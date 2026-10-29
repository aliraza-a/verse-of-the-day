"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Download,
  Heart,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Loader2,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuranVerse } from "@/app/api/verses/route";
import { getBackgroundForAyah } from "@/lib/backgrounds";
import { useFavorites } from "@/context/FavoritesContext";
import { useAudio } from "@/context/AudioContext";
import { VerseCard } from "@/components/VerseCard";
import {
  downloadOrSaveHDImage,
  shareHDImageToWhatsApp,
  isIOS,
} from "@/lib/downloadVerseImage";

interface DetailViewModalProps {
  verse: QuranVerse | null;
  allVerses: QuranVerse[];
  onClose: () => void;
  onSelectVerse: (verse: QuranVerse) => void;
}

// Authentic WhatsApp SVG Icon
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Convert Latin numerals to Eastern Arabic numerals (e.g. 114 -> ١١٤)
function toArabicNumerals(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join("");
}

export function DetailViewModal({
  verse,
  allVerses,
  onClose,
  onSelectVerse,
}: DetailViewModalProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { activeVerse, isPlaying, togglePlay, audioError } = useAudio();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharingWhatsApp, setSharingWhatsApp] = useState(false);
  const [savedPreviewUrl, setSavedPreviewUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when active verse changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [verse?.number]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (savedPreviewUrl) {
          setSavedPreviewUrl(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, savedPreviewUrl]);

  if (!verse) return null;

  const liked = isFavorite(verse.number);
  const isCurrentAudioPlaying = isPlaying && activeVerse?.number === verse.number;
  const bg = getBackgroundForAyah(verse.number, false);

  // Other verses for "More to explore"
  const moreVerses = allVerses.filter((v) => v.number !== verse.number);

  const handleCopy = async () => {
    const text = `"${verse.arabicText}"\n\n"${verse.englishText}"\n\n— Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy failed:", e);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await downloadOrSaveHDImage(verse);
      if (isIOS() && res.dataUrl) {
        // Also provide preview sheet so iPhone PWA users can tap-and-hold if share sheet was dismissed
        setSavedPreviewUrl(res.dataUrl);
      }
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    if (sharingWhatsApp) return;
    setSharingWhatsApp(true);
    try {
      await shareHDImageToWhatsApp(verse);
    } catch (e) {
      console.error("WhatsApp share failed:", e);
    } finally {
      setSharingWhatsApp(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#061316]/95 backdrop-blur-xl flex flex-col overflow-hidden"
      >
        {/* Detail View Header */}
        <div className="shrink-0 w-full max-w-4xl mx-auto px-4 h-14 pt-[env(safe-area-inset-top)] box-content flex items-center justify-between border-b border-[#0f272d]/40">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-slate-300 hover:text-white py-1 px-2 -ml-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-sm font-medium">Inspiration</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Quick WhatsApp Share in Header */}
            <button
              onClick={handleShareWhatsApp}
              disabled={sharingWhatsApp}
              aria-label="Share HD image to WhatsApp"
              title="Share to WhatsApp"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/15 transition-colors cursor-pointer"
            >
              {sharingWhatsApp ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#25D366]" />
              ) : (
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              )}
            </button>

            {/* Quick Download in Header */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Save HD image"
              title="Save HD Wallpaper"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              ) : (
                <Download className="w-5 h-5 text-emerald-400" />
              )}
            </button>

            <button
              onClick={onClose}
              aria-label="Close detail view"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors sm:flex hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-4 sm:py-6 no-scrollbar pb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Hero Card */}
            <motion.div
              layoutId={`verse-card-${verse.number}`}
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#163842]/40 bg-[#0b1e22] text-white flex flex-col p-6 sm:p-8"
            >
              {/* Photo Background & Scrim */}
              {bg && (
                <>
                  <Image
                    src={bg.url}
                    alt={bg.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 680px"
                    priority
                    crossOrigin="anonymous"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/90" />
                  <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/70" />
                </>
              )}

              {/* Card Meta & Title */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ayah of the Day
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  {verse.surahNameEnglish} {verse.surahNumber}:{verse.numberInSurah}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 backdrop-blur-xs font-medium">
                    {verse.surahNameMeaning}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 backdrop-blur-xs font-medium">
                    {verse.revelationType} • Juz {verse.juz}
                  </span>
                </div>
              </div>

              {/* Uthmani Arabic Calligraphy */}
              <div
                dir="rtl"
                className="relative z-10 my-6 text-center font-arabic text-2xl sm:text-3xl leading-[2.2] text-emerald-50 select-text px-2"
              >
                {verse.arabicText}
                <span className="inline-block mx-2 text-emerald-400 font-bold text-xl select-none">
                  ﴿{toArabicNumerals(verse.numberInSurah)}﴾
                </span>
              </div>

              {/* Ornamental divider */}
              <div className="relative z-10 flex items-center justify-center gap-3 w-full max-w-xs mx-auto text-emerald-400/50 select-none my-2">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-400/50" />
                <span className="text-xs">✦ ۞ ✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-400/50" />
              </div>

              {/* English Translation */}
              <div className="relative z-10 my-4 text-center">
                <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-normal italic">
                  &ldquo;{verse.englishText}&rdquo;
                </p>
                <p className="text-xs text-white/60 mt-3 font-medium">
                  Translation: Saheeh International
                </p>
              </div>

              {/* Audio Recitation Button */}
              {verse.audioUrl && (
                <div className="relative z-10 mt-4 flex items-center justify-center">
                  <button
                    onClick={() => togglePlay(verse)}
                    aria-label={isCurrentAudioPlaying ? "Pause audio" : "Play audio"}
                    className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isCurrentAudioPlaying
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-105"
                        : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
                    }`}
                  >
                    {isCurrentAudioPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4 animate-pulse" />
                        <span>Playing Recitation</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-300" />
                        <span>Listen (Mishary Alafasy)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {audioError && (
                <p className="relative z-10 text-[11px] text-amber-300 text-center mt-2">
                  Audio streaming momentarily unavailable for this ayah.
                </p>
              )}
            </motion.div>

            {/* Engagement Action Row (WhatsApp, Save Image, Bookmark, Copy) */}
            <div className="w-full flex items-center justify-between gap-2 py-4 mt-1 border-b border-[#0f272d]/60 text-slate-300 overflow-x-auto no-scrollbar">
              {/* WhatsApp Share Button */}
              <button
                onClick={handleShareWhatsApp}
                disabled={sharingWhatsApp}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/35 hover:bg-[#25D366]/25 active:scale-95 transition-all cursor-pointer shrink-0 font-semibold text-xs"
              >
                {sharingWhatsApp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#25D366]" />
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </>
                )}
              </button>

              {/* Save / Download Image Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25 active:scale-95 transition-all cursor-pointer shrink-0 font-semibold text-xs"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Save Photo</span>
                  </>
                )}
              </button>

              {/* Bookmark / Like Button */}
              <button
                onClick={() => toggleFavorite(verse)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0 text-xs font-semibold"
              >
                <Heart
                  className={`w-4 h-4 ${
                    liked ? "fill-red-500 text-red-500" : "text-slate-300"
                  }`}
                />
                <span>{liked ? "Saved" : "Save"}</span>
              </button>

              {/* Copy Verse Text Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* "More to explore" Heading & Continuous Masonry Feed */}
            <div className="w-full mt-6 mb-12">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 px-1">
                More to explore
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                {moreVerses.map((related) => (
                  <VerseCard
                    key={related.number}
                    verse={related}
                    onSelect={(v) => {
                      onSelectVerse(v);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* iPhone / Mobile Photo Save Dialog */}
        {savedPreviewUrl && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="relative max-w-sm w-full bg-[#0a1c20] border border-[#163842] rounded-3xl p-4 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSavedPreviewUrl(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-bold text-white mt-2 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                HD Photo Generated
              </h4>
              <p className="text-xs text-slate-300 mb-3 px-2">
                Tap &amp; hold the image below and select <strong className="text-emerald-400">&ldquo;Save to Photos&rdquo;</strong> to save it directly to your iPhone Camera Roll.
              </p>

              {/* Rendered HTML5 Canvas Image */}
              <div className="relative w-full max-h-[60vh] rounded-2xl overflow-hidden shadow-lg border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={savedPreviewUrl}
                  alt={`Surah ${verse.surahNameEnglish}`}
                  className="w-full h-auto object-contain max-h-[58vh] mx-auto rounded-xl select-all"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      fetch(savedPreviewUrl)
                        .then((r) => r.blob())
                        .then((b) => {
                          const f = new File([b], `Surah-${verse.surahNameEnglish}.png`, {
                            type: "image/png",
                          });
                          if (navigator.canShare && navigator.canShare({ files: [f] })) {
                            navigator.share({ files: [f] });
                          }
                        });
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Open iOS Share Sheet</span>
                </button>
                <button
                  onClick={() => setSavedPreviewUrl(null)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
