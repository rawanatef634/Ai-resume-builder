// src/app/components/ExperienceEditor.tsx
"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

interface ExperienceItem {
  title: string;
  company: string;
  period?: string;
  location?: string;
  bullets?: string[];
}

interface ExperienceEditorProps {
  resumeJson: any | null;
  onChange: (next: any) => void;
}

export function ExperienceEditor({
  resumeJson,
  onChange,
}: ExperienceEditorProps) {
  if (!resumeJson) {
    return (
      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">
        <div className="text-sm font-semibold text-white">
          Experience (manual edit)
        </div>
        <p>
          Once you generate or import a resume, you&apos;ll be able to
          fine-tune your experience section here.
        </p>
      </div>
    );
  }

  const experiences: ExperienceItem[] = Array.isArray(resumeJson.experiences)
    ? resumeJson.experiences
    : [];

  const updateExperiences = (next: ExperienceItem[]) => {
    onChange({
      ...resumeJson,
      experiences: next,
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof ExperienceItem,
    value: string,
  ) => {
    const next = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    );
    updateExperiences(next);
  };

  const handleBulletChange = (
    expIndex: number,
    bulletIndex: number,
    value: string,
  ) => {
    const next = experiences.map((exp, i) => {
      if (i !== expIndex) return exp;
      const bullets = Array.isArray(exp.bullets) ? [...exp.bullets] : [];
      bullets[bulletIndex] = value;
      return { ...exp, bullets };
    });
    updateExperiences(next);
  };

  const handleAddExperience = () => {
    const next: ExperienceItem[] = [
      ...experiences,
      {
        title: "",
        company: "",
        period: "",
        location: "",
        bullets: [""],
      },
    ];
    updateExperiences(next);
  };

  const handleRemoveExperience = (index: number) => {
    const next = experiences.filter((_, i) => i !== index);
    updateExperiences(next);
  };

  const handleAddBullet = (expIndex: number) => {
    const next = experiences.map((exp, i) => {
      if (i !== expIndex) return exp;
      const bullets = Array.isArray(exp.bullets) ? [...exp.bullets] : [];
      bullets.push("");
      return { ...exp, bullets };
    });
    updateExperiences(next);
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const next = experiences.map((exp, i) => {
      if (i !== expIndex) return exp;
      const bullets = Array.isArray(exp.bullets) ? [...exp.bullets] : [];
      bullets.splice(bulletIndex, 1);
      return { ...exp, bullets };
    });
    updateExperiences(next);
  };

  const moveExperience = (from: number, to: number) => {
    if (to < 0 || to >= experiences.length) return;
    const next = [...experiences];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    updateExperiences(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            Experience (manual edit)
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Fine-tune job titles, companies, and bullets. Changes update the
            preview and PDF instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-cyan-500"
        >
          <Plus className="h-3 w-3" />
          Add role
        </button>
      </div>

      {experiences.length === 0 ? (
        <p className="text-xs text-slate-400">
          No experience entries yet. Use the guided interview, import a resume,
          or click &quot;Add role&quot; to start from scratch.
        </p>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <GripVertical className="h-3.5 w-3.5 text-slate-600" />
                  <span>Role {index + 1}</span>
                </div>
                <div className="flex gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => moveExperience(index, index - 1)}
                    className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExperience(index, index + 1)}
                    className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-950/50 px-2 py-0.5 text-[11px] font-medium text-red-100 hover:border-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Job title
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="Frontend Developer"
                    value={exp.title || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Company
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="Tech Startup"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "company", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Period
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="2022 – Present"
                    value={exp.period || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "period", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Location
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="Cairo, Egypt (remote)"
                    value={exp.location || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "location", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Impact bullets</span>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(index)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200 hover:border-cyan-500"
                  >
                    <Plus className="h-3 w-3" />
                    Bullet
                  </button>
                </div>
                {(exp.bullets ?? []).map((b, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <textarea
                      rows={2}
                      className="flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                      placeholder="Implemented X using Y, resulting in Z% improvement..."
                      value={b}
                      onChange={(e) =>
                        handleBulletChange(
                          index,
                          bulletIndex,
                          e.target.value,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveBullet(index, bulletIndex)
                      }
                      className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/50 bg-red-950/50 text-red-100 hover:border-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(!exp.bullets || exp.bullets.length === 0) && (
                  <p className="text-[11px] text-slate-500">
                    No bullets yet. Add 3–5 concise, impact-focused statements
                    for this role.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
