import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type EducationItem = {
  institution: string;
  degree: string;
  location?: string;
  period?: string;
};

type ResumeJson = {
  summary: string;
  skills: string[];
  experiences: {
    title: string;
    company: string;
    period?: string;
    location?: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    description: string;
    stack?: string[];
  }[];
  education?: EducationItem[];
};

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
    const { resumeText } = (await req.json()) as { resumeText: string };

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "resumeText is required" },
        { status: 400 },
      );
    }

    const prompt = `
You are converting an existing resume into structured JSON for a frontend developer applying to U.S./Canada remote roles.

The text may be in Arabic, English, or a mix.

Tasks:
1. Interpret all content, translating Arabic into professional English where necessary. Do NOT translate technology names.
2. Extract a concise professional summary (2–3 sentences).
3. Extract technical skills as a flat list.
4. Extract work experience entries with title, company, period, location (if present) and bullet points.
5. Extract projects with name, description, and technology stack.
6. Extract education entries.

Return ONLY valid JSON with this structure:

{
  "summary": string,
  "skills": string[],
  "experiences": [
    {
      "title": string,
      "company": string,
      "period": string,
      "location": string,
      "bullets": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string,
      "stack": string[]
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "location": string,
      "period": string
    }
  ]
}

Raw resume text:
${resumeText}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You convert unstructured resumes into JSON for frontend developers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      // @ts-ignore
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let resumeJson: ResumeJson;
    try {
      resumeJson = extractJsonObject(raw) as ResumeJson;
    } catch (e) {
      console.error("JSON parse error (parse-resume):", e, raw);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json({ resumeJson });
  } catch (err) {
    console.error("parse-resume error:", err);
    return NextResponse.json(
      { error: "Internal server error in parse-resume" },
      { status: 500 },
    );
  }
}
