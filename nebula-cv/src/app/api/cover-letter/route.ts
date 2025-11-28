import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { header, resumeJson, jobDescription, tone } =
      (await req.json()) as {
        header: {
          fullName: string;
          title: string;
          location?: string;
        };
        resumeJson: any;
        jobDescription: string;
        tone?: "neutral" | "technical" | "confident";
      };

    if (!header || !resumeJson || !jobDescription) {
      return NextResponse.json(
        { error: "header, resumeJson, and jobDescription are required" },
        { status: 400 },
      );
    }

    const toneDescription =
      tone === "technical"
        ? "slightly technical tone, referencing modern frontend tools and practices"
        : tone === "confident"
        ? "confident, impact-oriented tone that shows enthusiasm for the role"
        : "neutral and professional tone suitable for North American companies";

    const prompt = `
You are writing a cover letter for a frontend developer from the Middle East applying for a U.S./Canada remote role.

Use:
- Candidate info:
  - Name: ${header.fullName || "Candidate"}
  - Title: ${header.title || "Frontend Developer"}
  - Location: ${header.location || "MENA, remote"}
- Resume JSON: 
${JSON.stringify(resumeJson, null, 2)}

- Job description:
${jobDescription}

Write a 3–4 paragraph cover letter that:
- Is targeted to this specific job.
- Highlights relevant frontend experience, stack (React, TypeScript, Next.js, Tailwind, testing, performance).
- Mentions remote collaboration, time zones, and communication when relevant.
- Uses ${toneDescription}.
- Does NOT include a street address or overly personal details.
- Uses a simple sign-off like: "Best regards, [Name]".

Return ONLY the plain text cover letter. No JSON, no explanations.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, professional cover letters for frontend developers applying to U.S./Canada remote roles.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    const coverLetter = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ coverLetter });
  } catch (err) {
    console.error("cover-letter error:", err);
    return NextResponse.json(
      { error: "Internal server error in cover-letter" },
      { status: 500 },
    );
  }
}
