"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  const [withHuman, setWithHuman] = useState(true);
  const [useLogo, setUseLogo] = useState(true);
  const [style, setStyle] = useState<"lifestyle" | "studio">("lifestyle");
  const [extraText, setExtraText] = useState("");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(
      () => setLoadingStep((s) => (s + 1) % loadingTexts.length),
      900
    );
    return () => clearInterval(interval);
  }, [loading]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onMutate: () => {
      setLoading(true);
      setLoadingStep(0);
      setInfo("");
      setVariants(null);
      setSelected(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      setInfo(data.infoMessage || "");
      setVariants(data.variants);
      toast.success("Kreacje zostały wygenerowane.");
    },
    onError: (err) => {
      setLoading(false);
      toast.error("Wystąpił błąd podczas generowania kreacji.");
    },
  });

  const handleGenerate = () => {
    if (!url && !imageUrl) {
      toast.error("Podaj link do produktu lub URL zdjęcia.");
      return;
    }
    mutation.mutate({
      url: url || undefined,
      imageUrl: imageUrl || undefined,
      withHuman,
      useLogo,
      extraText,
      style,
    });
  };

  return (
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

          <div className="grid md:grid-cols-3 gap-6 items-center bg-white/50 p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
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

            {/* --- SELECT: styl --- */}
            <div className="flex items-center gap-3">
              <Label className="ui-label text-sm whitespace-nowrap">
                Styl kreacji
              </Label>

              <Select
                value={style}
                onValueChange={(v: "lifestyle" | "studio") => setStyle(v)}
              >
                <SelectTrigger className="select-trigger h-10 text-sm min-w-[170px]">
                  <SelectValue placeholder="Wybierz styl..." />
                </SelectTrigger>

                <SelectContent className="select-content">
                  <SelectItem className="select-item" value="lifestyle">
                    Lifestyle / social media
                  </SelectItem>
                  <SelectItem className="select-item" value="studio">
                    Studio / ecommerce
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      {/* LOADING */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl p-5 bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-green-400" />
          <div className="font-medium text-sm opacity-90">
            {loadingTexts[loadingStep]}
          </div>
          <Progress value={((loadingStep + 1) / loadingTexts.length) * 100} />
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
                setCaption(variants[v].caption ?? "");
              }}
              className="cursor-pointer bg-white/5 hover:bg-white/10 transition border-white/10"
            >
              <CardContent className="p-3 space-y-3 flex flex-col items-center">
                <img
                  src={variants[v].image}
                  className="rounded-xl w-full max-w-[180px] aspect-[9/16] object-cover shadow-md"
                />
                <div className="font-semibold text-center text-sm">
                  Wariant {v}
                </div>
                <div className="text-xs opacity-60 text-center line-clamp-2">
                  {variants[v].headline}
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
                  className="rounded-xl w-full max-w-[320px] aspect-[9/16] object-cover shadow-xl"
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
                {/* FB */}
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

                {/* IG */}
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
  );
}
