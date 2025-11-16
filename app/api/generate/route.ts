export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { q } from "@/lib/db";

import { inline } from "./_lib/inline";
import { scrapePageContext } from "./_lib/scrape-context";
import { findProductImages } from "@/lib/scrape-image";
import { findStoreLogo } from "@/lib/scrape-logo";
import { generateText } from "./_lib/generate-text";
import { generateImage } from "./_lib/generate-image";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Musisz być zalogowany, aby generować kreacje." },
        { status: 401 }
      );
    }

    const email = session.user.email;

    let userRes = await q("SELECT id FROM users WHERE email=$1", [email]);

    if (!userRes.rows.length) {
      await q("INSERT INTO users (email) VALUES ($1)", [email]);
      userRes = await q("SELECT id FROM users WHERE email=$1", [email]);
    }

    const userId = userRes.rows[0].id;

    let subRes = await q(
      `SELECT s.id, s.plan, s.credits_remaining
       FROM subscriptions s
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [userId]
    );

    let sub = subRes.rows[0];

    if (!sub) {
      const insert = await q(
        `INSERT INTO subscriptions (user_id, plan, credits_remaining)
         VALUES ($1, 'free', 1)
         RETURNING id, plan, credits_remaining`,
        [userId]
      );
      sub = insert.rows[0];
    }

    if (sub.credits_remaining <= 0) {
      return NextResponse.json(
        { error: "Wykorzystano wszystkie dostępne kreacje." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const url = body.url;
    const imageUrl = body.imageUrl;
    const withHuman = body.withHuman ?? true;
    const extraText = body.extraText ?? "";
    const useLogo = body.useLogo ?? true;
    const useCartoon = body.useCartoon ?? false;

    if (!url && !imageUrl) {
      return NextResponse.json(
        { error: "Brak URL produktu lub zdjęcia." },
        { status: 400 }
      );
    }

    const pageContext = url
      ? await scrapePageContext(url)
      : { title: "Produkt", description: "" };

    const productImages = url ? await findProductImages(url) : [];
    const productImage = imageUrl || productImages[0] || "";

    if (!productImage) {
      return NextResponse.json(
        { error: "Nie znaleziono zdjęcia produktu." },
        { status: 400 }
      );
    }

    const storeLogo = useLogo && url ? await findStoreLogo(url) : null;

    const [productInline, logoInline] = await Promise.all([
      inline(productImage),
      storeLogo ? inline(storeLogo) : null,
    ]);

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

    const watermark = sub.plan === "free";

    await q(
      `INSERT INTO posts 
        (user_id, source_url, source_image_url, generated_image_url, caption, watermark)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        url || "",
        productImage,
        variants.A.image,
        variants.A.postDescription || "",
        watermark,
      ]
    );

    await q(
      "UPDATE subscriptions SET credits_remaining = credits_remaining - 1 WHERE id=$1",
      [sub.id]
    );

    return NextResponse.json({
      ok: true,
      variants,
      pageContext,
      infoMessage: "Kredyt został wykorzystany. Kreacje wygenerowane.",
    });
  } catch (err) {
    console.error("❌ ERROR /api/generate", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
