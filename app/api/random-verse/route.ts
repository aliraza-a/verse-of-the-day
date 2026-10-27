import { NextResponse } from "next/server";

interface AlquranAyahItem {
  number: number;
  text: string;
  audio?: string;
  numberInSurah: number;
  juz: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  edition: {
    identifier: string;
  };
}

interface AlquranApiResponse {
  code: number;
  status: string;
  data: AlquranAyahItem[];
}

const FALLBACK_VERSES = [
  {
    number: 262,
    arabicText: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    englishText: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3",
    surahNumber: 2,
    surahNameArabic: "سُورَةُ البَقَرَةِ",
    surahNameEnglish: "Al-Baqarah",
    surahNameMeaning: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
    numberInSurah: 255,
    juz: 3,
  },
  {
    number: 6046,
    arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا • إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    englishText: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6090.mp3",
    surahNumber: 94,
    surahNameArabic: "سُورَةُ الشَّرۡحِ",
    surahNameEnglish: "Ash-Sharh",
    surahNameMeaning: "The Relief",
    numberOfAyahs: 8,
    revelationType: "Meccan",
    numberInSurah: 5,
    juz: 30,
  },
  {
    number: 4235,
    arabicText: "قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
    englishText: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4111.mp3",
    surahNumber: 39,
    surahNameArabic: "سُورَةُ الزُّمَرِ",
    surahNameEnglish: "Az-Zumar",
    surahNameMeaning: "The Troops",
    numberOfAyahs: 75,
    revelationType: "Meccan",
    numberInSurah: 53,
    juz: 24,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specificAyah = searchParams.get("ayah");

  // Total verses in the Quran is 6236
  const ayahNumber = specificAyah
    ? Math.min(Math.max(1, parseInt(specificAyah, 10) || 1), 6236)
    : Math.floor(Math.random() * 6236) + 1;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih,ar.alafasy`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const json = (await res.json()) as AlquranApiResponse;

    if (!json?.data || !Array.isArray(json.data) || json.data.length < 2) {
      throw new Error("Invalid API payload structure");
    }

    const uthmani = json.data.find((d) => d.edition.identifier === "quran-uthmani") || json.data[0];
    const translation = json.data.find((d) => d.edition.identifier === "en.sahih") || json.data[1];
    const audioRecitation = json.data.find((d) => d.edition.identifier === "ar.alafasy") || json.data[2];

    const payload = {
      number: uthmani.number,
      arabicText: uthmani.text,
      englishText: translation.text,
      audioUrl: audioRecitation?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${uthmani.number}.mp3`,
      surahNumber: uthmani.surah.number,
      surahNameArabic: uthmani.surah.name,
      surahNameEnglish: uthmani.surah.englishName,
      surahNameMeaning: uthmani.surah.englishNameTranslation,
      numberOfAyahs: uthmani.surah.numberOfAyahs,
      revelationType: uthmani.surah.revelationType,
      numberInSurah: uthmani.numberInSurah,
      juz: uthmani.juz,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("Error fetching verse from AlQuran API, falling back:", err);
    const fallback = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
