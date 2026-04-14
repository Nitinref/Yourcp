import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { mapPayloadToRecord, mapRecordToQuestion } from "@/lib/questionDb";
import { prismaClient } from "@/lib/prismaclient";
import { QuestionPayload } from "@/types";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in with Google to view your questions." },
        { status: 401 }
      );
    }

    const records = await prismaClient.questionRecord.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        dateAdded: "desc"
      }
    });

    return NextResponse.json(records.map(mapRecordToQuestion));
  } catch {
    return NextResponse.json(
      { error: "Unable to load questions from the database." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in with Google to save questions." },
        { status: 401 }
      );
    }

    const payload = (await request.json()) as QuestionPayload;

    if (!payload.title?.trim()) {
      return NextResponse.json(
        { error: "Question title is required." },
        { status: 400 }
      );
    }

    const record = await prismaClient.questionRecord.create({
      data: {
        ...mapPayloadToRecord({
          ...payload,
          title: payload.title.trim(),
          url: payload.url.trim(),
          summary: payload.summary.trim(),
          notes: payload.notes.trim(),
          timeComplexity: payload.timeComplexity.trim()
        }),
        userId: session.user.id
      }
    });

    return NextResponse.json(mapRecordToQuestion(record), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save the question to the database." },
      { status: 500 }
    );
  }
}
