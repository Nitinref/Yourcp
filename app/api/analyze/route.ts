import { NextRequest, NextResponse } from "next/server";
import { analyzeQuestion } from "@/lib/analyzeQuestion";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { input?: string };
    const input = body.input?.trim();

    if (!input) {
      return NextResponse.json(
        { error: "Please provide a problem URL or a short problem description." },
        { status: 400 }
      );
    }

    const analysis = await analyzeQuestion(input);
    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to analyze the question right now.";

    return NextResponse.json(
      {
        error:
          message.includes("JSON") || message.includes("format")
            ? "The AI returned an unexpected format. Please try again or fill the form manually."
            : message.includes("402") ||
                message.toLowerCase().includes("credits") ||
                message.toLowerCase().includes("capacity")
              ? "OpenRouter free analysis is temporarily unavailable or out of quota. Try again in a moment or fill the form manually."
            : message
      },
      { status: 500 }
    );
  }
}
