import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { buildPlatformProfileUrl } from "@/lib/platformSync";
import { mapPlatformAccountRecord } from "@/lib/questionDb";
import { prismaClient } from "@/lib/prismaclient";
import { PlatformAccountPayload } from "@/types";

interface Context {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in with Google to update platform accounts." },
      { status: 401 }
    );
  }

  const payload = (await request.json()) as Partial<PlatformAccountPayload>;
  const account = await prismaClient.platformAccount.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!account) {
    return NextResponse.json({ error: "Platform account not found." }, { status: 404 });
  }

  const handle = payload.handle?.trim() || account.handle;

  const updated = await prismaClient.platformAccount.update({
    where: { id: params.id },
    data: {
      handle,
      profileUrl: buildPlatformProfileUrl(account.platform as PlatformAccountPayload["platform"], handle),
      lastError: null
    }
  });

  return NextResponse.json(mapPlatformAccountRecord(updated));
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in with Google to remove platform accounts." },
      { status: 401 }
    );
  }

  const account = await prismaClient.platformAccount.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!account) {
    return NextResponse.json({ error: "Platform account not found." }, { status: 404 });
  }

  await prismaClient.platformAccount.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
