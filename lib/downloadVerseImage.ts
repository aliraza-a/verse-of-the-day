import { toPng } from "html-to-image";
import { QuranVerse } from "@/app/api/verses/route";

export function getVerseFileName(verse: QuranVerse): string {
  const safeSurahName = verse.surahNameEnglish.replace(/[^a-zA-Z0-9]/g, "-");
  return `Surah-${safeSurahName}-${verse.surahNumber}-${verse.numberInSurah}.png`;
}

// Generate the high-resolution 2.5x retina PNG data URL
export async function generateVerseCardDataUrl(
  element: HTMLElement,
  verse: QuranVerse
): Promise<{ dataUrl: string; fileName: string }> {
  const fileName = getVerseFileName(verse);

  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2.5,
      cacheBust: true,
      filter: (node) => {
        // Exclude interactive elements from the wallpaper image
        if (node instanceof HTMLElement && node.dataset.exportIgnore === "true") {
          return false;
        }
        return true;
      },
    });
    return { dataUrl, fileName };
  } catch (error) {
    console.warn("Primary html-to-image export failed, attempting canvas fallback:", error);
    const dataUrl = await generateCanvasFallbackDataUrl(verse);
    return { dataUrl, fileName };
  }
}

// Download HD image directly to device
export async function downloadVerseCardImage(
  element: HTMLElement,
  verse: QuranVerse
): Promise<void> {
  const { dataUrl, fileName } = await generateVerseCardDataUrl(element, verse);

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Direct share HD image to WhatsApp
export async function shareVerseCardToWhatsApp(
  element: HTMLElement,
  verse: QuranVerse
): Promise<void> {
  const { dataUrl, fileName } = await generateVerseCardDataUrl(element, verse);

  const shareText = `"${verse.arabicText}"\n\n"${verse.englishText}"\n\n— Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`;

  try {
    // Convert dataUrl to a native File object for mobile Web Share
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: "image/png" });

    // On iOS Safari and Android Chrome, navigator.canShare({ files: [file] }) is supported!
    if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`,
        text: shareText,
      });
      return;
    }
  } catch (err: unknown) {
    if ((err as Error)?.name === "AbortError") {
      return; // User canceled the share prompt
    }
    console.warn("File sharing not supported or canceled, falling back to direct WhatsApp link:", err);
  }

  // Fallback for desktop / browsers where files cannot be passed directly into Web Share:
  // 1. Download the HD image automatically
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 2. Open WhatsApp Web / App with pre-filled message
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, "_blank");
}

// Fallback high-resolution canvas generator (1080x1440 HD Poster)
async function generateCanvasFallbackDataUrl(verse: QuranVerse): Promise<string> {
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background deep dark teal gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#061316");
  bgGrad.addColorStop(0.5, "#0b2025");
  bgGrad.addColorStop(1, "#051013");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Inner border frame
  ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Label: AYAH OF THE DAY
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ AYAH OF THE DAY ✦", width / 2, 120);

  // Surah Reference
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px -apple-system, sans-serif";
  ctx.fillText(`Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`, width / 2, 190);

  // Meaning & Type
  ctx.fillStyle = "#94a3b8";
  ctx.font = "24px -apple-system, sans-serif";
  ctx.fillText(`${verse.surahNameMeaning} • ${verse.revelationType} • Juz ${verse.juz}`, width / 2, 240);

  // Arabic Calligraphy Text
  ctx.fillStyle = "#ecfdf5";
  ctx.font = "44px 'Amiri', 'Traditional Arabic', serif";
  wrapText(ctx, verse.arabicText, width / 2, 400, width - 160, 80, true);

  // Divider
  ctx.fillStyle = "#34d399";
  ctx.font = "28px sans-serif";
  ctx.fillText("✦ ۞ ✦", width / 2, 750);

  // English Translation
  ctx.fillStyle = "#f1f5f9";
  ctx.font = "italic 32px Georgia, serif";
  wrapText(ctx, `“${verse.englishText}”`, width / 2, 850, width - 180, 56, false);

  // Attribution
  ctx.fillStyle = "#64748b";
  ctx.font = "20px -apple-system, sans-serif";
  ctx.fillText("Verse of the Day • Translation: Saheeh International", width / 2, height - 80);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  isRtl: boolean
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  ctx.direction = isRtl ? "rtl" : "ltr";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
