"use client";

import React from "react";
import { QuranVerse } from "@/app/api/verses/route";
import { VerseCard } from "@/components/VerseCard";
import { Loader2 } from "lucide-react";

interface MasonryFeedProps {
  verses: QuranVerse[];
  loading: boolean;
  onSelectVerse: (verse: QuranVerse) => void;
}

export function MasonryFeed({ verses, loading, onSelectVerse }: MasonryFeedProps) {
  if (loading && verses.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0b1e22]/70 border border-[#163842]/30 animate-pulse h-60 sm:h-72 p-4 flex flex-col justify-between"
            >
              <div className="h-3 w-16 bg-white/10 rounded-full mx-auto" />
              <div className="space-y-2">
                <div className="h-2.5 w-3/4 bg-white/10 rounded-full mx-auto" />
                <div className="h-2.5 w-5/6 bg-white/10 rounded-full mx-auto" />
                <div className="h-2.5 w-1/2 bg-white/10 rounded-full mx-auto" />
              </div>
              <div className="h-4 w-4 bg-white/10 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // To build an authentic staggered masonry balance, divide verses across columns
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-24">
      {/* 2-column on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {verses.map((verse, idx) => (
          <VerseCard
            key={verse.number}
            verse={verse}
            onSelect={onSelectVerse}
            priority={idx < 4}
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 text-emerald-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Loading inspiration...</span>
        </div>
      )}
    </div>
  );
}
