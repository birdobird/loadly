import { ai } from "./ai";
import { PageContext } from "./scrape-context";

export async function generateText(
  context: PageContext,
  extraText: string,
  key: "A" | "B"
) {
  const prompt = `
Jesteś ekspertem Meta Ads i copywriterem konwertujących postów.
Napisz treści w języku polskim, dynamiczne, naturalne i dopasowane do produktu.

Dane o produkcie:
${JSON.stringify(context)}

Dodatkowy kontekst kampanii:
"${extraText || "brak"}"

Wygeneruj WERSJĘ: ${key === "A" ? "emocjonalną" : "sprzedażową"}

🔹 Wymagania:
- headline: 1–4 słowa, mocne, chwytliwe
- postDescription: 2–4 zdania (maks 350 znaków)
- MUSZĄ BYĆ nowe linie (Enter)
- dodaj 3–6 hashtagów dopasowanych do produktu (po polsku lub mix PL/EN)
- ZERO emotek stockowych typu 😂💯🔥 (max 1–2 delikatne emotki są OK)

Zwróć poprawny JSON:
{
  "headline": "...",
  "postDescription": "..."
}
`;

  const txtRes = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });

  const rawText: string =
    (txtRes as any).text ??
    txtRes.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("\n") ??
    "{}";

  let headline = "Nowa inspiracja!";
  let postDescription = "Odkryj coś wyjątkowego! 🌟 Sprawdź teraz!";
  try {
    const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    if (parsed.headline) headline = parsed.headline;
    if (parsed.postDescription) postDescription = parsed.postDescription;
  } catch {}
  return { headline, postDescription };
}
