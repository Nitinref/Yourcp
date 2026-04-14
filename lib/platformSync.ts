import { platformSyncSupport } from "@/constants/platforms";
import { normalizeTopics } from "@/lib/utils";
import { prismaClient } from "@/lib/prismaclient";
import { mapPayloadToRecord } from "@/lib/questionDb";
import { PlatformAccount, SyncResult } from "@/types";

interface CodeforcesSubmission {
  verdict?: string;
  creationTimeSeconds?: number;
  problem?: {
    contestId?: number;
    index?: string;
    name?: string;
    rating?: number;
    tags?: string[];
  };
}

interface CodeforcesResponse {
  status: "OK" | "FAILED";
  result?: CodeforcesSubmission[];
  comment?: string;
}

interface AtCoderSubmission {
  id: number;
  epoch_second: number;
  problem_id: string;
  contest_id: string;
  user_id: string;
  language: string;
  result: string;
}

export function buildPlatformProfileUrl(platform: PlatformAccount["platform"], handle: string) {
  const safeHandle = handle.trim();
  switch (platform) {
    case "Codeforces":
      return `https://codeforces.com/profile/${safeHandle}`;
    case "AtCoder":
      return `https://atcoder.jp/users/${safeHandle}`;
    case "LeetCode":
      return `https://leetcode.com/${safeHandle}/`;
    case "CodeChef":
      return `https://www.codechef.com/users/${safeHandle}`;
    case "HackerRank":
      return `https://www.hackerrank.com/profile/${safeHandle}`;
    case "GeeksforGeeks":
      return `https://auth.geeksforgeeks.org/user/${safeHandle}`;
  }
}

function getDifficultyFromRating(rating?: number) {
  if (!rating || rating <= 1200) return "Easy" as const;
  if (rating <= 1800) return "Medium" as const;
  return "Hard" as const;
}

function buildCodeforcesProblemUrl(problem: NonNullable<CodeforcesSubmission["problem"]>) {
  if (problem.contestId && problem.index) {
    return `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
  }
  return "https://codeforces.com/problemset";
}

function buildExternalProblemId(problem: NonNullable<CodeforcesSubmission["problem"]>) {
  if (problem.contestId && problem.index) {
    return `${problem.contestId}-${problem.index}`;
  }
  return problem.name?.trim() || null;
}

export async function syncPlatformAccount(userId: string, accountId: string): Promise<SyncResult> {
  const account = await prismaClient.platformAccount.findFirst({
    where: {
      id: accountId,
      userId
    }
  });

  if (!account) {
    throw new Error("Platform account not found.");
  }

  await prismaClient.platformAccount.update({
    where: { id: account.id },
    data: {
      syncStatus: "syncing",
      lastError: null
    }
  });

  try {
    if (account.platform === "Codeforces") {
      // @ts-ignore
      return await syncCodeforces(account, userId);
    } else if (account.platform === "LeetCode") {
       // @ts-ignore
      return await syncLeetCode(account, userId);
    } else if (account.platform === "AtCoder") {
       // @ts-ignore
      return await syncAtCoder(account, userId);
    } else if (account.platform === "CodeChef") {
       // @ts-ignore
      return await syncCodeChef(account, userId);
    } else if (account.platform === "GeeksforGeeks") {
       // @ts-ignore
      return await syncGeeksforGeeks(account, userId);
    }

    throw new Error(`${account.platform} sync is not yet supported.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Platform sync failed.";
    await prismaClient.platformAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: "error",
        lastError: message
      }
    });
    throw new Error(message);
  }
}

