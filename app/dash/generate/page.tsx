"use client";

import { motion } from "framer-motion";
import GeneratorForm from "@/components/dash/generate/generator-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequireAuth from "@/components/auth/require-auth";

export default function GeneratePage() {
  return (
    <RequireAuth>
      <main className="relative flex flex-col items-center justify-start pt-10 pb-32 px-4 min-h-screen">
        <div className="grid-bg" />
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mt-20 w-full max-w-7xl"
        >
          <Card className="rounded-3xl bg-[rgba(15,23,42,0.96)]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.45)] shadow-[0_26px_70px_rgba(15,23,42,0.9)]">
            <CardHeader>
              <CardTitle className="text-center text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                Generator kreacji reklamowej
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <GeneratorForm />
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </RequireAuth>
  );
}
