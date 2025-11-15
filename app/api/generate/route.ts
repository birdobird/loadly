export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { inline } from "./_lib/inline";
import { extractImage } from "./_lib/extractImage";
import { scrapePageContext } from "./_lib/scrape-context";
import { findProductImages } from "@/lib/scrape-image";
import { findStoreLogo } from "@/lib/scrape-logo";
import { generateText } from "./_lib/generate-text";
import { generateImage } from "./_lib/generate-image";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string | undefined = body.url;
    const imageUrl: string | undefined = body.imageUrl;
    const withHuman: boolean = body.withHuman ?? true;
    const extraText: string = body.extraText ?? "";
    const useLogo: boolean = body.useLogo ?? true;
    const useCartoon: boolean = body.useCartoon ?? false;

    if (!url && !imageUrl)
      return NextResponse.json(
        { error: "Brak URL produktu lub zdjęcia" },
        { status: 400 }
      );

    const pageContext = url
      ? await scrapePageContext(url)
      : { title: "Produkt", description: "" };
    let productImages = url ? await findProductImages(url) : [];
    let productImage = imageUrl || productImages[0] || "";

    if (!productImage)
      return NextResponse.json(
        { error: "Brak zdjęcia produktu" },
        { status: 400 }
      );

    const storeLogo = useLogo && url ? await findStoreLogo(url) : null;
    const [productInline, logoInlineResult] = await Promise.all([
      inline(productImage),
      storeLogo ? inline(storeLogo) : Promise.resolve(null),
    ]);

    if (!productInline) {
      console.warn(
        "⚠️ Nie udało się zinline’ować głównego obrazu, pomijam logo."
      );
    }

    const logoInline = logoInlineResult;
    const variants: any = {};

    await Promise.all(
      (["A", "B"] as const).map(async (key) => {
        const text = await generateText(pageContext, extraText, key);
        const image = await generateImage({
          key,
          pageContext,
          extraText,
          productImage,
          productImages,
          withHuman,
          useCartoon,
          productInline,
          logoInline,
        });
        variants[key] = { ...text, image };
      })
    );

    return NextResponse.json({ ok: true, variants, pageContext });
  } catch (err) {
    console.error("❌ ERROR /api/generate", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
