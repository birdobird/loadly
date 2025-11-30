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
        <h1 className="text-4xl font-semibold text-center">Twoje konto</h1>

        {/* USER CARD */}
        <Card className="bg-white/60 backdrop-blur border border-[var(--color-border)] shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Dane użytkownika</CardTitle>
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
              <div className="font-medium">{email}</div>
              <div className="text-sm opacity-70">
                Plan: <span className="font-medium capitalize">{plan}</span>
              </div>
              <div className="text-sm opacity-70">
                Pozostałe kreacje:{" "}
                <span className="font-medium">{credits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SUBSCRIPTION CARD */}
        <Card className="bg-white/60 backdrop-blur border border-[var(--color-border)] shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Subskrypcja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active plan */}
            <div className="flex items-center justify-between border p-4 rounded-xl bg-white/70">
              <div>
                <div className="font-semibold capitalize">{plan}</div>
                <div className="text-sm opacity-70">
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
                className="w-full h-12 text-lg"
                onClick={() => (window.location.href = "/pricing")}
              >
                Kup subskrypcję
              </Button>
            )}
          </CardContent>
        </Card>

        {/* META CONNECTION CARD */}
        <Card className="bg-white/60 backdrop-blur border border-[var(--color-border)] shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Połączenia Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-white/70">
              <div>
                <div className="font-semibold">Facebook</div>
                <div className="text-sm opacity-70">
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

            <div className="flex items-center justify-between p-4 border rounded-xl bg-white/70">
              <div>
                <div className="font-semibold">Instagram</div>
                <div className="text-sm opacity-70">
                  {instagram ? "Połączono" : "Nie połączono"}
                </div>
              </div>
              <Button
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-50"
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
