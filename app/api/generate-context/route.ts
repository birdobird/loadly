import { NextRequest, NextResponse } from "next/server";
import { ai } from "../generate/_lib/ai";
import { scrapePageContext } from "../generate/_lib/scrape-context";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Brak URL produktu." },
        { status: 400 }
      );
    }

    const pageContext = await scrapePageContext(url);

    const prompt = `
Jesteś ekspertem od digital marketingu i Meta Ads.
Na podstawie poniższych danych o produkcie przygotuj zwięzły, KONKRETNY kontekst kreacji reklamowej w języku polskim.

Dane o produkcie (JSON):
${JSON.stringify(pageContext)}

Wymagania (MUSISZ ich przestrzegać):
- odwołuj się konkretnie do produktu z danych (np. jeśli to MacBook, pisz o laptopie/komputerze MacBook, nie o "produkcie" ogólnie)
- NIE używaj fraz typu: "nasz produkt", "nasze rozwiązanie", "uniwersalne narzędzie", "dla każdego" ani innych pustych ogólników
- opisz realny scenariusz użycia albo benefit (np. praca mobilna, montaż video, studia, gaming – zależnie od danych)
- możesz zasugerować okazję (np. Back to School, święta, promocja) jeśli to ma sens
- zwróć 1–3 krótkie zdania
- bez emoji, bez hashtagu, sam czysty tekst
`;

    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const rawText: string =
      (res as any).text ??
      res.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("\n") ??
      "";

    const contextPrompt = rawText.trim() || "Kampania produktowa online.";

    return NextResponse.json({ ok: true, contextPrompt, pageContext });
  } catch (e) {
    console.error("❌ ERROR /api/generate-context", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
