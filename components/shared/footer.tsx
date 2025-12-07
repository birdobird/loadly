"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Star, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)]/70 bg-[rgba(15,23,42,0.9)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-14 items-start">
          {/* LOGO + DESC */}
          <div className="space-y-4">
            <Image
              src="/logo2.png"
              alt="Loadly Logo"
              width={80}
              height={80}
              className="select-none drop-shadow-[0_0_25px_rgba(248,250,252,0.45)]"
            />

            <p className="text-sm text-muted-foreground/80 max-w-xs leading-relaxed">
              Loadly to inteligentny generator kreacji reklamowych — AI generuje
              grafikę, tekst i CTA, a Ty publikujesz jednym kliknięciem.
            </p>
          </div>

          {/* COLUMN 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase/relaxed text-[11px]">
              Produkt
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Jak to działa
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cennik
                </Link>
              </li>
              <li>
                <Link
                  href="/dash/generate"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Generuj reklamę
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase/relaxed text-[11px]">
              Wsparcie
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Polityka prywatności
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIALS */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase/relaxed text-[11px]">
              Social media
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/loadly__/"
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://www.tiktok.com/@loadly.pl"
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Star className="w-4 h-4" /> Tiktok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <Separator className="my-8 bg-[rgba(148,163,184,0.25)]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground/80">
          <p>
            © {new Date().getFullYear()} Loadly. Wszystkie prawa zastrzeżone.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground">
              Prywatność
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
