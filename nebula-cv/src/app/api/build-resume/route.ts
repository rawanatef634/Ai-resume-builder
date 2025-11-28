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
    const { answers } = (await req.json()) as { answers: string[] };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "answers required" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert resume writer for frontend developers from the Middle East applying to U.S. and Canadian remote roles.

The user has provided several answers about their experience. Some or all may be in Arabic. Your tasks:

1. If the text is Arabic, interpret and translate it into professional English appropriate for a resume. Do NOT translate technology names (React, API, Docker, Tailwind, etc.).
2. Create a concise professional summary (2–3 sentences) suitable for North American ATS. No personal information.
3. Infer a list of frontend skills: frameworks (React, Vue, Angular), libraries (Redux, Zustand, React Query, Vuex), styling tools (Tailwind, CSS-in-JS, MUI, Chakra), build tools (Vite, Webpack), testing tools (Jest, Cypress), and APIs (REST, GraphQL) where applicable.
4. Build 3–6 bullet points focusing on impact and measurable outcomes where possible (e.g. "reduced load time by 30%", "increased conversion by 12%").
5. Extract education if mentioned (institution, degree, location, period).
6. Extract any concrete projects with stack.

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

User answers:
${answers.map((a, i) => `Answer ${i + 1}: ${a}`).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate ATS-optimized resumes in JSON for frontend developers applying to U.S./Canada remote jobs.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      // @ts-ignore
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let resumeJson: ResumeJson;

    try {
      resumeJson = extractJsonObject(raw) as ResumeJson;
    } catch (e) {
      console.error("JSON parse error (build-resume):", e, raw);
      resumeJson = {
        summary:
          "Frontend developer with experience building responsive interfaces using modern JavaScript frameworks.",
        skills: ["React", "JavaScript", "CSS"],
        experiences: [
          {
            title: "Frontend Developer",
            company: "Example Company",
            period: "",
            location: "",
            bullets: [
              "Implemented responsive UI components.",
              "Collaborated with backend engineers to integrate APIs.",
            ],
          },
        ],
        projects: [],
        education: [],
      };
    }

    return NextResponse.json({ resumeJson });
  } catch (err) {
    console.error("build-resume error:", err);
    return NextResponse.json(
      { error: "Internal server error in build-resume" },
      { status: 500 },
    );
  }
}
