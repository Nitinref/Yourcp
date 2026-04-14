import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Difficulty,
  Platform,
  Question,
  SortBy,
  SortOrder,
  TrackerFilters
} from "@/types";
import { predefinedTopics, topicAliasMap, type PredefinedTopic } from "@/constants/topics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

export function getDifficultyRank(difficulty: Difficulty) {
  return {
    Easy: 1,
    Medium: 2,
    Hard: 3
  }[difficulty];
}

export function sanitizeTopics(topics: string[]) {
  return topics
    .map((topic) => topic.trim())
    .filter(Boolean)
    .filter((topic, index, array) => array.indexOf(topic) === index);
}

export function getUniqueTopics(questions: Question[]) {
  return Array.from(
    new Set(questions.flatMap((question) => question.topics))
  ).sort((a, b) => a.localeCompare(b));
}

export function normalizeTopics(topics: string[]) {
  const normalized = topics
    .map((topic) => topic.trim())
    .filter(Boolean)
    .map((topic) => {
      const key = topic.toLowerCase();
      return topicAliasMap[key] ?? predefinedTopics.find((item) => item.toLowerCase() === key) ?? null;
    })
    .filter((topic): topic is PredefinedTopic => Boolean(topic));

  return Array.from(new Set(normalized));
}

export function filterAndSortQuestions(
  questions: Question[],
  filters: TrackerFilters,
  sortBy: SortBy,
  sortOrder: SortOrder
) {
  const filtered = questions.filter((question) => {
    const matchesPlatform =
      !filters.filterPlatform || question.platform === filters.filterPlatform;
    const matchesDifficulty =
      !filters.filterDifficulty ||
      question.difficulty === filters.filterDifficulty;
    const matchesStatus =
      !filters.filterStatus || question.status === filters.filterStatus;
    const matchesTopic =
      !filters.filterTopic || question.topics.includes(filters.filterTopic);
    const query = filters.searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      question.title.toLowerCase().includes(query) ||
      question.summary.toLowerCase().includes(query) ||
      question.topics.some((topic) => topic.toLowerCase().includes(query)) ||
      question.platform.toLowerCase().includes(query);

    return (
      matchesPlatform &&
      matchesDifficulty &&
      matchesStatus &&
      matchesTopic &&
      matchesSearch
    );
  });

  const sorted = [...filtered].sort((first, second) => {
    let result = 0;

    if (sortBy === "date") {
      result =
        new Date(first.dateAdded).getTime() - new Date(second.dateAdded).getTime();
    }

    if (sortBy === "confidence") {
      result = first.confidence - second.confidence;
    }

    if (sortBy === "platform") {
      result = first.platform.localeCompare(second.platform);
    }

    if (sortBy === "difficulty") {
      result =
        getDifficultyRank(first.difficulty) - getDifficultyRank(second.difficulty);
    }

    return sortOrder === "asc" ? result : result * -1;
  });

  return sorted;
}

export function getPlatformFromUrl(url: string): Platform {
  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes("leetcode")) return "LeetCode";
  if (normalizedUrl.includes("codeforces")) return "Codeforces";
  if (normalizedUrl.includes("codechef")) return "CodeChef";
  if (normalizedUrl.includes("atcoder")) return "AtCoder";
  if (normalizedUrl.includes("hackerrank")) return "HackerRank";
  if (normalizedUrl.includes("geeksforgeeks")) return "GeeksforGeeks";

  return "Other";
}
