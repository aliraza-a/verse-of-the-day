"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuranVerse } from "@/app/api/verses/route";

interface FavoritesContextType {
  favorites: QuranVerse[];
  isFavorite: (number: number) => boolean;
  toggleFavorite: (verse: QuranVerse) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "quran_verse_favorites_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<QuranVerse[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read favorites from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Failed to save favorites to localStorage:", e);
    }
  }, [favorites, isLoaded]);

  const isFavorite = (number: number) => {
    return favorites.some((f) => f.number === number);
  };

  const toggleFavorite = (verse: QuranVerse) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.number === verse.number);
      if (exists) {
        return prev.filter((f) => f.number !== verse.number);
      } else {
        return [verse, ...prev];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
