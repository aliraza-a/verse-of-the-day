"use client";

import React from "react";
import { Shuffle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingSurpriseButtonProps {
  onClick: () => void;
  loading: boolean;
}

export function FloatingSurpriseButton({
  onClick,
  loading,
}: FloatingSurpriseButtonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-black font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer active:shadow-md transition-shadow disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-black" />
        ) : (
          <Shuffle className="w-4 h-4 text-black" />
        )}
        <span>Surprise Me</span>
        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/15 text-black font-semibold">
          Space
        </kbd>
      </motion.button>
    </div>
  );
}
