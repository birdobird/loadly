"use client";

import { motion } from "framer-motion";
import GeneratorForm from "@/components/dash/generate/generator-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequireAuth from "@/components/auth/require-auth";

export default function GeneratePage() {
  return (
    <RequireAuth>
      <main className="relative flex flex-col items-center justify-start pt-40 pb-32 px-4">
        <div className="grid-bg" />
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mt-20 w-full max-w-3xl"
        >
          <Card className="bg-white/70 backdrop-blur-xl shadow-xl border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold">
                Generator kreacji reklamowej
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <GeneratorForm />
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </RequireAuth>
  );
}
