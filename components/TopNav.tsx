"use client";

import React from "react";
import { ChevronLeft, Bookmark, Sparkles } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

interface TopNavProps {
  onOpenSaved: () => void;
  onResetFeed?: () => void;
}

export function TopNav({ onOpenSaved, onResetFeed }: TopNavProps) {
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#061316]/90 backdrop-blur-md border-b border-[#0f272d]/40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Back / Reset */}
        <button
          onClick={onResetFeed}
          aria-label="Back to home"
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Center: Title matching inspiration.mp4 */}
        <div className="flex flex-col items-center select-none cursor-pointer" onClick={onResetFeed}>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
            Inspiration
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </h1>
          <span className="text-[10px] text-emerald-400/80 font-arabic tracking-wide -mt-0.5">
            آيَةٌ مِنَ القُرآنِ الكَرِيم
          </span>
        </div>

        {/* Right: Saved Bookmarks */}
        <button
          onClick={onOpenSaved}
          aria-label="Open saved verses"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <Bookmark className="w-5 h-5" />
          {favorites.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center shadow-xs">
              {favorites.length > 9 ? "9+" : favorites.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
