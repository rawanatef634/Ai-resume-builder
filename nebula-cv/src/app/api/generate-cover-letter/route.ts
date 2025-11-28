// src/app/api/generate-cover-letter/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Tone = "neutral" | "technical" | "confident";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      header,
      resumeJson,
      jobTitle,
      jobCompany,
      tone,
    }: {
      header: {
        fullName?: string;
        title?: string;
        location?: string;
      };
      resumeJson: any;
      jobTitle?: string | null;
      jobCompany?: string | null;
      tone?: Tone;
    } = body;

    if (!header || !resumeJson) {
      return NextResponse.json(
        { error: "Missing header or resumeJson" },
        { status: 400 },
      );
    }

    const safeTone: Tone = tone ?? "neutral";

    const summary = resumeJson.summary ?? "";
    const skillsArr: string[] = resumeJson.skills ?? [];
    const skills = skillsArr.join(", ");
    const experiences = Array.isArray(resumeJson.experiences)
      ? resumeJson.experiences
      : [];

    const experienceLines = experiences
      .map((exp: any) => {
        const title = exp.title ?? "";
        const company = exp.company ?? "";
        const impact = Array.isArray(exp.bullets)
          ? exp.bullets.slice(0, 2).join(" ")
          : "";
        return `- ${title} at ${company}: ${impact}`;
      })
      .join("\n");

    const toneHint =
      safeTone === "technical"
        ? "slightly more technical, mentioning relevant tools and technologies, but still understandable to a recruiter."
        : safeTone === "confident"
        ? "confident and impact-focused, but still professional and not arrogant."
        : "neutral, professional tone suitable for most U.S./Canada tech companies.";

    const targetRoleLine =
      jobTitle && jobCompany
        ? `for the ${jobTitle} role at ${jobCompany}`
        : jobTitle
        ? `for the ${jobTitle} role`
        : jobCompany
        ? `for an open role at ${jobCompany}`
        : "for a frontend engineering role";

    const prompt = `
You write cover letters for software engineers applying to U.S. and Canadian tech companies.

Write a cover letter ${targetRoleLine}.

Candidate:
- Name: ${header.fullName ?? "Candidate"}
- Title: ${header.title ?? "Frontend Developer"}
- Location: ${header.location ?? "MENA (remote)"}

Summary:
${summary || "(no explicit summary provided)"}

Key skills:
${skills || "(no skills listed)"}

Experience highlights:
${experienceLines || "(no experience bullets available)"}

Tone:
- Use a ${toneHint}
- Write in English.
- Assume the candidate is based in MENA and applying for remote-friendly work.

Formatting rules:
- Return plain text ONLY (no markdown, no bullet lists, no code fences).
- Include a greeting (e.g., "Dear Hiring Manager,").
- 3–5 short paragraphs.
- End with a professional closing like "Sincerely," followed by their name (${header.fullName ??
      "Candidate"}).
- Do NOT include the date or company address block at the top.
- Do NOT include the candidate's email/phone in the body.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise assistant that writes clean, ATS-friendly cover letter text. Output plain text only, no markdown, no bullet lists.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
    });

    const text = completion.choices[0].message.content ?? "";
    const cleaned = text
      .replace(/```/g, "")
      .replace(/^[\s\n]*/, "")
      .trim();

    return NextResponse.json({ coverLetter: cleaned });
  } catch (err: any) {
    console.error(err);
     if (err?.status === 429) {
      return NextResponse.json(
        { error: "RATE_LIMIT", message: "OpenAI rate limit exceeded." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  }
}
