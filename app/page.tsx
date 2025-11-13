import GeneratorForm from "@/components/generator-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-16 text-center">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[var(--color-text)]">
          Wklej link - Generuj - Edytuj - Opublikuj
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Stwórz profesjonalne posty z AI. Loadly łączy się z Facebookiem i
          Instagramem, by publikować automatycznie.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="#generate">
            <Button>Generuj</Button>
          </a>
          <Link href="/pricing">
            <Button className="bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg-card)]">
              Cennik
            </Button>
          </Link>
        </div>
      </section>

      <section id="generate" className="card">
        <GeneratorForm />
      </section>
    </div>
  );
}
