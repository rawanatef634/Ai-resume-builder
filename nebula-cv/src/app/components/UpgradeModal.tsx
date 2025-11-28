"use client";

import { X, Crown } from "lucide-react";
import React from "react";

type UpgradeReason = "resumes" | "tailor" | "coverLetter";

interface UpgradeModalProps {
  open: boolean;
  reason?: UpgradeReason;
  onClose: () => void;
}
const handleUpgrade = async () => {
  const res = await fetch("/api/checkout", { method: "POST" });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  }
};

export function UpgradeModal({ open, reason, onClose }: UpgradeModalProps) {
  if (!open) return null;

  const reasonLine =
    reason === "resumes"
      ? "You’ve hit the free limit for saved resumes."
      : reason === "tailor"
      ? "You’ve hit the free limit for job tailorings."
      : reason === "coverLetter"
      ? "You’ve hit the free limit for cover letters."
      : "You’ve reached the limits of the free plan.";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Pro coming soon
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                Upgrade to NebulaCV Pro
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-slate-200">{reasonLine}</p>
        <p className="mt-1 text-xs text-slate-400">
          Pro is designed for active job seekers applying to multiple
          U.S./Canada roles every week.
        </p>

        <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-100">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <div>
              <div className="font-semibold text-white">
                Unlimited resumes & job versions
              </div>
              <div className="text-xs text-slate-400">
                Keep separate versions for every company and role you apply to.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <div>
              <div className="font-semibold text-white">
                Unlimited job tailorings & cover letters
              </div>
              <div className="text-xs text-slate-400">
                Optimize your resume and cover letter for every job posting.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <div>
              <div className="font-semibold text-white">
                Advanced templates & priority AI
              </div>
              <div className="text-xs text-slate-400">
                More resume layouts tuned for front-end roles and faster
                responses.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            No credit card required yet. We&apos;ll email you when Pro is
            available.
          </p>
          <div className="flex gap-2">
         <button onClick={handleUpgrade} className="btn-pro">
          Upgrade to Pro
        </button>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-300"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
