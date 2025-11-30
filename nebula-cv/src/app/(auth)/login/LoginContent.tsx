// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirectTo") || "/builder";

 // inside src/app/login/page.tsx handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  if (!email || !password) return;

  setLoading(true);
  try {
    if (mode === "login") {
      const res = await supabase.auth.signInWithPassword({ email, password });
      console.log("signInWithPassword response:", res);
      if (res.error) throw res.error;
      // success: navigate
      router.push(redirectTo);
      // don't force refresh immediately — let onAuthStateChange update UI
    } else {
      const res = await supabase.auth.signUp({ email, password });
      console.log("signUp response:", res);
      if (res.error) throw res.error;
      // After signup, Supabase may require email confirmation depending on settings.
      router.push(redirectTo);
    }
  } catch (err: any) {
    console.error("auth error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                NebulaCV
              </div>
              <div className="text-xs text-slate-400">
                Sign in to your workspace
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Back to home
          </Link>
        </div>

        <div className="mb-4 flex gap-2 rounded-full bg-slate-900/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`cursor-pointer flex-1 rounded-full px-3 py-2 font-medium ${
              mode === "login"
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-300"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`cursor-pointer flex-1 rounded-full px-3 py-2 font-medium ${
              mode === "signup"
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-300"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Logging in…" : "Creating account…"}
              </>
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500">
          By continuing, you agree to NebulaCV’s terms. You can delete your
          account anytime.
        </p>
      </div>
    </div>
  );
}
