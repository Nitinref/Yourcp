import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { mapRecordToQuestion } from "@/lib/questionDb";
import { prismaClient } from "@/lib/prismaclient";
import { Question, QuestionPayload } from "@/types";

interface Context {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in with Google to update questions." },
        { status: 401 }
      );
    }

    const payload = (await request.json()) as Partial<Question> | Partial<QuestionPayload>;
    const updates: Record<string, unknown> = {};

    if (payload.title !== undefined) updates.title = payload.title.trim();
    if (payload.url !== undefined) updates.url = payload.url.trim();
    if (payload.platform !== undefined) updates.platform = payload.platform;
    if (payload.difficulty !== undefined) updates.difficulty = payload.difficulty;
    if (payload.topics !== undefined) updates.topics = JSON.stringify(payload.topics);
    if (payload.summary !== undefined) updates.summary = payload.summary.trim();
    if (payload.hints !== undefined) updates.hints = JSON.stringify(payload.hints);
    if (payload.timeComplexity !== undefined) {
      updates.timeComplexity = payload.timeComplexity.trim();
    }
    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.confidence !== undefined) updates.confidence = payload.confidence;
    if (payload.understood !== undefined) updates.understood = payload.understood;
    if (payload.notes !== undefined) updates.notes = payload.notes.trim();
    if (payload.timeTaken !== undefined) updates.timeTaken = payload.timeTaken;
    if (payload.revisionFlag !== undefined) updates.revisionFlag = payload.revisionFlag;
    if (payload.isFavorite !== undefined) updates.isFavorite = payload.isFavorite;

    const existing = await prismaClient.questionRecord.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    const record = await prismaClient.questionRecord.update({
      where: { id: params.id },
      data: updates
    });

    return NextResponse.json(mapRecordToQuestion(record));
  } catch {
    return NextResponse.json(
      { error: "Unable to update this question." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in with Google to delete questions." },
        { status: 401 }
      );
    }

    const existing = await prismaClient.questionRecord.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    await prismaClient.questionRecord.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete this question." },
      { status: 500 }
    );
  }
}
