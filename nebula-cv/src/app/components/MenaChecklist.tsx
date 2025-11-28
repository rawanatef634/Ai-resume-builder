// src/components/MenaChecklist.tsx
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface MenaChecklistProps {
  resumeJson: any | null;
  header: any;
}

export function MenaChecklist({ resumeJson, header }: MenaChecklistProps) {
  // Check various criteria
  const checks = [
    {
      id: "no-photo",
      label: "No photo",
      status: "pass", // Always pass since we don't support photos
      info: "US/Canada companies prefer resumes without photos",
    },
    {
      id: "english-only",
      label: "English language",
      status: resumeJson ? "pass" : "pending",
      info: "Resume content should be in English",
    },
    {
      id: "contact-info",
      label: "Professional contact info",
      status: header.email && header.phone ? "pass" : "warning",
      info: "Include email and phone number",
    },
    {
      id: "tech-stack",
      label: "Clear tech stack listed",
      status: resumeJson?.skills?.length > 0 ? "pass" : "pending",
      info: "List your technical skills prominently",
    },
    {
      id: "one-page",
      label: "One page length",
      status:
        resumeJson?.experiences?.length <= 3 ? "pass" : "warning",
      info: "Junior/mid-level resumes should be 1 page",
    },
    {
      id: "no-personal",
      label: "No personal info",
      status: "pass",
      info: "Avoid age, marital status, nationality",
    },
  ];

  const passedCount = checks.filter((c) => c.status === "pass").length;
  const totalCount = checks.length;
  const scorePercentage = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">US/Canada Ready</h3>
        <div className="rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 px-4 py-2 text-lg font-bold text-white">
          {passedCount}/{totalCount}
        </div>
      </div>

      <p className="text-base text-slate-300">
        Essential checklist for MENA developers applying to US/Canada remote roles
      </p>

      <div className="space-y-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/30 p-3"
          >
            <div className="flex-shrink-0 pt-0.5">
              {check.status === "pass" && (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              {check.status === "warning" && (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              {check.status === "pending" && (
                <XCircle className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-base font-medium text-white">
                {check.label}
              </div>
              <div className="mt-1 text-sm text-slate-400">{check.info}</div>
            </div>
          </div>
        ))}
      </div>

      {scorePercentage === 100 ? (
        <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
          <p className="text-base font-semibold text-emerald-300">
            🎉 Your resume meets all US/Canada standards!
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200">
            Complete the remaining items to maximize your chances with US/Canada companies
          </p>
        </div>
      )}
    </div>
  );
}