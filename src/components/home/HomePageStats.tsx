import React from "react";
import type { IslamicData, QuranAyah, HadithEntry } from "../../types/Types";
import type { FavoriteItem } from "../../hooks/useFavorites";
import { useLanguage } from "../../hooks/useContext";

interface HomePageStatsProps {
  cards: IslamicData[];
  quranData: QuranAyah[];
  hadithData: HadithEntry[];
  favorites: FavoriteItem[];
}

export const HomePageStats: React.FC<HomePageStatsProps> = ({
  cards,
  quranData,
  hadithData,
  favorites,
}) => {
  const { t } = useLanguage();

  // Explicit hex colors so stat numbers are unaffected by dependency (e.g. d3-color) or Tailwind build changes
  const statColors = [
    { number: "#15803d", label: "text-stone-600 dark:text-stone-400" }, // green - Featured Islamic Sources
    { number: "#1d4ed8", label: "text-stone-600 dark:text-stone-400" },  // blue - Quran Verses
    { number: "#6d28d9", label: "text-stone-600 dark:text-stone-400" },  // purple - Hadiths
    { number: "#c2410c", label: "text-stone-600 dark:text-stone-400" },  // orange-red - Favorites
  ] as const;

  const stats = [
    { value: cards.length, color: statColors[0], labelKey: "stats.islamicData" },
    { value: quranData.length, color: statColors[1], labelKey: "stats.quranVerses" },
    { value: hadithData.length, color: statColors[2], labelKey: "stats.hadiths" },
    { value: favorites.length, color: statColors[3], labelKey: "stats.favorites" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map(({ value, color, labelKey }) => (
        <div
          key={labelKey}
          className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700"
        >
          <div className="text-2xl font-bold" style={{ color: color.number }}>
            {value}
          </div>
          <div className={`text-sm ${color.label}`}>
            {t(labelKey)}
          </div>
        </div>
      ))}
    </div>
  );
};
