import { toPng } from "html-to-image";
import { QuranVerse } from "@/app/api/verses/route";

export async function downloadVerseCardImage(
  element: HTMLElement,
  verse: QuranVerse
): Promise<void> {
  // Filename safe format: Surah-Hud-11-114-Verse-of-the-day.png
  const safeSurahName = verse.surahNameEnglish.replace(/[^a-zA-Z0-9]/g, "-");
  const fileName = `Surah-${safeSurahName}-${verse.surahNumber}-${verse.numberInSurah}.png`;

  try {
    // Generate high-resolution 2.5x retina PNG
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2.5,
      cacheBust: true,
      filter: (node) => {
        // Exclude elements marked with data-export-ignore (e.g. interactive audio player buttons)
        if (node instanceof HTMLElement && node.dataset.exportIgnore === "true") {
          return false;
        }
        return true;
      },
    });

    // Create temporary download link and trigger download
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.warn("Primary html-to-image export failed, attempting canvas fallback:", error);
    await fallbackCanvasDownload(verse, fileName);
  }
}

// Fallback high-resolution canvas generator (1080x1440 HD Poster)
async function fallbackCanvasDownload(verse: QuranVerse, fileName: string): Promise<void> {
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

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

  // Trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
