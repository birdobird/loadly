"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Zap, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)] flex justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group no-underline">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--color-accent)] rounded-lg blur opacity-50 group-hover:opacity-75 transition" />
            <div className="relative bg-[var(--color-accent)] p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl text-[var(--color-text)]">
            Loadly
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] no-underline"
          >
            Jak to działa
          </Link>

          <Link
            href="/pricing"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] no-underline"
          >
            Cennik
          </Link>

          {/* SESSION LOGGED OUT */}
          {!session && (
            <Button
              onClick={() => signIn("google")}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white"
            >
              Zaloguj przez Google
            </Button>
          )}

          {/* SESSION LOGGED IN */}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="cursor-pointer border">
                  <AvatarImage src={session.user?.image ?? undefined} />
                  <AvatarFallback className="bg-[var(--color-accent)] text-white">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  {session.user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu size={26} />
          </SheetTrigger>

          <SheetContent side="right" className="w-72 space-y-6">
            <div className="pt-4 flex flex-col gap-4">
              <Link
                href="/how-it-works"
                className="text-[var(--color-text)] text-sm font-medium no-underline"
              >
                Jak to działa
              </Link>

              <Link
                href="/pricing"
                className="text-[var(--color-text)] text-sm font-medium no-underline"
              >
                Cennik
              </Link>

              {!session && (
                <Button
                  onClick={() => signIn("google")}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white w-full"
                >
                  Zaloguj przez Google
                </Button>
              )}

              {session && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <Avatar>
                      <AvatarFallback className="bg-[var(--color-accent)] text-white">
                        {session.user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {session.user?.email}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Wyloguj
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
