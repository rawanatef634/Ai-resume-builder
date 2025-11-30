// src/app/api/tailor-resume/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TailorRequest = {
  resumeJson: any;
  jobInput: string;
};

function safeParseJson(maybe: string) {
  try {
    return JSON.parse(maybe);
  } catch {
    // Try to extract JSON substring
    const match = maybe.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body: TailorRequest = await req.json();
    const { resumeJson, jobInput } = body;

    if (!resumeJson || !jobInput) {
      return NextResponse.json(
        { error: "MISSING_INPUT", message: "Missing resumeJson or jobInput" },
        { status: 400 },
      );
    }

    // Build a concise prompt that instructs the model to output JSON only.
    const system = `You are an expert resume + ATS assistant. Output a single JSON object (no extra text) with keys:
- tailoredResumeJson: the updated resume object (structure preserved)
- atsScore: integer 0-100
- missingSkills: array of short skill strings
- presentKeywords: array of keywords found in resume
- missingKeywords: array of suggested keywords
- jobTitle: optional string
- jobCompany: optional string`;

    const userPrompt = `Job description / link:
${jobInput}

Source resume (JSON):
${JSON.stringify(resumeJson)}

Return the JSON exactly as specified by the system instructions.`;

    // Use chat completion. Tune model and temperature conservatively
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // keep same as you used; change if needed
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    // Remove triple-backticks and markdown fences if any
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse robustly
    const parsed = safeParseJson(cleaned);
    if (!parsed) {
      console.error("tailor-resume: failed to parse JSON response:", cleaned);
      return NextResponse.json(
        { error: "PARSE_ERROR", message: "Failed to parse model output" },
        { status: 500 },
      );
    }

    // Ensure fields exist and provide sensible defaults
    const tailoredResumeJson = parsed.tailoredResumeJson ?? parsed.resume ?? parsed;
    const atsScore = Number(parsed.atsScore ?? null);
    const missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
    const presentKeywords = Array.isArray(parsed.presentKeywords) ? parsed.presentKeywords : [];
    const missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];
    const jobTitle = parsed.jobTitle ?? null;
    const jobCompany = parsed.jobCompany ?? null;

    return NextResponse.json({
      tailoredResumeJson,
      atsScore: Number.isFinite(atsScore) ? atsScore : null,
      missingSkills,
      presentKeywords,
      missingKeywords,
      jobTitle,
      jobCompany,
    });
  } catch (err: any) {
    console.error("tailor-resume error:", err);

    if (err?.status === 429 || (err?.message && err.message.toLowerCase().includes("rate limit"))) {
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
