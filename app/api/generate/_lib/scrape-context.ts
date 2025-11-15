import * as cheerio from "cheerio";

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

    const priceText = $("body").text();
    const match = priceText.match(/(\d+[.,]?\d*)\s?(zł|pln)/i);
    if (match) context.price = `${match[1].replace(",", ".")} zł`;

    const body = $("body").text().toLowerCase();

    const kidsPattern = /(dzieci(?!ęcy)|niemowl(?!ę)|zabawka(?!r)|bajk(?!a))/i;
    const womenPattern = /(kobiet|damsk|biżuteri|torebk|kosmetyk)/i;
    const menPattern = /(mężczyzn|męsk|zarost|golenie)/i;
    const sportPattern = /(sport|fitness|trening|rower|joga|bieganie)/i;
    const travelPattern = /(podróż|turyst|walizk|samolot|camping|plecak)/i;
    const officePattern =
      /(biuro|pracownik|laptop|notatnik|krzesło|ergonomiczny)/i;

    if (travelPattern.test(body)) context.targetAudience = "podróżnicy";
    else if (sportPattern.test(body)) context.targetAudience = "sportowcy";
    else if (officePattern.test(body))
      context.targetAudience = "pracownicy biurowi";
    else if (womenPattern.test(body)) context.targetAudience = "kobiety";
    else if (menPattern.test(body)) context.targetAudience = "mężczyźni";
    else if (kidsPattern.test(body)) {
      // dodatkowa kontrola – żeby nie myliło się z „bezpieczne dla dzieci”
      if (
        !/dla\s+dzieci\s+i\s+dorosłych|bezpieczne\s+dla\s+dzieci/.test(body)
      ) {
        context.targetAudience = "dzieci";
      } else {
        context.targetAudience = "wszyscy";
      }
    } else {
      context.targetAudience = "wszyscy";
    }
  } catch (e) {
    console.error("❌ Błąd scrapePageContext", e);
  }
  return context;
}
