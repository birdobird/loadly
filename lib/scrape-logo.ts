import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function findStoreLogo(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LoadlyBot/1.3)" },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);
    const domain = new URL(url).hostname.replace("www.", "");

    // === Zbieranie potencjalnych logotypów ===
    const candidates = new Set<string>();

    const metaCandidates = [
      $('meta[property="og:logo"]').attr("content"),
      $('meta[itemprop="logo"]').attr("content"),
      $('meta[property="og:image"]').attr("content"),
      $('link[rel="icon"]').attr("href"),
      $('link[rel="shortcut icon"]').attr("href"),
      $('link[rel="apple-touch-icon"]').attr("href"),
    ].filter(Boolean) as string[];

    metaCandidates.forEach((c) => candidates.add(c));

    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt") || "";
      if (/logo|brand|header|marka|firma|company/i.test(src + alt)) {
        candidates.add(src);
      }
    });

    const logoCandidates = Array.from(candidates)
      .map((c) => absoluteUrl(url, c))
      .filter(
        (x) =>
          /\.(png|jpe?g|webp|svg)$/i.test(x) &&
          !/favicon|sprite|mask-icon|apple-touch/i.test(x)
      );

    if (logoCandidates.length === 0) return null;
    if (logoCandidates.length === 1) return logoCandidates[0];

    console.log(
      `🔍 Analizuję ${logoCandidates.length} kandydatów logotypu dla ${url}`
    );

    // === Super-precyzyjny prompt ===
    const parts: any[] = [
      {
        text: `
Masz obrazy logotypów. Wybierz tylko logo SKLEPU z domeny ${domain}, a nie producenta produktu.
Zasady:
- Jeśli na obrazie widzisz nazwę marki produktu (np. Schneider, Samsung, Lenovo) – to NIE jest logo sklepu.
- Logo sklepu zazwyczaj zawiera nazwę domeny (${domain}) lub jej fragment (np. biuronet, morele, x-kom, mediaexpert itd.).
- Wybierz tylko jedno logo, powiązane z nazwą sklepu, NIE producenta.
- Jeśli żaden nie pasuje, wybierz ten, który wygląda najbardziej jak logo sklepu internetowego, a nie produktowego.
Zwróć JEDEN URL z poniższej listy, dokładnie jak jest napisany.`,
      },
    ];

    const limited = logoCandidates.slice(0, 3);
    for (const candidate of limited) {
      try {
        const imgRes = await fetch(candidate);
        if (!imgRes.ok) continue;
        const mimeType = imgRes.headers.get("content-type") || "image/png";
        if (/x-icon|ico/i.test(mimeType)) continue;
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        parts.push({
          inlineData: {
            mimeType,
            data: buffer.toString("base64"),
          },
        });
      } catch {
        console.warn("⚠️ Nie udało się pobrać obrazu:", candidate);
      }
    }

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts }],
    });

    const answer = resp.text?.trim() || "";
    const best =
      limited.find((l) => answer.includes(l)) || answer.split("\n")[0];

    if (best && best.startsWith("http")) {
      console.log("🏁 Wybrane logo sklepu:", best);
      return best;
    }

    const fallback =
      logoCandidates.find((l) => l.includes(domain)) ||
      logoCandidates.find((l) => /logo|brand/i.test(l)) ||
      logoCandidates[0];

    console.log("⚙️ Fallback logo:", fallback);
    return fallback;
  } catch (err) {
    console.error("❌ Błąd findStoreLogo:", err);
    return null;
  }
}

function absoluteUrl(base: string, relative: string) {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}
