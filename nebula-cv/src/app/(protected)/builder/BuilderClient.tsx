// src/app/(protected)/builder/BuilderClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// --- START: Exporting types for the Server Component to import ---
type TemplateId = "classic" | "compact";

export type ResumeHeader = {
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
};

export const DEFAULT_HEADER: ResumeHeader = {
  fullName: "",
  title: "Frontend Developer",
  location: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
};

export type DbResumeRow = {
  id: string;
  user_id: string;
  title: string | null;
  resume_json: {
    header?: ResumeHeader;
    body?: any;
    templateId?: TemplateId;
    coverLetter?: string;
  } | null;
};

export type ResumeSummary = {
  id: string;
  title: string | null;
  updated_at?: string | null;
};

// --- END: Exporting types ---

// Core resume pieces
import { ResumeHeaderForm } from "../../components/ResumeHeaderForm";
import { ResumeImportForm } from "../../components/ResumeImportForm";
import { ToneControl } from "../../components/ToneControl";
import { SkillsEditor } from "../../components/SkillsEditor";
import { ExperienceEditor } from "../../components/ExperienceEditor";
import { ProjectsEditor } from "../../components/ProjectsEditor";
import { EducationEditor } from "../../components/EducationEditor";
import { ChatPanel } from "../../components/ChatPanel";
import { JobLinkForm } from "../../components/JobLinkForm";

// Preview + analysis
import { ResumePreview } from "../../components/ResumePreview";
import { CoverLetterPreview } from "../../components/CoverLetterPreview";
import { AtsPanel } from "../../components/AtsPanel";
import { PdfExportButton } from "../../components/PdfExportButton";

// Cover letter + layout
import { CoverLetterPanel } from "../../components/CoverLetterPanel";
import { DashboardSidebar } from "../../components/DashboardSidebar";
import { createClient } from "@/utils/supabase/client";

type ActiveSection = "build" | "tailor" | "coverLetter";

interface BuilderClientProps {
  initialData: {
    initialResume: DbResumeRow | null;
    resumesList: ResumeSummary[];
    userPlan: 'free' | 'pro';
  }
}

