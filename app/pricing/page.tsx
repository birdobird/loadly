"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(priceId: string) {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <main className="relative flex flex-col items-center pb-32 pt-32 min-h-screen">
      {/* GRID BACKGROUND */}
      <div className="grid-bg" />

      {/* ...HEADER... */}

      <section className="relative z-10 mt-24 w-full max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(148,163,184,0.45)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] h-full flex flex-col transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Free
                </CardTitle>
                <p className="text-sm text-muted-foreground">Na start</p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold text-foreground">0 zł</p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>• 1 kreacja</li>
                  <li>• Watermark Loadly</li>
                  <li>• Podstawowy layout</li>
                </ul>

                <Button className="mt-auto rounded-xl" disabled>
                  Rozpocznij
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="relative rounded-2xl bg-[rgba(15,23,42,0.98)] backdrop-blur-2xl border border-primary/70 shadow-[0_22px_60px_rgba(236,72,153,0.6)] h-full flex flex-col scale-[1.02]">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-lg">
                Najpopularniejszy
              </Badge>

              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Premium
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dla rozwijających się sklepów
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold text-foreground">49 zł</p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>• 30 kreacji</li>
                  <li>• Możliwość wyboru stylu</li>
                  <li>• Lepsze layouty i CTA</li>
                  <li>• Szybsze generowanie</li>
                </ul>

                <Button
                  className="mt-auto bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shadow-lg"
                  disabled={loading === process.env.NEXT_PUBLIC_PRICE_PREMIUM}
                  onClick={() =>
                    handleCheckout(process.env.NEXT_PUBLIC_PRICE_PREMIUM!)
                  }
                >
                  {loading === process.env.NEXT_PUBLIC_PRICE_PREMIUM
                    ? "Ładowanie..."
                    : "Wybierz plan"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ENTERPRISE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/90 backdrop-blur-xl border border-[rgba(148,163,184,0.45)] shadow-[0_18px_45px_rgba(15,23,42,0.6)] h-full flex flex-col transition-transform transition-shadow hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.9)]">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Enterprise
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dla marek i większych sklepów
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold text-foreground">99 zł</p>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>• 150 kreacji</li>
                  <li>• Priorytet generowania</li>
                  <li>• Dedykowane style</li>
                  <li>• Wsparcie mailowe</li>
                </ul>

                <Button
                  className="mt-auto rounded-xl"
                  disabled={
                    loading === process.env.NEXT_PUBLIC_PRICE_ENTERPRISE
                  }
                  onClick={() =>
                    handleCheckout(process.env.NEXT_PUBLIC_PRICE_ENTERPRISE!)
                  }
                >
                  {loading === process.env.NEXT_PUBLIC_PRICE_ENTERPRISE
                    ? "Ładowanie..."
                    : "Skontaktuj się"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
