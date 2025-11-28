// src/app/api/tailor-resume/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeJson, jobInput } = body;

    if (!resumeJson || !jobInput) {
      return NextResponse.json(
        { error: "Missing resumeJson or jobInput" },
        { status: 400 },
      );
    }

    // 🔹 your existing prompt + openai.chat.completions.create here
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an ATS optimization assistant. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: " ... your prompt using resumeJson + jobInput ... ",
        },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content ?? "";
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      tailoredResumeJson: parsed.tailoredResumeJson,
      atsScore: parsed.atsScore,
      missingSkills: parsed.missingSkills ?? [],
      presentKeywords: parsed.presentKeywords ?? [],
      missingKeywords: parsed.missingKeywords ?? [],
      jobTitle: parsed.jobTitle ?? null,
      jobCompany: parsed.jobCompany ?? null,
    });
  } catch (err: any) {
    console.error("tailor-resume error:", err);

    // ✅ Explicit handling for rate limit
    if (err?.status === 429) {
      return NextResponse.json(
        { error: "RATE_LIMIT", message: "OpenAI rate limit exceeded." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to tailor resume." },
      { status: 500 },
    );
  }
}
