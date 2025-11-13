"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import Navbar from "@/components/navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main className="container py-8">{children}</main>
      </QueryClientProvider>
    </SessionProvider>
  );
}
