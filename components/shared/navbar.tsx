"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Menu,
  LogOut,
  Settings,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoogleIcon } from "@/components/icons/google";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 
        z-50 flex items-center justify-center
        transition-all duration-300
        ${scrolled ? "scale-[0.97] opacity-95" : "scale-100 opacity-100"}
        backdrop-blur-2xl rounded-2xl
      `}
    >
      <div
        className="
          w-[92vw] max-w-7xl
          px-4 py-3
          flex flex-row items-center justify-between gap-4 md:gap-6
          bg-[rgba(15,23,42,0.92)]
          border border-[var(--color-border)]/70
          rounded-2xl 
          shadow-[0_18px_45px_rgba(15,23,42,0.6)]
        "
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <Image src="/logo2.png" alt="Loadly Logo" width={100} height={100} />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="nav-link">
            Jak to działa
          </Link>

          <Link href="/pricing" className="nav-link">
            Cennik
          </Link>

          {session && (
            <>
              <Link href="/dash/generate" className="nav-link">
                Generuj
              </Link>

              <Link href="/dash/account" className="nav-link">
                Konto
              </Link>
            </>
          )}

          {!session && (
            <Button
              onClick={() => signIn("google")}
              className="bg-primary text-primary-foreground hover:bg-primary-hover transition flex items-center gap-2 shadow-md"
            >
              <GoogleIcon className="w-4 h-4" />
              Zaloguj przez Google
            </Button>
          )}

          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="cursor-pointer border shadow-sm">
                  <AvatarImage src={session.user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary text-white">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 shadow-xl rounded-xl backdrop-blur-xl bg-[rgba(15,23,42,0.98)] border border-[var(--color-border)]/70 text-foreground"
              >
                <DropdownMenuLabel className="font-semibold">
                  {session.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/dash/generate"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generator
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/dash/account"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    Konto
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu size={26} />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 space-y-6 p-6 bg-[rgba(15,23,42,0.98)] text-foreground border-l border-[var(--color-border)]/70"
          >
            <div className="pt-4 flex flex-col gap-4">
              <Link href="/how-it-works" className="font-medium">
                Jak to działa
              </Link>

              <Link href="/pricing" className="font-medium">
                Cennik
              </Link>

              {session && (
                <>
                  <Link href="/dash/generate" className="font-medium">
                    Generuj
                  </Link>

                  <Link href="/dash/account" className="font-medium">
                    Konto
                  </Link>
                </>
              )}

              {!session && (
                <Button
                  onClick={() => signIn("google")}
                  className="w-full bg-primary text-primary-foreground"
                >
                  <GoogleIcon className="w-4 h-4" /> Zaloguj przez Google
                </Button>
              )}

              {session && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
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
