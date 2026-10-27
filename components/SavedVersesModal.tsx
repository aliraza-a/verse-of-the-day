"use client";

import React from "react";
import { X, Bookmark, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuranVerse } from "@/app/api/verses/route";
import { useFavorites } from "@/context/FavoritesContext";
import { VerseCard } from "@/components/VerseCard";

interface SavedVersesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: QuranVerse) => void;
}

export function SavedVersesModal({
  isOpen,
  onClose,
  onSelectVerse,
}: SavedVersesModalProps) {
  const { favorites, toggleFavorite } = useFavorites();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#061316]/95 backdrop-blur-xl flex flex-col"
      >
        {/* Header */}
        <div className="w-full max-w-4xl mx-auto px-4 h-14 flex items-center justify-between border-b border-[#0f272d]/40">
          <div className="flex items-center gap-2 text-white">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-base sm:text-lg">Saved Verses</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
              {favorites.length}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close saved verses"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full no-scrollbar">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[#0b2126] border border-[#163842] flex items-center justify-center text-slate-400 mb-4">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-white">No saved verses yet</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xs mt-1">
                Tap the heart icon on any verse card to save your favorite Quranic inspirations for easy reflection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {favorites.map((verse) => (
                <div key={verse.number} className="relative group">
                  <VerseCard
                    verse={verse}
                    onSelect={(v) => {
                      onClose();
                      onSelectVerse(v);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
