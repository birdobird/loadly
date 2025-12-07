"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="relative flex flex-col items-center justify-start pb-32 pt-44">
      {/* GRID BACKGROUND FIX */}
      <div className="grid-bg" />

      {/* HERO */}
      <section className="relative z-10 w-full max-w-4xl px-4 text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight text-foreground"
        >
          Stwórz reklamę w <span className="text-primary">2 minuty</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg md:text-xl text-foreground max-w-2xl"
        >
          Wklej link do produktu — Loadly wygeneruje obraz, opis, CTA i format
          do publikacji.
        </motion.p>

        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full max-w-2xl flex gap-3"
        >
          <Input
            placeholder="Wklej link do produktu..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 text-lg rounded-xl bg-white/80 backdrop-blur shadow-sm"
          />
          <Link href="/dash/generate">
            <Button className="h-14 px-6 text-lg rounded-xl shadow-md">
              Stwórz reklamę
            </Button>
          </Link>
        </motion.div>

        <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">
          100% automatyczne generowanie
        </Badge>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mt-32 w-full max-w-6xl z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Jak to działa?
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "1. Wklej link",
              desc: "Obsługa Allegro, Amazon, eBay, Etsy, sklepów i stron produktowych.",
            },
            {
              title: "2. AI generuje scenę",
              desc: "Obraz, copy, CTA, dopasowanie do branży i stylu.",
            },
            {
              title: "3. Publikuj",
              desc: "Integracja z Facebook/Instagram — 1 kliknięcie.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(0, 6, 14, 0.99)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground leading-relaxed">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="relative mt-32 w-full max-w-6xl z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Przykładowe kreacje
        </h2>

        <p className="text-center mt-3 text-foreground">
          Wygenerowane w Loadly — realne przykłady gotowych kreacji.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-10 opacity-90">
          {["/kreacja_1.png", "/kreacja_2.png", "/kreacja_3.png"].map(
            (src, i) => (
              <div
                key={src}
                className="aspect-square rounded-2xl bg-muted border border-[rgba(148,163,184,0.5)] shadow-inner overflow-hidden flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Przykładowa kreacja ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
