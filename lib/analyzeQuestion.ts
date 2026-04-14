import { AnalysisResult } from "@/types";

const SYSTEM_PROMPT = `You are a competitive programming expert. Analyze the given problem URL or description and return ONLY a JSON object with these exact fields:
{
  "title": string,
  "platform": "LeetCode"|"Codeforces"|"CodeChef"|"AtCoder"|"HackerRank"|"GeeksforGeeks"|"Other",
  "difficulty": "Easy"|"Medium"|"Hard",
  "topics": string[],
  "summary": string,
  "hints": [string, string, string],
  "timeComplexity": string
}
Return ONLY valid JSON, no markdown, no explanation.`;

interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface OpenRouterErrorResponse {
  error?: {
    message?: string;
  };
}

const FREE_MODELS = [
  process.env.OPENROUTER_MODEL?.trim(),
  "openrouter/free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-3n-e4b-it:free",
  "google/gemma-3n-e2b-it:free"
].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value as string) === index);

function extractJson(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("The AI response did not contain valid JSON.");
  }

  return match[0];
}

export async function analyzeQuestion(input: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const sanitizedInput = input.trim().slice(0, 2400);

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing. Add it to .env.local.");
  }

  let lastError = "Unable to analyze the question right now.";

  for (const model of FREE_MODELS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const messages: OpenRouterMessage[] = [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: sanitizedInput
        }
      ];

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "CodeTracker Pro"
          },
          body: JSON.stringify({
            model,
            temperature: 0.2,
            max_tokens: 450,
            messages
          }),
          cache: "no-store",
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const parsedError = JSON.parse(errorText) as OpenRouterErrorResponse;
          lastError =
            parsedError.error?.message ??
            `OpenRouter request failed with status ${response.status}.`;
        } catch {
          lastError = `OpenRouter request failed with status ${response.status}.`;
        }
        continue;
      }

      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        lastError = "The AI service returned an empty analysis.";
        continue;
      }

      const parsed = JSON.parse(extractJson(content)) as AnalysisResult;

      if (
        !parsed.title ||
        !parsed.platform ||
        !parsed.difficulty ||
        !Array.isArray(parsed.topics) ||
        !Array.isArray(parsed.hints)
      ) {
        lastError = "The AI response format was invalid.";
        continue;
      }

      return {
        ...parsed,
        hints: [
          parsed.hints[0] ?? "Start by identifying the core pattern.",
          parsed.hints[1] ?? "Consider the most efficient standard approach.",
          parsed.hints[2] ?? "Work backward from the final state or invariant."
        ]
      };
    } catch (error) {
      lastError =
        error instanceof Error && error.name === "AbortError"
          ? `The ${model} request timed out.`
          : error instanceof Error
            ? error.message
            : "Unable to analyze the question right now.";
      continue;
    }
  }

  throw new Error(lastError);
}
