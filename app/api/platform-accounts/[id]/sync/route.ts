import { NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { syncPlatformAccount } from "@/lib/platformSync";

interface Context {
  params: {
    id: string;
  };
}

export async function POST(_: Request, { params }: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in with Google to sync platform accounts." },
      { status: 401 }
    );
  }

  try {
    const result = await syncPlatformAccount(session.user.id, params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Platform sync failed."
      },
      { status: 500 }
    );
  }
}
