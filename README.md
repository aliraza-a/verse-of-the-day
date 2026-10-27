# Verse of the Day (آية اليوم) 📖

A cinematic, mobile-first Quranic inspiration web application designed with fluid animations, high-definition photographic nature backdrops, an authentic Uthmani Arabic script, English translations, and Mishary Alafasy audio recitation.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer)
![GSAP](https://img.shields.io/badge/GSAP-3-88ce02?logo=greensock)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## ✨ Features & Visual Experience

- **📱 Mobile-First Responsive Masonry Feed**: 2-column masonry grid on mobile scaling to 3 and 4 columns on tablet and desktop.
- **🖼️ HD Nature Photographic Cards**: High-definition backgrounds (cherry blossoms, misty pines, turquoise oceans, starry skies, desert dunes, canyon rocks) with dual-layer dark scrims for WCAG AAA contrast, plus off-white accent cards for visual rhythm.
- **🌸 Story Highlights Bar**: Circular story bubbles for quick one-tap exploration into daily themes (*Daily Verse, Gratitude, Patience, Trust, Inner Peace*).
- **🏷️ Thematic Filter Pills**: Horizontally scrollable category pills connecting to a consolidated batch API (`/api/verses?theme=...`).
- **📜 Sacred Arabic Calligraphy**: Google's **Amiri** font with authentic diacritics and traditional Eastern Arabic numerals (`﴿ ... ﴾`).
- **📖 Saheeh International Translations**: Clear, elegant English translations with Surah names, verse indices, and Juz metadata.
- **🎧 Global Audio Reciter**: Single-instance audio player streaming Sheik Mishary Rashid Alafasy recitation across feed and detail views.
- **✨ Hero Detail View with "More to Explore"**: Full-screen slide-up sheet on mobile and modal on desktop featuring infinite continuous masonry discovery.
- **❤️ Favorites & Bookmarks**: Local storage persistence for saving cherished verses with an active count badge and a dedicated drawer.
- **🎲 "Surprise Me" Randomizer**: Floating action button with keyboard shortcuts (<kbd>Space</kbd> or <kbd>R</kbd>) pulling dynamically from all 6,236 Ayahs.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev)
- **Animation & Transitions**: [Framer Motion](https://motion.dev) & [GSAP](https://gsap.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom deep teal design tokens
- **Typography**: [Google Amiri Font](https://fonts.google.com/specimen/Amiri) & Geist
- **Icons**: [Lucide React](https://lucide.dev)
- **HD Imagery**: Free high-definition nature imagery via Unsplash CDN
- **Data & Audio Source**: [Al-Quran Cloud API](https://alquran.cloud/api)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18.18.0 or newer recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aliraza-a/verse-of-the-day.git
   cd verse-of-the-day
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📡 API Endpoints

### 1. Batch & Themed Verses: `GET /api/verses`
- `?theme=daily-verse` (or `gratitude`, `patience`, `trust`, `purpose`, `peace`)
- `?ids=1587,6083,5416`
- `?random=true&limit=8`

### 2. Single Ayah: `GET /api/random-verse`
- `?ayah=<number>` (1–6236)

---

## 🤝 Attribution

- Quran text and audio recitation provided by the [Al-Quran Cloud API](https://alquran.cloud/api).
- Recitation by Sheikh Mishary Rashid Alafasy.
- HD nature photography via Unsplash.
