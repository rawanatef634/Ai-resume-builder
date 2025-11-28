// src/components/AtsPanel.tsx
import { CheckCircle, XCircle, Target } from "lucide-react";

interface AtsPanelProps {
  atsScore: number | null;
  missingSkills: string[];
  presentKeywords?: string[];
  missingKeywords?: string[];
  jobTitle?: string | null;
  jobCompany?: string | null;
}

export function AtsPanel({
  atsScore,
  missingSkills,
  presentKeywords = [],
  missingKeywords = [],
  jobTitle,
  jobCompany,
}: AtsPanelProps) {
  const hasKeywords =
    (presentKeywords?.length ?? 0) > 0 ||
    (missingKeywords?.length ?? 0) > 0;

  const scoreLabel =
    atsScore === null
      ? "Not calculated yet"
      : atsScore >= 80
      ? "Strong match"
      : atsScore >= 60
      ? "Good match"
      : "Needs improvement";

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">ATS Match</h3>
          <p className="mt-1 text-xs text-emerald-200/90">
            Based on structure + keywords from the pasted job description
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
            {atsScore !== null ? (
              <>
                <span className="text-lg font-bold text-cyan-300">
                  {atsScore}/100
                </span>
                <span className="text-xs font-medium text-cyan-100">
                  {scoreLabel}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-cyan-200">
                Not yet calculated
              </span>
            )}
          </div>
          {jobTitle && (
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-[11px] text-slate-200">
              <Target className="h-3 w-3 text-cyan-300" />
              <span className="truncate">
                {jobTitle}
                {jobCompany ? ` · ${jobCompany}` : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {atsScore !== null ? (
        <>
          <p className="text-xs sm:text-sm text-slate-200">
            This score estimates how closely your resume matches the job
            description from a keyword + structure perspective, tuned for
            U.S./Canada ATS patterns.
          </p>

          {/* Missing skills (high level) */}
          {missingSkills.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                Suggested skills to highlight
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-100"
                  >
                    <CheckCircle className="h-3 w-3 text-amber-300" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyword breakdown */}
          {hasKeywords && (
            <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 text-xs sm:grid-cols-2">
              {/* Present keywords */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    Matched keywords
                  </h4>
                  <span className="text-[10px] text-emerald-200/80">
                    {presentKeywords.length}
                  </span>
                </div>
                {presentKeywords.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No specific keywords detected yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {presentKeywords.slice(0, 15).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] text-emerald-100"
                      >
                        {kw}
                      </span>
                    ))}
                    {presentKeywords.length > 15 && (
                      <span className="text-[10px] text-emerald-200/80">
                        +{presentKeywords.length - 15} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Missing keywords */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                    Keywords to consider adding
                  </h4>
                  <span className="text-[10px] text-amber-200/80">
                    {missingKeywords.length}
                  </span>
                </div>
                {missingKeywords.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No obvious missing keywords. You&apos;re closely aligned.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {missingKeywords.slice(0, 15).map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] text-amber-100"
                      >
                        <XCircle className="h-3 w-3 text-amber-300" />
                        {kw}
                      </span>
                    ))}
                    {missingKeywords.length > 15 && (
                      <span className="text-[10px] text-amber-200/80">
                        +{missingKeywords.length - 15} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {!hasKeywords && (
            <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 text-[11px] text-slate-300">
              Paste a detailed job description next time to see a breakdown of
              matched vs missing keywords.
            </div>
          )}
        </>
      ) : (
        // No ATS score yet
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-200">
            Paste a U.S./Canada remote job link or description and click{" "}
            <span className="font-semibold text-cyan-300">
              “Analyze & Tailor Resume”
            </span>{" "}
            to see:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              ATS match score out of 100
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              Suggested skills to highlight
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              Matched vs missing keywords from the job description
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
