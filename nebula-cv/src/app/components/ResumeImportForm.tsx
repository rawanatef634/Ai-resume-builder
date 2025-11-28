// src/components/ResumeImportForm.tsx
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface ResumeImportFormProps {
  onImported: (json: any) => void;
}

export function ResumeImportForm({ onImported }: ResumeImportFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text.trim() }),
      });
      const data = await res.json();
      if (data.resumeJson) {
        onImported(data.resumeJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Import Existing Resume</h3>
        <Upload className="h-5 w-5 text-cyan-400" />
      </div>
      
      <p className="text-sm text-slate-400">
        Paste your current resume text and we'll convert it to this template
      </p>
      
      <textarea
        rows={6}
        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 outline-none transition focus:border-cyan-500"
        placeholder="Paste your existing resume here (we will convert it into this template)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <button
        onClick={handleImport}
        disabled={loading || !text.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Importing…" : "Import & Overwrite Current Resume"}
      </button>
    </div>
  );
}