export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import * as cheerio from "cheerio";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Brak URL produktu" }, { status: 400 });
    }

    console.log("🔍 Fetching product page:", url);

    const page = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await page.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text() ||
      $("title").text() ||
      "Produkt";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    let img =
      $('meta[property="og:image"]').attr("content") ||
      $("img").first().attr("src") ||
      "";

    if (img && !img.startsWith("http")) {
      const base = new URL(url);
      img = `${base.origin}${img.startsWith("/") ? img : "/" + img}`;
    }

    console.log("📦 Extracted product:", { title, description, img });

    // --------------------------------------------
    // 1) GENERATE AD COPY
    // --------------------------------------------
    const adCopy = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś ekspertem od pisania reklam na Instagram/Facebook w języku polskim.",
        },
        {
          role: "user",
          content: `
Napisz:
1. Nagłówek (max 40 znaków)
2. Tekst posta (max 150 znaków, dynamiczny, emocjonalny)

Produkt:
Tytuł: ${title}
Opis: ${description}
          `,
        },
      ],
    });

    const copy = adCopy.choices[0].message?.content || "";
    console.log("📝 Generated copy:", copy);

    const [headline, text] = copy.split("\n").map((s) => s.replace(/^[0-9\.\- ]+/g, ""));

    // --------------------------------------------
    // 2) GENERATE AD IMAGE (GOTOWY POST)
    // --------------------------------------------
    const imagePrompt = `
Create a professional square social media ad.
Product: ${title}
Description: ${description}
Style: modern, minimalist, aesthetic, clean, high-converting.
Use product image: ${img}
Bright colors, strong contrast, premium look.
`;

    const imageRes = await openai.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024",
    });

    const adImage = imageRes.data?.[0].url;

    console.log("🎨 Generated ad image:", adImage);

    return NextResponse.json({
      ok: true,
      headline,
      text,
      image: adImage,
      title,
      description,
    });
  } catch (err) {
    console.error("❌ Error generating ad:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
