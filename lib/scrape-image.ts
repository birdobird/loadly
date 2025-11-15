// lib/scrape-image.ts
import * as cheerio from "cheerio";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// =====================================================
// GŁÓWNA FUNKCJA
// =====================================================
export async function findProductImage(
  url: string
): Promise<{ bestImage: string | null; allImages: string[] }> {
  try {
    const images = await findProductImages(url, 8);
    if (images.length === 0) {
      console.warn("⚠️ Brak zdjęć produktu na stronie:", url);
      return { bestImage: null, allImages: [] };
    }

    // spróbuj pozwolić AI wybrać najlepsze
    const best = await analyzeImagesWithAI(images);
    return { bestImage: best || images[0] || null, allImages: images };
  } catch (err) {
    console.error("❌ findProductImage error:", err);
    return { bestImage: null, allImages: [] };
  }
}

// =====================================================
// SCRAPER OBRAZÓW ZE STRONY
// =====================================================
export async function findProductImages(
  url: string,
  limit = 8
): Promise<string[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LoadlyBot/3.0)" },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);

    const urls = new Set<string>();

    // 1️⃣ Meta tagi
    const metaSelectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[itemprop="image"]',
    ];
    metaSelectors.forEach((sel) => {
      const src = $(sel).attr("content");
      if (src) urls.add(new URL(src, url).href);
    });

    // 2️⃣ Zwykłe <img>
    $("img").each((_, el) => {
      const src =
        $(el).attr("src") ||
        $(el).attr("data-src") ||
        $(el).attr("data-large_image");
      const srcset = $(el).attr("srcset") || $(el).attr("data-srcset");
      const best = src || (srcset ? extractLargestFromSrcset(srcset) : null);
      if (best && /\.(jpe?g|png|webp|avif)$/i.test(best)) {
        urls.add(new URL(best, url).href);
      }
    });

    // 3️⃣ picture>source
    $("picture source").each((_, el) => {
      const srcset = $(el).attr("srcset") || $(el).attr("data-srcset");
      if (srcset) {
        const best = extractLargestFromSrcset(srcset);
        if (best) urls.add(new URL(best, url).href);
      }
    });

    // 4️⃣ schema.org/Product
    $('[itemtype*="schema.org/Product"] img').each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src) urls.add(new URL(src, url).href);
    });

    // 5️⃣ Filtrowanie logotypów i śmieci
    const filtered = Array.from(urls).filter(
      (u) =>
        !/logo|sprite|banner|icon|favicon|social|avatar|header|footer|nav|brand|background/i.test(
          u
        )
    );

    // 6️⃣ Ranking prosty
    const ranked = filtered.sort((a, b) => getScore(b) - getScore(a));

    console.log("🧩 Znalazłem obrazy:", ranked.slice(0, limit));
    return ranked.slice(0, limit);
  } catch (e) {
    console.error("❌ findProductImages error:", e);
    return [];
  }
}

// =====================================================
// POMOCNICZE
// =====================================================
function extractLargestFromSrcset(srcset: string): string | null {
  const parts = srcset.split(",").map((s) => s.trim().split(" "));
  const sorted = parts
    .map(([url, size]) => ({
      url,
      px: parseInt(size?.replace(/\D/g, "") || "0"),
    }))
    .sort((a, b) => b.px - a.px);
  return sorted[0]?.url || null;
}

function getScore(url: string): number {
  let s = 0;
  if (/main|full|contain|gallery|hero|large|detail/i.test(url)) s += 100;
  if (/750|1080|1200|1600/.test(url)) s += 50;
  if (/webp|avif/.test(url)) s += 15;
  if (/original|xl|zoom/i.test(url)) s += 20;
  return s;
}

// =====================================================
// AI ANALIZA ZDJĘĆ (GEMINI 2.0 FLASH)
// =====================================================
async function analyzeImagesWithAI(images: string[]): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ Brak GEMINI_API_KEY — pomijam analizę AI");
    return null;
  }

  try {
    const first = images.slice(0, 3);
    const prompt = `
Analyze these product photos and return ONLY the index number (0–${
      first.length - 1
    }) of the one that looks like the main e-commerce product image.

Rules:
- Prefer clear, centered product on neutral background
- Avoid logos, icons, banners, collages, UI, or multiple items
- Respond ONLY with a number (no words)
`;

    // pobierz dane obrazów
    const parts: any[] = [{ text: prompt }];
    for (const imgUrl of first) {
      const buf = await fetchImageBuffer(imgUrl);
      if (!buf) continue;
      parts.push({
        inline_data: { mime_type: "image/png", data: buf.toString("base64") },
      });
    }

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    if (!resp.ok) {
      console.error("Gemini API error:", await resp.text());
      return null;
    }

    const result = await resp.json();
    const txt = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const match = txt.match(/^(\d+)/);
    const index = match ? parseInt(match[1]) : 0;

    if (index >= 0 && index < first.length) {
      console.log(`🤖 AI wybrało index ${index}: ${first[index]}`);
      return first[index];
    }

    console.warn("⚠️ AI nie wskazało poprawnego indeksu:", txt);
    return null;
  } catch (err) {
    console.error("❌ analyzeImagesWithAI error:", err);
    return null;
  }
}

// =====================================================
// Pomocnicze: pobierz obraz jako Buffer
// =====================================================
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!r.ok) return null;
    const ab = await r.arrayBuffer();
    return Buffer.from(ab);
  } catch {
    return null;
  }
}
