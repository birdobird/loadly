"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ConnectPage() {
  return (
    <main className="relative flex flex-col items-center pb-32 pt-32">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* HERO */}
      <section className="relative z-10 text-center max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-foreground tracking-tight"
        >
          Połącz swoje konta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          Aby publikować kreacje bezpośrednio z Loadly na Facebooku i
          Instagramie, musisz połączyć konto Meta i skonfigurować stronę firmową.
        </motion.p>

        <Link href="/account">
          <Button className="mt-8 h-12 px-8 text-lg rounded-xl shadow-md">
            Przejdź do połączenia Meta
          </Button>
        </Link>
      </section>

      {/* STEPS */}
      <section className="relative mt-24 w-full max-w-5xl z-10 px-4 space-y-16">

        {/* STEP 1 */}
        <Card className="bg-white/70 backdrop-blur border rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              1. Połączenie z Facebook (Meta OAuth)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Aby umożliwić publikację postów przez Loadly:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Kliknij przycisk <strong>Połącz z Meta</strong> w ustawieniach konta.</li>
              <li>Zaloguj się na swoje konto Facebook.</li>
              <li>Wybierz stronę Facebook Page, którą chcesz połączyć.</li>
              <li>Zezwól na uprawnienia:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>pages_show_list</li>
                  <li>pages_read_engagement</li>
                  <li>pages_manage_posts</li>
                  <li>instagram_basic</li>
                  <li>instagram_content_publish</li>
                </ul>
              </li>
              <li>Zatwierdź i wróć do Loadly. Gotowe.</li>
            </ol>
          </CardContent>
        </Card>

        {/* STEP 2 */}
        <Card className="bg-white/70 backdrop-blur border rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              2. Jak stworzyć stronę Facebook (jeśli jej nie masz)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Strona jest wymagana, aby połączyć Instagram Business oraz publikować posty.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Wejdź na: <Link className="underline" href="https://www.facebook.com/pages/create" target="_blank">facebook.com/pages/create</Link></li>
              <li>Wybierz kategorię (np. „Sklep”, „Marka”, „Usługi”).</li>
              <li>Dodaj nazwę i zdjęcie profilowe.</li>
              <li>Zapisz — strona jest gotowa.</li>
            </ol>
          </CardContent>
        </Card>

        {/* STEP 3 */}
        <Card className="bg-white/70 backdrop-blur border rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              3. Zmień Instagram na konto biznesowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Aby Instagram działał z Meta API:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Otwórz Instagram → Ustawienia.</li>
              <li>Przejdź do <strong>Konto</strong>.</li>
              <li>Kliknij <strong>Przełącz na konto profesjonalne</strong>.</li>
              <li>Wybierz kategorię (nie ma znaczenia jaka).</li>
              <li>Wybierz <strong>Konto firmowe (Business)</strong>, NIE twórcy (Creator).</li>
            </ol>
          </CardContent>
        </Card>

        {/* STEP 4 */}
        <Card className="bg-white/70 backdrop-blur border rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              4. Połącz Instagram Business z Facebook Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>To kluczowy krok — bez tego API Meta nie pozwala publikować.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Przejdź do swojej strony na Facebooku.</li>
              <li>Wejdź w <strong>Ustawienia Strony</strong>.</li>
              <li>Wybierz <strong>Połączony Instagram</strong>.</li>
              <li>Zaloguj się na konto IG Business.</li>
              <li>Zatwierdź połączenie.</li>
            </ol>
          </CardContent>
        </Card>

      </section>

      {/* CTA */}
      <section className="relative z-10 mt-20 text-center">
        <Link href="/account">
          <Button className="h-14 px-10 text-lg rounded-xl shadow-md bg-primary hover:bg-primary-hover text-primary-foreground">
            Połącz Meta teraz
          </Button>
        </Link>
        <p className="mt-3 text-muted-foreground text-sm">
          Gotowe w mniej niż 2 minuty.
        </p>
      </section>
    </main>
  );
}
