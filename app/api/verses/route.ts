import { NextResponse } from "next/server";
import { THEMES, getDailyVerseId } from "@/lib/themes";

export interface QuranVerse {
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
  isLightCard?: boolean;
}

// In-memory server cache to ensure lightning fast loads and zero rate limits
const verseCache = new Map<number, QuranVerse>();

// Curated static fallback cache for immediate offline or instant availability
const CURATED_FALLBACKS: Record<number, QuranVerse> = {
  1587: {
    number: 1587,
    arabicText: "وَأَقِمِ ٱلصَّلَوٰةَ طَرَفَىِ ٱلنَّهَارِ وَزُلَفًۭا مِّنَ ٱلَّيْلِ ۚ إِنَّ ٱلْحَسَنَٰتِ يُذْهِبْنَ ٱلسَّيِّـَٔاتِ ۚ ذَٰلِكَ ذِكْرَىٰ لِلذَّٰكِرِينَ",
    englishText: "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds do away with misdeeds. That is a reminder for those who remember.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1587.mp3",
    surahNumber: 11,
    surahNameArabic: "سُورَةُ هُودٍ",
    surahNameEnglish: "Hud",
    surahNameMeaning: "Hud",
    numberOfAyahs: 123,
    revelationType: "Meccan",
    numberInSurah: 114,
    juz: 12,
  },
  6083: {
    number: 6083,
    arabicText: "وَلَلْـَٔاخِرَةُ خَيْرٌۭ لَّكَ مِنَ ٱلْأُولَىٰ",
    englishText: "And the next life is certainly far better for you than this one.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6083.mp3",
    surahNumber: 93,
    surahNameArabic: "سُورَةُ الضُّحَىٰ",
    surahNameEnglish: "Ad-Duhaa",
    surahNameMeaning: "The Morning Hours",
    numberOfAyahs: 11,
    revelationType: "Meccan",
    numberInSurah: 4,
    juz: 30,
  },
  5416: {
    number: 5416,
    arabicText: "فَٱصْبِرْ صَبْرًۭا جَمِيلًا",
    englishText: "So endure patiently, with beautiful patience.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5416.mp3",
    surahNumber: 70,
    surahNameArabic: "سُورَةُ المَعَارِجِ",
    surahNameEnglish: "Al-Ma'arij",
    surahNameMeaning: "The Ascending Stairways",
    numberOfAyahs: 44,
    revelationType: "Meccan",
    numberInSurah: 5,
    juz: 29,
  },
  159: {
    number: 159,
    arabicText: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",
    englishText: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/159.mp3",
    surahNumber: 2,
    surahNameArabic: "سُورَةُ البَقَرَةِ",
    surahNameEnglish: "Al-Baqarah",
    surahNameMeaning: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
    numberInSurah: 152,
    juz: 2,
    isLightCard: true, // As seen in inspiration video
  },
  162: {
    number: 162,
    arabicText: "وَلَنَبْلُوَنَّكُم بِشَىْءٍۢ مِّنَ ٱلْخَوْفِ وَٱلْجُوعِ وَنَقْصٍۢ مِّنَ ٱلْأَمْوَٰلِ وَٱلْأَنفُسِ وَٱلثَّمَرَٰتِ ۗ وَبَشِّرِ ٱلصَّٰبِرِينَ",
    englishText: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient,",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/162.mp3",
    surahNumber: 2,
    surahNameArabic: "سُورَةُ البَقَرَةِ",
    surahNameEnglish: "Al-Baqarah",
    surahNameMeaning: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan",
    numberInSurah: 155,
    juz: 2,
  },
  527: {
    number: 527,
    arabicText: "وَٱعْبُدُوا۟ ٱللَّهَ وَلَا تُشْرِكُوا۟ بِهِۦ شَيْـًۭٔا ۖ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًۭا وَبِذِى ٱلْقُرْبَىٰ وَٱلْيَتَٰمَىٰ وَٱلْمَسَٰكِينِ وَٱلْجَارِ ذِى ٱلْقُرْبَىٰ وَٱلْجَارِ ٱلْجُنُبِ وَٱلصَّاحِبِ بِٱلْجَنۢبِ وَٱبْنِ ٱلسَّبِيلِ وَمَا مَلَكَتْ أَيْمَٰنُكُمْ",
    englishText: "Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbor, the neighbor farther away...",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/527.mp3",
    surahNumber: 4,
    surahNameArabic: "سُورَةُ النِّسَاءِ",
    surahNameEnglish: "An-Nisa",
    surahNameMeaning: "The Women",
    numberOfAyahs: 176,
    revelationType: "Medinan",
    numberInSurah: 36,
    juz: 5,
  },
  3441: {
    number: 3441,
    arabicText: "وَمِنْ ءَايَٰتِهِۦ خَلْقُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَٰفُ أَلْسِنَتِكُمْ وَأَلْوَٰنِكُمْ ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَٰتٍۢ لِّلْعَٰلِمِينَ",
    englishText: "And of His signs is the creation of the heavens and the earth and the diversity of your languages and your colors. Indeed in that are signs for those of knowledge.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3441.mp3",
    surahNumber: 30,
    surahNameArabic: "سُورَةُ الرُّومِ",
    surahNameEnglish: "Ar-Rum",
    surahNameMeaning: "The Romans",
    numberOfAyahs: 60,
    revelationType: "Meccan",
    numberInSurah: 22,
    juz: 21,
  },
  1253: {
    number: 1253,
    arabicText: "إِنَّمَا يَعْمُرُ مَسَٰجِدَ ٱللَّهِ مَنْ ءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْـَٔاخِرِ وَأَقَامَ ٱلصَّلَوٰةَ وَءَاتَى ٱلزَّكَوٰةَ وَلَمْ يَخْشَ إِلَّا ٱللَّهَ",
    englishText: "The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day and establish prayer and give zakah and do not fear except Allah...",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1253.mp3",
    surahNumber: 9,
    surahNameArabic: "سُورَةُ التَّوۡبَةِ",
    surahNameEnglish: "At-Tawbah",
    surahNameMeaning: "The Repentance",
    numberOfAyahs: 129,
    revelationType: "Medinan",
    numberInSurah: 18,
    juz: 10,
  },
  466: {
    number: 466,
    arabicText: "وَكَيْفَ تَكْفُرُونَ وَأَنتُمْ تُتْلَىٰ عَلَيْكُمْ ءَايَٰتُ ٱللَّهِ وَفِيكُمْ رَسُولُهُۥ ۗ وَمَن يَعْتَصِم بِٱللَّهِ فَقَدْ هُدِىَ إِلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ",
    englishText: "And how could you disbelieve while to you are being recited the verses of Allah and among you is His Messenger? And whoever holds firmly to Allah has indeed been guided to a straight path.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/466.mp3",
    surahNumber: 3,
    surahNameArabic: "سُورَةُ آلِ عِمْرَانَ",
    surahNameEnglish: "Ali 'Imran",
    surahNameMeaning: "Family of Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan",
    numberInSurah: 101,
    juz: 4,
  },
  5262: {
    number: 5262,
    arabicText: "ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍۢ طِبَاقًۭا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍۢ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍۢ",
    englishText: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5262.mp3",
    surahNumber: 67,
    surahNameArabic: "سُورَةُ المُلۡكِ",
    surahNameEnglish: "Al-Mulk",
    surahNameMeaning: "The Sovereignty",
    numberOfAyahs: 30,
    revelationType: "Meccan",
    numberInSurah: 3,
    juz: 29,
  },
  262: {
    number: 262,
    arabicText: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ",
    englishText: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
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
  6046: {
    number: 6046,
    arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا • إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    englishText: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6046.mp3",
    surahNumber: 94,
    surahNameArabic: "سُورَةُ الشَّرۡحِ",
    surahNameEnglish: "Ash-Sharh",
    surahNameMeaning: "The Relief",
    numberOfAyahs: 8,
    revelationType: "Meccan",
    numberInSurah: 5,
    juz: 30,
  },
  1780: {
    number: 1780,
    arabicText: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِى لَشَدِيدٌۭ",
    englishText: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe.'",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1780.mp3",
    surahNumber: 14,
    surahNameArabic: "سُورَةُ إِبۡرَاهِيمَ",
    surahNameEnglish: "Ibrahim",
    surahNameMeaning: "Abraham",
    numberOfAyahs: 52,
    revelationType: "Meccan",
    numberInSurah: 7,
    juz: 13,
  },
  5192: {
    number: 5192,
    arabicText: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ",
    englishText: "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5192.mp3",
    surahNumber: 65,
    surahNameArabic: "سُورَةُ الطَّلَاقِ",
    surahNameEnglish: "At-Talaq",
    surahNameMeaning: "The Divorce",
    numberOfAyahs: 12,
    revelationType: "Medinan",
    numberInSurah: 3,
    juz: 28,
  },
  4235: {
    number: 4235,
    arabicText: "قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
    englishText: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4235.mp3",
    surahNumber: 39,
    surahNameArabic: "سُورَةُ الزُّمَرِ",
    surahNameEnglish: "Az-Zumar",
    surahNameMeaning: "The Troops",
    numberOfAyahs: 75,
    revelationType: "Meccan",
    numberInSurah: 53,
    juz: 24,
  },
};

// Seed in-memory cache with curated fallbacks
for (const [key, val] of Object.entries(CURATED_FALLBACKS)) {
  verseCache.set(Number(key), val);
}

// Fetch a single Ayah with caching
async function fetchAyah(ayahNumber: number): Promise<QuranVerse | null> {
  if (verseCache.has(ayahNumber)) {
    return verseCache.get(ayahNumber)!;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.sahih,ar.alafasy`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "force-cache",
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }

    const json = await res.json();
    if (!json?.data || !Array.isArray(json.data) || json.data.length < 2) {
      throw new Error("Invalid structure");
    }

    const uthmani = json.data.find((d: any) => d.edition.identifier === "quran-uthmani") || json.data[0];
    const translation = json.data.find((d: any) => d.edition.identifier === "en.sahih") || json.data[1];
    const audioRecitation = json.data.find((d: any) => d.edition.identifier === "ar.alafasy") || json.data[2];

    const verse: QuranVerse = {
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

    verseCache.set(ayahNumber, verse);
    return verse;
  } catch (err) {
    if (CURATED_FALLBACKS[ayahNumber]) {
      return CURATED_FALLBACKS[ayahNumber];
    }
    // Pick any fallback to prevent empty slots
    const fallbackList = Object.values(CURATED_FALLBACKS);
    return fallbackList[ayahNumber % fallbackList.length];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme");
  const idsParam = searchParams.get("ids");
  const random = searchParams.get("random");

  let targetIds: number[] = [];

  if (idsParam) {
    targetIds = idsParam
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 6236);
  } else if (theme) {
    if (theme === "daily-verse") {
      targetIds = [getDailyVerseId()];
      // Also append a few related daily verses for exploration
      const dailyConfig = THEMES.find((t) => t.id === "daily-verse");
      if (dailyConfig) {
        targetIds = dailyConfig.ayahIds;
      }
    } else {
      const themeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];
      targetIds = themeConfig.ayahIds;
    }
  } else if (random) {
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "8", 10)), 20);
    const set = new Set<number>();
    while (set.size < limit) {
      set.add(Math.floor(Math.random() * 6236) + 1);
    }
    targetIds = Array.from(set);
  } else {
    // Default: Return the Daily Verse collection
    const defaultTheme = THEMES.find((t) => t.id === "daily-verse") || THEMES[0];
    targetIds = defaultTheme.ayahIds;
  }

  // Fetch in parallel with concurrency
  const results = await Promise.all(targetIds.map((id) => fetchAyah(id)));
  const validVerses = results.filter((v): v is QuranVerse => v !== null);

  // Mark approximately every 5th or 6th card as a light accent card (if not already set)
  validVerses.forEach((verse, idx) => {
    if (verse.isLightCard === undefined) {
      verse.isLightCard = idx === 3 || idx === 9;
    }
  });

  return NextResponse.json(validVerses, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
