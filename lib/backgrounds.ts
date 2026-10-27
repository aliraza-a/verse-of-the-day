// High-definition, free-to-use Unsplash nature photographs (landscapes, celestial, flora, earth)
// Direct Unsplash CDN with optimized WebP/JPEG formatting, no living beings.
export interface BackgroundImage {
  id: string;
  url: string;
  blurDataUrl?: string;
  alt: string;
  category: 'blossom' | 'forest' | 'water' | 'desert' | 'sky' | 'canyon' | 'aurora' | 'mountain';
}

export const NATURE_BACKGROUNDS: BackgroundImage[] = [
  {
    id: "cherry-blossoms",
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80",
    alt: "Pink cherry blossom flowers blooming against soft light",
    category: "blossom",
  },
  {
    id: "misty-pines",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    alt: "Deep pine forest shrouded in peaceful morning mist",
    category: "forest",
  },
  {
    id: "serene-ocean",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    alt: "Calm turquoise ocean meeting the horizon",
    category: "water",
  },
  {
    id: "desert-sunset-dunes",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    alt: "Golden sand dunes sculpted by wind at sunset",
    category: "desert",
  },
  {
    id: "aurora-borealis",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    alt: "Glowing emerald Northern Lights dancing across the night sky",
    category: "aurora",
  },
  {
    id: "canyon-rock-glow",
    url: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80",
    alt: "Warm sandstone canyon walls glowing with ambient sunlight",
    category: "canyon",
  },
  {
    id: "starry-cosmos",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    alt: "Breathtaking starry night sky showing celestial constellations",
    category: "sky",
  },
  {
    id: "autumn-canopy",
    url: "https://images.unsplash.com/photo-1507782613944-6754c93137a8?auto=format&fit=crop&w=1200&q=80",
    alt: "Golden amber autumn leaves in a peaceful forest",
    category: "forest",
  },
  {
    id: "emerald-mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    alt: "Majestic mountain peaks reaching above morning clouds",
    category: "mountain",
  },
  {
    id: "red-rock-arches",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    alt: "Atmospheric red rock desert canyon",
    category: "canyon",
  },
  {
    id: "tranquil-lake-reflections",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    alt: "Crystal clear mountain lake reflecting the twilight sky",
    category: "water",
  },
  {
    id: "golden-dusk-clouds",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    alt: "Vast evening sky with golden radiant clouds",
    category: "sky",
  },
  {
    id: "lavender-meadow",
    url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=80",
    alt: "Soothing purple lavender flowers in gentle sunlight",
    category: "blossom",
  },
  {
    id: "coastal-waves",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
    alt: "Deep blue ocean waves gently lapping shore rocks",
    category: "water",
  },
  {
    id: "misty-valley",
    url: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=1200&q=80",
    alt: "Lush green valley under dramatic clouds",
    category: "mountain",
  },
];

// Returns an HD nature background image deterministically based on Ayah number
export function getBackgroundForAyah(ayahNumber: number, isLightCard: boolean = false): BackgroundImage | null {
  if (isLightCard) {
    return null; // Light cards use CSS styling instead of photos
  }
  const index = Math.abs(ayahNumber) % NATURE_BACKGROUNDS.length;
  return NATURE_BACKGROUNDS[index];
}
