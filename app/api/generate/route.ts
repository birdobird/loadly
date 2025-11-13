export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import { findProductImage } from "@/lib/scrape-image";
import { findStoreLogo } from "@/lib/scrape-logo";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// zamiana URLa obrazka na inlineData dla Gemini
async function inline(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nie udało się pobrać obrazu: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());

  return {
    inlineData: {
      mimeType: res.headers.get("content-type") || "image/png",
      data: buf.toString("base64"),
    },
  };
}

// wyciągnięcie inlineData z odpowiedzi Gemini
function extractImage(resp: any): string | null {
  const parts = resp.candidates?.[0]?.content?.parts ?? resp.parts ?? [];

  const img = parts.find((p: any) => p.inlineData && p.inlineData.data);
  if (!img) return null;

  return `data:${img.inlineData.mimeType};base64,${img.inlineData.data}`;
}

// ##############################################################

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const url: string | undefined = body.url;
    const imageUrl: string | undefined = body.imageUrl;
    const withHuman: boolean = body.withHuman ?? true;
    const extraText: string = body.extraText ?? "";
    const useLogo: boolean = body.useLogo ?? true;
    const stylePref: string | undefined = body.style; // np. "lifestyle" / "studio"

    if (!url && !imageUrl) {
      return NextResponse.json(
        { error: "Brak URL produktu lub URL zdjęcia" },
        { status: 400 }
      );
    }

    let title = "Produkt";
    let description = "";
    let productImage = imageUrl || "";

    // ---------- SCRAPING ----------
    if (url) {
      const page = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (LoadlyBot/1.0)" },
      }).catch(() => null);

      if (page) {
        const html = await page.text();
        const $ = cheerio.load(html);

        title =
          $('meta[property="og:title"]').attr("content") ||
          $("h1").first().text() ||
          $("title").text() ||
          "Produkt";

        description =
          $('meta[property="og:description"]').attr("content") ||
          $('meta[name="description"]').attr("content") ||
          "";
      }

      if (!productImage) {
        productImage = (await findProductImage(url)) || "";
      }
    }

    if (!productImage) {
      return NextResponse.json(
        {
          error:
            "Nie udało się znaleźć zdjęcia produktu. Podaj URL zdjęcia ręcznie.",
        },
        { status: 400 }
      );
    }

    // logo sklepu – tylko jeśli user pozwolił
    let storeLogo: string | null = null;
    if (useLogo && url) {
      storeLogo = await findStoreLogo(url);
    }

    const [productInline, logoInlineResult] = await Promise.all([
      inline(productImage),
      storeLogo ? inline(storeLogo) : Promise.resolve(null),
    ]);

    const logoInline = logoInlineResult;

    // ---------- STYLE PRESETY ----------
    const styleMap: Record<"A" | "B", string> = {
      A:
        stylePref === "studio"
          ? "clean studio light, soft shadows, ecommerce look"
          : "bright travel lifestyle, soft natural light, instagram style",
      B:
        stylePref === "studio"
          ? "dark premium studio, gradient background, high contrast"
          : "urban night cinematic, subtle neon lights, tiktok ad look",
    };

    const variants: any = {};

    // ---------- GENERACJA A / B ----------
    await Promise.all(
      (["A", "B"] as const).map(async (key) => {
        // 1) COPY – tylko nagłówek + caption (bez wciskania extraText na obraz)
        const textPrompt = `
Jesteś ekspertem od reklam performance (Meta / Instagram / TikTok).

Produkt:
- Tytuł: ${title}
- Opis: ${description}

Kontekst kampanii (użyj jako inspiracji tonu i klimatu):
"${extraText || "brak dodatkowego kontekstu"}"

Zwróć DOKŁADNIE jeden obiekt JSON:

{
  "headline": "krótki, mocny nagłówek (max 30 znaków, po polsku)",
  "caption": "dynamiczny tekst posta (max 120 znaków, po polsku)"
}
`.trim();

        const txtRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ parts: [{ text: textPrompt }] }],
        });

        const rawText: string =
          (txtRes as any).text ??
          txtRes.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text || "")
            .join("\n") ??
          "{}";

        let headline = title;
        let caption = description;

        try {
          const parsed = JSON.parse(
            rawText.replace(/```json/gi, "").replace(/```/g, "")
          );
          if (parsed.headline) headline = parsed.headline;
          if (parsed.caption) caption = parsed.caption;
        } catch {
          // zostaw fallback
        }

        // 2) IMAGE PROMPT
        const personRule = withHuman
          ? `
PERSON:
- Pokaż prawdziwą osobę.
- Jeśli produkt to odzież/obuwie/plecak/torba/biżuteria — można go naturalnie nosić.
- Jeśli produkt NIE jest przeznaczony do noszenia (np. organizer, etui, gadżet, poduszka) — osoba NIE dotyka produktu. Leży obok na powierzchni.
- Jeśli produkt ma paski/rzepy, ale nie jest odzieżą — NIE zakładać na ciało.
- Scena realistyczna, naturalne oświetlenie.
`
          : `
NO PERSON:
- Zero ludzi, twarzy, rąk, sylwetek.
- Produkt sam w realistycznym otoczeniu.
`;

        const logoRule = logoInline
          ? `
LOGO:
- Dodaj logo w lewym dolnym rogu, bez zmian i bez modyfikacji.
`
          : `
LOGO:
- Nie dodawaj żadnego logo.
`;

        const imgPrompt = `
Create a realistic vertical 9:16 advertisement.

PRODUCT RULES:
- Use the provided product photo EXACTLY as it is (no redesign, recolor, smoothing, morphing).
- Keep original proportions, geometry, materials, stitching, labels.
- NEVER place the product on the person’s lap, legs, hands, or body unless it is a naturally wearable item.
- If the product is a travel neck pillow: it may ONLY be worn on the neck or placed on a surface (seat, table, luggage).

PERSON RULES:
${personRule}

SCENE:
- Realistic, photographic environment.
- High-quality lighting.
- Maintain clear visibility of the product.
- Style preset: ${styleMap[key]}

TEXT:
- Show only the headline: "${headline}"
- Add small CTA at bottom: "Zamów teraz"
- Do NOT show the caption.
- No extra text.

LOGO:
${logoRule}

Marketing context (DO NOT render as text):
"${extraText || "no additional context"}"
`.trim();

        const parts: any[] = [{ text: imgPrompt }, productInline];
        if (logoInline) parts.push(logoInline);

        const imgRes = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [{ parts }],
          config: {
            responseModalities: ["IMAGE"],
            imageConfig: { aspectRatio: "9:16" },
          },
        });

        const image = extractImage(imgRes);
        variants[key] = {
          image,
          headline,
          caption, // to będzie opis posta, NIE tekst na obrazku
        };
      })
    );

    return NextResponse.json({
      ok: true,
      variants,
      infoMessage: "Wygenerowano 2 warianty A/B z blokadą zmiany produktu",
    });
  } catch (err) {
    console.error("❌ ERROR /api/generate", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
