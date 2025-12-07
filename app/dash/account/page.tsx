"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin opacity-60" />
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20 opacity-70">
        Nie udało się pobrać danych konta.
      </div>
    );

  const { email, image, plan, credits, facebook, instagram } = data;

  return (
    <div className="w-full flex justify-center pt-28 pb-20 px-4">
      <div className="w-full max-w-6xl space-y-12">
        {/* HEADER */}
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-foreground tracking-tight">
          Twoje konto
        </h1>

        {/* USER CARD */}
        <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.45)] shadow-[0_20px_55px_rgba(15,23,42,0.9)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Dane użytkownika
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Image
              src={image || "/avatar.png"}
              alt="Avatar"
              width={70}
              height={70}
              className="rounded-full border"
            />

            <div className="space-y-1">
              <div className="font-medium text-foreground">{email}</div>
              <div className="text-sm text-muted-foreground">
                Plan: <span className="font-medium capitalize">{plan}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Pozostałe kreacje:{" "}
                <span className="font-medium">{credits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SUBSCRIPTION CARD */}
        <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.45)] shadow-[0_20px_55px_rgba(15,23,42,0.9)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Subskrypcja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active plan */}
            <div className="flex items-center justify-between border border-[rgba(148,163,184,0.5)] p-4 rounded-xl bg-[rgba(15,23,42,0.9)]">
              <div>
                <div className="font-semibold capitalize text-foreground">
                  {plan}
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan === "free"
                    ? "Darmowe konto — 1 kreacja"
                    : plan === "premium"
                    ? "30 kreacji / miesiąc"
                    : "150 kreacji / miesiąc"}
                </div>
              </div>

              {plan !== "free" && (
                <Button
                  onClick={async () => {
                    const r = await fetch("/api/stripe/customer-portal", {
                      method: "POST",
                    });
                    const d = await r.json();
                    if (d.url) window.location.href = d.url;
                  }}
                >
                  Zarządzaj
                </Button>
              )}
            </div>

            {/* Upgrade */}
            {plan === "free" && (
              <Button
                className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-primary-foreground font-semibold shadow-[0_18px_50px_rgba(236,72,153,0.7)] hover:opacity-95"
                onClick={() => (window.location.href = "/pricing")}
              >
                Kup subskrypcję
              </Button>
            )}
          </CardContent>
        </Card>

        {/* META CONNECTION CARD */}
        <Card className="rounded-2xl bg-[rgba(15,23,42,0.9)]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.45)] shadow-[0_20px_55px_rgba(15,23,42,0.9)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Połączenia Meta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[rgba(148,163,184,0.5)] rounded-xl bg-[rgba(15,23,42,0.9)]">
              <div>
                <div className="font-semibold text-foreground">Facebook</div>
                <div className="text-sm text-muted-foreground">
                  {facebook ? "Połączono" : "Nie połączono"}
                </div>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => (window.location.href = "/connect/facebook")}
              >
                {facebook ? "Zmień" : "Połącz"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-[rgba(148,163,184,0.5)] rounded-xl bg-[rgba(15,23,42,0.9)]">
              <div>
                <div className="font-semibold text-foreground">Instagram</div>
                <div className="text-sm text-muted-foreground">
                  {instagram ? "Połączono" : "Nie połączono"}
                </div>
              </div>
              <Button
                variant="outline"
                className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[rgba(236,72,153,0.12)]"
                onClick={() => (window.location.href = "/connect/instagram")}
              >
                {instagram ? "Zmień" : "Połącz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
