"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function Loader() {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initial splash on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setInitialized(true);
    }, 700); // min 0.7s

    return () => clearTimeout(timer);
  }, []);

  // Show loader briefly on route change
  useEffect(() => {
    if (!initialized) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5s on each navigation

    return () => clearTimeout(timer);
  }, [pathname, initialized]);

  return (
    <>

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-8 px-6">
            {/* Logo + title */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/40">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  NebulaCV
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Loading your AI resume workspace…
                </p>
              </div>
            </div>

            {/* Spinner + progress */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900/80 shadow-inner">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
              </div>

              <div className="relative h-1.5 w-64 overflow-hidden rounded-full bg-slate-800">
                <div className="absolute inset-y-0 w-1/2 animate-[nebulaLoader_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" />
              </div>

              <div className="mt-2 flex flex-col items-center gap-1 text-[11px] text-slate-400">
                <p>Fetching your saved resumes…</p>
                <p>Preparing ATS & cover letter tools…</p>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Tip: have a job link ready for better results.
            </p>
          </div>

          {/* Keyframes once globally */}
          <style jsx global>{`
            @keyframes nebulaLoader {
              0% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(20%);
              }
              100% {
                transform: translateX(120%);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
