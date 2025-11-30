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
      {/* ...HEADER... */}

      <section className="relative z-10 mt-24 w-full max-w-6xl px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl bg-white/70 backdrop-blur border shadow-xl h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Free</CardTitle>
                <p className="text-muted-foreground">Na start</p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold">0 zł</p>
                <ul className="text-muted-foreground space-y-3 text-sm">
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
            <Card className="relative rounded-2xl bg-white border-primary shadow-xl backdrop-blur-xl h-full flex flex-col">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-lg">
                Najpopularniejszy
              </Badge>

              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Premium
                </CardTitle>
                <p className="text-muted-foreground">
                  Dla rozwijających się sklepów
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold">49 zł</p>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  <li>• 30 kreacji</li>
                  <li>• Możliwość wyboru stylu</li>
                  <li>• Lepsze layouty i CTA</li>
                  <li>• Szybsze generowanie</li>
                </ul>

                <Button
                  className="mt-auto bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shadow-lg"
                  disabled={loading === process.env.NEXT_PUBLIC_PRICE_PREMIUM}
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_PREMIUM!)}
                >
                  {loading === process.env.NEXT_PUBLIC_PRICE_PREMIUM ? "Ładowanie..." : "Wybierz plan"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ENTERPRISE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-2xl bg-white/70 backdrop-blur border shadow-xl h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Enterprise
                </CardTitle>
                <p className="text-muted-foreground">
                  Dla marek i większych sklepów
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 flex-grow">
                <p className="text-4xl font-bold">99 zł</p>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  <li>• 150 kreacji</li>
                  <li>• Priorytet generowania</li>
                  <li>• Dedykowane style</li>
                  <li>• Wsparcie mailowe</li>
                </ul>

                <Button
                  className="mt-auto rounded-xl"
                  disabled={loading === process.env.NEXT_PUBLIC_PRICE_ENTERPRISE}
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_PRICE_ENTERPRISE!)}
                >
                  {loading === process.env.NEXT_PUBLIC_PRICE_ENTERPRISE ? "Ładowanie..." : "Skontaktuj się"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
