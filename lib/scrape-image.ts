import * as cheerio from "cheerio";

export async function findProductImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LoadlyBot/1.0)" },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let imgs = $("img")
      .map((_, el) => $(el).attr("src") || "")
      .get()
      .filter(Boolean)
      .map((src) => absoluteUrl(url, src))
      .filter((src) => isImage(src) && !isLogo(src));

    if (imgs.length === 0) return null;

    // WEBP ZAWSZE PRIORITY
    imgs = sortImages(imgs);

    return imgs[0];
  } catch {
    return null;
  }
}

function isLogo(url: string) {
  return /logo|favicon|sprite|icon|banner|header|brand/i.test(url);
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

// WEBP FIRST + LARGEST
function sortImages(list: string[]) {
  return list.sort((a, b) => {
    const aw = a.endsWith(".webp");
    const bw = b.endsWith(".webp");
    if (aw && !bw) return -1;
    if (!aw && bw) return 1;
    return extractSize(b) - extractSize(a);
  });
}

function extractSize(url: string) {
  const match = url.match(/(\d{3,4})[x_](\d{3,4})/);
  if (!match) return 0;
  return parseInt(match[1]) * parseInt(match[2]);
}
