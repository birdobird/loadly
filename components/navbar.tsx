"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          <Link 
            href="/" 
            className="flex items-center gap-2 group no-underline"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-accent)] rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-[var(--color-accent)] p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl text-[var(--color-text)]">
              Loadly
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/how-it-works" 
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] no-underline relative group"
            >
              Jak to działa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] no-underline relative group"
            >
              Cennik
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
            </Link>

            {!session ? (
              <Button 
                onClick={() => signIn("google")}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-[0_4px_15px_rgba(138,173,125,0.25)]"
              >
                Zaloguj przez Google
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[150px] truncate text-[var(--color-text)]">
                    {session.user?.email}
                  </span>
                </div>
                <Button 
                  onClick={() => signOut()}
                  className="bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-none"
                >
                  Wyloguj
                </Button>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors shadow-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white backdrop-blur-xl animate-fade-in absolute top-24 left-0 right-0">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <Link
              href="/how-it-works"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-bg)] transition-colors no-underline text-[var(--color-text)]"
            >
              Jak to działa
            </Link>

            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--color-bg)] transition-colors no-underline text-[var(--color-text)]"
            >
              Cennik
            </Link>

            <div className="pt-4 border-t border-[var(--color-border)]">
              {!session ? (
                <Button
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-[0_4px_15px_rgba(138,173,125,0.25)]"
                  onClick={() => {
                    setOpen(false);
                    signIn("google");
                  }}
                >
                  Zaloguj przez Google
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
                      {session.user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate text-[var(--color-text)]">
                      {session.user?.email}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-none"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                  >
                    Wyloguj
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}