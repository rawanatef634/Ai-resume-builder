// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Loader } from "../loading";
import { NavbarUserMenu } from "./components/NavbarUserMenu";

export const metadata: Metadata = {
  title: "NebulaCV – AI Resume Builder for Frontend Developers",
  description:
    "AI resume builder for frontend developers in the Middle East applying to U.S. and Canadian remote roles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="my-20 max-w-8xl min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-base text-slate-100">
          <Loader />
          {/* Top nav */}
          <nav className="mb-8 fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Link href="/">
                        <div className="absolute inset-0 animate-pulse rounded-xl bg-cyan-500/20 blur-xl" />
                        
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                         </Link>
                      </div>
                      <span className="text-xl font-bold tracking-tight text-white">NebulaCV</span>
                     
                    </div>
                    <div className="flex items-center gap-6">
                      <Link
                        href="/builder"
                        className="text-base text-slate-300 transition hover:text-white"
                      >
                        Builder
                      </Link>
                      <Link
                        href="/tracker"
                        className="text-base text-slate-300 transition hover:text-white"
                      >
                        Tracker
                      </Link>
                      <Link
                        href="/settings"
                        className="text-base text-slate-300 transition hover:text-white"
                      >
                        Settings
                      </Link>
                        <Link
                        href="/pricing"
                        className="text-base text-slate-300 transition hover:text-white"
                      >
                        Pricing
                      </Link>
                      <Link
                      href="/builder"
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
                      >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                      <NavbarUserMenu />

                    </div>

                  </div>
                </div>
          </nav>
          <main className="mb-8 flex-1">{children}</main>

          <footer className="mt-6 border-t border-white/10 pt-6 text-sm text-slate-500">
            <div className="flex items-center justify-between">
              <p>© 2024 NebulaCV · Built for remote developers in MENA</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-300">Privacy</a>
                <a href="#" className="hover:text-slate-300">Terms</a>
                <a href="#" className="hover:text-slate-300">Contact</a>
              </div>
            </div>
          </footer>
      </body>
    </html>
  );
}