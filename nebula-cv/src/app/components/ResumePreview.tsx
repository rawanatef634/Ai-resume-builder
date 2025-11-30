// src/components/ResumePreview.tsx
"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
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

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeJson, header, templateId, onChangeResumeJson }, ref) => {
    const [localResume, setLocalResume] = useState<any | null>(resumeJson);
    const [improving, setImproving] = useState<ImprovingState>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);

    // --- ADDED: refs + helpers for auto-resizing textareas (summary + bullets)
    const summaryRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = (el?: HTMLTextAreaElement | null) => {
      if (!el) return;
      el.style.height = "auto";
      // add a couple pixels to avoid a hairline scrollbar in some browsers
      el.style.height = `${Math.max(el.scrollHeight + 2, 20)}px`;
    };

    useEffect(() => {
      // resize summary on mount and when resumeJson changes
      autoResize(summaryRef.current);
    }, [localResume?.summary, resumeJson]);
    // --- END ADDED

    useEffect(() => {
      setLocalResume(resumeJson);
    }, [resumeJson]);

    const skills: string[] = localResume?.skills || [];
    const experiences: any[] = localResume?.experiences || [];
    const projects: any[] = localResume?.projects || [];
    const education: EducationItem[] = localResume?.education || [];
    const summary: string = localResume?.summary || "";

    const isEmpty =
      !header.fullName &&
      experiences.length === 0 &&
      projects.length === 0 &&
      education.length === 0 &&
      !localResume;

    const commitUpdate = (updated: any) => {
      setLocalResume(updated);
      onChangeResumeJson?.(updated);
    };

    const improveExperience = async (index: number, mode: string) => {
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

    const improveSummary = async (mode: string) => {
      if (!localResume) return;
      setImproving({ section: "summary", mode });

      try {
        const res = await fetch("/api/improve-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "summary",
            mode,
            summary: localResume.summary || "",
          }),
        });
        const data = await res.json();
        if (typeof data.summary === "string") {
          const updated = { ...localResume, summary: data.summary };
          commitUpdate(updated);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setImproving(null);
      }
    };

    const computeRows = (text: string | undefined) => {
      if (!text) return 1;
      const lines = text.split("\n").length;
      return Math.min(Math.max(lines, 1), 8);
    };

    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(innerRef.current);
      } else if (ref && "current" in ref) {
        // @ts-ignore
        ref.current = innerRef.current;
      }
    }, [ref]);

    return (
      <div className="flex w-full justify-center">
        <style>{`
          @page { size: A4; margin: 0; }
          @media print {
            html, body { height: 100%; }
            [data-print-resume] {
              width: 210mm !important;
              height: 297mm !important;
              padding: 18mm !important;
              box-sizing: border-box !important;
            }
          }

          [data-print-resume] p,
          [data-print-resume] li {
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
          }
        `}</style>

        <div
          ref={innerRef}
          data-print-resume
          className="bg-white text-black"
          style={{
            width: "210mm",
            maxWidth: "100%",
            padding: "10mm",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "11pt",
            lineHeight: 1.15,
            boxShadow: "0 8px 20px rgba(2,6,23,0.15)",
          }}
        >
          {isEmpty ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-5xl">📝</div>
                <p className="text-lg font-semibold text-gray-600">
                  Your resume will appear here
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Answer the questions on the left or import your existing resume to start editing.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="mb-2 text-center">
                <h1 style={{ fontSize: "20pt", fontWeight: 700 }}>
                  {header.fullName || "Your Name"}
                </h1>
                <div
                  className="mt-1 flex flex-wrap items-center justify-center gap-1.5"
                  style={{ fontSize: "10pt", color: "#374151" }}
                >
                  {header.phone && <span>{header.phone}</span>}
                  {header.email && (
                    <>
                      {header.phone && <span>|</span>}
                      <span>{header.email}</span>
                    </>
                  )}
                  {header.linkedin && (
                    <>
                      {(header.phone || header.email) && <span>|</span>}
                      <span>{header.linkedin}</span>
                    </>
                  )}
                  {header.github && (
                    <>
                      {(header.phone || header.email || header.linkedin) && <span>|</span>}
                      <span>{header.github}</span>
                    </>
                  )}
                </div>
              </header>

              <div className="space-y-1.5">
                {/* SUMMARY */}
                <section>
                  <h2 className="mb-1.5 border-b border-black pb-0.5 uppercase">
                    Summary
                  </h2>

                  <textarea
                    ref={summaryRef} // --- ADDED: ref so we can auto-resize
                    className="w-full resize-none border-none bg-transparent p-0 leading-tight"
                    style={{ fontSize: "11pt", overflow: "hidden" }} // --- ADDED: hide textarea scrollbar
                    // rows={computeRows(summary)}
                    value={summary}
                    onChange={(e) => {
                      const updated = { ...localResume, summary: e.target.value };
                      setLocalResume(updated);
                    }}
                    onInput={(e) => autoResize(e.currentTarget as HTMLTextAreaElement)} // --- ADDED: resize while typing
                    onBlur={() => commitUpdate(localResume)}
                  />

                  {/* <div className="flex justify-end">
                    <SectionAiControls
                      disabled={!!improving}
                      isLoading={improving?.section === "summary"}
                      onImprove={() => improveSummary("improve")}
                      onConcise={() => improveSummary("concise")}
                    />
                  </div> */}
                </section> 

                {/* EDUCATION */}
                {education.length > 0 && (
                  <section>
                    <h2 className="mb-1.5 border-b border-black uppercase">
                      Education
                    </h2>
                    <div className="space-y-1.5">
                      {education.map((edu, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-bold">{edu.institution}</span>
                            {edu.location && <span>{edu.location}</span>}
                          </div>
                          <div className="flex justify-between italic">
                            <span>{edu.degree}</span>
                            {edu.period && <span>{edu.period}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* EXPERIENCE */}
                {experiences.length > 0 && (
                  <section>
                    <h2 className="mb-1.5 border-b border-black pb-0.5 uppercase">
                      Experience
                    </h2>

                    <div className="space-y-2">
                      {experiences.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-bold">{exp.title}</span>
                            <span
                              style={{
                                minWidth: 80,
                                textAlign: "right",
                                color: "#4a5568",
                              }}
                            >
                              {exp.period}
                            </span>
                          </div>

                          <div className="flex justify-between italic">
                            <span>{exp.company}</span>
                            {exp.location && <span>{exp.location}</span>}
                          </div>

                          {/* BULLETS WITH INLINE TEXTAREA */}
                          {exp.bullets && (
                            <ul className="ml-5 list-disc">
                              {exp.bullets.map((b: any, i: any) => (
                                <li key={i} style={{ marginBottom: 2 }}>
                                  <textarea
                                    className="w-full h-full resize-none border-none bg-transparent p-0 leading-tight"
                                    style={{
                                      fontSize: "11pt",
                                      display: "inline-block",
                                      verticalAlign: "top",
                                      overflow: "hidden", 
                                    }}
                                    // rows={computeRows(b)}
                                    value={b}
                                    onChange={(e) => {
                                      const newExps = [...experiences];
                                      const newBullets = [...newExps[idx].bullets];
                                      newBullets[i] = e.target.value;
                                      newExps[idx] = {
                                        ...newExps[idx],
                                        bullets: newBullets,
                                      };
                                      const updated = {
                                        ...localResume,
                                        experiences: newExps,
                                      };
                                      setLocalResume(updated);
                                    }}
                                    onInput={(e) => autoResize(e.currentTarget as HTMLTextAreaElement)} 
                                    onBlur={() => commitUpdate(localResume)}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* <div className="mt-1 flex justify-end">
                            <SectionAiControls
                              small
                              disabled={!!improving}
                              isLoading={
                                improving?.section === "experience" &&
                                improving?.index === idx
                              }
                              onImprove={() => improveExperience(idx, "improve")}
                              onConcise={() => improveExperience(idx, "concise")}
                            />
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* PROJECTS */}
                {projects.length > 0 && (
                  <section>
                    <h2 className="mb-1.5 border-b border-black pb-0.5 uppercase">
                      Projects
                    </h2>
                    <div className="space-y-2">
                      {projects.map((p, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-bold">
                              {p.name}
                              {p.stack?.length > 0 &&
                                " | " + p.stack.join(", ")}
                            </span>
                            {p.period && <span>{p.period}</span>}
                          </div>

                          {p.bullets && (
                            <ul className="ml-5 list-disc">
                              {p.bullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* SKILLS */}
                {skills.length > 0 && (
                  <section>
                    <h2 className="mb-1.5 border-b border-black pb-0.5 uppercase">
                      Technical Skills
                    </h2>
                    <div>
                      <div>
                        <span className="font-bold">Languages: </span>
                        <span>
                          {skills
                            .filter((s) =>
                              [
                                "Java",
                                "Python",
                                "C/C++",
                                "SQL",
                                "JavaScript",
                                "HTML/CSS",
                                "R",
                                "TypeScript",
                              ].some((lang) =>
                                s.toLowerCase().includes(lang.toLowerCase())
                              )
                            )
                            .join(", ") ||
                            "Java, Python, C/C++, SQL, JavaScript, HTML/CSS, R, TypeScript"}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold">Frameworks: </span>
                        <span>
                          {skills
                            .filter((s) =>
                              [
                                "React",
                                "Node",
                                "Flask",
                                "JUnit",
                                "WordPress",
                                "Material-UI",
                                "FastAPI",
                                "Next",
                                "Vue",
                                "Angular",
                              ].some((fw) =>
                                s.toLowerCase().includes(fw.toLowerCase())
                              )
                            )
                            .join(", ") || "React, Node.js, Flask, Next.js"}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold">Tools: </span>
                        <span>
                          {skills
                            .filter((s) =>
                              [
                                "Git",
                                "Docker",
                                "Travis",
                                "Google Cloud",
                                "VS Code",
                                "AWS",
                                "Kubernetes",
                              ].some((tool) =>
                                s.toLowerCase().includes(tool.toLowerCase())
                              )
                            )
                            .join(", ") || "Git, Docker, AWS, GCP"}
                        </span>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

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
    return <span className="text-[10px] text-cyan-700">Improving…</span>;
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
