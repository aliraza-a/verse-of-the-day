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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuranVerse } from "@/app/api/verses/route";
import { getBackgroundForAyah } from "@/lib/backgrounds";
import { useFavorites } from "@/context/FavoritesContext";
import { useAudio } from "@/context/AudioContext";
import { VerseCard } from "@/components/VerseCard";
import { downloadVerseCardImage } from "@/lib/downloadVerseImage";

interface DetailViewModalProps {
  verse: QuranVerse | null;
  allVerses: QuranVerse[];
  onClose: () => void;
  onSelectVerse: (verse: QuranVerse) => void;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

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
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      await downloadVerseCardImage(cardRef.current, verse);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
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
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download HD image"
              title="Download HD Wallpaper"
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
          className="flex-1 overflow-y-auto px-4 py-4 sm:py-6 no-scrollbar"
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Hero Card */}
            <motion.div
              ref={cardRef}
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

              {/* Audio Recitation Button - marked with data-export-ignore so it doesn't appear on downloaded image */}
              {verse.audioUrl && (
                <div
                  data-export-ignore="true"
                  className="relative z-10 mt-4 flex items-center justify-center"
                >
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
                <p
                  data-export-ignore="true"
                  className="relative z-10 text-[11px] text-amber-300 text-center mt-2"
                >
                  Audio streaming momentarily unavailable for this ayah.
                </p>
              )}
            </motion.div>

            {/* Engagement Row under Hero Card (Save, Download HD, Copy) */}
            <div className="w-full flex items-center justify-around py-4 mt-1 border-b border-[#0f272d]/60 text-slate-300">
              {/* Like / Save Button */}
              <button
                onClick={() => toggleFavorite(verse)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked ? "fill-red-500 text-red-500" : "text-slate-300"
                  }`}
                />
                <span className="text-xs font-semibold">
                  {liked ? "Saved" : "Save"}
                </span>
              </button>

              {/* Download HD Button (Replaces Share button) */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Generating...
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">
                      Download HD
                    </span>
                  </>
                )}
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-slate-300" />
                    <span className="text-xs font-semibold">Copy</span>
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
      </motion.div>
    </AnimatePresence>
  );
}
