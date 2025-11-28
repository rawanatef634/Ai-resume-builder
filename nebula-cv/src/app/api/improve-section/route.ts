// src/app/api/improve-section/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, mode } = body as {
      section: "summary" | "experience";
      mode: "improve" | "concise" | "technical" | string;
      summary?: string;
      experience?: {
        title?: string;
        company?: string;
        period?: string;
        bullets?: string[];
      };
    };

    if (section === "summary") {
      if (!body.summary) {
        return NextResponse.json(
          { error: "Missing summary" },
          { status: 400 },
        );
      }

      const toneHint =
        mode === "concise"
          ? "more concise, while keeping impact and key metrics"
          : mode === "technical"
          ? "more technical, with specific tools and metrics"
          : "more polished and professional, with strong action verbs and impact";

      const prompt = `You are helping a frontend engineer rewrite their resume summary for US/Canada tech companies.

Original summary:
"${body.summary}"

Rewrite this as a single resume summary paragraph, ${toneHint}.
- Keep it 3–4 lines.
- Do not add personal details.
- Write directly in English.
Return ONLY the rewritten summary text.`;

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You rewrite resume summaries for software engineers. Be concise and impact-focused.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
        });

      const improved =
        completion.choices[0].message.content?.trim() ?? "";

      return NextResponse.json({ summary: improved });
    }

    if (section === "experience") {
      const exp = body.experience;
      if (!exp || !Array.isArray(exp.bullets)) {
        return NextResponse.json(
          { error: "Missing experience bullets" },
          { status: 400 },
        );
      }

      const bulletsText = exp.bullets
        .map((b: string, i: number) => `${i + 1}. ${b}`)
        .join("\n");

      const toneHint =
        mode === "concise"
          ? "more concise, merging or shortening where possible"
          : "more impact-focused, with strong action verbs and measurable outcomes where possible";

      const prompt = `You are helping a frontend engineer rewrite the bullet points for a single job in their resume.

Job:
- Title: ${exp.title ?? "Frontend Engineer"}
- Company: ${exp.company ?? "Company"}
- Period: ${exp.period ?? ""}

Current bullet points:
${bulletsText}

Rewrite these bullet points to be ${toneHint}.
Guidelines:
- Return 3–6 bullet points.
- Each bullet should start with a strong verb.
- Focus on impact, metrics, and technologies used.
- Keep everything in English.
Return ONLY the new bullet points as a numbered list.`;

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You rewrite resume bullet points for software engineers. Focus on measurable impact.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
        });

      const content =
        completion.choices[0].message.content ?? "";
      // Parse numbered list back into array
      const lines = content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const bullets: string[] = lines.map((line) =>
        line.replace(/^\d+[\).\s-]*/, "").trim(),
      );

      return NextResponse.json({ bullets });
    }

    return NextResponse.json(
      { error: "Unknown section" },
      { status: 400 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to improve section" },
      { status: 500 },
    );
  }
}
