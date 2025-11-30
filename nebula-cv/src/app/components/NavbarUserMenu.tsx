// src/app/components/NavbarUserMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Sparkles, Crown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Plan = "free" | "pro" | null;

interface SupaUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

export function NavbarUserMenu() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<SupaUser | null>(null);
  const [plan, setPlan] = useState<Plan>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) {
        setUser(null);
        setPlan(null);
        setLoading(false);
        return;
      }
      setUser(user as SupaUser);
      // load profile plan
      const { data: profile } = await supabase.from("profiles").select("plan").eq("user_id", user.id).maybeSingle();
      if (!mounted) return;
      setPlan((profile?.plan as Plan) ?? "free");
      setLoading(false);
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setPlan(null);
        setOpen(false);
        setLoading(false);
        return;
      }
      setUser(session.user as SupaUser);
      // fetch plan (fire and forget)
      supabase.from("profiles").select("plan").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
        setPlan((data?.plan as Plan) ?? "free");
      });
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setPlan(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />;
  }

  if (!user) {
    return (
      <button onClick={() => router.push("/login")} className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">
        Sign in
      </button>
    );
  }

  const full =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";

  const parts = full.split(" ").filter(Boolean);
  const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : full.slice(0,2).toUpperCase();
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Account";

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="cursor-pointer flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-2 py-1 text-left text-xs text-slate-100 hover:border-cyan-500/60">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-[11px] font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="max-w-[120px] truncate text-[11px] font-medium">{displayName}</span>
          {user.email && <span className="max-w-[130px] truncate text-[10px] text-slate-400">{user.email}</span>}
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/15 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-xl">
          <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-sm font-semibold text-white">{initials}</div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{displayName}</div>
              {user.email && <div className="text-[11px] text-slate-400 truncate">{user.email}</div>}
              <div className="mt-1 text-[10px] text-cyan-200 inline-flex items-center gap-1">
                {plan === "pro" ? (<><Crown className="h-3 w-3 text-yellow-300" /> Pro member</>) : (<><Sparkles className="h-3 w-3 text-cyan-300" /> Free plan</>)}
              </div>
            </div>
          </div>

          {plan !== "pro" && (
            <button onClick={() => { setOpen(false); router.push("/#pricing"); }} className="mb-2 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-blue-500/20 px-3 py-2 text-[11px] font-medium text-slate-100 hover:from-fuchsia-500/30">
              <span className="cursor-pointer inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-fuchsia-300" /> Upgrade to Pro</span>
            </button>
          )}

          <button onClick={handleSignOut} className="cursor-pointer mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-slate-200 hover:bg-slate-900">
            <LogOut className="h-4 w-4 text-slate-400" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