async function syncCodeforces(account: PlatformAccount, userId: string): Promise<SyncResult> {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${encodeURIComponent(account.handle)}&from=1&count=1000`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Codeforces API failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as CodeforcesResponse;

  if (payload.status !== "OK" || !Array.isArray(payload.result)) {
    throw new Error(payload.comment || "Codeforces API returned an invalid response.");
  }

  const acceptedByProblem = new Map<string, CodeforcesSubmission>();

  for (const submission of payload.result) {
    if (submission.verdict !== "OK" || !submission.problem) {
      continue;
    }

    const externalProblemId = buildExternalProblemId(submission.problem);
    if (!externalProblemId) {
      continue;
    }

    const existing = acceptedByProblem.get(externalProblemId);
    if (!existing) {
      acceptedByProblem.set(externalProblemId, submission);
    }
  }

  let importedCount = 0;
  let updatedCount = 0;

  for (const [, submission] of acceptedByProblem) {
    const problem = submission.problem;
    if (!problem) continue;

    const externalProblemId = buildExternalProblemId(problem);
    if (!externalProblemId) continue;

    const topics = normalizeTopics(problem.tags ?? []);
    const difficulty = getDifficultyFromRating(problem.rating);
    const createdData = {
      ...mapPayloadToRecord({
        title: problem.name?.trim() || `${problem.contestId ?? "CF"} ${problem.index ?? ""}`.trim(),
        url: buildCodeforcesProblemUrl(problem),
        platform: "Codeforces",
        difficulty,
        topics,
        summary:
          topics.length > 0
            ? `Imported from Codeforces solved submissions. Topics: ${topics.join(", ")}.`
            : "Imported from Codeforces solved submissions.",
        hints: [
          "Imported from your solved submissions.",
          "Re-open the original problem when you want a fresh re-attempt.",
          "Use your notes field for the approach you used."
        ],
        timeComplexity: "Unknown",
        status: "Solved",
        confidence: 3,
        understood: "Partially",
        notes: `Synced from Codeforces handle ${account.handle}.`,
        timeTaken: 0,
        revisionFlag: false,
        isFavorite: false,
        externalProblemId,
        sourceHandle: account.handle,
        syncSource: "platform-sync"
      }),
      userId
    };

    const existing = await prismaClient.questionRecord.findFirst({
      where: {
        userId,
        platform: "Codeforces",
        externalProblemId
      }
    });

    if (existing) {
      await prismaClient.questionRecord.update({
        where: { id: existing.id },
        data: {
          ...createdData,
          status: "Solved",
          updatedAt: new Date(),
          dateAdded: submission.creationTimeSeconds
            ? new Date(submission.creationTimeSeconds * 1000)
            : existing.dateAdded
        }
      });
      updatedCount += 1;
    } else {
      await prismaClient.questionRecord.create({
        data: {
          ...createdData,
          dateAdded: submission.creationTimeSeconds
            ? new Date(submission.creationTimeSeconds * 1000)
            : new Date()
        }
      });
      importedCount += 1;
    }
  }

  await prismaClient.platformAccount.update({
    where: { id: account.id },
    data: {
      syncStatus: "success",
      lastError: null,
      lastSyncedAt: new Date()
    }
  });

  return {
    importedCount,
    updatedCount,
    skippedCount: 0,
    message: `Synced ${acceptedByProblem.size} solved Codeforces problems for ${account.handle}.`
  };
}

async function syncLeetCode(account: PlatformAccount, userId: string): Promise<SyncResult> {
  const query = `
    query {
      matchedUser(username: "${account.handle}") {
        username
        profile {
          reputation
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({ query }),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`LeetCode API failed with status ${response.status}.`);
    }

    const data = (await response.json()) as any;

    if (data.errors) {
      throw new Error(data.errors[0]?.message || "LeetCode GraphQL error");
    }

    const user = data.data?.matchedUser;
    if (!user) {
      throw new Error(`LeetCode user "${account.handle}" not found.`);
    }

    const submissionsQuery = `
      query {
        matchedUser(username: "${account.handle}") {
          submissionCalendar
        }
      }
    `;

    const submissionsResponse = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({ query: submissionsQuery }),
      cache: "no-store"
    });

    let submissionData: any = {};
    if (submissionsResponse.ok) {
      submissionData = (await submissionsResponse.json()) as any;
    }

    const acStats = user.submitStats?.acSubmissionNum || [];
    const allQuestions = data.data?.allQuestionsCount || [];

    let importedCount = 0;

    for (const stat of acStats) {
      if (stat.count > 0) {
        const externalId = `leetcode-${stat.difficulty.toLowerCase()}`;
        const existing = await prismaClient.questionRecord.findFirst({
          where: {
            userId,
            platform: "LeetCode",
            externalProblemId: externalId
          }
        });

        if (!existing) {
          await prismaClient.questionRecord.create({
            data: {
              ...mapPayloadToRecord({
                title: `${stat.difficulty} Level Problems`,
                url: `https://leetcode.com/${account.handle}/`,
                platform: "LeetCode",
                difficulty: stat.difficulty === "Hard" ? "Hard" : stat.difficulty === "Easy" ? "Easy" : "Medium",
                topics: ["leetcode", "algorithms"],
                summary: `${stat.count} ${stat.difficulty} problems solved on LeetCode (${account.handle})`,
                hints: [
                  "Visit your LeetCode submissions for individual problems.",
                  `Filter by ${stat.difficulty} difficulty to see these problems.`,
                  "Track your progress with the problem list."
                ],
                timeComplexity: "Unknown",
                status: "Solved",
                confidence: 3,
                understood: "Partially",
                notes: `Synced from LeetCode user ${account.handle}. Difficulty: ${stat.difficulty}`,
                timeTaken: 0,
                revisionFlag: false,
                isFavorite: false,
                externalProblemId: externalId,
                sourceHandle: account.handle,
                syncSource: "platform-sync"
              }),
              userId,
              dateAdded: new Date()
            }
          });
          importedCount += 1;
        }
      }
    }

    await prismaClient.platformAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: "success",
        lastError: null,
        lastSyncedAt: new Date()
      }
    });

    const totalSolved = acStats.reduce((sum: number, stat: any) => sum + (stat.count || 0), 0);
    return {
      importedCount,
      updatedCount: 0,
      skippedCount: 0,
      message: `Synced LeetCode profile: ${totalSolved} problems solved. Visit https://leetcode.com/${account.handle}/ for full problem list.`
    };
  } catch (error) {
    throw error;
  }
}

