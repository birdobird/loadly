import * as cheerio from "cheerio";


export async function findProductImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LoadlyBot/1.0)" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const meta = $(
      'meta[property="og:image"], meta[name="twitter:image"]'
    ).attr("content");
    if (meta && !isLogo(meta)) return absoluteUrl(url, meta);

    const imgs = $("img")
      .map((_, el) => $(el).attr("src") || "")
      .get()
      .filter(Boolean)
      .map((src) => absoluteUrl(url, src))
      .filter((src) => !isLogo(src) && isImage(src));

    const candidates = imgs.filter((src) =>
      /product|item|photo|pack|sku|gallery|main/i.test(src)
    );

    if (candidates.length > 0) return candidates[0];
    if (imgs.length > 0) return imgs[0];

    return null;
  } catch (err) {
    console.error("findProductImage error:", err);
    return null;
  }
}

function isLogo(url: string) {
  return /logo|icon|favicon|sprite|banner|header|brand/i.test(url);
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
}

function absoluteUrl(base: string, relative: string) {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}
