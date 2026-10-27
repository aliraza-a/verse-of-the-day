import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { PwaRegister } from "@/components/PwaRegister";

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

export const viewport: Viewport = {
  themeColor: "#061316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Inspiration — Verse of the Day | آية اليوم",
  description: "A mobile-first Islamic inspiration app presenting sacred Quranic verses with authentic calligraphy, English translations, and audio recitation.",
  manifest: "/manifest.webmanifest",
  applicationName: "Inspiration",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Inspiration",
    startupImage: "/icons/icon-512.png",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
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
            <PwaRegister />
          </AudioProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
