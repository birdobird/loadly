"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="relative flex flex-col items-center justify-start pb-32 pt-44">
      {/* GRID BACKGROUND FIX */}
      <div className="grid-bg" />

      {/* HERO */}
      <section className="relative z-10 w-full max-w-4xl px-4 text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight text-foreground"
        >
          Stwórz reklamę w <span className="text-primary">2 minuty</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          Wklej link do produktu — Loadly wygeneruje obraz, opis, CTA i format
          do publikacji.
        </motion.p>

        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 w-full max-w-2xl flex gap-3"
        >
          <Input
            placeholder="Wklej link do produktu..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 text-lg rounded-xl bg-white/80 backdrop-blur shadow-sm"
          />

          <Button className="h-14 px-6 text-lg rounded-xl shadow-md">
            Stwórz reklamę
          </Button>
        </motion.div>

        <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">
          100% automatyczne generowanie
        </Badge>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mt-32 w-full max-w-6xl z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Jak to działa?
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "1. Wklej link",
              desc: "Obsługa Allegro, Amazon, eBay, Etsy, sklepów i stron produktowych.",
            },
            {
              title: "2. AI generuje scenę",
              desc: "Obraz, copy, CTA, dopasowanie do branży i stylu.",
            },
            {
              title: "3. Publikuj",
              desc: "Integracja z Facebook/Instagram — 1 kliknięcie.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="bg-white/70 backdrop-blur border shadow-lg rounded-2xl"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="relative mt-32 w-full max-w-6xl z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Przykładowe kreacje
        </h2>

        <p className="text-center mt-3 text-muted-foreground">
          Wygenerowane w Loadly — tu pojawią się realne przykłady.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-10 opacity-70">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-muted border shadow-inner"
            />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS — SHADCN CAROUSEL */}
      <section className="relative mt-32 w-full max-w-4xl z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Opinie użytkowników
        </h2>

        <Carousel className="mt-12">
          <CarouselContent>
            {[
              {
                name: "Kamil",
                text: "Reklama gotowa w kilka sekund. Nigdy nie było to łatwiejsze.",
              },
              {
                name: "Agnieszka",
                text: "Jako sklep odzieżowy — absolutnie zmienia zasady gry.",
              },
              {
                name: "Marek",
                text: "Integracja z IG oszczędza mi 40 min dziennie.",
              },
              {
                name: "Alicja",
                text: "Reklama gotowa w kilka sekund. Nigdy nie było to łatwiejsze.",
              },
            ].map((item, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/70 backdrop-blur rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{item.text}</p>
                    <p className="font-semibold mt-4">{item.name}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
}
