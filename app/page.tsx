"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TopNav } from "@/components/TopNav";
import { StoryCircles } from "@/components/StoryCircles";
import { FilterPills } from "@/components/FilterPills";
import { MasonryFeed } from "@/components/MasonryFeed";
import { DetailViewModal } from "@/components/DetailViewModal";
import { SavedVersesModal } from "@/components/SavedVersesModal";
import { FloatingSurpriseButton } from "@/components/FloatingSurpriseButton";
import { QuranVerse } from "@/app/api/verses/route";

export default function Home() {
  const [activeTheme, setActiveTheme] = useState<string>("daily-verse");
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(null);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [surpriseLoading, setSurpriseLoading] = useState<boolean>(false);

  // Fetch verses for selected theme
  const loadThemeVerses = useCallback(async (themeId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/verses?theme=${themeId}`);
      if (!res.ok) throw new Error("Failed to load verses");
      const data: QuranVerse[] = await res.json();
      setVerses(data);
    } catch (err) {
      console.error("Error fetching theme verses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemeVerses(activeTheme);
  }, [activeTheme, loadThemeVerses]);

  // Handle Theme Selection
  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
  };

  // Handle "Surprise Me" Random Verse
  const handleSurpriseMe = async () => {
    setSurpriseLoading(true);
    try {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;
      const res = await fetch(`/api/verses?ids=${randomAyah}`);
      if (!res.ok) throw new Error("Failed to fetch random verse");
      const data: QuranVerse[] = await res.json();
      if (data && data.length > 0) {
        setSelectedVerse(data[0]);
      }
    } catch (e) {
      console.error("Surprise Me failed:", e);
    } finally {
      setSurpriseLoading(false);
    }
  };

  // Keyboard shortcut: Space or 'R' triggers Surprise Me
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }
      if (e.code === "Space" || e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleSurpriseMe();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#061316] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <TopNav
        onOpenSaved={() => setIsSavedOpen(true)}
        onResetFeed={() => setActiveTheme("daily-verse")}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full">
        {/* Story Circles Row */}
        <StoryCircles
          activeTheme={activeTheme}
          onSelectStory={handleSelectTheme}
        />

        {/* Filter Chips Bar */}
        <FilterPills
          activeTheme={activeTheme}
          onSelectTheme={handleSelectTheme}
        />

        {/* 2-Column Responsive Masonry Feed */}
        <MasonryFeed
          verses={verses}
          loading={loading}
          onSelectVerse={(v) => setSelectedVerse(v)}
        />
      </main>

      {/* Floating Surprise Button */}
      <FloatingSurpriseButton
        onClick={handleSurpriseMe}
        loading={surpriseLoading}
      />

      {/* Detail View Modal / Sheet */}
      <DetailViewModal
        verse={selectedVerse}
        allVerses={verses}
        onClose={() => setSelectedVerse(null)}
        onSelectVerse={(v) => setSelectedVerse(v)}
      />

      {/* Saved Verses Drawer */}
      <SavedVersesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        onSelectVerse={(v) => setSelectedVerse(v)}
      />

      {/* Attribution Footer */}
      <footer className="w-full py-6 px-4 text-center text-[11px] text-slate-500 border-t border-[#0f272d]/40">
        <p>
          Qur&apos;an Data provided by{" "}
          <a
            href="https://alquran.cloud/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-400"
          >
            Al-Quran Cloud
          </a>{" "}
          • Recitation by Sheikh Mishary Rashid Alafasy • HD Imagery via Unsplash
        </p>
      </footer>
    </div>
  );
}
