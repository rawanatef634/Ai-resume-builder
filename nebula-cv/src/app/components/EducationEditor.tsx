// src/app/components/EducationEditor.tsx
"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface EducationItem {
  institution: string;
  degree: string;
  location?: string;
  period?: string;
}

interface EducationEditorProps {
  resumeJson: any | null;
  onChange: (next: any) => void;
}

export function EducationEditor({
  resumeJson,
  onChange,
}: EducationEditorProps) {
  if (!resumeJson) {
    return (
      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">
        <div className="text-sm font-semibold text-white">Education</div>
        <p>
          Once you generate or import a resume, you&apos;ll be able to edit your
          education here.
        </p>
      </div>
    );
  }

  const education: EducationItem[] = Array.isArray(resumeJson.education)
    ? resumeJson.education
    : [];

  const updateEducation = (next: EducationItem[]) => {
    onChange({
      ...resumeJson,
      education: next,
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof EducationItem,
    value: string,
  ) => {
    const next = education.map((e, i) =>
      i === index ? { ...e, [field]: value } : e,
    );
    updateEducation(next);
  };

  const handleAddEducation = () => {
    const next: EducationItem[] = [
      ...education,
      {
        institution: "",
        degree: "",
        location: "",
        period: "",
      },
    ];
    updateEducation(next);
  };

  const handleRemoveEducation = (index: number) => {
    const next = education.filter((_, i) => i !== index);
    updateEducation(next);
  };

  const moveEducation = (from: number, to: number) => {
    if (to < 0 || to >= education.length) return;
    const next = [...education];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    updateEducation(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Education</h3>
          <p className="mt-1 text-xs text-slate-400">
            Add your degrees or relevant certifications. For junior roles, this
            section is important.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-cyan-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Add entry
        </button>
      </div>

      {education.length === 0 ? (
        <p className="text-xs text-slate-400">
          No education entries yet. Add your main degree or relevant programs.
        </p>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-[11px] text-slate-500">
                  Entry {index + 1}
                </div>
                <div className="flex gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => moveEducation(index, index - 1)}
                    className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEducation(index, index + 1)}
                    className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
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
                    Institution
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="Cairo University"
                    value={edu.institution || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "institution", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Degree / Program
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    placeholder="BSc Computer Science"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "degree", e.target.value)
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
                    placeholder="2017 – 2021"
                    value={edu.period || ""}
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
                    placeholder="Cairo, Egypt"
                    value={edu.location || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "location", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
