"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-white/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* LOGO + DESC */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Loadly Logo"
              width={80}
              height={80}
              className="select-none"
            />

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Loadly to inteligentny generator kreacji reklamowych — AI generuje
              grafikę, tekst i CTA, a Ty publikujesz jednym kliknięciem.
            </p>
          </div>

          {/* COLUMN 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Produkt</h4>
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
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Panel użytkownika
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Wsparcie</h4>
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
            <h4 className="text-sm font-semibold text-foreground">
              Social media
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>

              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <Separator className="my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
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
            <Link href="/contact" className="hover:text-foreground">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
