// src/components/ToneControl.tsx
"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

interface ToneControlProps {
  resumeJson: any | null;
  onRefined: (json: any) => void;
}

type Tone = "neutral" | "technical" | "confident";

export function ToneControl({ resumeJson, onRefined }: ToneControlProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>("neutral");
  const [loading, setLoading] = useState(false);

  const tones: { value: Tone; label: string; desc: string }[] = [
    {
      value: "neutral",
      label: "Neutral",
      desc: "Balanced and professional",
    },
    {
      value: "technical",
      label: "Technical",
      desc: "Focus on technical depth",
    },
    {
      value: "confident",
      label: "Confident",
      desc: "Strong impact statements",
    },
  ];

  const handleRefine = async () => {
    if (!resumeJson || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/refine-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeJson,
          tone: selectedTone,
        }),
      });

      const data = await res.json();
      if (data.refinedResumeJson) {
        onRefined(data.refinedResumeJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Writing Style</h3>
        <Wand2 className="h-5 w-5 text-cyan-400" />
      </div>

      <p className="text-sm text-slate-400">
        Choose how your resume should sound
      </p>

      {/* Tone Selector */}
      <div className="grid gap-3 md:grid-cols-3">
        {tones.map((tone) => (
          <button
            key={tone.value}
            onClick={() => setSelectedTone(tone.value)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedTone === tone.value
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-white/10 bg-slate-950/50 hover:border-white/20"
            }`}
          >
            <div className="text-base font-semibold text-white">
              {tone.label}
            </div>
            <div className="mt-1 text-sm text-slate-400">{tone.desc}</div>
          </button>
        ))}
      </div>

      {/* Refine Button */}
      <button
        onClick={handleRefine}
        disabled={!resumeJson || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Wand2 className="h-5 w-5" />
        {loading ? "Refining..." : "Refine Wording"}
      </button>

      {!resumeJson && (
        <p className="text-sm text-amber-300/90">
          Complete the interview first to unlock tone refinement
        </p>
      )}
    </div>
  );
}