// src/app/components/SkillsEditor.tsx
"use client";

import { useState } from "react";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";

interface SkillsEditorProps {
  resumeJson: any | null;
  onChange: (next: any) => void;
}

export function SkillsEditor({ resumeJson, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState("");

  if (!resumeJson) {
    return (
      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">
        <div className="text-sm font-semibold text-white">
          Technical Skills
        </div>
        <p>
          Once you generate or import a resume, you&apos;ll be able to edit your
          skills here as tags.
        </p>
      </div>
    );
  }

  const skills: string[] = Array.isArray(resumeJson.skills)
    ? resumeJson.skills
    : [];

  const updateSkills = (next: string[]) => {
    onChange({
      ...resumeJson,
      skills: next,
    });
  };

  const addSkill = () => {
    const value = input.trim();
    if (!value) return;

    // avoid duplicates (case-insensitive)
    const exists = skills.some(
      (s) => s.toLowerCase() === value.toLowerCase(),
    );
    if (exists) {
      setInput("");
      return;
    }

    updateSkills([...skills, value]);
    setInput("");
  };

  const removeSkill = (index: number) => {
    const next = skills.filter((_, i) => i !== index);
    updateSkills(next);
  };

  const moveSkill = (from: number, to: number) => {
    if (to < 0 || to >= skills.length) return;
    const next = [...skills];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    updateSkills(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white">
            Technical Skills
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Add or reorder your skills. These show up under &quot;Technical
            Skills&quot; in the resume preview.
          </p>
        </div>
        <span className="text-[11px] text-slate-500">
          Aim for 8–15 focused skills
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          placeholder="Add a skill (e.g. React, TypeScript, Tailwind)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-cyan-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Chips */}
      {skills.length === 0 ? (
        <p className="text-xs text-slate-400">
          No skills yet. Add your main technologies like React, TypeScript,
          Next.js, Tailwind, Jest, Cypress, etc.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-100"
            >
              <span className="mr-1 font-medium">{skill}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => moveSkill(index, index - 1)}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-[10px] text-slate-300 hover:border-cyan-500"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSkill(index, index + 1)}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-[10px] text-slate-300 hover:border-cyan-500"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-red-500/40 bg-red-950/60 text-[10px] text-red-100 hover:border-red-400"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
