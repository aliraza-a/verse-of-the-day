import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Inspiration — Verse of the Day | آية اليوم",
  description: "A mobile-first Islamic inspiration app presenting sacred Quranic verses with authentic calligraphy, English translations, and audio recitation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#061316] text-white">
        <FavoritesProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
