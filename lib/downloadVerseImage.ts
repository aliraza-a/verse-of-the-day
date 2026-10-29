import { QuranVerse } from "@/app/api/verses/route";
import { getBackgroundForAyah } from "./backgrounds";

// Helper to convert Latin numerals to Eastern Arabic numerals
function toArabicNumerals(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join("");
}

export function getVerseFileName(verse: QuranVerse): string {
  const safeSurahName = verse.surahNameEnglish.replace(/[^a-zA-Z0-9]/g, "-");
  return `Surah-${safeSurahName}-${verse.surahNumber}-${verse.numberInSurah}.png`;
}

export interface GeneratedVerseImage {
  dataUrl: string;
  blob: Blob;
  file: File;
  fileName: string;
}

// Check if current device is iOS (iPhone/iPad/iPod or iPad in MacIntel mode)
export function isIOS(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

// Generate the high-resolution 1080x1440 HD Poster directly via HTML5 Canvas
// This guarantees:
// 1. Never transparent (always solid photo + scrim)
// 2. No SVG foreignObject WebKit/Safari bugs
// 3. Crisp text with Amiri Arabic calligraphy and English translation
export async function generateHDVerseCard(
  verse: QuranVerse
): Promise<GeneratedVerseImage> {
  const fileName = getVerseFileName(verse);
  const width = 1080;
  const height = 1440;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }

  // 1. Draw solid base background (prevents transparency)
  ctx.fillStyle = "#061316";
  ctx.fillRect(0, 0, width, height);

  // 2. Load and draw the background photo
  const bg = getBackgroundForAyah(verse.number, false);
  if (bg?.url) {
    try {
      // Use proxy endpoint to guarantee no CORS taint on iOS Safari / PWA
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(bg.url)}`;
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => {
          // If proxy fails, try direct URL
          img.onerror = () => reject(new Error("Image failed to load"));
          img.src = bg.url;
        };
        img.src = proxyUrl;
      });

      // Draw image centered with 'cover' aspect ratio
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = height * imgAspect;
        offsetX = -(drawWidth - width) / 2;
      } else {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetY = -(drawHeight - height) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
      console.warn("Could not load background image, using luxury gradient:", e);
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#061316");
      grad.addColorStop(0.5, "#0d2b32");
      grad.addColorStop(1, "#081c20");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 3. Draw dual-layer contrast scrims (ensures crisp WCAG text contrast)
  const linearScrim = ctx.createLinearGradient(0, 0, 0, height);
  linearScrim.addColorStop(0, "rgba(6, 19, 22, 0.55)");
  linearScrim.addColorStop(0.35, "rgba(6, 19, 22, 0.45)");
  linearScrim.addColorStop(0.75, "rgba(6, 19, 22, 0.82)");
  linearScrim.addColorStop(1, "rgba(6, 19, 22, 0.95)");
  ctx.fillStyle = linearScrim;
  ctx.fillRect(0, 0, width, height);

  // Radial dark vignette
  const radialVignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    width * 0.75
  );
  radialVignette.addColorStop(0, "rgba(0, 0, 0, 0.15)");
  radialVignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
  ctx.fillStyle = radialVignette;
  ctx.fillRect(0, 0, width, height);

  // 4. Draw outer ornamental border
  ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  ctx.lineWidth = 3;
  roundRect(ctx, 40, 40, width - 80, height - 80, 36);
  ctx.stroke();

  // Wait for web fonts if possible
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (err) {
      // Ignore font wait error
    }
  }

  // 5. Header: "✦ AYAH OF THE DAY ✦"
  ctx.textAlign = "center";
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("✦ AYAH OF THE DAY ✦", width / 2, 120);

  // 6. Surah Title: e.g. "Surah Hud (11:114)"
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `Surah ${verse.surahNameEnglish} ${verse.surahNumber}:${verse.numberInSurah}`,
    width / 2,
    180
  );

  // 7. Subtitle pills (Meaning • Revelation • Juz)
  ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
  ctx.font = "500 22px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `(${verse.surahNameMeaning})  •  ${verse.revelationType}  •  Juz ${verse.juz}`,
    width / 2,
    225
  );

  // 8. Arabic Calligraphy text with Amiri font
  ctx.fillStyle = "#ecfdf5";
  ctx.font = "52px 'Amiri', 'Traditional Arabic', serif";
  const arabicWithMarker = `${verse.arabicText} ﴿${toArabicNumerals(verse.numberInSurah)}﴾`;
  const arabicEndY = wrapCenteredText(
    ctx,
    arabicWithMarker,
    width / 2,
    330,
    width - 160,
    88,
    true
  );

  // 9. Ornamental Islamic Star divider
  const dividerY = Math.max(arabicEndY + 50, 750);
  ctx.fillStyle = "#34d399";
  ctx.font = "28px system-ui, sans-serif";
  ctx.fillText("✦ ۞ ✦", width / 2, dividerY);

  // 10. English Translation
  ctx.fillStyle = "#f8fafc";
  ctx.font = "normal 32px Georgia, 'Times New Roman', serif";
  wrapCenteredText(
    ctx,
    `“${verse.englishText}”`,
    width / 2,
    dividerY + 70,
    width - 180,
    54,
    false
  );

  // 11. Bottom Attribution Branding
  ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
  ctx.font = "500 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    "Inspiration • Verse of the Day • Translation: Saheeh International",
    width / 2,
    height - 85
  );

  // Convert to Blob and File
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas blob conversion failed"));
      },
      "image/png",
      1.0
    );
  });

  const file = new File([blob], fileName, { type: "image/png" });
  const dataUrl = canvas.toDataURL("image/png");

  return { dataUrl, blob, file, fileName };
}

// Download or Save HD image to phone
export async function downloadOrSaveHDImage(
  verse: QuranVerse
): Promise<{ success: boolean; dataUrl: string; fileName: string }> {
  const { dataUrl, blob, file, fileName } = await generateHDVerseCard(verse);

  // On iOS / iPhone (especially inside standalone PWA):
  // The official native way to save a photo to the camera roll is through the Web Share Sheet
  // (which provides the direct "Save Image" action into the iPhone Photos app).
  if (isIOS() && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`,
      });
      return { success: true, dataUrl, fileName };
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return { success: true, dataUrl, fileName }; // User closed share sheet
      }
      console.warn("iOS file share failed:", err);
    }
  }

  // Desktop & Android fallback: standard file download trigger
  try {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    return { success: true, dataUrl, fileName };
  } catch (err) {
    console.warn("Direct file download link failed:", err);
    return { success: false, dataUrl, fileName };
  }
}

// Share HD Image directly to WhatsApp
export async function shareHDImageToWhatsApp(
  verse: QuranVerse
): Promise<{ success: boolean; dataUrl: string }> {
  const { dataUrl, blob, file, fileName } = await generateHDVerseCard(verse);

  const shareText = `"${verse.arabicText}"\n\n"${verse.englishText}"\n\n— Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})\n\nReflect on the Verse of the Day`;

  // On iPhone / Android: navigator.share with files attaches the image directly to WhatsApp!
  if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`,
        text: shareText,
      });
      return { success: true, dataUrl };
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return { success: true, dataUrl }; // User cancelled share sheet
      }
      console.warn("File sharing not supported or failed:", err);
    }
  }

  // Desktop fallback: Download the image and launch WhatsApp Web with message
  try {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 5000);
  } catch (e) {
    // ignore
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, "_blank");
  return { success: true, dataUrl };
}

// Helper to draw rounded rectangle on canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper to wrap centered text on canvas
function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  isRtl: boolean
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = startY;

  ctx.direction = isRtl ? "rtl" : "ltr";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), centerX, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), centerX, currentY);
  return currentY;
}
