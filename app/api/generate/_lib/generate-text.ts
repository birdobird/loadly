import { ai } from "./ai";
import { PageContext } from "./scrape-context";

export async function generateText(context: PageContext, extraText: string, key: "A" | "B") {
  const prompt = `
Jesteś ekspertem od pisania krótkich, emocjonalnych tekstów reklamowych (Meta Ads).
Dane o produkcie:
${JSON.stringify(context)}
Dodatkowy kontekst kampanii: "${extraText || "brak"}"
Wygeneruj ${key === "A" ? "emocjonalną" : "sprzedażową"} wersję reklamy.
Zwróć JSON:
{
  "headline": "1–4 słowa po polsku",
  "postDescription": "opis posta 150–250 znaków po polsku"
}`;

  const txtRes = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });

  const rawText: string =
    (txtRes as any).text ??
    txtRes.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("\n") ??
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
