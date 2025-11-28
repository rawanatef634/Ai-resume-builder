// src/app/tracker/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ArrowLeft, ChevronDown } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type JobStatus = "applied" | "interviewing" | "offer" | "rejected" | "hold";

interface JobApplication {
  id: string;
  user_id: string;
  resume_id: string | null;
  company: string | null;
  role: string | null;
  job_url: string | null;
  status: JobStatus;
  applied_at: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ResumeSummary {
  id: string;
  title: string | null;
}

export default function TrackerPage() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefill from query (e.g. from builder link)
  const initialCompany = searchParams.get("company") ?? "";
  const initialRole = searchParams.get("title") ?? "";
  const initialUrl = searchParams.get("url") ?? "";
  const initialResumeIdFromUrl = searchParams.get("resumeId") ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState(initialCompany);
  const [role, setRole] = useState(initialRole);
  const [jobUrl, setJobUrl] = useState(initialUrl);
  const [status, setStatus] = useState<JobStatus>("applied");
  const [appliedAt, setAppliedAt] = useState<string>("");
  const [notes, setNotes] = useState("");

  // NEW: resumes for dropdown + linking
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    initialResumeIdFromUrl,
  );

  const resumeMap = useMemo(() => {
    const map: Record<string, ResumeSummary> = {};
    resumes.forEach((r) => {
      map[r.id] = r;
    });
    return map;
  }, [resumes]);

  // Load user + resumes + their applications
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoadingUser(true);
      setLoading(true);

      const { data } = await supabase.auth.getUser();
      const u = (data.user as User | null) ?? null;
      if (cancelled) return;

      // Redirect to login if no user
      if (!u) {
        router.push('/login');
        return;
      }

      setUser(u);
      setLoadingUser(false);

      // Load resumes for this user
      const { data: resumeRows, error: resumeError } = await supabase
        .from("resumes")
        .select("id, title")
        .eq("user_id", u.id)
        .order("updated_at", { ascending: false });

      if (!cancelled && !resumeError && resumeRows) {
        setResumes(resumeRows as ResumeSummary[]);
      }

      // Load applications
      const { data: rows, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", u.id)
        .order("applied_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error(error);
        setError("Failed to load applications.");
      } else {
        setJobs((rows ?? []) as JobApplication[]);
      }

      setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [supabase, router]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!company && !role && !jobUrl) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        user_id: user.id,
        company: company || null,
        role: role || null,
        job_url: jobUrl || null,
        status,
        applied_at: appliedAt || null,
        notes: notes || null,
        // NEW: link to resume
        resume_id: selectedResumeId || null,
      };

      const { data, error } = await supabase
        .from("job_applications")
        .insert([payload])
        .select("*")
        .single();

      if (error) {
        console.error(error);
        setError("Failed to save application.");
      } else if (data) {
        setJobs((prev) => [data as JobApplication, ...prev]);

        // Clear form except selectedResumeId (so you can add multiple for same resume)
        setCompany("");
        setRole("");
        setJobUrl("");
        setStatus("applied");
        setAppliedAt("");
        setNotes("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    if (!user) return;
    const original = [...jobs];

    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)),
    );

    const { error } = await supabase
      .from("job_applications")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      setJobs(original);
    }
  };

  const statusLabel: Record<JobStatus, string> = {
    applied: "Applied",
    interviewing: "Interviewing",
    offer: "Offer",
    rejected: "Rejected",
    hold: "On hold",
  };

  const statusColor: Record<JobStatus, string> = {
    applied: "bg-slate-800 text-slate-100 border-slate-600",
    interviewing: "bg-amber-500/20 text-amber-100 border-amber-400/70",
    offer: "bg-emerald-500/20 text-emerald-100 border-emerald-400/70",
    rejected: "bg-rose-500/20 text-rose-100 border-rose-400/70",
    hold: "bg-slate-700/60 text-slate-100 border-slate-500",
  };

  // Loading state
  if (loadingUser) {
    return (
      <div className="relative max-w-8xl px-6 py-20">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 rounded bg-slate-800" />
            <div className="h-9 w-32 rounded-full bg-slate-800" />
          </div>
          <div className="h-32 rounded-2xl bg-slate-900/80 border border-white/10" />
          <div className="h-64 rounded-2xl bg-slate-900/80 border border-white/10" />
        </div>
      </div>
    );
  }

  // This shouldn't render due to redirect, but keep as fallback
  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-slate-300">
        Redirecting to login…
      </div>
    );
  }

  // Logged in view
  return (
    <div className="relative mx-auto max-w-7xl my-24 px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Job Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Keep track of where you&apos;ve applied and which resume you used.
            </p>
          </div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to builder
          </Link>
        </div>

        {/* Tiny stats row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total applications" value={jobs.length} />
          <StatCard
            label="Interviewing"
            value={jobs.filter((j) => j.status === "interviewing").length}
          />
          <StatCard
            label="Offers"
            value={jobs.filter((j) => j.status === "offer").length}
          />
        </div>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              Add application
            </h2>
            <span className="text-[11px] text-slate-400">
              Tip: Tailor your resume in the builder, then select which one you
              used here.
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Company
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                placeholder="Shopify"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Role / job title
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                placeholder="Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Job link
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                placeholder="https://..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Applied date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                value={appliedAt}
                onChange={(e) => setAppliedAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[160px,1.2fr]">
            {/* Status */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as JobStatus)
                  }
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="hold">On hold</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            {/* Resume select */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Resume used (optional)
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  <option value="">Not linked</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || "Untitled resume"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Notes
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              placeholder="Interviewer names, time zones, follow-up dates..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : "Add application"}
          </button>
        </form>

        {/* List */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Your applications
            </h2>
            <p className="text-xs text-slate-400">
              {jobs.length === 0
                ? "No applications tracked yet."
                : `${jobs.length} application${
                    jobs.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">
              Loading applications…
            </p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-slate-400">
              When you apply with a tailored resume, add it here so
              you remember where and when you applied.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200">
                <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="py-2 pr-4">Company</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Applied</th>
                    <th className="py-2 pr-4">Resume</th>
                    <th className="py-2 pr-4">Job link</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const linkedResume =
                      job.resume_id && resumeMap[job.resume_id];

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="py-2 pr-4 text-xs font-medium text-slate-100">
                          {job.company || "—"}
                        </td>
                        <td className="py-2 pr-4 text-xs text-slate-200">
                          {job.role || "—"}
                        </td>
                        <td className="py-2 pr-4 text-xs">
                          <select
                            className={`rounded-full border px-3 py-1 text-[11px] outline-none ${statusColor[job.status]}`}
                            value={job.status}
                            onChange={(e) =>
                              handleStatusChange(
                                job.id,
                                e.target.value as JobStatus,
                              )
                            }
                          >
                            <option value="applied">
                              {statusLabel.applied}
                            </option>
                            <option value="interviewing">
                              {statusLabel.interviewing}
                            </option>
                            <option value="offer">
                              {statusLabel.offer}
                            </option>
                            <option value="rejected">
                              {statusLabel.rejected}
                            </option>
                            <option value="hold">
                              {statusLabel.hold}
                            </option>
                          </select>
                        </td>
                        <td className="py-2 pr-4 text-xs text-slate-300">
                          {job.applied_at
                            ? new Date(
                                job.applied_at,
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="py-2 pr-4 text-xs text-slate-200">
                          {linkedResume ? (
                            <div className="flex flex-col gap-1">
                              <span className="truncate">
                                {linkedResume.title ||
                                  "Untitled resume"}
                              </span>
                              <Link
                                href={`/builder?resumeId=${linkedResume.id}`}
                                className="text-[11px] text-cyan-300 hover:text-cyan-200"
                              >
                                View resume
                              </Link>
                            </div>
                          ) : (
                            <span className="text-slate-500">
                              Not linked
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-xs">
                          {job.job_url ? (
                            <a
                              href={job.job_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-300 hover:text-cyan-200"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-slate-500">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}