async function syncAtCoder(account: PlatformAccount, userId: string): Promise<SyncResult> {
  try {
    // ✅ Correct Kenkoooo AtCoder Problems API endpoint
    const response = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/accepted_submissions?user=${encodeURIComponent(account.handle)}&from_second=0`,
      {
        cache: "no-store",
        headers: { "User-Agent": "Mozilla/5.0" }
      }
    );

    if (!response.ok) {
      throw new Error(`AtCoder API failed with status ${response.status}.`);
    }

    const submissions = (await response.json()) as AtCoderSubmission[];

    // Deduplicate — keep only the first accepted submission per problem
    const seenProblems = new Map<string, AtCoderSubmission>();
    for (const sub of submissions) {
      if (!seenProblems.has(sub.problem_id)) {
        seenProblems.set(sub.problem_id, sub);
      }
    }

    const problems = [...seenProblems.values()];

    let importedCount = 0;

    for (const sub of problems) {
      const problemId = sub.problem_id;   // e.g. "abc123_a"
      const contestId = sub.contest_id;   // e.g. "abc123"

      const createdData = {
        ...mapPayloadToRecord({
          title: problemId,
          url: `https://atcoder.jp/contests/${contestId}/tasks/${problemId}`,
          platform: "AtCoder",
          difficulty: "Medium",
          topics: ["competitive-programming"],
          summary: `Imported from AtCoder solved submission: ${problemId}`,
          hints: [
            "Problem solved on AtCoder.",
            "Check editorial for solutions.",
            "Try harder variations."
          ],
          timeComplexity: "Unknown",
          status: "Solved",
          confidence: 3,
          understood: "Partially",
          notes: `Synced from AtCoder user ${account.handle}.`,
          timeTaken: 0,
          revisionFlag: false,
          isFavorite: false,
          externalProblemId: `atcoder-${problemId}`,
          sourceHandle: account.handle,
          syncSource: "platform-sync"
        }),
        userId
      };

      const existing = await prismaClient.questionRecord.findFirst({
        where: {
          userId,
          platform: "AtCoder",
          externalProblemId: `atcoder-${problemId}`
        }
      });

      if (!existing) {
        await prismaClient.questionRecord.create({
          data: {
            ...createdData,
            // ✅ Use real solve timestamp from API
            dateAdded: sub.epoch_second ? new Date(sub.epoch_second * 1000) : new Date()
          }
        });
        importedCount += 1;
      }
    }

    await prismaClient.platformAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: "success",
        lastError: null,
        lastSyncedAt: new Date()
      }
    });

    return {
      importedCount,
      updatedCount: 0,
      skippedCount: 0,
      message: `Synced ${problems.length} solved AtCoder problems for ${account.handle}.`
    };
  } catch (error) {
    throw error;
  }
}

