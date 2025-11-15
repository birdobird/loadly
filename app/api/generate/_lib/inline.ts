export async function inline(url: string, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const arrayBuffer: ArrayBuffer = await res.arrayBuffer();
      let buf = Buffer.from(arrayBuffer);
      let mimeType =
        res.headers.get("content-type")?.split(";")[0].trim() || "image/png";

      if (mimeType === "image/webp" || mimeType === "image/avif") {
        try {
          const sharp = (await import("sharp")).default;
          const converted = await sharp(buf).png().toBuffer();
          const arrayBuffer = converted.buffer as ArrayBuffer;
          buf = Buffer.from(arrayBuffer);
          mimeType = "image/png";
          console.log(`🧩 Converted ${url} → PNG`);
        } catch (e) {
          console.warn(
            "⚠️ Błąd konwersji WebP/AVIF → PNG:",
            String(e).slice(0, 100)
          );
        }
      }

      return {
        inlineData: {
          mimeType,
          data: buf.toString("base64"),
        },
      };
    } catch (err) {
      console.warn(
        `⚠️ Próba ${attempt}/${maxRetries} nieudana dla ${url}:`,
        (err as Error).message
      );
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }

  console.error(
    `❌ Nie udało się pobrać obrazu po ${maxRetries} próbach: ${url}`
  );
  return null;
}
