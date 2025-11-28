import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const {
      title,
      company,
      period,
      location,
      techStack,
      existingBullets,
      jobDescriptionSnippet,
    } = (await req.json()) as {
      title: string;
      company: string;
      period?: string;
      location?: string;
      techStack?: string[];
      existingBullets?: string[];
      jobDescriptionSnippet?: string;
    };

    if (!title && !company) {
      return NextResponse.json(
        { error: "title or company is required" },
        { status: 400 },
      );
    }

    const prompt = `
You are generating strong resume bullet points for a frontend developer experience entry.

Context:
- Title: ${title || "N/A"}
- Company: ${company || "N/A"}
- Period: ${period || "N/A"}
- Location: ${location || "N/A"}
- Tech stack: ${(techStack || []).join(", ") || "N/A"}
- Existing bullets:
${(existingBullets || []).map((b, i) => `  ${i + 1}. ${b}`).join("\n") || "  none"}

Job description snippet (if any):
${jobDescriptionSnippet || "N/A"}

Tasks:
1. Propose 3–5 NEW bullet points for this job that:
   - Are concise, 1 line each.
   - Use strong action verbs.
   - Focus on measurable impact when possible.
   - Emphasize modern frontend stack (React, TypeScript, Next.js, Tailwind, testing, performance, accessibility) where relevant.
2. Do NOT repeat existing bullets.
3. Assume U.S./Canada remote role standards and tone.

Return ONLY valid JSON:

{
  "bullets": string[]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, impact-focused resume bullet points for frontend developers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      // @ts-ignore
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: { bullets: string[] };
    try {
      parsed = extractJsonObject(raw);
    } catch (e) {
      console.error("JSON parse error (generate-bullets):", e, raw);
      parsed = { bullets: [] };
    }

    return NextResponse.json({
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
    });
  } catch (err) {
    console.error("generate-bullets error:", err);
    return NextResponse.json(
      { error: "Internal server error in generate-bullets" },
      { status: 500 },
    );
  }
}
