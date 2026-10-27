"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Shuffle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  BookOpen,
  Sparkles,
  Loader2,
  RotateCw,
} from "lucide-react";

interface QuranVerse {
  number: number;
  arabicText: string;
  englishText: string;
  audioUrl?: string;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  surahNameMeaning: string;
  numberOfAyahs: number;
  revelationType: string;
  numberInSurah: number;
  juz: number;
}

// Convert Latin numerals to Eastern Arabic numerals (e.g. 1 -> ١, 255 -> ٢٥٥)
function toArabicNumerals(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join("");
}

export default function Home() {
  const [verse, setVerse] = useState<QuranVerse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const fetchRandomVerse = useCallback(async () => {
    stopAudio();
    setLoading(true);
    setFetchError(null);
    setAudioError(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/random-verse", {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data: QuranVerse = await res.json();
      setVerse(data);
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }
      console.error("Error fetching random verse:", err);
      setFetchError("Unable to fetch verse. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [stopAudio]);

  // Initial load
  useEffect(() => {
    fetchRandomVerse();
    return () => {
      stopAudio();
    };
  }, [fetchRandomVerse, stopAudio]);

  // Keyboard shortcut: Space or 'R' to randomize
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
        fetchRandomVerse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchRandomVerse]);

  // Toggle Audio Playback
  const toggleAudio = () => {
    if (!verse?.audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(verse.audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setAudioError(true);
        setIsPlaying(false);
      };
    }

    if (audioRef.current.src !== verse.audioUrl) {
      audioRef.current.src = verse.audioUrl;
      audioRef.current.load();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setAudioError(false);
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback failed:", err);
        setAudioError(true);
        setIsPlaying(false);
      });
    }
  };

  // Copy Verse Text
  const handleCopy = async () => {
    if (!verse) return;
    const textToCopy = `"${verse.arabicText}"\n\n"${verse.englishText}"\n\n— Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  // Share Verse
  const handleShare = async () => {
    if (!verse) return;
    const shareData = {
      title: `Surah ${verse.surahNameEnglish} (${verse.surahNumber}:${verse.numberInSurah})`,
      text: `"${verse.englishText}" — Surah ${verse.surahNameEnglish}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      await handleCopy();
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-emerald-100/30 dark:from-[#0a111a] dark:via-[#0c1622] dark:to-[#080d14] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Background Islamic Geometric Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial from-emerald-400/15 via-teal-300/10 to-transparent dark:from-emerald-600/15 dark:via-teal-500/5 dark:to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-radial from-amber-400/10 via-transparent to-transparent dark:from-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto pt-8 pb-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Verse of the Day
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Quran Randomizer
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reflect upon the words of the Holy Qur&apos;an
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-arabic text-xl sm:text-2xl text-emerald-800 dark:text-emerald-300 font-bold select-none">
            آيَةُ اليَوم
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 w-full max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="w-full relative rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-emerald-100 dark:border-emerald-950/80 shadow-2xl shadow-emerald-950/5 dark:shadow-black/40 overflow-hidden transition-all duration-300">
          {/* Card Top Banner / Surah Reference */}
          <div className="border-b border-emerald-50 dark:border-slate-800/80 px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-transparent dark:from-emerald-950/30 dark:via-transparent dark:to-transparent">
            {verse ? (
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-600 text-white font-mono text-xs font-semibold shadow-xs">
                  {verse.surahNumber}
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                    Surah {verse.surahNameEnglish}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    ({verse.surahNameMeaning})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    Ayah {verse.numberInSurah} of {verse.numberOfAyahs}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                    {verse.revelationType}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                    Juz {verse.juz}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            )}

            {verse && (
              <div className="font-arabic text-xl sm:text-2xl text-emerald-800 dark:text-emerald-300 font-semibold select-none pr-1">
                {verse.surahNameArabic}
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-10 flex flex-col items-center min-h-[320px] justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-emerald-600 dark:text-emerald-400">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
                  Revealing random Quranic verse...
                </p>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium text-sm max-w-md">
                  {fetchError}
                </p>
                <button
                  onClick={fetchRandomVerse}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                >
                  <RotateCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            ) : verse ? (
              <div className="w-full flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                {/* Arabic Text */}
                <div
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-emerald-50 leading-[2.3] sm:leading-[2.4] font-normal tracking-wide max-w-3xl px-2 select-text"
                >
                  {verse.arabicText}
                  <span className="inline-block mx-2 text-emerald-700 dark:text-emerald-400 font-bold text-xl sm:text-2xl select-none">
                    ﴿{toArabicNumerals(verse.numberInSurah)}﴾
                  </span>
                </div>

                {/* Ornamental Islamic Divider */}
                <div className="flex items-center justify-center gap-3 w-full max-w-xs text-emerald-600/40 dark:text-emerald-400/40 select-none">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700 to-emerald-400/50" />
                  <span className="text-emerald-700 dark:text-emerald-400 text-sm">✦ ۞ ✦</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-emerald-300 dark:via-emerald-700 to-emerald-400/50" />
                </div>

                {/* English Translation */}
                <div className="max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-slate-700 dark:text-slate-200 px-2 italic">
                  &ldquo;{verse.englishText}&rdquo;
                </div>

                {/* Ayah Citation */}
                <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Surah {verse.surahNameEnglish} • Verse {verse.numberInSurah} (Translation: Saheeh International)
                </div>
              </div>
            ) : null}
          </div>

          {/* Card Actions Footer */}
          <div className="border-t border-emerald-50 dark:border-slate-800/80 px-6 sm:px-8 py-5 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quick Actions (Audio, Copy, Share) */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
              {/* Audio Button */}
              {verse?.audioUrl && (
                <button
                  onClick={toggleAudio}
                  disabled={loading}
                  aria-label={isPlaying ? "Pause audio recitation" : "Listen to audio recitation"}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    isPlaying
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4 animate-pulse" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                disabled={loading || !verse}
                aria-label="Copy verse text"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Copy verse"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={loading || !verse}
                aria-label="Share verse"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Share verse"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Main Action: Randomize Button */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <button
                onClick={fetchRandomVerse}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                <Shuffle className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Randomize Verse</span>
                <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-white/20 text-emerald-50">
                  Space
                </kbd>
              </button>
            </div>
          </div>
        </div>

        {audioError && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 text-center">
            Audio stream is temporarily unavailable for this ayah.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto py-6 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          Data provided by{" "}
          <a
            href="https://alquran.cloud/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            Al-Quran Cloud API
          </a>{" "}
          • Recitation by Sheikh Mishary Rashid Alafasy
        </p>
      </footer>
    </div>
  );
}
