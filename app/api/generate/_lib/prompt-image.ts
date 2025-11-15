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
- Logo powinno być małe, subtelne, bez dodatkowego tła.
- Jeśli logo ma białe/kolorowe tło, usuń je - logo powinno być przezroczyste.
- Nie dodawaj ramek, pasków ani żadnych elementów wokół logo.
`
    : "";

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

LANGUAGE:
All text MUST be in POLISH language.

PRODUCT PLACEMENT:
- Product must be the main focal point
- Keep it clearly visible

${personRule}

PRODUCT CONTEXT (for mood, DO NOT display):
${productInfo}

TEXT ON IMAGE:
- Use Polish text only
- Font: modern, readable
- No product descriptions, specs, or prices

TEXT RENDERING PRIORITY:
- The following text must appear EXACTLY as written, in correct Polish letters.
- Do NOT translate or modify it.
- Ensure correct diacritics: ą, ć, ę, ł, ń, ó, ś, ź, ż.
- The text must be perfectly legible, without misspellings.

${logoRule}

FORBIDDEN:
- Frames, banners, bars
- Non-Polish text
- Product modifications

Additional mood (do not display):
"${extraText || "none"}"
`.trim();
}
