import { ai } from "./ai";

export interface ImageTextCheckResult {
  extractedText: string;
  issues: string[];
  hasCriticalTypos: boolean;
}

export async function checkImageText(
  imageDataUrl: string,
  expectedText?: string
): Promise<ImageTextCheckResult | null> {
  try {
    if (!imageDataUrl.startsWith("data:")) return null;

    const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) return null;

    const mimeType = match[1];
    const base64 = match[2];

    const prompt = `
Jesteś ekspertem od kreacji reklamowych.

1) Odczytaj cały widoczny tekst z przesłanego obrazu (nagłówki, CTA, małe teksty).
2) Oceń, czy w tym tekście są literówki lub oczywiste błędy w języku polskim.
3) Jeśli podano oczekiwany tekst reklamowy, porównaj z nim treść z obrazu.

Zwróć WYŁĄCZNIE poprawny JSON w formacie:
{
  "extractedText": "...",    // cały tekst z obrazu w jednym polu
  "issues": ["..."] ,         // lista opisów potencjalnych problemów (może być pusta)
  "hasCriticalTypos": true/false // true jeśli są istotne błędy w tekście na obrazie
}

Jeśli nie widzisz żadnego tekstu na obrazie, ustaw extractedText na pusty string i issues na pustą tablicę.

${
  expectedText
    ? `Oczekiwany tekst reklamowy (dla porównania):\n${expectedText}`
    : ""
}
    `;

    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
        },
      ],
    });

    const rawText: string =
      (res as any).text ??
      res.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("\n") ??
      "{}";

    try {
      const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
      return {
        extractedText: parsed.extractedText || "",
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        hasCriticalTypos: Boolean(parsed.hasCriticalTypos),
      };
    } catch {
      return null;
    }
  } catch (e) {
    console.error("❌ checkImageText failed", e);
    return null;
  }
}
