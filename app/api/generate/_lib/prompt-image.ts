import { PageContext } from "./scrape-context";

export function buildImagePrompt({
  useCartoon,
  withHuman,
  logoInline,
  extraText,
  pageContext,
  productInfo,
}: {
  useCartoon: boolean;
  withHuman: boolean;
  logoInline: any;
  extraText: string;
  pageContext: PageContext;
  productInfo: string;
}) {
  const personRule = withHuman
    ? `
SCENA Z OSOBĄ:
- Pokaż osobę korzystającą lub używającą produktu w naturalny sposób.
- Osoba powinna wyglądać autentycznie (nie jak model ze stocka).
- Wyraz twarzy: radość, skupienie lub relaks – zależnie od produktu.
- Otoczenie dopasowane do kontekstu ${
        pageContext.targetAudience || "użytkownik"
      }.
- NIE ZMIENIAJ WYGLĄDU/KSZTAŁTU PRODUKTU
`
    : `
SCENA BEZ OSOBY:
- Pokaż produkt w atrakcyjnym otoczeniu.
- Kompozycja estetyczna, profesjonalna.
- Otoczenie dopasowane do kontekstu ${
        pageContext.targetAudience || "użytkownik"
      }.
`;

  const logoRule = logoInline
    ? `
LOGO SKLEPU:
- Umieść logo sklepu w lewym dolnym rogu.
- Logo subtelne, małe, bez tła.
`
    : `
LOGO SKLEPU:
- NIE UMIESZCZAJ żadnego logo, znaku wodnego, brandingu ani elementów dodatkowych.
- Scena ma być całkowicie BEZLOGOWA.
`;

  return `
Create a ${
    useCartoon ? "cartoon-style, artistic" : "realistic, photo-like"
  } advertising scene in 1:1 format.
The scene should look ${
    useCartoon
      ? "like a vector illustration or hand-drawn digital art"
      : "like a real photo"
  }.
Use vibrant but natural lighting and colors.

MULTI-VIEW INPUT:
- Several product photos are provided.
- They ALL represent the SAME product from different angles or in use.
- Use them to understand correct appearance (shape, color, texture).
- The final image must show THIS EXACT product (no modifications).

CRITICAL:
- Use EXACTLY the provided product images WITHOUT MODIFICATIONS
- DO NOT change product color, shape, or details
- DO NOT replace product with another
- Only change background/environment

PRODUCT PLACEMENT:
- Product must be the main focal point
- Keep it clearly visible

${personRule}

PRODUCT CONTEXT (for mood, DO NOT display):
${productInfo}

LANGUAGE:
- All visible text on the image MUST be in Polish.
- Write Polish words ONLY with basic Latin letters (a-z, A-Z) without any accents.
- Prefer words and phrasing that still sound natural to a Polish speaker without diacritics.

TEXT ON IMAGE:
- Create a short Polish marketing headline and, optionally, a very short CTA.
- Text must sound like real Polish advertising copy, just written without diacritics.
- Use simple, clear words and avoid long sentences.
- Avoid words that are hard to read without accents when possible.

${logoRule}

FORBIDDEN:
- Any non‑Polish words or mixed languages
- Obvious spelling mistakes in Polish text
- Frames, banners, UI bars
- Product modifications

Additional mood (do not display):
"${extraText || "none"}"
`.trim();
}
