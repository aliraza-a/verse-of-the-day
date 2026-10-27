export interface ThemeConfig {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  ayahIds: number[];
}

export const THEMES: ThemeConfig[] = [
  {
    id: "all",
    name: "All",
    arabicName: "الكل",
    description: "Explore diverse verses across the Holy Qur'an",
    ayahIds: [
      262, 6046, 4235, 159, 162, 466, 493, 1318, 1587, 1780, 2005, 3441, 5192, 5279, 6216,
    ],
  },
  {
    id: "daily-verse",
    name: "Daily Verse",
    arabicName: "آية اليوم",
    description: "Today's highlighted verse for contemplation",
    ayahIds: [
      1587, // 11:114 Hud: "And establish prayer at the two ends of the day and at the approach of the night..."
      6083, // 93:4 Ad-Duhaa: "And the next life is certainly far better for you than this one."
      5416, // 70:5 Al-Ma'arij: "So endure patiently, with beautiful patience."
      159,  // 2:152 Al-Baqarah: "So remember Me; I will remember you. And be grateful to Me and do not deny Me."
      162,  // 2:155 Al-Baqarah: "And We will surely test you with something of fear and hunger..."
      527,  // 4:36 An-Nisa: "Worship Allah and associate nothing with Him..."
      3441, // 30:22 Ar-Rum: "And of His signs is the creation of the heavens and the earth..."
      1253, // 9:18 At-Tawbah: "The mosques of Allah are only to be maintained by those who believe in Allah..."
      466,  // 3:101 Ali 'Imran: "And whoever holds firmly to Allah has indeed been guided to a straight path."
      5262, // 67:3 Al-Mulk: "[And] who created seven heavens in layers..."
    ],
  },
  {
    id: "gratitude",
    name: "Gratitude",
    arabicName: "الشكر",
    description: "Verses acknowledging divine gifts and expressing thankfulness",
    ayahIds: [
      159,  // 2:152: "So remember Me; I will remember you. And be grateful to Me..."
      1780, // 14:7: "If you are grateful, I will surely increase you [in favor]..."
      3281, // 27:40: "This is from the favor of my Lord to test me whether I will be grateful..."
      3440, // 31:12: "And whoever is grateful is grateful for [the benefit of] himself..."
      4116, // 39:66: "Nay, but worship Allah, and be of those who give thanks."
      4980, // 55:13: "So which of the favors of your Lord would you deny?"
      2005, // 16:18: "And if you should count the favors of Allah, you could not enumerate them."
    ],
  },
  {
    id: "patience",
    name: "Patience",
    arabicName: "الصبر",
    description: "Guidance on enduring hardships with faith and steadfastness",
    ayahIds: [
      162,  // 2:155: "And We will surely test you with something of fear and hunger..."
      493,  // 3:200: "O you who have believed, persevere and endure and remain stationed..."
      5416, // 70:5: "So endure patiently, with beautiful patience."
      6046, // 94:5: "For indeed, with hardship [will be] ease."
      1587, // 12:87: "And do not despair of the mercy of Allah..."
      4141, // 39:10: "Indeed, the patient will be given their reward without account."
    ],
  },
  {
    id: "trust",
    name: "Trust in Allah",
    arabicName: "التوكل",
    description: "Relying wholly upon the Almighty in every circumstance",
    ayahIds: [
      466,  // 3:173: "Sufficient for us is Allah, and [He is] the best Disposer of affairs."
      1318, // 9:129: "Sufficient for me is Allah; there is no deity except Him..."
      5192, // 65:3: "And whoever relies upon Allah - then He is sufficient for him..."
      1128, // 8:2: "The believers are only those who, when Allah is mentioned, their hearts feel fear..."
      3138, // 26:217: "And rely upon the Exalted in Might, the Merciful."
    ],
  },
  {
    id: "purpose",
    name: "Purpose",
    arabicName: "الغاية",
    description: "Reflecting upon human purpose, creation, and destiny",
    ayahIds: [
      5279, // 67:2: "[He] who created death and life to test you as to which of you is best in deed..."
      3441, // 30:22: "And of His signs is the creation of the heavens and the earth..."
      2571, // 21:87: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."
      5613, // 76:22: "[And it will be said], 'Indeed, this is for you a reward, and your effort has been appreciated.'"
      4235, // 39:53: "Say, 'O My servants who have transgressed against themselves...'"
    ],
  },
  {
    id: "peace",
    name: "Inner Peace",
    arabicName: "السكينة",
    description: "Finding tranquility and solace through divine remembrance",
    ayahIds: [
      1735, // 13:28: "Unquestionably, by the remembrance of Allah hearts are assured."
      6083, // 93:4: "And the next life is certainly far better for you than this one."
      6047, // 94:6: "Indeed, with hardship [will be] ease."
      262,  // 2:255: Ayat al-Kursi
      6216, // 112:1-4: Surah Al-Ikhlas
    ],
  },
];

// Returns today's specific daily verse based on day of the year
export function getDailyVerseId(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  const dailyTheme = THEMES.find((t) => t.id === "daily-verse")!;
  return dailyTheme.ayahIds[dayOfYear % dailyTheme.ayahIds.length];
}
