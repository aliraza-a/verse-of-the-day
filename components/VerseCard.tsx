"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { QuranVerse } from "@/app/api/verses/route";
import { getBackgroundForAyah } from "@/lib/backgrounds";
import { useFavorites } from "@/context/FavoritesContext";

interface VerseCardProps {
  verse: QuranVerse;
  onSelect: (verse: QuranVerse) => void;
  priority?: boolean;
}

export function VerseCard({ verse, onSelect, priority = false }: VerseCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(verse.number);
  const isLight = Boolean(verse.isLightCard);
  const bg = getBackgroundForAyah(verse.number, isLight);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(verse);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={() => onSelect(verse)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer select-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.985] flex flex-col justify-between p-4 sm:p-5 min-h-[220px] sm:min-h-[260px] ${
        isLight
          ? "bg-[#faf9f6] text-slate-900 border border-slate-200/80"
          : "bg-[#0b1e22] text-white border border-[#163842]/40"
      }`}
    >
      {/* Background Image for Photo Cards */}
      {!isLight && bg && (
        <>
          <Image
            src={bg.url}
            alt={bg.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Dual-layer dark scrim overlay for crisp legibility matching inspiration.mp4 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/85" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </>
      )}

      {/* Card Header */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span
          className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-widest ${
            isLight ? "text-slate-500" : "text-white/70"
          }`}
        >
          Ayah of the Day
        </span>
        <h3
          className={`text-sm sm:text-base font-semibold tracking-tight mt-0.5 ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {verse.surahNameEnglish} {verse.surahNumber}:{verse.numberInSurah}
        </h3>
      </div>

      {/* Main Verse Text (English quote truncated gracefully) */}
      <div className="relative z-10 my-3 text-center flex-1 flex items-center justify-center">
        <p
          className={`text-xs sm:text-[13.5px] leading-relaxed line-clamp-6 font-normal tracking-wide ${
            isLight ? "text-slate-700 font-medium" : "text-slate-100/95"
          }`}
        >
          &ldquo;{verse.englishText}&rdquo;
        </p>
      </div>

      {/* Card Bottom / Heart Like Button */}
      <div className="relative z-10 flex items-center justify-end w-full pt-1">
        <button
          onClick={handleHeartClick}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isLight
              ? "hover:bg-black/5 text-slate-700"
              : "hover:bg-white/20 text-white"
          }`}
        >
          <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: liked ? [1, 1.25, 1] : 1 }}>
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                liked
                  ? "fill-red-500 text-red-500"
                  : isLight
                  ? "text-slate-600 hover:text-red-500"
                  : "text-white/80 hover:text-white"
              }`}
            />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}
