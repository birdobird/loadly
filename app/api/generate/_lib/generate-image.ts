import { ai } from "./ai";
import { extractImage } from "./extractImage";
import { inline } from "./inline";
import { buildImagePrompt } from "./prompt-image";
import { PageContext } from "./scrape-context";

interface ImageParams {
  key: "A" | "B";
  pageContext: PageContext;
  extraText: string;
  productImage: string;
  productImages: string[];
  withHuman: boolean;
  useCartoon: boolean;
  productInline: any;
  logoInline: any;
}

export async function generateImage(params: ImageParams) {
  const { key, pageContext, extraText, productImage, productImages, withHuman, useCartoon, productInline, logoInline } =
    params;

  const productInfo = `
Tytuł: ${pageContext.title}
Opis: ${pageContext.description}
${pageContext.price ? `Cena: ${pageContext.price}` : ""}
Grupa docelowa: ${pageContext.targetAudience || "wszyscy"}
`.trim();

  const imgPrompt = buildImagePrompt({
    useCartoon,
    withHuman,
    logoInline,
    extraText,
    pageContext,
    productInfo,
  });

  const imgs = (productImages.length ? productImages : [productImage]).slice(0, 5);
  const productInlines = await Promise.all(imgs.map((i) => inline(i)));
  const parts: any[] = [{ text: imgPrompt }, ...productInlines];
  if (logoInline) parts.push(logoInline);

  const imgRes = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ parts }],
    config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
  });

  let image = extractImage(imgRes);
  if (!image) {
    const retryParts = [{ text: imgPrompt }, productInline];
    const retry = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts: retryParts }],
      config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
    });
    image = extractImage(retry);
  }

  return image;
}
