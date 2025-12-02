import * as cheerio from "cheerio";
import { ai } from "./ai";

export interface PageContext {
  title: string;
  description: string;
  price?: string;
  features?: string[];
  targetAudience?: string;
}

export async function scrapePageContext(url: string): Promise<PageContext> {
  const context: PageContext = {
    title: "Produkt",
    description: "",
    price: "",
    features: [],
    targetAudience: "",
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (LoadlyBot/1.0)" },
    });
    if (!res.ok) return context;

    const html = await res.text();
    const $ = cheerio.load(html);

    context.title =
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim();

    context.description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $("p").first().text().trim();

    // --- PRICE ---
    const priceText = $("body").text();
    const match = priceText.match(/(\d+[.,]?\d*)\s?(zł|pln)/i);
    if (match) context.price = `${match[1].replace(",", ".")} zł`;

    const textForAI =
      (context.title || "") +
      "\n" +
      (context.description || "") +
      "\n" +
      priceText.slice(0, 5000); // limity modelu, nie trzeba więcej

    // -------------- AI CLASSIFICATION --------------
    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
Jesteś klasyfikatorem produktów.

Na podstawie tekstu zwróć JEDNO słowo opisujące główną grupę docelową:
- "kobiety"
- "mężczyźni"
- "dzieci"
- "sportowcy"
- "podróżnicy"
- "pracownicy biurowi"
- "wszyscy"

Jeśli tekst dotyczy wielu grup → zwróć "wszyscy".

Zwracaj TYLKO jedno słowo bez żadnych wyjaśnień.

Tekst:
${textForAI}
          `,
              },
            ],
          },
        ],
      });

      // poprawny dostęp do treści:
      const raw = aiResponse?.text?.trim().toLowerCase();

      const allowed = [
        "kobiety",
        "mężczyźni",
        "dzieci",
        "sportowcy",
        "podróżnicy",
        "pracownicy biurowi",
        "wszyscy",
      ];

      if (allowed.includes(raw || "")) {
        context.targetAudience = raw;
        return context;
      }
    } catch (e) {
      console.error("⚠️ AI classification failed, using regex fallback", e);
    }

    // -------------- FALLBACK (regex) --------------
    const body = priceText.toLowerCase();

    const patterns = {
      sportowcy: /(sport|fitness|trening|rower|jog|biega)/,
      pracownicy: /(biuro|laptop|ergonomicz|pracownik|notatnik)/,
      kobiety: /(damsk|kobiet|torebk|kosmetik|biżuteri)/,
      mężczyźni: /(męsk|mężczyzn|brod|zarost|golenie)/,
      podróżnicy: /(walizk|bagaż|turyst|plecak(?!.*laptop)|camping)/,
      dzieci: /(dzieci|niemowl|zabaw|bajk)/,
    };

    for (const [audience, reg] of Object.entries(patterns)) {
      if (reg.test(body)) {
        context.targetAudience =
          audience === "pracownicy" ? "pracownicy biurowi" : audience;
        return context;
      }
    }

    context.targetAudience = "wszyscy";
    return context;
  } catch (e) {
    console.error("❌ Błąd scrapePageContext", e);
    return context;
  }
}
