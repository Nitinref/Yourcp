import { Platform, PlatformSyncSupport } from "@/types";

export const platforms: Platform[] = [
  "LeetCode",
  "Codeforces",
  "CodeChef",
  "AtCoder",
  "HackerRank",
  "GeeksforGeeks",
  "Other"
];

export const difficultyOptions = ["Easy", "Medium", "Hard"] as const;
export const statusOptions = ["Unsolved", "Attempted", "Solved"] as const;
export const understoodOptions = ["Yes", "No", "Partially"] as const;

export const platformColors: Record<Platform, string> = {
  LeetCode: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  Codeforces: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  CodeChef: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  AtCoder: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  HackerRank: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  GeeksforGeeks: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100",
  Other: "border-zinc-500/30 bg-zinc-500/10 text-zinc-100"
};

export const difficultyColors = {
  Easy: "border-zinc-600/40 bg-zinc-600/10 text-zinc-200",
  Medium: "border-zinc-500/40 bg-zinc-500/10 text-zinc-100",
  Hard: "border-zinc-400/40 bg-zinc-400/10 text-white"
} as const;

export const connectablePlatforms = platforms.filter(
  (platform): platform is Exclude<Platform, "Other"> => platform !== "Other"
);

export const platformSyncSupport: Record<Exclude<Platform, "Other">, PlatformSyncSupport> = {
  LeetCode: "official",
  Codeforces: "official",
  CodeChef: "official",
  AtCoder: "official",
  HackerRank: "planned",
  GeeksforGeeks: "official"
};
