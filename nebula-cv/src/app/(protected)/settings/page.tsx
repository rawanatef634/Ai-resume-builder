// src/app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { LogOut, Trash2, FileText, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const FREE_RESUME_LIMIT = 3;
const FREE_JOB_TAILOR_LIMIT = 10;
const FREE_COVER_LETTER_LIMIT = 5;

type ResumeRow = {
  id: string;
  kind: "base" | "job_version" | null;
};

export default function SettingsPage() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user ?? null;
      
      // Redirect to login if no user
      if (!u) {
        router.push('/login');
        return;
      }
      
      setUser(u);

      const { data: rows, error } = await supabase
        .from("resumes")
        .select("id, kind")
        .eq("user_id", u.id);

      if (error) {
        console.error(error);
        setError("Failed to load your usage.");
      } else {
        setResumes((rows ?? []) as ResumeRow[]);
      }

      setLoading(false);
    };

    init();
  }, [supabase, router]);

  const totalResumes = resumes.length;
  const jobVersionCount = resumes.filter(
    (r) => r.kind === "job_version",
  ).length;
  const baseResumeCount = totalResumes - jobVersionCount;

  const handleDeleteAllResumes = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Delete all saved resumes? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setError("Failed to delete resumes.");
      } else {
        setResumes([]);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-slate-300">
        Loading settings…
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

  return (
    <div className="relative py-20 px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Account & Usage
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your NebulaCV account, data, and usage limits.
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

        {/* Account card */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Email</span>
                <div className="text-slate-100">{user.email}</div>
              </div>
              <div>
                <span className="text-slate-400">Plan</span>
                <div className="text-slate-100">
                  Free &middot; up to {FREE_RESUME_LIMIT} saved resumes,{" "}
                  {FREE_JOB_TAILOR_LIMIT} job tailorings,{" "}
                  {FREE_COVER_LETTER_LIMIT} cover letters
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-red-400 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>

          {/* Usage card */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Usage</h2>

            <div className="space-y-4 text-sm text-slate-200">
              {/* Resumes usage bar */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>Saved resumes</span>
                  <span className="text-slate-400">
                    {totalResumes}/{FREE_RESUME_LIMIT}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{
                      width: `${Math.min(
                        (totalResumes / FREE_RESUME_LIMIT) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {baseResumeCount} base resumes · {jobVersionCount} job-specific
                  versions
                </p>
              </div>

              {/* Job tailoring info - static for now */}
              <div className="flex items-center gap-3 text-xs">
                <FileText className="h-4 w-4 text-cyan-300" />
                <p className="text-slate-300">
                  Job tailoring and cover letter usage are tracked per account and
                  reset when you upgrade. You can monitor approximate usage inside
                  the builder.
                </p>
              </div>
            </div>

            {error && <p className="text-xs text-rose-300">{error}</p>}

            <button
              onClick={handleDeleteAllResumes}
              disabled={deleting || totalResumes === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-100 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting…" : "Delete all resumes"}
            </button>
          </div>
        </section>

        {/* Data note */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-xs text-slate-400">
          NebulaCV stores your resumes and job-related data only to help you build
          and reuse them. You can delete all resumes anytime from this page. For
          account deletion, contact support and we&apos;ll remove your account and
          associated data.
        </section>
      </div>
    </div>
  );
}