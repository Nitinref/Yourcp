export type Platform =
  | "LeetCode"
  | "Codeforces"
  | "CodeChef"
  | "AtCoder"
  | "HackerRank"
  | "GeeksforGeeks"
  | "Other";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Status = "Unsolved" | "Attempted" | "Solved";

export type Understood = "Yes" | "No" | "Partially";

export interface Question {
  id: string;
  title: string;
  url: string;
  platform: Platform;
  difficulty: Difficulty;
  topics: string[];
  summary: string;
  hints: [string, string, string];
  timeComplexity: string;
  status: Status;
  confidence: number;
  understood: Understood;
  notes: string;
  timeTaken: number;
  dateAdded: string;
  revisionFlag: boolean;
  isFavorite: boolean;
  externalProblemId?: string | null;
  sourceHandle?: string | null;
  syncSource?: string | null;
}

export interface AnalysisResult {
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  topics: string[];
  summary: string;
  hints: [string, string, string];
  timeComplexity: string;
}

export interface TrackerFilters {
  filterPlatform: string;
  filterDifficulty: string;
  filterStatus: string;
  filterTopic: string;
  searchQuery: string;
}

export type SortBy = "difficulty" | "date" | "confidence" | "platform";
export type SortOrder = "asc" | "desc";

export interface QuestionPayload {
  title: string;
  url: string;
  platform: Platform;
  difficulty: Difficulty;
  topics: string[];
  summary: string;
  hints: [string, string, string];
  timeComplexity: string;
  status: Status;
  confidence: number;
  understood: Understood;
  notes: string;
  timeTaken: number;
  revisionFlag?: boolean;
  isFavorite?: boolean;
  externalProblemId?: string | null;
  sourceHandle?: string | null;
  syncSource?: string | null;
}

export type PlatformSyncStatus = "idle" | "syncing" | "success" | "error";
export type PlatformSyncSupport = "official" | "planned";

export interface PlatformAccount {
  id: string;
  platform: Exclude<Platform, "Other">;
  handle: string;
  profileUrl: string;
  syncSupport: PlatformSyncSupport;
  syncStatus: PlatformSyncStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformAccountPayload {
  platform: Exclude<Platform, "Other">;
  handle: string;
}

export interface SyncResult {
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  message: string;
}
