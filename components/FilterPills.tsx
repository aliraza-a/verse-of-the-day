"use client";

import React, { useRef } from "react";
import { THEMES } from "@/lib/themes";

interface FilterPillsProps {
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function FilterPills({ activeTheme, onSelectTheme }: FilterPillsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full pb-3 px-4 overflow-x-auto no-scrollbar">
      <div ref={containerRef} className="flex items-center gap-2 max-w-4xl mx-auto">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#104841] text-emerald-100 font-semibold shadow-xs ring-1 ring-emerald-500/50"
                  : "bg-[#0b2126]/80 text-slate-300 hover:text-white hover:bg-[#0f2d34] border border-[#163842]/60"
              }`}
            >
              {theme.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
