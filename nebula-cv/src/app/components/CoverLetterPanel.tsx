// src/app/components/CoverLetterPanel.tsx
"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import type { ResumeHeader } from "./ResumeHeaderForm";

type Tone = "neutral" | "technical" | "confident";

interface CoverLetterPanelProps {
  resumeJson: any | null;
  header: ResumeHeader;
  jobTitle: string | null;
  jobCompany: string | null;
  coverLetter: string;
  onChange: (value: string) => void;
  onGenerated: (value: string) => void;
  // kept for future paywall, but unused now
  reachedLimit: boolean;
  onHitLimit: () => void;
}

export function CoverLetterPanel({
  resumeJson,
  header,
  jobTitle,
  jobCompany,
  coverLetter,
  onChange,
  onGenerated,
}: CoverLetterPanelProps) {
  const [tone, setTone] = useState<Tone>("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = Boolean(resumeJson) && !loading;

  const handleGenerate = async () => {
    if (!resumeJson || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          header,
          resumeJson,
          jobTitle,
          jobCompany,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.message || "Failed to generate cover letter. Please try again.",
        );
        return;
      }

      if (data.coverLetter) {
        onGenerated(data.coverLetter);
      }
    } catch (err) {
      console.error(err);
      setError("Network error while contacting the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tones: { value: Tone; label: string; desc: string }[] = [
    { value: "neutral", label: "Neutral", desc: "Balanced and professional" },
    {
      value: "technical",
      label: "Technical",
      desc: "Highlights stack & problem-solving",
    },
    {
      value: "confident",
      label: "Confident",
      desc: "Stronger, impact-oriented tone",
    },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Cover letter</h3>
          <p className="mt-1 text-xs text-slate-400">
            Generate a tailored cover letter based on your resume and the last
            job you tailored to.
          </p>
        </div>
        <Wand2 className="h-5 w-5 text-cyan-400" />
      </div>

      {/* Tone selector */}
      <div className="grid gap-3 md:grid-cols-3">
        {tones.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTone(t.value)}
            className={`rounded-xl border p-3 text-left transition ${
              tone === t.value
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-white/10 bg-slate-950/60 hover:border-white/20"
            }`}
          >
            <div className="text-sm font-semibold text-white">
              {t.label}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {t.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-[11px] text-slate-300">
        <p>
          We use your <span className="font-medium">Summary</span>,{" "}
          <span className="font-medium">Experience</span>,{" "}
          <span className="font-medium">Projects</span>, and the last job title/
          company you tailored to:
        </p>
        <p className="mt-1 text-slate-400">
          {jobTitle || jobCompany ? (
            <>
              <span className="font-semibold text-slate-100">
                {jobTitle || "Role"} at {jobCompany || "company"}
              </span>
            </>
          ) : (
            <>
              No job selected yet. Tailor your resume to a job first for best
              results.
            </>
          )}
        </p>
      </div>

      {/* Editor */}
      <textarea
        rows={7}
        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
        placeholder="You can edit the generated cover letter here…"
        value={coverLetter}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Wand2 className="h-4 w-4" />
          {loading ? "Generating…" : "Generate from resume"}
        </button>
        {!resumeJson && (
          <p className="text-[11px] text-amber-300/90">
            Create or import a resume first to enable cover letter
            generation.
          </p>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
  