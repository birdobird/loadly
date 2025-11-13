import * as cheerio from "cheerio";

export async function findStoreLogo(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LoadlyBot/1.0)" },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const logo =
      $('img[src*="logo"]').attr("src") ||
      $('img[alt*="logo"]').attr("src") ||
      $('meta[property="og:logo"]').attr("content") ||
      null;

    if (logo) return absoluteUrl(url, logo);

    return null;
  } catch {
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
