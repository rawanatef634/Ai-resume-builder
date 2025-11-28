// src/components/ResumeHeaderForm.tsx
"use client";

export interface ResumeHeader {
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

interface ResumeHeaderFormProps {
  header: ResumeHeader;
  onChange: (header: ResumeHeader) => void;
}

export function ResumeHeaderForm({ header, onChange }: ResumeHeaderFormProps) {
  const update = (field: keyof ResumeHeader, value: string) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Resume Header</h3>
        <span className="text-sm text-slate-400">Appears at the top of your PDF</span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Full Name</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Rawan Ali"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Headline / Title
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Frontend Developer"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Location</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Cairo, Egypt (remote)"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Phone</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+20 ..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Email</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">LinkedIn</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              placeholder="linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">GitHub</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
              value={header.github}
              onChange={(e) => update("github", e.target.value)}
              placeholder="github.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}