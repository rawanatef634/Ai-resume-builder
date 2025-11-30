import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
         <section
        id="pricing"
        className="relative mx-auto max-w-7xl px-6 my-24"
      >
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base sm:text-xl text-slate-400">
            Start free, upgrade when you’re actively applying.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white">Free</h3>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Perfect for trying NebulaCV and creating your first resume.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">
                $0
              </span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-slate-200">
              {[
                "1 saved resume",
                "A few job analyses per month",
                "Arabic → English support",
                "PDF export (ATS-friendly)",
                "1 cover letter"
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3"
                >
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
              No credit card required. Upgrade only if NebulaCV helps you.
            </p>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/60 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-sm">
            <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Coming soon
            </div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="mt-2 text-sm sm:text-base text-slate-100">
              For serious job seekers applying to multiple roles per week.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">
                $5
              </span>
              <span className="text-sm text-slate-200">
                /month
              </span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-slate-50">
              {[
                "Unlimited resumes & job versions",
                "Unlimited job tailoring & ATS insights",
                "Advanced, recruiter-tested templates",
                "Priority AI and faster responses",
                "Priority support",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3"
                >
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
              We&apos;ll email you when Pro launches. Early users get
              discounted lifetime access.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default page
