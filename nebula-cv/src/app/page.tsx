"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Target,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Globe2,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>("who");

  const faqs = [
    {
      id: "who",
      q: "Who is NebulaCV for?",
      a: "NebulaCV is built for developers in the Middle East & North Africa who are applying to remote roles in the U.S. and Canada — especially frontend and full-stack engineers.",
    },
    {
      id: "ats",
      q: "Will my resume pass ATS filters?",
      a: "We generate a clean, one-page layout with the right headings and keyword structure. We also show an estimated ATS match score and highlight missing skills from each job description.",
    },
    {
      id: "arabic",
      q: "Can I answer in Arabic?",
      a: "Yes. You can answer the interview questions in Arabic or English. NebulaCV will convert everything into a polished, English resume that matches Western expectations.",
    },
    {
      id: "price",
      q: "Is there a free plan?",
      a: "Yes. You can create a resume, tailor it to a few jobs, and export as PDF on the free plan. Pro unlocks unlimited resumes, unlimited job tailorings, and advanced templates.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* ================= HERO ================= */}
      <section className="relative mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-3xl rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          {/* Left: main copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-950/70 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>MENA developers → US / Canada</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn your experience into a{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  job-ready, ATS-optimized resume.
                </span>
              </h1>

              <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                NebulaCV guides you from messy experience (in Arabic or
                English) to a clean, recruiter-friendly resume tailored to
                remote roles in the U.S. and Canada.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/builder"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/50"
              >
                Create your resume
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 backdrop-blur-sm transition hover:bg-white/10"
              >
                Watch the flow
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Social proof / mini stats */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-slate-950 bg-gradient-to-br from-cyan-400 to-blue-500"
                  />
                ))}
              </div>
              <div className="space-y-0.5 text-slate-400">
                <p className="font-semibold text-slate-100">
                  2,000+ resumes generated
                </p>
                <p className="text-[11px]">
                  Used by developers in Cairo, Riyadh, Amman, Dubai & more
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200 sm:inline-flex">
                <Star className="h-3.5 w-3.5" />
                <span>“My resume finally looks global.”</span>
              </div>
            </div>

            {/* Mini feature strip */}
            <div className="grid gap-3 pt-4 text-xs sm:grid-cols-3 sm:text-[13px]">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-medium text-slate-100">
                    ATS-friendly by default
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Clean sections, no CV “design traps”.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5">
                <Globe2 className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="font-medium text-slate-100">
                    US / Canada standard
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Removes photos & personal data automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5">
                <Clock className="h-4 w-4 text-indigo-400" />
                <div>
                  <p className="font-medium text-slate-100">
                    Under 10 minutes
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Answer questions, get a finished PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: “product” preview */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/25 to-blue-500/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl">
              {/* Top bar */}
              <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live preview
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100">
                  <Target className="h-3 w-3" />
                  86 / 100 ATS match
                </span>
              </div>

              {/* Fake app UI frame */}
              <div className="grid gap-4 md:grid-cols-[1.1fr,1fr]">
                {/* Left: resume sheet */}
                <div className="rounded-2xl bg-white p-4 text-[11px] text-slate-900 shadow-inner">
                  <div className="border-b border-slate-200 pb-3 text-center">
                    <h3 className="text-lg font-bold">Sarah Ahmed</h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                      Senior Frontend Developer
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500">
                      Cairo, Egypt · sarah@example.com · +20 123 456 789
                    </p>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Summary
                      </h4>
                      <p className="leading-relaxed text-[10px] text-slate-700">
                        Frontend engineer with 5+ years building performant React &
                        Next.js applications for global teams. Focused on DX,
                        accessibility & clean component systems.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Experience
                      </h4>
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-semibold">
                            Senior Frontend Engineer · Remote
                          </span>
                          <span className="text-[9px] text-slate-500">
                            2021 – Present
                          </span>
                        </div>
                        <ul className="mt-1 list-disc pl-4 text-[10px] text-slate-700">
                          <li>
                            Built internal analytics dashboard used by 40+ team
                            members, cutting manual reporting time by 60%.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Skills
                      </h4>
                      <p className="text-[10px] text-slate-700">
                        React · TypeScript · Next.js · Tailwind CSS · Redux Toolkit
                        · Jest · Cypress · REST APIs · GraphQL
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: small “panels” to feel like an app */}
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-[11px] text-slate-100">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Job tailoring
                    </p>
                    <p className="text-[11px] text-slate-200">
                      “Senior Frontend Engineer · Shopify”
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      3 missing keywords:{" "}
                      <span className="text-amber-300">
                        GraphQL, A/B testing, Accessibility
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-[11px]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      MENA → US/Canada checks
                    </p>
                    <ul className="space-y-1 text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        No photo or personal info
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        One-page, clean sections
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        Tech stack clearly visible
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-[11px]">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Export
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-200">
                        Ready as a single-page PDF.
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-100">
                        Download PDF
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-400">
                This is an example preview. NebulaCV fills everything with your
                actual experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS STRIP ================= */}
      <section className="border-t border-white/5 bg-slate-900/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-center md:flex-row md:items-center md:justify-between">
          {/* Countries */}
          <div className="flex flex-col items-center gap-2 text-sm text-slate-200">
            <div className="flex -space-x-1">
              {["🇪🇬", "🇸🇦", "🇦🇪", "🇯🇴", "🇲🇦", "🇹🇳"].map((flag) => (
                <div
                  key={flag}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-base"
                >
                  {flag}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Trusted by developers in Egypt, Saudi Arabia, UAE & more
            </p>
          </div>

          {/* Middle stat */}
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-white">2,000+</p>
            <p className="text-xs text-slate-400">Resumes generated</p>
          </div>

          {/* Right stat */}
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              92%
            </p>
            <p className="text-xs text-slate-400">
              Start getting more callbacks with tailored resumes
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="border-t border-white/5 bg-slate-950/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                From blank page to job-ready in 5 steps
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
                No templates, no guessing. NebulaCV walks you through everything,
                step by step, and updates your resume in real time.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Built for mid-level frontend / full-stack developers in MENA.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {[
              {
                step: "01",
                title: "Answer a short interview",
                desc: "Describe your experience, projects, and stack in Arabic or English — no need to write bullets.",
              },
              {
                step: "02",
                title: "We build your base resume",
                desc: "AI turns your answers into a structured, ATS-friendly resume tuned for frontend roles.",
              },
              {
                step: "03",
                title: "Paste a job link",
                desc: "NebulaCV analyzes the job description and shows your match score and missing skills.",
              },
              {
                step: "04",
                title: "Tailor & refine",
                desc: "Adjust tone, add keywords, and generate impact-focused bullet points in one click.",
              },
              {
                step: "05",
                title: "Export & track",
                desc: "Download as PDF and save job-specific versions. Track where you applied from inside NebulaCV.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300 transition hover:border-cyan-500/60 hover:bg-slate-900"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] font-semibold text-cyan-300">
                  {item.step}
                </div>
                <div className="text-sm font-semibold text-white">
                  {item.title}
                </div>
                <div className="text-xs text-slate-400">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MENA STRIP ================= */}
      <section className="border-t border-white/5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3 w-3" />
              Built for MENA → US/Canada
            </p>
            <h3 className="text-lg font-semibold text-white sm:text-xl">
              Stop sending local-style CVs to global companies.
            </h3>
            <p className="max-w-xl text-sm text-slate-200">
              NebulaCV removes photos, age, marital status, and other details
              that Western recruiters don&apos;t want — and replaces them with
              focused, impact-driven bullet points that highlight your tech
              stack and business results.
            </p>
          </div>
          <div className="grid gap-3 text-xs text-slate-200 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                MENA checklist
              </div>
              <p className="mt-1 text-[11px]">
                Automatic checks for photos, personal data, and multi-page CVs —
                with suggestions to fix them.
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                English-first output
              </div>
              <p className="mt-1 text-[11px]">
                You can respond in Arabic or mixed. Your final resume is clean,
                fluent English tuned for global companies.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
                Remote-ready format
              </div>
              <p className="mt-1 text-[11px]">
                Focused on skills, impact, and stack — not location. Perfect for
                remote job descriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            More than a template. A full resume workflow.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            From collecting your experience to tailoring for each job and
            exporting PDFs — NebulaCV replaces 4–5 separate tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MessageSquare,
              title: "Guided AI interview",
              desc: "Answer a few tailored questions in Arabic or English and let NebulaCV write your sections.",
              color: "from-cyan-500 to-blue-500",
            },
            {
              icon: Target,
              title: "Job matching & ATS score",
              desc: "Paste a job listing and get a match score, missing skills, and keyword breakdown tuned for ATS.",
              color: "from-blue-500 to-indigo-500",
            },
            {
              icon: CheckCircle,
              title: "US/Canada resume checks",
              desc: "Automatic checks for photo, personal info, and length — tuned for Western hiring standards.",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: Sparkles,
              title: "Cover letters in one click",
              desc: "Generate a tailored cover letter that matches both your resume and the job description.",
              color: "from-fuchsia-500 to-pink-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-sm transition hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <div
                className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-3`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Start free. Upgrade only when NebulaCV actually helps you get more
            interviews.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white">Free</h3>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Perfect for creating your first global-standard resume.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">$0</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-slate-200">
              {[
                "1 saved resume",
                "A few job analyses per month",
                "Arabic → English support",
                "PDF export (ATS-friendly)",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/builder"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get started free
            </Link>
            <p className="mt-3 text-[11px] text-slate-500">
              No credit card required. Just sign in and start building.
            </p>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/60 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-sm">
            <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Coming soon
            </div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="mt-2 text-sm text-slate-100 sm:text-base">
              For serious job seekers applying to multiple roles per week.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">$12</span>
              <span className="text-sm text-slate-200">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-slate-50">
              {[
                "Unlimited resumes & job versions",
                "Unlimited job tailoring & ATS insights",
                "Advanced, recruiter-tested templates",
                "Priority AI and faster responses",
                "Priority support",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
            >
              Join Pro waitlist
            </button>
            <p className="mt-3 text-[11px] text-cyan-100/80">
              Early users will get access to discounted lifetime deals when Pro
              launches.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="border-t border-white/5 bg-slate-950/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Questions, answered
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Everything you need to know before sending your next application.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="flex w-full flex-col rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-500/50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{faq.q}</span>
                    <ChevronRight
                      className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-90 text-cyan-400" : ""
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-xs text-slate-400">{faq.a}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-slate-400">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  NebulaCV
                </div>
                <div className="text-xs text-slate-500">
                  AI resume builder for MENA developers.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span>© {new Date().getFullYear()} NebulaCV</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>Built for remote developers in MENA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
