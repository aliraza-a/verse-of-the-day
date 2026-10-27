"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { QuranVerse } from "@/app/api/verses/route";

interface AudioContextType {
  activeVerse: QuranVerse | null;
  isPlaying: boolean;
  progress: number;
  togglePlay: (verse: QuranVerse) => void;
  stop: () => void;
  audioError: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeVerse, setActiveVerse] = useState<QuranVerse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const togglePlay = useCallback((verse: QuranVerse) => {
    if (!verse.audioUrl) return;

    // If currently playing this verse, pause
    if (activeVerse?.number === verse.number && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setAudioError(false);
    setActiveVerse(verse);

    if (!audioRef.current) {
      const audio = new Audio(verse.audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.onerror = () => {
        setAudioError(true);
        setIsPlaying(false);
      };
    } else {
      audioRef.current.src = verse.audioUrl;
      audioRef.current.load();
    }

    audioRef.current.play().catch((e) => {
      console.warn("Audio playback failed:", e);
      setAudioError(true);
      setIsPlaying(false);
    });
  }, [activeVerse, isPlaying]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <AudioContext.Provider value={{ activeVerse, isPlaying, progress, togglePlay, stop, audioError }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
