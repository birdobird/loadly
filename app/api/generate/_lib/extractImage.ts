export function extractImage(resp: any): string | null {
  const parts = resp.candidates?.[0]?.content?.parts ?? resp.parts ?? [];
  const img = parts.find((p: any) => p.inlineData && p.inlineData.data);
  return img ? `data:${img.inlineData.mimeType};base64,${img.inlineData.data}` : null;
}
