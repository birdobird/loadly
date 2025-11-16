"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <main className="relative flex flex-col items-center pb-32 pt-32">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* HEADER */}
      <section className="relative z-10 text-center max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-foreground tracking-tight"
        >
          Cennik
        </motion.h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Wybierz plan idealny dla swoich potrzeb. Płacisz tylko za generacje.
        </p>
      </section>

      {/* PRICING GRID */}
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

                <Button className="mt-auto rounded-xl">Rozpocznij</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* PREMIUM PLAN — highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="relative rounded-2xl bg-white border-primary shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl h-full flex flex-col">
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
                  <li>• 15 kreacji</li>
                  <li>• Możliwość wyboru stylu</li>
                  <li>• Lepsze layouty i CTA</li>
                  <li>• Szybsze generowanie</li>
                </ul>

                <Button className="mt-auto bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shadow-lg">
                  Wybierz plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ENTERPRISE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
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
                  <li>• 100 kreacji</li>
                  <li>• Priorytet generowania</li>
                  <li>• Dedykowane style i presety</li>
                  <li>• Wsparcie mailowe</li>
                </ul>

                <Button className="mt-auto rounded-xl">Skontaktuj się</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
