// src/components/ResumePreview.tsx
"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
} from "react";
import type { ResumeHeader } from "./ResumeHeaderForm";

interface EducationItem {
  institution: string;
  degree: string;
  location?: string;
  period?: string;
}

type TemplateId = "classic" | "compact";

interface ResumePreviewProps {
  resumeJson: any | null;
  header: ResumeHeader;
  templateId: TemplateId;
  onChangeResumeJson?: (updated: any) => void;
}

type ImprovingState =
  | null
  | { section: "summary"; mode: string }
  | { section: "experience"; index: number; mode: string };

// A4-like page style, white background, black text
export const ResumePreview = forwardRef<
  HTMLDivElement,
  ResumePreviewProps
>(({ resumeJson, header, templateId, onChangeResumeJson }, ref) => {
  const [localResume, setLocalResume] = useState<any | null>(
    resumeJson,
  );
  const [improving, setImproving] =
    useState<ImprovingState>(null);

  // keep local state in sync when parent changes resumeJson
  useEffect(() => {
    setLocalResume(resumeJson);
  }, [resumeJson]);

  const summary: string = localResume?.summary || "";
  const skills: string[] = localResume?.skills || [];
  const experiences: any[] = localResume?.experiences || [];
  const projects: any[] = localResume?.projects || [];
  const education: EducationItem[] = localResume?.education || [];

  const isEmpty =
    !header.fullName &&
    !summary &&
    experiences.length === 0 &&
    !localResume;

  const commitUpdate = (updated: any) => {
    setLocalResume(updated);
    onChangeResumeJson?.(updated);
  };

  // === AI IMPROVEMENT CALLS ===
  const improveSummary = async (mode: string) => {
    if (!localResume?.summary) return;
    setImproving({ section: "summary", mode });
    try {
      const res = await fetch("/api/improve-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "summary",
          mode,
          summary: localResume.summary,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        const updated = {
          ...localResume,
          summary: data.summary,
        };
        commitUpdate(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImproving(null);
    }
  };

  const improveExperience = async (
    index: number,
    mode: string,
  ) => {
    if (!localResume?.experiences?.[index]) return;
    const exp = localResume.experiences[index];
    setImproving({ section: "experience", index, mode });

    try {
      const res = await fetch("/api/improve-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "experience",
          mode,
          experience: exp,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.bullets)) {
        const newExperiences = [...localResume.experiences];
        newExperiences[index] = {
          ...newExperiences[index],
          bullets: data.bullets,
        };
        const updated = {
          ...localResume,
          experiences: newExperiences,
        };
        commitUpdate(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImproving(null);
    }
  };

  // === RENDER ===
  return (
    <div className="flex h-[800px] items-start justify-center overflow-y-auto">
      <div
        ref={ref}
        data-print-resume
        className="w-full max-w-[850px] border border-gray-300 bg-white px-10 py-8 text-black shadow-2xl"
        style={{
          minHeight: "297mm", // A4 height
          maxWidth: "210mm", // A4 width
          fontSize: templateId === "compact" ? "11px" : "12px",
          lineHeight: templateId === "compact" ? 1.35 : 1.45,
        }}
      >
        {isEmpty ? (
          <div className="flex min-h-[800px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">📝</div>
              <p className="text-lg font-semibold text-gray-600">
                Your resume will appear here
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Answer the questions on the left or import your existing resume to
                start editing.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <header className="border-b-2 border-gray-800 pb-4 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {header.fullName || "Your Name"}
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                {header.title || "Frontend Developer"}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-700">
                {header.location && <span>{header.location}</span>}
                {header.email && (
                  <>
                    {header.location && <span>•</span>}
                    <span>{header.email}</span>
                  </>
                )}
                {header.phone && (
                  <>
                    {(header.location || header.email) && <span>•</span>}
                    <span>{header.phone}</span>
                  </>
                )}
                {header.linkedin && (
                  <>
                    {(header.location ||
                      header.email ||
                      header.phone) && <span>•</span>}
                    <span>{header.linkedin}</span>
                  </>
                )}
                {header.github && (
                  <>
                    {(header.location ||
                      header.email ||
                      header.phone ||
                      header.linkedin) && <span>•</span>}
                    <span>{header.github}</span>
                  </>
                )}
              </div>
            </header>

            <main className="mt-4 space-y-4">
              {/* SUMMARY */}
              {summary && (
                <Section>
                  <div className="flex items-center justify-between gap-2">
                    <SectionTitle>Professional Summary</SectionTitle>
                    <SectionAiControls
                      disabled={!!improving}
                      isLoading={
                        improving?.section === "summary"
                      }
                      onImprove={() =>
                        improveSummary("improve")
                      }
                      onConcise={() =>
                        improveSummary("concise")
                      }
                    />
                  </div>
                  <textarea
                    className="mt-1 w-full resize-none border-none bg-transparent p-0 text-[12px] leading-relaxed text-gray-900 focus:outline-none focus:ring-0"
                    rows={templateId === "compact" ? 3 : 4}
                    value={summary}
                    onChange={(e) => {
                      const updated = {
                        ...localResume,
                        summary: e.target.value,
                      };
                      setLocalResume(updated);
                    }}
                    onBlur={() => {
                      if (!localResume) return;
                      commitUpdate(localResume);
                    }}
                  />
                  <p className="mt-1 text-[10px] text-gray-400">
                    Click to edit. Keep it 3–4 lines and focused on impact.
                  </p>
                </Section>
              )}

              {/* EDUCATION */}
              {education && education.length > 0 && (
                <Section>
                  <SectionTitle>Education</SectionTitle>
                  <div className="mt-1 space-y-1.5">
                    {education.map(
                      (edu: EducationItem, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                              {edu.institution}
                            </span>
                            {edu.period && (
                              <span className="text-[11px] text-gray-700">
                                {edu.period}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-800">
                            <span>{edu.degree}</span>
                            {edu.location && (
                              <span>{edu.location}</span>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </Section>
              )}

              {/* EXPERIENCE */}
              {experiences && experiences.length > 0 && (
                <Section>
                  <div className="flex items-center justify-between gap-2">
                    <SectionTitle>Experience</SectionTitle>
                    <span className="text-[10px] text-gray-400">
                      Edit bullets or use AI to tighten them.
                    </span>
                  </div>
                  <div className="mt-1 space-y-2.5">
                    {experiences.map(
                      (exp: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                              {exp.title}
                            </span>
                            <span className="text-[11px] text-gray-700">
                              {exp.period}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-800">
                            <span>{exp.company}</span>
                            {exp.location && (
                              <span>{exp.location}</span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              Bullets
                            </span>
                            <SectionAiControls
                              small
                              disabled={!!improving}
                              isLoading={
                                improving?.section ===
                                  "experience" &&
                                improving?.index === idx
                              }
                              onImprove={() =>
                                improveExperience(
                                  idx,
                                  "improve",
                                )
                              }
                              onConcise={() =>
                                improveExperience(
                                  idx,
                                  "concise",
                                )
                              }
                            />
                          </div>

                          {exp.bullets &&
                            exp.bullets.length > 0 && (
                              <ul className="mt-1 list-disc pl-4 text-[11px] text-gray-900">
                                {exp.bullets.map(
                                  (
                                    b: string,
                                    i: number,
                                  ) => (
                                    <li
                                      key={i}
                                      className="mb-1"
                                    >
                                      <textarea
                                        className="w-full resize-none border-none bg-transparent p-0 text-[11px] leading-relaxed text-gray-900 focus:outline-none focus:ring-0"
                                        rows={
                                          templateId ===
                                          "compact"
                                            ? 1
                                            : 2
                                        }
                                        value={b}
                                        onChange={(e) => {
                                          const newExps =
                                            [
                                              ...experiences,
                                            ];
                                          const newBullets =
                                            [
                                              ...newExps[
                                                idx
                                              ].bullets,
                                            ];
                                          newBullets[i] =
                                            e.target.value;
                                          newExps[idx] = {
                                            ...newExps[idx],
                                            bullets:
                                              newBullets,
                                          };
                                          const updated =
                                            {
                                              ...localResume,
                                              experiences:
                                                newExps,
                                            };
                                          setLocalResume(
                                            updated,
                                          );
                                        }}
                                        onBlur={() => {
                                          if (
                                            !localResume
                                          )
                                            return;
                                          commitUpdate(
                                            localResume,
                                          );
                                        }}
                                      />
                                    </li>
                                  ),
                                )}
                              </ul>
                            )}
                        </div>
                      ),
                    )}
                  </div>
                </Section>
              )}

              {/* PROJECTS */}
              {projects && projects.length > 0 && (
                <Section>
                  <SectionTitle>Projects</SectionTitle>
                  <div className="mt-1 space-y-1.5">
                    {projects.map(
                      (p: any, idx: number) => (
                        <div key={idx}>
                          <div className="font-semibold text-gray-900">
                            {p.name}
                          </div>
                          <p className="text-[11px] text-gray-900">
                            {p.description}
                          </p>
                          {p.stack && (
                            <p className="text-[11px] text-gray-700">
                              {p.stack.join(" · ")}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </Section>
              )}

              {/* SKILLS */}
              {skills && skills.length > 0 && (
                <Section>
                  <SectionTitle>Technical Skills</SectionTitle>
                  <p className="mt-1 text-[11px] text-gray-900">
                    {skills.join(" · ")}
                  </p>
                </Section>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="border-t-2 border-gray-300 pt-3">
      {children}
    </section>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
      {children}
    </h3>
  );
}

interface SectionAiControlsProps {
  disabled?: boolean;
  isLoading?: boolean;
  small?: boolean;
  onImprove: () => void;
  onConcise: () => void;
}

function SectionAiControls({
  disabled,
  isLoading,
  small,
  onImprove,
  onConcise,
}: SectionAiControlsProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium";
  if (isLoading) {
    return (
      <span className="text-[10px] text-cyan-700">
        Improving…
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={onImprove}
        className={`${base} border-cyan-500/40 bg-cyan-500/10 text-cyan-700 disabled:opacity-40`}
      >
        ✨ {small ? "Improve" : "Improve with AI"}
      </button>
      {!small && (
        <button
          type="button"
          disabled={disabled}
          onClick={onConcise}
          className={`${base} border-slate-400/40 bg-slate-100 text-slate-700 disabled:opacity-40`}
        >
          Shorten
        </button>
      )}
    </div>
  );
}
