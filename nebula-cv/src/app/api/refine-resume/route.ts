// src/app/api/refine-resume/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Tone = "neutral" | "technical" | "confident";

function extractJsonObject(raw: string) {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Could not find JSON object in AI response");
  }
  const jsonText = raw.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonText);
}

export async function POST(req: Request) {
  try {
    const { resumeJson, tone } = (await req.json()) as {
      resumeJson: any;
      tone: Tone;
    };

    if (!resumeJson) {
      return NextResponse.json(
        { error: "resumeJson is required" },
        { status: 400 },
      );
    }

    const toneDescription =
      tone === "technical"
        ? "very technical, emphasizing technologies, architecture, and performance metrics"
        : tone === "confident"
        ? "confident and impact-focused, with strong action verbs and clear achievements"
        : "neutral, concise, and professional with balanced tone";

    const prompt = `
You are refining a resume JSON for a frontend developer applying to U.S./Canada remote roles.

Rewrite the following fields:
- summary
- experience bullets
- project descriptions

Rules:
- Keep the overall structure and factual content.
- Use ${toneDescription}.
- Do NOT invent new jobs or projects.
- You may add light quantification (e.g., "improved load time by 20%") ONLY if it is strongly implied.

Return ONLY valid JSON with the same structure as the input resume JSON.

Current resume JSON:
${JSON.stringify(resumeJson, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You refine resumes for frontend developers, returning JSON in the exact same structure.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      // @ts-ignore
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let refinedResumeJson: any;
    try {
      refinedResumeJson = extractJsonObject(raw);
    } catch (e) {
      console.error("JSON parse error (refine-resume):", e, raw);
      // Fall back to original
      refinedResumeJson = resumeJson;
    }

    return NextResponse.json({ refinedResumeJson });
  } catch (err) {
    console.error("refine-resume error:", err);
    return NextResponse.json(
      { error: "Internal server error in refine-resume" },
      { status: 500 },
    );
  }
}
