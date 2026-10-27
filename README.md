# Verse of the Day (آية اليوم) 📖

A modern, elegant web application that presents random Quranic verses with authentic Arabic calligraphy, English translations, and high-quality audio recitation.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## ✨ Features

- **🎲 Random Verse Generator**: Pulls verses dynamically across all 6,236 Ayahs of the Holy Qur'an with a single click.
- **📜 Authentic Arabic Calligraphy**: Rendered with Google's **Amiri** font and traditional Eastern Arabic numerals (`﴿ ... ﴾`).
- **🌍 English Translation**: Accurate, clear English translation by Saheeh International.
- **🎧 Audio Recitation**: Play/pause melodious verse-by-verse recitation by Sheikh Mishary Rashid Alafasy.
- **📋 Copy & Share**: One-click copying to clipboard formatted with Arabic, translation, and Surah citation; supports native mobile Web Share.
- **⌨️ Keyboard Shortcuts**: Press <kbd>Space</kbd> or <kbd>R</kbd> anywhere on the page to randomize instantly.
- **🌙 Responsive & Theme-Aware**: Serene Islamic-inspired aesthetic with dark mode and smooth animations.
- **🛡️ Resilient Architecture**: Backend API route handler (`/api/random-verse`) with timeout management and offline fallback protection.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Typography**: [Google Amiri Font](https://fonts.google.com/specimen/Amiri) & Geist
- **Icons**: [Lucide React](https://lucide.dev)
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

To build the application for production:

```bash
npm run build
npm run start
```

---

## 📡 API Endpoint

The app includes an internal route handler at `/api/random-verse`:

- **Endpoint**: `GET /api/random-verse`
- **Optional Query Parameter**: `?ayah=<number>` (1–6236)
- **Sample Response**:
  ```json
  {
    "number": 262,
    "arabicText": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ...",
    "englishText": "Allah - there is no deity except Him, the Ever-Living, the Sustainer...",
    "audioUrl": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3",
    "surahNumber": 2,
    "surahNameArabic": "سُورَةُ البَقَرَةِ",
    "surahNameEnglish": "Al-Baqarah",
    "surahNameMeaning": "The Cow",
    "numberOfAyahs": 286,
    "revelationType": "Medinan",
    "numberInSurah": 255,
    "juz": 3
  }
  ```

---

## 🤝 Attribution

- Quran text and audio recitation provided by the [Al-Quran Cloud API](https://alquran.cloud/api).
- Recitation by Sheikh Mishary Rashid Alafasy.
