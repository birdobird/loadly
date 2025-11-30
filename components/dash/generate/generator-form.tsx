"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Script from "next/script";

const loadingTexts = [
  "Łączenie z modelem AI…",
  "Pobieranie danych produktu…",
  "Generowanie sceny…",
  "Przetwarzanie layoutu…",
  "Dodawanie tekstów i CTA…",
  "Kończenie kreacji…",
];

type VariantKey = "A" | "B";

export default function GeneratorForm() {
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [info, setInfo] = useState("");
  const [variants, setVariants] = useState<any>(null);
  const [selected, setSelected] = useState<VariantKey | null>(null);
  const [caption, setCaption] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [widgetId, setWidgetId] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const [withHuman, setWithHuman] = useState(true);
  const [useLogo, setUseLogo] = useState(true);
  const [extraText, setExtraText] = useState("");
  const [useCartoon, setUseCartoon] = useState(false);

  const [connected, setConnected] = useState({
    facebook: false,
    instagram: false,
  });

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!;

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    fetch("/api/meta/status")
      .then((r) => r.json())
      .then((d) => setConnected(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, loadingTexts.length - 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [loading]);

  const resetCaptcha = () => {
    // @ts-ignore
    if (window?.turnstile && widgetId) {
      // @ts-ignore
      window.turnstile.reset(widgetId);
      setTurnstileToken("");
    }
  };

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // WAŻNE: przekaż backendowy error do catch()
        throw new Error(data.error || "Nieznany błąd");
      }

      return data;
    },
    onMutate: () => {
      setLoading(true);
      setLoadingStep(0);
      setProgress(0);
      setInfo("");
      setVariants(null);
      setSelected(null);
    },
    onSuccess: (data) => {
      setProgress((p) => {
        if (p < 100) return 100;
        return p;
      });

      setTimeout(() => {
        setLoading(false);
        setInfo(data.infoMessage || "");
        setVariants(data.variants);
        toast.success("Kreacje zostały wygenerowane.");
        resetCaptcha();
      }, 400); // 300–600 ms działa idealnie
    },

    onError: (err: any) => {
      setLoading(false);
      toast.error(err.message);
      resetCaptcha();
    },
  });

  const handleGenerate = () => {
    if (!url && !imageUrl) {
      toast.error("Podaj link do produktu lub URL zdjęcia.");
      return;
    }

    if (!turnstileToken) {
      toast.error("Potwierdź, że nie jesteś botem (Captcha).");
      return;
    }

    mutation.mutate({
      url: url || undefined,
      imageUrl: imageUrl || undefined,
      withHuman,
      useLogo,
      extraText,
      useCartoon,
      turnstileToken,
    });
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (window?.turnstile) {
            // @ts-ignore
            const id = window.turnstile.render("#turnstile-container", {
              sitekey: siteKey,
              callback: (token: string) => setTurnstileToken(token),
            });
            setWidgetId(id);
          }
        }}
      />

      <div className="space-y-8">
        {/* PANEL WEJŚCIOWY */}
        <Card className="bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Kreacje A/B z produktem
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Wklej link do produktu"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Input
                placeholder="Lub URL zdjęcia produktu"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <Textarea
              placeholder="Kontekst kampanii (np. Black Friday -40%, nowa kolekcja, limitowana edycja)…"
              value={extraText}
              onChange={(e) => setExtraText(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-4 items-center">
              <div className="grid md:grid-cols-3 gap-6 items-center bg-white/50 p-4 rounded-xl border border-[var(--color-border)] shadow-sm w-fit">
                {/* --- SWITCH: z człowiekiem --- */}
                <div className="flex items-center gap-3">
                  <Switch
                    id="with-human"
                    checked={withHuman}
                    onCheckedChange={(v) => setWithHuman(Boolean(v))}
                    className="switch-root"
                  />
                  <Label htmlFor="with-human" className="ui-label text-sm">
                    Scena z człowiekiem
                  </Label>
                </div>

                {/* --- SWITCH: logo sklepu --- */}
                <div className="flex items-center gap-3">
                  <Switch
                    id="use-logo"
                    checked={useLogo}
                    onCheckedChange={(v) => setUseLogo(Boolean(v))}
                    className="switch-root"
                  />
                  <Label htmlFor="use-logo" className="ui-label text-sm">
                    Dodaj logo sklepu
                  </Label>
                </div>

                {/* --- SWITCH: styl ilustracyjny --- */}
                <div className="flex items-center gap-3">
                  <Switch
                    id="art-style"
                    checked={useCartoon}
                    onCheckedChange={(v) => setUseCartoon(Boolean(v))}
                    className="switch-root"
                  />
                  <Label htmlFor="art-style" className="ui-label text-sm">
                    Styl ilustracyjny (kreskówkowy)
                  </Label>
                </div>
              </div>

              <div id="turnstile-container" className="my-4" />
            </div>

            <Button
              className="w-full mt-2"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generowanie…" : "Generuj 2 kreacje A/B"}
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 rounded-xl"
            style={{
              backgroundColor: "rgba(26, 26, 26, 0.85)", // kolor-foreground / lekko transparentny
              backdropFilter: "blur(6px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                delay: 0.15,
              }}
              className="w-full max-w-sm rounded-2xl p-8 border shadow-2xl flex flex-col items-center text-center"
              style={{
                background: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-foreground)",
              }}
            >
              {/* Ikona */}
              <motion.div
                key={loadingStep}
                initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 360, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="p-5 rounded-full shadow-lg"
                style={{
                  background: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="text-3xl">
                  {["🤖", "📦", "🎨", "🖼️", "✏️", "🚀"][loadingStep]}
                </span>
              </motion.div>

              {/* Tekst */}
              <motion.div
                key={loadingTexts[loadingStep]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 text-lg font-semibold"
                style={{
                  color: "var(--color-foreground)",
                }}
              >
                {loadingTexts[loadingStep]}
              </motion.div>

              {/* Procenty */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-1 text-sm font-mono"
                style={{ color: "var(--color-primary)" }}
              >
                {progress}%
              </motion.div>

              {/* Pasek progresu */}
              <div
                className="w-full mt-7 relative h-3 rounded-full overflow-hidden shadow-inner"
                style={{ background: "var(--color-muted)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* INFO */}
        {info && !loading && (
          <div className="rounded-xl bg-white/10 p-3 text-sm opacity-80 text-center">
            {info}
          </div>
        )}

        {/* WARIANTY A/B */}
        {variants && !selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {(["A", "B"] as VariantKey[]).map((v) => (
              <Card
                key={v}
                onClick={() => {
                  setSelected(v);
                  setCaption(variants[v].postDescription ?? "");
                }}
                className="cursor-pointer bg-white/5 hover:bg-white/10 transition border-white/10"
              >
                <CardContent className="p-3 space-y-3 flex flex-col items-center">
                  <img
                    src={variants[v].image}
                    className="rounded-xl w-full max-w-[180px] aspect-[1/1] object-cover shadow-md"
                  />
                  <div className="font-semibold text-center text-sm">
                    Wariant {v}
                  </div>
                  <div className="text-xs opacity-80 text-center line-clamp-2 italic">
                    {variants[v].headline || "Hasło niedostępne"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* WYBRANY WARIANT */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-base">
                  Wybrano wariant {selected}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={variants[selected].image}
                    className="rounded-xl w-full max-w-[320px] aspect-[1/1] object-cover shadow-xl"
                  />
                </div>

                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="text-sm"
                  placeholder="Tekst posta / opisu pod reklamą…"
                />

                <Separator />

                <div className="flex flex-wrap gap-3 items-center">
                  {/* FACEBOOK */}
                  {connected.facebook ? (
                    <form action="/api/publish/facebook" method="post">
                      <input
                        type="hidden"
                        name="image"
                        value={variants[selected].image}
                      />
                      <input type="hidden" name="caption" value={caption} />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Facebook
                      </Button>
                    </form>
                  ) : (
                    <Button
                      onClick={() =>
                        (window.location.href = "/connect/facebook")
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Połącz z Facebookiem
                    </Button>
                  )}

                  {/* INSTAGRAM */}
                  {connected.instagram ? (
                    <form action="/api/publish/instagram" method="post">
                      <input
                        type="hidden"
                        name="image"
                        value={variants[selected].image}
                      />
                      <input type="hidden" name="caption" value={caption} />
                      <Button
                        variant="outline"
                        className="border-pink-500 text-pink-500"
                      >
                        Instagram
                      </Button>
                    </form>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-pink-500 text-pink-500"
                      onClick={() =>
                        (window.location.href = "/connect/instagram")
                      }
                    >
                      Połącz z Instagramem
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => setSelected(null)}
                    className="ml-auto"
                  >
                    Wróć do A/B
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}
