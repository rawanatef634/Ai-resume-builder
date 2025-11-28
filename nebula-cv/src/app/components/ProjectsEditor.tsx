// src/app/components/ProjectsEditor.tsx
"use client";

import { Plus, Trash2, ArrowUp, ArrowDown, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface ProjectItem {
  name: string;
  description?: string;
  stack?: string[];
  link?: string;
}

interface ProjectsEditorProps {
  resumeJson: any | null;
  onChange: (next: any) => void;
}

export function ProjectsEditor({ resumeJson, onChange }: ProjectsEditorProps) {
  if (!resumeJson) {
    return (
      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">
        <div className="text-sm font-semibold text-white">Projects</div>
        <p>
          Once you generate or import a resume, you&apos;ll be able to edit your
          projects here.
        </p>
      </div>
    );
  }

  const projects: ProjectItem[] = Array.isArray(resumeJson.projects)
    ? resumeJson.projects
    : [];

  const updateProjects = (next: ProjectItem[]) => {
    onChange({
      ...resumeJson,
      projects: next,
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof ProjectItem,
    value: string,
  ) => {
    const next = projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    updateProjects(next);
  };

  const handleAddProject = () => {
    const next: ProjectItem[] = [
      ...projects,
      {
        name: "",
        description: "",
        link: "",
        stack: [],
      },
    ];
    updateProjects(next);
  };

  const handleRemoveProject = (index: number) => {
    const next = projects.filter((_, i) => i !== index);
    updateProjects(next);
  };

  const moveProject = (from: number, to: number) => {
    if (to < 0 || to >= projects.length) return;
    const next = [...projects];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    updateProjects(next);
  };

  const handleAddStackItem = (index: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const next = projects.map((p, i) => {
      if (i !== index) return p;
      const stack = Array.isArray(p.stack) ? [...p.stack] : [];
      const exists = stack.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exists) return p;
      stack.push(trimmed);
      return { ...p, stack };
    });
    updateProjects(next);
  };

  const handleRemoveStackItem = (index: number, stackIndex: number) => {
    const next = projects.map((p, i) => {
      if (i !== index) return p;
      const stack = Array.isArray(p.stack) ? [...p.stack] : [];
      stack.splice(stackIndex, 1);
      return { ...p, stack };
    });
    updateProjects(next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Projects</h3>
          <p className="mt-1 text-xs text-slate-400">
            Highlight 1–3 strong frontend projects. These support your
            experience for remote roles.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-cyan-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Add project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-xs text-slate-400">
          No projects yet. Add 1–3 relevant apps (dashboards, landing pages,
          internal tools, etc).
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((p, index) => (
            <ProjectCard
              key={index}
              index={index}
              project={p}
              onFieldChange={handleFieldChange}
              onRemove={() => handleRemoveProject(index)}
              onMoveUp={() => moveProject(index, index - 1)}
              onMoveDown={() => moveProject(index, index + 1)}
              onAddStackItem={(value) => handleAddStackItem(index, value)}
              onRemoveStackItem={(stackIndex) =>
                handleRemoveStackItem(index, stackIndex)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  index: number;
  project: ProjectItem;
  onFieldChange: (index: number, field: keyof ProjectItem, value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddStackItem: (value: string) => void;
  onRemoveStackItem: (stackIndex: number) => void;
}

function ProjectCard({
  index,
  project,
  onFieldChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddStackItem,
  onRemoveStackItem,
}: ProjectCardProps) {
  const [stackInput, setStackInput] = useState("");

  const handleStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (stackInput.trim()) {
        onAddStackItem(stackInput);
        setStackInput("");
      }
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] text-slate-500">Project {index + 1}</div>
        <div className="flex gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={onMoveUp}
            className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-full border border-white/10 bg-slate-900 px-2 py-0.5 text-slate-300 hover:border-cyan-500"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
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
            Project name
          </label>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            placeholder="Analytics Dashboard"
            value={project.name || ""}
            onChange={(e) => onFieldChange(index, "name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Link (optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-slate-900">
              <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
            </span>
            <input
              className="flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              placeholder="https://..."
              value={project.link || ""}
              onChange={(e) => onFieldChange(index, "link", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-medium text-slate-300">
          Short description
        </label>
        <textarea
          rows={2}
          className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          placeholder="Built a responsive analytics dashboard for pharmacy rebates, enabling pharmacists to track and submit claims in real time..."
          value={project.description || ""}
          onChange={(e) =>
            onFieldChange(index, "description", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Tech stack (tags)</span>
          <span className="text-slate-500">
            Example: React, TypeScript, Tailwind, GraphQL
          </span>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            placeholder="Add a tech (Enter to confirm)"
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            onKeyDown={handleStackKeyDown}
          />
          <button
            type="button"
            onClick={() => {
              if (stackInput.trim()) {
                onAddStackItem(stackInput);
                setStackInput("");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-cyan-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(project.stack ?? []).map((tech, i) => (
            <button
              key={`${tech}-${i}`}
              type="button"
              onClick={() => onRemoveStackItem(i)}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-100 hover:border-rose-400"
              title="Click to remove"
            >
              {tech}
              <span className="text-rose-300">×</span>
            </button>
          ))}
          {(!project.stack || project.stack.length === 0) && (
            <span className="text-[11px] text-slate-500">
              No stack tags yet.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
