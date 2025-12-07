import { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Strona nie istnieje | Loadly",
  description: "Żądana strona nie została odnaleziona",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* GLOW CIRCLE */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute w-40 h-40 bg-[var(--color-primary)]/20 blur-3xl rounded-full" />
          <AlertTriangle className="relative w-16 h-16 text-[var(--color-primary)] drop-shadow-xl" />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-[var(--color-foreground)] mb-2 tracking-tight">
          404 – Nie znaleziono
        </h1>

        {/* DESCRIPTION */}
        <p className="text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
          Nie mogliśmy znaleźć strony, której szukasz.  
          Mogła zostać przeniesiona lub usunięta.
        </p>

        {/* CARD */}
        <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-white/60 backdrop-blur-md shadow-lg">
          <p className="text-[var(--color-foreground)] font-medium mb-4">
            Chcesz wrócić na stronę główną?
          </p>

          <Button
            asChild
            className="w-full"
          >
            <a href="/">Wróć na stronę główną</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
