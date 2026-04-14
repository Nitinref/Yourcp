import { PlatformAccount as PlatformAccountRecord, QuestionRecord } from "@prisma/client";
import { PlatformAccount, Question, QuestionPayload } from "@/types";

function parseJsonArray(value: string) {
  const parsed = JSON.parse(value) as string[];
  return Array.isArray(parsed) ? parsed : [];
}

export function mapRecordToQuestion(record: QuestionRecord): Question {
  const hints = parseJsonArray(record.hints);
  return {
    id: record.id,
    title: record.title,
    url: record.url,
    platform: record.platform as Question["platform"],
    difficulty: record.difficulty as Question["difficulty"],
    topics: parseJsonArray(record.topics),
    summary: record.summary,
    hints: [
      hints[0] ?? "",
      hints[1] ?? "",
      hints[2] ?? ""
    ],
    timeComplexity: record.timeComplexity,
    status: record.status as Question["status"],
    confidence: record.confidence,
    understood: record.understood as Question["understood"],
    notes: record.notes,
    timeTaken: record.timeTaken,
    dateAdded: record.dateAdded.toISOString(),
    revisionFlag: record.revisionFlag,
    isFavorite: record.isFavorite,
    externalProblemId: record.externalProblemId,
    sourceHandle: record.sourceHandle,
    syncSource: record.syncSource
  };
}

export function mapPayloadToRecord(payload: QuestionPayload) {
  return {
    title: payload.title,
    url: payload.url,
    platform: payload.platform,
    difficulty: payload.difficulty,
    topics: JSON.stringify(payload.topics),
    summary: payload.summary,
    hints: JSON.stringify(payload.hints),
    timeComplexity: payload.timeComplexity,
    status: payload.status,
    confidence: payload.confidence,
    understood: payload.understood,
    notes: payload.notes,
    timeTaken: payload.timeTaken,
    revisionFlag: payload.revisionFlag ?? false,
    isFavorite: payload.isFavorite ?? false,
    externalProblemId: payload.externalProblemId ?? null,
    sourceHandle: payload.sourceHandle ?? null,
    syncSource: payload.syncSource ?? null
  };
}

export function mapPlatformAccountRecord(record: PlatformAccountRecord): PlatformAccount {
  return {
    id: record.id,
    platform: record.platform as PlatformAccount["platform"],
    handle: record.handle,
    profileUrl: record.profileUrl,
    syncSupport: record.syncSupport as PlatformAccount["syncSupport"],
    syncStatus: record.syncStatus as PlatformAccount["syncStatus"],
    lastSyncedAt: record.lastSyncedAt ? record.lastSyncedAt.toISOString() : null,
    lastError: record.lastError,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}
