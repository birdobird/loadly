"use client";

import { motion } from "framer-motion";
import { CheckCircle, Link2, Image as Img, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <main className="relative flex flex-col items-center pb-32 pt-32">
      {/* GRID BACKGROUND */}
      <div className="grid-bg" />

      {/* HEADER */}
      <section className="relative z-10 text-center max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-foreground tracking-tight"
        >
          Jak to działa?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Loadly przekształca zwykły link produktu w gotową reklamę — obraz,
          tekst, CTA i format idealny pod FB/IG.
        </motion.p>
      </section>

      {/* STEPS */}
      <section className="relative z-10 mt-24 w-full max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {/* 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(148,163,184,0.5)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <Link2 className="w-6 h-6 text-primary" />
                  1. Wklej link
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                Podaj URL produktu z dowolnego sklepu — Allegro, Amazon,
                Zalando, Zara, eBay, Shein, cokolwiek.
              </CardContent>
            </Card>
          </motion.div>

          {/* 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(148,163,184,0.5)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <Img className="w-6 h-6 text-primary" />
                  2. AI generuje kreacje
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                Loadly analizuje stronę produktu, tworzy grafikę, teksty,
                nagłówki, CTA i layout reklamowy.
              </CardContent>
            </Card>
          </motion.div>

          {/* 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative"
          >
            <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(148,163,184,0.5)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <UploadCloud className="w-6 h-6 text-primary" />
                  3. Publikujesz 1 kliknięciem
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                Połącz konto FB/IG i wrzucaj posty bezpośrednio z Loadly —
                błyskawicznie.
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative z-10 mt-32 w-full max-w-4xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Cały proces zajmuje <span className="text-primary">10 sekund</span>
        </h2>

        <div className="space-y-10 border-l-2 border-primary/40 pl-6">
          {[
            "Wklejasz link do produktu lub zdjęcie.",
            "System analizuje opis, zdjęcia i kontekst sklepu.",
            "AI generuje grafikę reklamową w stylu premium.",
            "Druga AI tworzy tekst posta + hashtagi.",
            "Gotowe — możesz publikować od razu.",
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4"
            >
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="text-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mt-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Gotowy żeby spróbować?
        </h2>

        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Roczne plany, darmowe generowanie i natychmiastowa gotowa kreacja.
        </p>

        <Button className="mt-8 text-lg px-8 py-6 rounded-xl shadow-lg">
          Przejdź do generatora
        </Button>
      </section>
    </main>
  );
}
