// src/components/JobLinkForm.tsx
"use client";

import { useState } from "react";
import { Target } from "lucide-react";

interface JobLinkFormProps {
  resumeJson: any | null;
  onTailoredResume: (
    json: any,
    atsScore: number,
    missingSkills: string[],
    presentKeywords?: string[],
    missingKeywords?: string[],
    jobTitle?: string | null,
    jobCompany?: string | null,
  ) => void;
}

export function JobLinkForm({
  resumeJson,
  onTailoredResume,
}: JobLinkFormProps) {
  const [jobUrlOrText, setJobUrlOrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeJson || !jobUrlOrText.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeJson,
          jobInput: jobUrlOrText.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 || data?.error === "RATE_LIMIT") {
          setError(
            "You’ve reached the AI rate limit for now. Wait a bit and then try tailoring again.",
          );
        } else {
          setError(
            data?.message ||
              "Something went wrong while tailoring. Please try again.",
          );
        }
        return;
      }

      onTailoredResume(
        data.tailoredResumeJson,
        data.atsScore,
        data.missingSkills ?? [],
        data.presentKeywords ?? [],
        data.missingKeywords ?? [],
        data.jobTitle ?? null,
        data.jobCompany ?? null,
      );
    } catch (err) {
      console.error(err);
      setError("Network error while contacting the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Tailor to a Job</h3>
        <Target className="h-5 w-5 text-cyan-400" />
      </div>

      <p className="text-sm text-slate-400">
        Paste U.S./Canada remote job link or full description
      </p>

      <textarea
        rows={5}
        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
        placeholder="Paste job link or full job description here..."
        value={jobUrlOrText}
        onChange={(e) => setJobUrlOrText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={!resumeJson || loading}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Analyze & Tailor Resume"}
      </button>

      {!resumeJson && (
        <p className="text-sm text-amber-300/90">
          Complete the guided interview or import a resume first so NebulaCV can
          build your base CV.
        </p>
      )}

      {error && (
        <p className="text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
