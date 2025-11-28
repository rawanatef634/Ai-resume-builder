// src/app/components/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import {
  Sparkles,
  LayoutTemplate,
  Target,
  FileText,
  LineChart,
  Settings,
} from "lucide-react";

export type DashboardSection = "build" | "tailor" | "coverLetter";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onChangeSection: (section: DashboardSection) => void;
}

export function DashboardSidebar({
  activeSection,
  onChangeSection,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 flex-col rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300 shadow-[0_18px_45px_rgba(0,0,0,0.65)] md:flex">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-xl" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-white">
            NebulaCV
          </div>
          <div className="text-[11px] text-slate-400">
            MENA → US/Canada remote
          </div>
        </div>
      </div>

      {/* Workspace nav */}
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Workspace
      </div>
      <nav className="space-y-1.5">
        <SidebarButton
          icon={LayoutTemplate}
          label="Resume builder"
          description="Header, skills, experience, projects, education"
          active={activeSection === "build"}
          onClick={() => onChangeSection("build")}
        />
        <SidebarButton
          icon={Target}
          label="Resume tailoring"
          description="Job link, ATS score, keywords"
          active={activeSection === "tailor"}
          onClick={() => onChangeSection("tailor")}
        />
        <SidebarButton
          icon={FileText}
          label="Cover letter"
          description="Generate & edit tailored letter"
          active={activeSection === "coverLetter"}
          onClick={() => onChangeSection("coverLetter")}
        />
      </nav>

      {/* Divider */}
      <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Secondary nav (simple, no logic) */}
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Account
      </div>
      <div className="space-y-1.5">
        <Link
          href="/tracker"
          className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs text-slate-300 hover:border-white/10 hover:bg-slate-900/70"
        >
          <span className="inline-flex items-center gap-2">
            <LineChart className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400" />
            <span>Applications tracker</span>
          </span>
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
            Soon
          </span>
        </Link>

        <Link
          href="/settings"
          className="group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs text-slate-300 hover:border-white/10 hover:bg-slate-900/70"
        >
          <Settings className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400" />
          <span>Account & usage</span>
        </Link>
      </div>

      {/* Bottom hint */}
      <div className="mt-auto pt-5 text-[11px] text-slate-500">
        <div>1. Build base resume</div>
        <div>2. Tailor to job</div>
        <div>3. Generate cover letter</div>
      </div>
    </aside>
  );
}

interface SidebarButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function SidebarButton({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition ${
        active
          ? "border-cyan-500/70 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-blue-500/15 text-cyan-50 shadow-[0_0_25px_rgba(6,182,212,0.45)]"
          : "border-transparent bg-slate-950/60 text-slate-200 hover:border-white/12 hover:bg-slate-900/80"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg border text-slate-200 ${
            active
              ? "border-cyan-400/60 bg-cyan-500/20"
              : "border-white/10 bg-slate-900"
          }`}
        >
          <Icon
            className={`h-3.5 w-3.5 ${
              active ? "text-cyan-300" : "text-slate-400"
            }`}
          />
        </span>
        <div>
          <div className="text-[13px] font-semibold">{label}</div>
          <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-400">
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}
