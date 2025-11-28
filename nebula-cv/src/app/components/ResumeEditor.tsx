"use client";

import { useState } from "react";
import { Wand2, PlusCircle } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  period?: string;
  location?: string;
  bullets: string[];
}

interface ResumeJson {
  summary?: string;
  skills?: string[];
  experiences?: Experience[];
  projects?: any[];
  education?: any[];
}

interface ResumeEditorProps {
  resumeJson: ResumeJson | null;
  onChange: (json: ResumeJson) => void;
}

export function ResumeEditor({ resumeJson, onChange }: ResumeEditorProps) {
  const [loadingExperienceIndex, setLoadingExperienceIndex] = useState<
    number | null
  >(null);

  if (!resumeJson) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-sm text-slate-400 backdrop-blur-sm">
        Complete the guided interview or import an existing resume to start
        editing content.
      </div>
    );
  }

  const updateSummary = (value: string) => {
    onChange({ ...resumeJson, summary: value });
  };

  const updateExperienceField = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const exps = [...(resumeJson.experiences || [])];
    exps[index] = { ...exps[index], [field]: value };
    onChange({ ...resumeJson, experiences: exps });
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const exps = [...(resumeJson.experiences || [])];
    const exp = exps[expIndex];
    const bullets = [...(exp.bullets || [])];
    bullets[bulletIndex] = value;
    exps[expIndex] = { ...exp, bullets };
    onChange({ ...resumeJson, experiences: exps });
  };

  const addBullet = (expIndex: number) => {
    const exps = [...(resumeJson.experiences || [])];
    const exp = exps[expIndex];
    const bullets = [...(exp.bullets || []), ""];
    exps[expIndex] = { ...exp, bullets };
    onChange({ ...resumeJson, experiences: exps });
  };

  const handleGenerateBullets = async (expIndex: number) => {
    if (!resumeJson.experiences) return;
    const exp = resumeJson.experiences[expIndex];
    if (!exp) return;

    setLoadingExperienceIndex(expIndex);

    try{
      const res = await fetch("/api/generate-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: exp.title,
          company: exp.company,
          period: exp.period,
          location: exp.location,
          techStack: resumeJson.skills || [],
          existingBullets: exp.bullets || [],
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.bullets) && data.bullets.length > 0) {
        const exps = [...(resumeJson.experiences || [])];
        exps[expIndex] = {
          ...exp,
          bullets: [...(exp.bullets || []), ...data.bullets],
        };
        onChange({ ...resumeJson, experiences: exps });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExperienceIndex(null);
    }
  };


  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Content Editor</h3>
        <span className="text-sm text-slate-400">
          Edit summary and experience directly
        </span>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">
            Professional Summary
          </label>
        </div>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
          value={resumeJson.summary || ""}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Write 2–3 sentences summarizing your frontend experience, tech stack, and impact..."
        />
      </div>

      {/* Experiences */}
      {resumeJson.experiences && resumeJson.experiences.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Experience
            </label>
            <span className="text-xs text-slate-500">
              Edit titles and bullets, or generate new ones with AI
            </span>
          </div>

          <div className="space-y-4">
            {resumeJson.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-white/10 bg-slate-950/40 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Job Title
                    </label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-500"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperienceField(idx, "title", e.target.value)
                      }
                      placeholder="Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Company
                    </label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-500"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperienceField(idx, "company", e.target.value)
                      }
                      placeholder="Startup Inc."
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Period
                    </label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-500"
                      value={exp.period || ""}
                      onChange={(e) =>
                        updateExperienceField(idx, "period", e.target.value)
                      }
                      placeholder="2022 – Present"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Location
                    </label>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-500"
                      value={exp.location || ""}
                      onChange={(e) =>
                        updateExperienceField(idx, "location", e.target.value)
                      }
                      placeholder="Remote / Cairo, Egypt"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">
                      Bullet points
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addBullet(idx)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-cyan-500"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Add bullet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateBullets(idx)}
                        disabled={loadingExperienceIndex === idx}
                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Wand2 className="h-3 w-3" />
                        {loadingExperienceIndex === idx
                          ? "Generating..."
                          : "AI bullets"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(exp.bullets || []).map((b, bIdx) => (
                      <textarea
                        key={bIdx}
                        rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
                        value={b}
                        onChange={(e) =>
                          updateBullet(idx, bIdx, e.target.value)
                        }
                        placeholder="Implemented X resulting in Y..."
                      />
                    ))}
                    {(!exp.bullets || exp.bullets.length === 0) && (
                      <p className="text-xs text-slate-500">
                        No bullets yet. Use <strong>AI bullets</strong> or add
                        your own.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
