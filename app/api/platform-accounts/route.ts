import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { connectablePlatforms, platformSyncSupport } from "@/constants/platforms";
import { buildPlatformProfileUrl } from "@/lib/platformSync";
import { mapPlatformAccountRecord } from "@/lib/questionDb";
import { prismaClient } from "@/lib/prismaclient";
import { PlatformAccountPayload } from "@/types";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in with Google to manage platform accounts." },
      { status: 401 }
    );
  }

  const accounts = await prismaClient.platformAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { platform: "asc" }
  });

  return NextResponse.json(accounts.map(mapPlatformAccountRecord));
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in with Google to save platform accounts." },
      { status: 401 }
    );
  }

  const payload = (await request.json()) as PlatformAccountPayload;

  if (!connectablePlatforms.includes(payload.platform) || !payload.handle?.trim()) {
    return NextResponse.json({ error: "Platform and handle are required." }, { status: 400 });
  }

  const handle = payload.handle.trim();
  const account = await prismaClient.platformAccount.upsert({
    where: {
      userId_platform: {
        userId: session.user.id,
        platform: payload.platform
      }
    },
    create: {
      userId: session.user.id,
      platform: payload.platform,
      handle,
      profileUrl: buildPlatformProfileUrl(payload.platform, handle),
      syncSupport: platformSyncSupport[payload.platform]
    },
    update: {
      handle,
      profileUrl: buildPlatformProfileUrl(payload.platform, handle),
      syncSupport: platformSyncSupport[payload.platform],
      lastError: null
    }
  });

  return NextResponse.json(mapPlatformAccountRecord(account), { status: 201 });
}
