"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import NextTopLoader from "nextjs-toploader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        <NextTopLoader color="#8aad7d"/>
        <Navbar />
        <main className="mt-16">{children}</main>
        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  );
}
