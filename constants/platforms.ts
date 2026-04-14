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
  LeetCode: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  Codeforces: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  CodeChef: "border-amber-700/40 bg-amber-700/10 text-amber-200",
  AtCoder: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  HackerRank: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  GeeksforGeeks: "border-lime-500/30 bg-lime-500/10 text-lime-200",
  Other: "border-slate-500/30 bg-slate-500/10 text-slate-200"
};

export const difficultyColors = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-200"
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
