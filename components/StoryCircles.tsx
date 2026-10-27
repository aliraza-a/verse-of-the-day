"use client";

import React from "react";
import Image from "next/image";
import { THEMES } from "@/lib/themes";
import { NATURE_BACKGROUNDS } from "@/lib/backgrounds";

interface StoryCirclesProps {
  onSelectStory: (themeId: string) => void;
  activeTheme: string;
}

export function StoryCircles({ onSelectStory, activeTheme }: StoryCirclesProps) {
  // Use first 5 themes
  const displayThemes = THEMES.slice(1, 6);

  return (
    <div className="w-full py-3.5 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        {displayThemes.map((theme, index) => {
          const bg = NATURE_BACKGROUNDS[index % NATURE_BACKGROUNDS.length];
          const isSelected = activeTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelectStory(theme.id)}
              className="flex flex-col items-center gap-1.5 focus:outline-hidden group cursor-pointer shrink-0"
            >
              <div
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#061316] scale-105"
                    : "ring-1.5 ring-slate-400/40 hover:ring-slate-300"
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-800">
                  <Image
                    src={bg.url}
                    alt={theme.name}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                </div>
              </div>
              <span
                className={`text-[11px] sm:text-xs font-medium tracking-tight text-center max-w-[68px] truncate transition-colors ${
                  isSelected ? "text-emerald-400 font-semibold" : "text-slate-300/90 group-hover:text-white"
                }`}
              >
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