async function syncCodeChef(account: PlatformAccount, userId: string): Promise<SyncResult> {
  try {
    const response = await fetch(`https://www.codechef.com/api/contests/all/user/${account.handle}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      throw new Error(
        `CodeChef sync requires manual entry. Try the profile URL: https://www.codechef.com/users/${account.handle}`
      );
    }

    const data = (await response.json()) as any;
    let importedCount = 0;

    const solvedProblems = data.solved || [];
    for (const problemId of solvedProblems.slice(0, 100)) {
      const createdData = {
        ...mapPayloadToRecord({
          title: problemId,
          url: `https://www.codechef.com/problems/${problemId}`,
          platform: "CodeChef",
          difficulty: "Medium",
          topics: ["competitive-programming"],
          summary: `Imported from CodeChef solved submission: ${problemId}`,
          hints: ["Solved on CodeChef.", "Check editorials.", "Practice with similar problems."],
          timeComplexity: "Unknown",
          status: "Solved",
          confidence: 3,
          understood: "Partially",
          notes: `Synced from CodeChef user ${account.handle}.`,
          timeTaken: 0,
          revisionFlag: false,
          isFavorite: false,
          externalProblemId: `codechef-${problemId}`,
          sourceHandle: account.handle,
          syncSource: "platform-sync"
        }),
        userId
      };

      const existing = await prismaClient.questionRecord.findFirst({
        where: {
          userId,
          platform: "CodeChef",
          externalProblemId: `codechef-${problemId}`
        }
      });

      if (!existing) {
        await prismaClient.questionRecord.create({
          data: {
            ...createdData,
            dateAdded: new Date()
          }
        });
        importedCount += 1;
      }
    }

    await prismaClient.platformAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: "success",
        lastError: null,
        lastSyncedAt: new Date()
      }
    });

    return {
      importedCount,
      updatedCount: 0,
      skippedCount: 0,
      message: `Synced CodeChef problems for ${account.handle}.`
    };
  } catch (error) {
    throw error;
  }
}

async function syncGeeksforGeeks(account: PlatformAccount, userId: string): Promise<SyncResult> {
  try {
    const response = await fetch(
      `https://practiceapi.geeksforgeeks.org/api/v1/profile/${encodeURIComponent(account.handle)}/`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(
        `GeeksforGeeks sync requires manual entry. Visit: https://auth.geeksforgeeks.org/user/${account.handle}`
      );
    }

    const profile = (await response.json()) as any;
    const solvedCount = profile.solved_count || 0;

    const createdData = {
      ...mapPayloadToRecord({
        title: `GeeksforGeeks - ${solvedCount} problems solved`,
        url: `https://auth.geeksforgeeks.org/user/${account.handle}`,
        platform: "GeeksforGeeks",
        difficulty: "Medium",
        topics: ["data-structures", "algorithms"],
        summary: `${solvedCount} problems solved on GeeksforGeeks`,
        hints: ["Check GeeksforGeeks DSA sheet.", "Review editorial solutions.", "Practice more variations."],
        timeComplexity: "Unknown",
        status: "Solved",
        confidence: 3,
        understood: "Partially",
        notes: `Synced from GeeksforGeeks user ${account.handle}.`,
        timeTaken: 0,
        revisionFlag: false,
        isFavorite: false,
        externalProblemId: `gfg-${account.handle}`,
        sourceHandle: account.handle,
        syncSource: "platform-sync"
      }),
      userId
    };

    const existing = await prismaClient.questionRecord.findFirst({
      where: {
        userId,
        platform: "GeeksforGeeks",
        externalProblemId: `gfg-${account.handle}`
      }
    });

    let importedCount = 0;
    if (!existing) {
      await prismaClient.questionRecord.create({
        data: {
          ...createdData,
          dateAdded: new Date()
        }
      });
      importedCount = 1;
    }

    await prismaClient.platformAccount.update({
      where: { id: account.id },
      data: {
        syncStatus: "success",
        lastError: null,
        lastSyncedAt: new Date()
      }
    });

    return {
      importedCount,
      updatedCount: 0,
      skippedCount: 0,
      message: `Synced GeeksforGeeks profile for ${account.handle}. Solved: ${solvedCount}`
    };
  } catch (error) {
    throw error;
  }
}