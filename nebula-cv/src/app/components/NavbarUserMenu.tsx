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

  // ---- Load initial user + subscribe to auth changes ----
  useEffect(() => {
    let cancelled = false;
    const client = supabase; // capture once

    async function init() {
      setLoading(true);

      const {
        data: { user },
      } = await client.auth.getUser();

      if (cancelled) return;

      if (!user) {
        setUser(null);
        setPlan(null);
        setLoading(false);
      } else {
        setUser(user as SupaUser);
        const { data: profile } = await client
          .from("profiles")
          .select("plan")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!cancelled) {
          setPlan((profile?.plan as Plan) ?? "free");
          setLoading(false);
        }
      }
    }

    init();

    const { data: subscription } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return;

        if (!session?.user) {
          setUser(null);
          setPlan(null);
          setOpen(false);
        } else {
          const u = session.user as SupaUser;
          setUser(u);
          const { data: profile } = await client
            .from("profiles")
            .select("plan")
            .eq("user_id", u.id)
            .maybeSingle();
          setPlan((profile?.plan as Plan) ?? "free");
        }
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
      subscription?.subscription.unsubscribe();
    };
  }, []); // 👈 run once on mount


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Instant UI update
    setUser(null);
    setPlan(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const getInitials = () => {
    if (!user) return "?";
    const full =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "";
    const parts = full.split(" ").filter(Boolean);
    if (parts.length === 0) return full.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "";

  // If no user and not loading -> show "Sign in"
  if (!loading && !user) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
      >
        Sign in
      </button>
    );
  }

  // While loading, show skeleton pill
  if (loading) {
    return (
      <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />
    );
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-2 py-1 text-left text-xs text-slate-100 hover:border-cyan-500/60"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-[11px] font-semibold text-white">
          {getInitials()}
        </div>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="max-w-[120px] truncate text-[11px] font-medium">
            {displayName || "Account"}
          </span>
          {user?.email && (
            <span className="max-w-[130px] truncate text-[10px] text-slate-400">
              {user.email}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/15 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-xl">
          {/* User info */}
          <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-sm font-semibold text-white">
              {getInitials()}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold">
                {displayName || "Your account"}
              </span>
              {user?.email && (
                <span className="truncate text-[11px] text-slate-400">
                  {user.email}
                </span>
              )}
              <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-cyan-200">
                {plan === "pro" ? (
                  <>
                    <Crown className="h-3 w-3 text-yellow-300" />
                    Pro member
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-cyan-300" />
                    Free plan
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Upgrade */}
          {plan !== "pro" && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                // go to pricing or billing
                router.push("/#pricing");
              }}
              className="mb-2 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-blue-500/20 px-3 py-2 text-[11px] font-medium text-slate-100 hover:from-fuchsia-500/30 hover:to-blue-500/30"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                Upgrade to Pro
              </span>
            </button>
          )}

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-slate-200 hover:bg-slate-900"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