export function BuilderClient({ initialData }: BuilderClientProps) {
  const [supabase] = useState(() => createClient());
  const searchParams = useSearchParams();

  // ------------ Core state initialization from props ------------

  const [header, setHeader] = useState<ResumeHeader>(
    initialData.initialResume?.resume_json?.header ?? DEFAULT_HEADER
  );
  const [resumeJson, setResumeJson] = useState<any | null>(
    initialData.initialResume?.resume_json?.body ?? null
  );
  const [templateId, setTemplateId] = useState<TemplateId>(
    initialData.initialResume?.resume_json?.templateId ?? "classic"
  );
  const [coverLetter, setCoverLetter] = useState<string>(
    initialData.initialResume?.resume_json?.coverLetter ?? ""
  );

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("build");
  const [previewMode, setPreviewMode] =
    useState<"resume" | "coverLetter">("resume");

  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const [lastJobTitle, setLastJobTitle] = useState<string | null>(null);
  const [lastJobCompany, setLastJobCompany] = useState<string | null>(
    null,
  );

  // Resume persistence
  const [resumeTitle, setResumeTitle] = useState<string>(
    initialData.initialResume?.title ?? "New resume",
  );
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(
    initialData.initialResume?.id ?? null,
  );
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false); 
  const [saving, setSaving] = useState<boolean>(false);

  // Resume list
  const [resumes, setResumes] = useState<ResumeSummary[]>(initialData.resumesList);
  const [showResumeMenu, setShowResumeMenu] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const resumeRef = useRef<HTMLDivElement | null>(null);
  const coverLetterRef = useRef<HTMLDivElement | null>(null);

  // Plan & upgrade
  const [userPlan, setUserPlan] = useState<"free" | "pro">(initialData.userPlan);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  // ------------ Helpers ------------

  function resetToNewResume() {
    setCurrentResumeId(null);
    setResumeTitle("New resume");
    setHeader(DEFAULT_HEADER);
    setResumeJson(null);
    setTemplateId("classic");
    setCoverLetter("");
    setAtsScore(null);
    setMissingSkills([]);
    setLastJobTitle(null);
    setLastJobCompany(null);
    setPreviewMode("resume");
    setActiveSection("build");
  }

  async function refreshResumesList(userId: string) {
    setLoadingResumes(true);
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setResumes(data as ResumeSummary[]);
      }
    } catch (err) {
      console.error("Error refreshing resumes list:", err);
    } finally {
      setLoadingResumes(false);
    }
  }

  async function loadResumeById(id: string) {
    setLoadingInitial(true);
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, resume_json")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Error loading resume:", error);
        return;
      }

      const row = data as DbResumeRow;
      setCurrentResumeId(row.id);
      setResumeTitle(row.title ?? "My frontend resume");

      if (row.resume_json) {
        const { header, body, templateId, coverLetter } = row.resume_json;
        setHeader(header ?? DEFAULT_HEADER);
        setResumeJson(body ?? null);
        setTemplateId(templateId ?? "classic");
        setCoverLetter(coverLetter ?? "");
      }

      setActiveSection("build");
      setPreviewMode("resume");
      setShowResumeMenu(false);
    } catch (err) {
      console.error("Error loading resume:", err);
    } finally {
      setLoadingInitial(false);
    }
  }

  async function handleUpgradeClick() {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Failed to start checkout", err);
    }
  }

  function hitPaywall() {
    if (userPlan !== "pro") {
      setShowUpgradeBanner(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ------------ Save current resume to Supabase ------------

  async function handleSave() {
    if (!resumeJson) {
      console.log("No resume JSON to save");
      return;
    }

    console.log("Starting save...");
    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No user found:", userError);
        alert("Please sign in to save your resume.");
        setSaving(false);
        return;
      }

      console.log("User authenticated:", user.id);

      const payload = {
        header,
        body: resumeJson,
        templateId,
        coverLetter,
      };

      const upsertData: any = {
        user_id: user.id,
        title: resumeTitle || "Untitled Resume",
        resume_json: payload,
      };

      // Only include ID if updating existing resume
      if (currentResumeId) {
        upsertData.id = currentResumeId;
        console.log("Updating existing resume:", currentResumeId);
      } else {
        console.log("Creating new resume");
      }

      console.log("Upserting data...");
      const { data, error } = await supabase
        .from("resumes")
        .upsert(upsertData, {
          onConflict: 'id'
        })
        .select("id, title, updated_at");

      if (error) {
        console.error("Error saving resume:", error);
        alert(`Failed to save resume: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log("Save successful:", data[0]);
        setCurrentResumeId(data[0].id);
        // Refresh list so new or renamed resume appears
        await refreshResumesList(user.id);
      } else {
        console.error("No data returned from upsert");
        alert("Failed to save resume. No data returned.");
      }
    } catch (err: any) {
      console.error("Exception while saving:", err);
      alert(`An error occurred while saving: ${err?.message || err}`);
    } finally {
      console.log("Save complete, resetting saving state");
      setSaving(false);
    }
  }

  // ------------ Render ------------

  return (
    <div className="relative max-w-8xl my-20 px-6">
      {/* Top heading + save bar */}
      <section className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Resume Builder
            </h1>

            {/* Simple plan pill */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                userPlan === "pro"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/50"
                  : "bg-slate-800 text-slate-200 border border-slate-600"
              }`}
            >
              {userPlan === "pro" ? "Pro plan" : "Free plan"}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Build an ATS-optimized resume for U.S. & Canadian remote
            frontend roles.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-xs text-slate-300">
          <div className="relative flex items-center gap-2">
            {/* My resumes dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowResumeMenu((v) => !v)}
                className="rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-[11px] font-medium text-slate-100 hover:border-cyan-500"
              >
                My resumes
                {resumes.length > 0 && (
                  <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {resumes.length}
                  </span>
                )}
              </button>

              {showResumeMenu && (
                <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-white/15 bg-slate-950/95 p-2 text-[11px] shadow-xl">
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className="font-semibold text-slate-100">
                      Saved resumes
                    </span>
                    <button
                      type="button"
                      onClick={resetToNewResume}
                      className="rounded-full border border-cyan-500/60 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-200 hover:bg-cyan-500/20"
                    >
                      New
                    </button>
                  </div>

                  {loadingResumes && (
                    <div className="px-1 py-2 text-slate-400">
                      Loading…
                    </div>
                  )}

                  {!loadingResumes && resumes.length === 0 && (
                    <div className="px-1 py-2 text-slate-400">
                      No resumes yet. Save your first one.
                    </div>
                  )}

                  {!loadingResumes && resumes.length > 0 && (
                    <ul className="max-h-60 space-y-1 overflow-y-auto">
                      {resumes.map((r) => (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => loadResumeById(r.id)}
                            className={`w-full rounded-lg px-2 py-2 text-left hover:bg-slate-900 ${
                              r.id === currentResumeId
                                ? "bg-slate-900/80 text-cyan-200"
                                : "text-slate-200"
                            }`}
                          >
                            <div className="truncate">
                              {r.title || "Untitled resume"}
                            </div>
                            {r.updated_at && (
                              <div className="text-[10px] text-slate-500">
                                Last updated:{" "}
                                {new Date(
                                  r.updated_at,
                                ).toLocaleString()}
                              </div>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Title + Save */}
            <input
              className="w-56 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="Resume title"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!resumeJson || saving}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          {currentResumeId && (
            <p className="text-[11px] text-slate-500">
              Changes are local until you click Save.
            </p>
          )}
        </div>
      </section>

      {/* Upgrade banner (shown when user hits paywall) */}
      {userPlan === "free" && showUpgradeBanner && (
        <div className="mb-6 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4 text-sm text-cyan-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">
                Unlock Pro features
              </div>
              <div className="text-xs text-cyan-100/80">
                Get unlimited tailoring, cover letters, and full ATS
                insights with NebulaCV Pro.
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/60"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      {/* Main layout: sidebar + content */}
      <section className="flex gap-6">
        {/* Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          onChangeSection={setActiveSection}
        />

        {/* Main content grid */}
        <div className="flex-1 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          {/* LEFT COLUMN: changes with section */}
          <div className="space-y-6">
            {/* Header always visible */}
            <ResumeHeaderForm header={header} onChange={setHeader} />

            {/* Loading skeleton (only initial load) */}
            {loadingInitial && (
              <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">
                Loading your last resume…
              </div>
            )}

            {!loadingInitial && (
              <>
                {activeSection === "build" && (
                  <>
                    <ChatPanel onResumeJson={setResumeJson} />

                    <SkillsEditor
                      resumeJson={resumeJson}
                      onChange={setResumeJson}
                    />
                    <ExperienceEditor
                      resumeJson={resumeJson}
                      onChange={setResumeJson}
                    />
                    <ProjectsEditor
                      resumeJson={resumeJson}
                      onChange={setResumeJson}
                    />
                    <EducationEditor
                      resumeJson={resumeJson}
                      onChange={setResumeJson}
                    />
                  </>
                )}

                {activeSection === "tailor" && (
                  <>
                    <JobLinkForm
                      resumeJson={resumeJson}
                      onTailoredResume={(
                        json,
                        score,
                        skills,
                        _presentKw?,
                        _missingKw?,
                        jobTitle?,
                        jobCompany?,
                      ) => {
                        setResumeJson(json);
                        setAtsScore(score);
                        setMissingSkills(skills);
                        setLastJobTitle(jobTitle ?? null);
                        setLastJobCompany(jobCompany ?? null);
                      }}
                    />
                    <AtsPanel
                      atsScore={atsScore}
                      missingSkills={missingSkills}
                    />
                  </>
                )}

                {activeSection === "coverLetter" && (
                  <>
                    {/* {userPlan === "pro" ? ( */}
                      <CoverLetterPanel
                        resumeJson={resumeJson}
                        header={header}
                        jobTitle={lastJobTitle}
                        jobCompany={lastJobCompany}
                        coverLetter={coverLetter}
                        onChange={setCoverLetter}
                        onGenerated={(value) => {
                          setCoverLetter(value);
                          setPreviewMode("coverLetter");
                        }}
                        reachedLimit={false}
                        onHitLimit={() => {}}
                      />
                    {/* ) : ( */}
                      {/* <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-100">
                        <div className="text-base font-semibold text-white">
                          Cover letters are a Pro feature
                        </div>
                        <p className="text-sm text-slate-300">
                          Upgrade to NebulaCV Pro to generate unlimited
                          cover letters tailored to each job you apply
                          for.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            hitPaywall();
                          }}
                          className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/60"
                        >
                          Upgrade to Pro to unlock
                        </button>
                      </div> */}
                    {/* )} */}
                  </>
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN: preview + export + tools for build */}
          <div className="flex flex-col gap-6">
            {/* Preview card */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <div className="font-medium text-slate-200">
                  Preview
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    View:
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("resume")}
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      previewMode === "resume"
                        ? "border border-cyan-500/60 bg-cyan-500/20 text-cyan-200"
                        : "border border-white/10 bg-slate-950/60 text-slate-300"
                    }`}
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("coverLetter")}
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      previewMode === "coverLetter"
                        ? "border border-cyan-500/60 bg-cyan-500/20 text-cyan-200"
                        : "border border-white/10 bg-slate-950/60 text-slate-300"
                    }`}
                  >
                    Cover letter
                  </button>
                </div>
              </div>

              <div>
                {previewMode === "resume" ? (
                  <ResumePreview
                    resumeJson={resumeJson}
                    header={header}
                    templateId={templateId}
                    ref={resumeRef}
                  />
                ) : (
                  <CoverLetterPreview
                    header={header}
                    coverLetter={coverLetter}
                    ref={coverLetterRef}
                  />
                )}
              </div>
            </div>

            {/* Export */}
            <PdfExportButton
              resumeRef={resumeRef}
              coverLetterRef={coverLetterRef}
              previewMode={previewMode}
              disabled={
                previewMode === "resume"
                  ? !resumeJson
                  : !coverLetter?.trim()
              }
            />

            {/* Tools only on build tab */}
            {activeSection === "build" && (
              <>
                <ToneControl
                  resumeJson={resumeJson}
                  onRefined={setResumeJson}
                />
                <ResumeImportForm onImported={setResumeJson} />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}