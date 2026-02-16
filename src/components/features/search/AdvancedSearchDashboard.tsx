import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { SmartSearchBar } from "./SmartSearchBar";
import { AdvancedFilterPanel } from "./AdvancedFilterPanel";
import { SearchResults } from "./SearchResults";
import type {
  IslamicData,
  QuranAyah,
  HadithEntry,
  UnifiedSearchResult,
  FilterState,
} from "../../../types/Types";
import type { FavoriteItem } from "../../../hooks/useFavorites";
import mediaBackground from "../../../assets/media-5000790.svg";
import { useLanguage } from "../../../hooks/useContext";

interface AdvancedSearchDashboardProps {
  data: IslamicData[];
  quranData?: QuranAyah[];
  hadithData?: HadithEntry[];
  onFavorite: (item: FavoriteItem) => void;
  isFavorite: (item: FavoriteItem) => boolean;
}

// AdvancedSearchDashboard provides a comprehensive search experience across all Islamic data
export const AdvancedSearchDashboard: React.FC<AdvancedSearchDashboardProps> =
  React.memo(
    ({ data, quranData = [], hadithData = [], onFavorite, isFavorite }) => {
      const { t } = useLanguage();
      const [searchQuery, setSearchQuery] = useState("");
      const [filters, setFilters] = useState<FilterState>({
        types: [],
        categories: [],
        searchFields: [], // Default to no search fields selected - user has full control
        sortBy: "title",
        sortOrder: "asc",
        fulfillmentStatus: [],
        prophecyCategories: [],
        yearRange: { min: 0, max: 2024 },
        dataSources: [], // Default: nothing selected - user must select at least one source and one filter
        // Initialize new Quran filters with proper defaults
        quranSurahs: [],
        quranVerseRange: { min: 1, max: 6236 }, // Use actual Quran verse range based on loaded data
        quranPlaceOfRevelation: [],
        quranSajdahOnly: false, // Filter for Sajdah verses only
        // Initialize new Hadith filters with proper defaults
        hadithNumberRange: { min: 1, max: 13143 }, // Use actual Hadith range
        hadithCategories: [],
      });
      const [filteredResults, setFilteredResults] = useState<
        UnifiedSearchResult[]
      >([]);
      const [isSearching, setIsSearching] = useState(false);
      const [hasSearched, setHasSearched] = useState(false);
      const [actualResultsCount, setActualResultsCount] = useState(0);
      const searchResultsRef = useRef<HTMLDivElement>(null);
      const filtersRef = useRef<FilterState>(filters);
      filtersRef.current = filters;

      // Sync hadith range max with actual data when still at fallback 13143, so "X active" is accurate
      const HADITH_MAX_FALLBACK = 13143;
      useEffect(() => {
        if (hadithData.length === 0) return;
        const actualMax = hadithData.length;
        setFilters((prev) => {
          if (
            prev.hadithNumberRange.max === HADITH_MAX_FALLBACK &&
            actualMax > HADITH_MAX_FALLBACK
          ) {
            return {
              ...prev,
              hadithNumberRange: { ...prev.hadithNumberRange, max: actualMax },
            };
          }
          return prev;
        });
      }, [hadithData.length]);

      // Memoized processed data to prevent recalculation on every render
      const processedIslamicData = useMemo(() => {
        return data.map((item) => ({
          id: `islamic-${item.title}`,
          type: "islamic data" as const,
          title: item.title,
          content: [
            item.notes || "",
            item.sources?.primary || "",
            item.sources?.verification || "",
            item.sources?.methodology || "",
            item.sources?.source || "",
            item.fulfillmentEvidence || "",
            item.prophecyCategory || "",
          ].join(" "),
          source: item.sources?.source || "Islamic Data",
          data: item,
          relevance: 100,
          timestamp: new Date(),
        }));
      }, [data]);

      const processedQuranData = useMemo(() => {
        return quranData.map((ayah) => ({
          id: `quran-${ayah.surah_no}-${ayah.ayah_no_surah}`,
          type: "quran" as const,
          title: `${ayah.surah_name_en} ${ayah.ayah_no_surah}`,
          content: [
            ayah.ayah_en,
            ayah.ayah_ar,
            ayah.surah_name_en,
            ayah.surah_name_ar,
            ayah.place_of_revelation,
          ].join(" "),
          source: `Quran - ${ayah.surah_name_en} ${ayah.ayah_no_surah}`,
          data: ayah,
          relevance: 100,
          timestamp: new Date(),
        }));
      }, [quranData]);

      const processedHadithData = useMemo(() => {
        // Sort hadith data by number first to ensure proper ordering
        const sortedHadithData = [...hadithData].sort((a, b) => {
          const aNumber = parseInt(a.number);
          const bNumber = parseInt(b.number);
          return aNumber - bNumber;
        });

        return sortedHadithData.map((hadith, index) => ({
          id: `hadith-${hadith.number}-${index}`,
          type: "hadith" as const,
          title: `Hadith ${hadith.number}`,
          content: Object.values(hadith).join(" "),
          source: "Sahih Bukhari",
          data: hadith,
          relevance: 100,
          timestamp: new Date(),
        }));
      }, [hadithData]);

      // Memoized statistics calculations
      const totalDataCount = useMemo(
        () => data.length + quranData.length + hadithData.length,
        [data.length, quranData.length, hadithData.length],
      );

      // Calculate the total filtered data count based on current filters
      const filteredDataCount = useMemo(() => {
        let count = 0;

        // Count Islamic data based on filters
        if (filters.dataSources.includes("islamic data")) {
          let islamicCount = data.length;

          // Apply Islamic data filters
          if (filters.types.length > 0) {
            islamicCount = data.filter((item) =>
              filters.types.includes(item.type),
            ).length;
          }
          if (filters.fulfillmentStatus.length > 0) {
            islamicCount = data.filter(
              (item) =>
                item.fulfillmentStatus &&
                filters.fulfillmentStatus.includes(item.fulfillmentStatus),
            ).length;
          }
          if (filters.prophecyCategories.length > 0) {
            islamicCount = data.filter(
              (item) =>
                item.prophecyCategory &&
                filters.prophecyCategories.includes(item.prophecyCategory),
            ).length;
          }
          if (filters.yearRange.min > 0 || filters.yearRange.max < 2024) {
            islamicCount = data.filter((item) => {
              const yearRevealed = item.yearRevealed || 0;
              const yearFulfilled = item.yearFulfilled || 0;
              return (
                (yearRevealed >= filters.yearRange.min &&
                  yearRevealed <= filters.yearRange.max) ||
                (yearFulfilled >= filters.yearRange.min &&
                  yearFulfilled <= filters.yearRange.max)
              );
            }).length;
          }
          count += islamicCount;
        }

        // Count Quran data based on filters
        if (filters.dataSources.includes("quran")) {
          let quranCount = quranData.length;

          if (filters.quranSurahs.length > 0) {
            quranCount = quranData.filter((ayah) =>
              filters.quranSurahs.includes(ayah.surah_no.toString()),
            ).length;
          }
          if (
            filters.quranVerseRange.min !== 1 ||
            filters.quranVerseRange.max !== 6236
          ) {
            quranCount = quranData.filter((ayah) => {
              const verseNumber = parseInt(ayah.ayah_no_surah.toString());
              return (
                verseNumber >= filters.quranVerseRange.min &&
                verseNumber <= filters.quranVerseRange.max
              );
            }).length;
          }
          if (filters.quranPlaceOfRevelation.length > 0) {
            quranCount = quranData.filter((ayah) =>
              filters.quranPlaceOfRevelation.includes(ayah.place_of_revelation),
            ).length;
          }
          count += quranCount;
        }

        // Count Hadith data based on filters
        if (filters.dataSources.includes("hadith")) {
          let hadithCount = hadithData.length;

          if (
            filters.hadithNumberRange.min !== 1 ||
            filters.hadithNumberRange.max !== hadithData.length
          ) {
            hadithCount = hadithData.filter((hadith) => {
              const hadithNumber = parseInt(hadith.number);
              return (
                hadithNumber >= filters.hadithNumberRange.min &&
                hadithNumber <= filters.hadithNumberRange.max
              );
            }).length;
          }
          count += hadithCount;
        }

        return count;
      }, [data, quranData, hadithData, filters]);

      // Enhanced search function: always reads latest filters from ref to avoid stale closure
      const performSearch = useCallback(
        (query: string) => {
          setIsSearching(true);
          setHasSearched(true);

          setTimeout(() => {
            const currentFilters = filtersRef.current;
            let results: UnifiedSearchResult[] = [];

            // Guard: if no valid selection (no sources or any selected source has no filter), return nothing and show inline messages
            if (currentFilters.dataSources.length === 0) {
              setFilteredResults([]);
              setActualResultsCount(0);
              setIsSearching(false);
              return;
            }
            const quranNoFilter =
              currentFilters.dataSources.includes("quran") &&
              !(
                currentFilters.quranSurahs.length > 0 ||
                currentFilters.quranVerseRange.min !== 1 ||
                currentFilters.quranVerseRange.max !== 6236 ||
                currentFilters.quranPlaceOfRevelation.length > 0 ||
                currentFilters.quranSajdahOnly
              );
            const islamicNoFilter =
              currentFilters.dataSources.includes("islamic data") &&
              !(
                currentFilters.types.length > 0 ||
                currentFilters.fulfillmentStatus.length > 0 ||
                currentFilters.prophecyCategories.length > 0 ||
                currentFilters.yearRange.min > 0 ||
                currentFilters.yearRange.max < 2024
              );
            const hadithSourceSelected = currentFilters.dataSources.some(
              (s) => String(s).toLowerCase().trim() === "hadith"
            );
            // Hadith: only chapter counts as "filter applied" for guard (number range uses data min/max and can falsely be true when data has large ids)
            const hadithNoFilter =
              hadithSourceSelected &&
              currentFilters.hadithCategories.length === 0;
            if (quranNoFilter || islamicNoFilter || hadithNoFilter) {
              setFilteredResults([]);
              setActualResultsCount(0);
              setIsSearching(false);
              return;
            }

            // Process Islamic data: only include results when at least one filter is selected (default: no results)
            if (currentFilters.dataSources.includes("islamic data")) {
              const hasIslamicTypes = currentFilters.types.length > 0;
              const hasFulfillment =
                currentFilters.fulfillmentStatus.length > 0;
              const hasProphecy =
                currentFilters.prophecyCategories.length > 0;
              const yearRangeNarrowed =
                currentFilters.yearRange.min > 0 ||
                currentFilters.yearRange.max < 2024;
              const hasIslamicFilter =
                hasIslamicTypes ||
                hasFulfillment ||
                hasProphecy ||
                yearRangeNarrowed;

              if (hasIslamicFilter) {
                let islamicResults = processedIslamicData;

                if (hasIslamicTypes) {
                  islamicResults = islamicResults.filter((result) => {
                    const item = result.data as IslamicData;
                    return (
                      item.type &&
                      currentFilters.types.includes(item.type)
                    );
                  });
                }
                if (hasFulfillment) {
                  islamicResults = islamicResults.filter((result) => {
                    const item = result.data as IslamicData;
                    return (
                      item.fulfillmentStatus &&
                      currentFilters.fulfillmentStatus.includes(
                        item.fulfillmentStatus,
                      )
                    );
                  });
                }
                if (hasProphecy) {
                  islamicResults = islamicResults.filter((result) => {
                    const item = result.data as IslamicData;
                    return (
                      item.prophecyCategory &&
                      currentFilters.prophecyCategories.includes(
                        item.prophecyCategory,
                      )
                    );
                  });
                }
                if (yearRangeNarrowed) {
                  islamicResults = islamicResults.filter((result) => {
                    const item = result.data as IslamicData;
                    const yearRevealed = item.yearRevealed ?? 0;
                    const yearFulfilled = item.yearFulfilled ?? 0;
                    return (
                      (yearRevealed >= currentFilters.yearRange.min &&
                        yearRevealed <= currentFilters.yearRange.max) ||
                      (yearFulfilled >= currentFilters.yearRange.min &&
                        yearFulfilled <= currentFilters.yearRange.max)
                    );
                  });
                }

                results.push(...islamicResults);
              }
            }

            // Process Quran data: only include results when at least one Quran filter is selected (default: no results)
            if (currentFilters.dataSources.includes("quran")) {
              const hasQuranSurahs = currentFilters.quranSurahs.length > 0;
              const verseRangeNarrowed =
                currentFilters.quranVerseRange.min !== 1 ||
                currentFilters.quranVerseRange.max !== 6236;
              const hasQuranPlace =
                currentFilters.quranPlaceOfRevelation.length > 0;
              const hasQuranFilter =
                hasQuranSurahs ||
                verseRangeNarrowed ||
                hasQuranPlace ||
                currentFilters.quranSajdahOnly;

              if (hasQuranFilter) {
                let quranResults = processedQuranData;

                if (hasQuranSurahs) {
                  quranResults = quranResults.filter((result) => {
                    const ayah = result.data as QuranAyah;
                    return currentFilters.quranSurahs.includes(
                      ayah.surah_no.toString(),
                    );
                  });
                }

                if (verseRangeNarrowed) {
                  quranResults = quranResults.filter((result) => {
                    const ayah = result.data as QuranAyah;
                    const verseNumber = parseInt(
                      ayah.ayah_no_surah.toString(),
                    );
                    return (
                      verseNumber >= currentFilters.quranVerseRange.min &&
                      verseNumber <= currentFilters.quranVerseRange.max
                    );
                  });
                }

                if (hasQuranPlace) {
                  quranResults = quranResults.filter((result) => {
                    const ayah = result.data as QuranAyah;
                    return currentFilters.quranPlaceOfRevelation.includes(
                      ayah.place_of_revelation,
                    );
                  });
                }

                if (currentFilters.quranSajdahOnly) {
                  quranResults = quranResults.filter((result) => {
                    const ayah = result.data as QuranAyah;
                    return ayah.sajah_ayah === true;
                  });
                }

                results.push(...quranResults);
              }
            }

            // Process Hadith data: only include results when at least one filter is selected (default: no results)
            const hadithSelected = currentFilters.dataSources.some(
              (s) => String(s).toLowerCase().trim() === "hadith"
            );
            if (hadithSelected) {
              // Hadith: require at least one chapter (same idea as Quran requiring surah) so "no filter" = no results
              const hasHadithCategories =
                currentFilters.hadithCategories.length > 0;

              if (hasHadithCategories) {
                let hadithResults = [...processedHadithData];

                hadithResults = hadithResults.filter((result) => {
                  const hadith = result.data as HadithEntry;
                  return (
                    hadith.chapter != null &&
                    currentFilters.hadithCategories.includes(
                      hadith.chapter,
                    )
                  );
                });

                // Optional: narrow by number range when user has changed from full range (use data min/max)
                const hadithNums = processedHadithData
                  .map((r) => parseInt((r.data as HadithEntry).number, 10))
                  .filter((n) => !Number.isNaN(n));
                const dataMin =
                  hadithNums.length > 0 ? Math.min(...hadithNums) : 1;
                const dataMax =
                  hadithNums.length > 0 ? Math.max(...hadithNums) : 13143;
                const hadithRangeNarrowed =
                  currentFilters.hadithNumberRange.min > dataMin ||
                  currentFilters.hadithNumberRange.max < dataMax;
                if (hadithRangeNarrowed) {
                  hadithResults = hadithResults.filter((result) => {
                    const hadith = result.data as HadithEntry;
                    const n = parseInt(hadith.number, 10);
                    if (Number.isNaN(n)) return true;
                    return (
                      n >= currentFilters.hadithNumberRange.min &&
                      n <= currentFilters.hadithNumberRange.max
                    );
                  });
                }

                results.push(...hadithResults);
              }
            }

            // Defensive: only keep results whose type is in selected data sources (normalize for casing)
            const sourceSet = new Set(
              currentFilters.dataSources.map((s) =>
                String(s).toLowerCase().trim()
              )
            );
            results = results.filter((result) =>
              sourceSet.has(result.type.toLowerCase()),
            );

            // Apply search query with enhanced field coverage
            if (query.trim()) {
              const searchTerms = query
                .toLowerCase()
                .split(" ")
                .filter((term) => term.length > 0);

              results = results.filter((result) => {
                const searchableText = [
                  result.title.toLowerCase(),
                  result.content.toLowerCase(),
                  result.source.toLowerCase(),
                ].join(" ");

                // Check if ANY search terms are found (more flexible)
                return searchTerms.some((term) =>
                  searchableText.includes(term),
                );
              });
            }

            // Enhanced sorting options
            results.sort((a, b) => {
              let aValue: string | number = "";
              let bValue: string | number = "";

              switch (currentFilters.sortBy) {
                case "title":
                  aValue = a.title || "";
                  bValue = b.title || "";
                  break;
                case "type":
                  aValue = a.type || "";
                  bValue = b.type || "";
                  break;
                case "source": // New sort option
                  aValue = a.source || "";
                  bValue = b.source || "";
                  break;
                case "hadithNumber":
                  // Special sorting for hadith numbers
                  if (a.type === "hadith" && b.type === "hadith") {
                    const aHadith = a.data as HadithEntry;
                    const bHadith = b.data as HadithEntry;
                    const aNumber = parseInt(aHadith.number);
                    const bNumber = parseInt(bHadith.number);
                    aValue = aNumber;
                    bValue = bNumber;
                  } else {
                    aValue = a.title || "";
                    bValue = b.title || "";
                  }
                  break;
                case "relevance":
                  // For relevance, we'll use the number of search term matches
                  if (query.trim()) {
                    const searchTerms = query
                      .toLowerCase()
                      .split(" ")
                      .filter((term) => term.length > 0);
                    aValue = searchTerms.filter(
                      (term) =>
                        a.title?.toLowerCase().includes(term) ||
                        a.content?.toLowerCase().includes(term) ||
                        false,
                    ).length;
                    bValue = searchTerms.filter(
                      (term) =>
                        b.title?.toLowerCase().includes(term) ||
                        b.content?.toLowerCase().includes(term) ||
                        false,
                    ).length;
                  } else {
                    aValue = 0;
                    bValue = 0;
                  }
                  break;
                default:
                  aValue = a.title || "";
                  bValue = b.title || "";
              }

              if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = aValue.localeCompare(bValue);
                return currentFilters.sortOrder === "asc"
                  ? comparison
                  : -comparison;
              } else {
                const comparison = (aValue as number) - (bValue as number);
                return currentFilters.sortOrder === "asc"
                  ? comparison
                  : -comparison;
              }
            });

            // Limit results for performance
            const MAX_RESULTS = 1000;
            const actualResultsCount = results.length;
            results = results.slice(0, MAX_RESULTS);

            setFilteredResults(results);
            setActualResultsCount(actualResultsCount); // Set actual results count
            setIsSearching(false);

            // Auto-scroll to search results after search completes
            setTimeout(() => {
              if (searchResultsRef.current && results.length > 0) {
                searchResultsRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 150); // Small delay to ensure results are rendered
          }, 100);
        },
        [
          processedIslamicData,
          processedQuranData,
          processedHadithData,
          hadithData.length,
          totalDataCount,
          filteredDataCount,
        ],
      );

      // Handle search query changes - only update state, don't trigger search
      const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
      }, []);

      // Handle filter changes - only update state, don't trigger search.
      // Accept updater function so panel always applies changes to latest state (avoids stale closure when toggling multiple options quickly).
      const handleFiltersChange = useCallback(
        (updater: FilterState | ((prev: FilterState) => FilterState)) => {
          setFilters((prev) => {
            const next =
              typeof updater === "function" ? updater(prev) : updater;
            filtersRef.current = next;
            return next;
          });
        },
        []
      );

      // Handle clear filters - only update state, don't trigger search
      const handleClearFilters = useCallback(() => {
        const hadithMax =
          hadithData.length > 0 ? hadithData.length : HADITH_MAX_FALLBACK;
        const defaultFilters: FilterState = {
          types: [],
          categories: [],
          searchFields: [],
          sortBy: "title",
          sortOrder: "asc",
          fulfillmentStatus: [],
          prophecyCategories: [],
          yearRange: { min: 0, max: 2024 },
          dataSources: [], // Reset to nothing selected - user must select source(s) and filter(s)
          quranSurahs: [],
          quranVerseRange: { min: 1, max: 6236 },
          quranPlaceOfRevelation: [],
          quranSajdahOnly: false,
          hadithNumberRange: { min: 1, max: hadithMax },
          hadithCategories: [],
        };
        setFilters(defaultFilters);
      }, [hadithData.length]);

      const islamicDataCount = useMemo(
        () => filteredResults.filter((r) => r.type === "islamic data").length,
        [filteredResults],
      );

      const quranCount = useMemo(
        () => filteredResults.filter((r) => r.type === "quran").length,
        [filteredResults],
      );

      const hadithCount = useMemo(
        () => filteredResults.filter((r) => r.type === "hadith").length,
        [filteredResults],
      );

      const quranSelectedWithoutFilter = useMemo(() => {
        if (!hasSearched || !filters.dataSources.includes("quran"))
          return false;
        const hasFilter =
          filters.quranSurahs.length > 0 ||
          filters.quranVerseRange.min !== 1 ||
          filters.quranVerseRange.max !== 6236 ||
          filters.quranPlaceOfRevelation.length > 0 ||
          filters.quranSajdahOnly;
        return !hasFilter;
      }, [
        hasSearched,
        filters.dataSources,
        filters.quranSurahs.length,
        filters.quranVerseRange.min,
        filters.quranVerseRange.max,
        filters.quranPlaceOfRevelation.length,
        filters.quranSajdahOnly,
      ]);

      const islamicSelectedWithoutFilter = useMemo(() => {
        if (!hasSearched || !filters.dataSources.includes("islamic data"))
          return false;
        const hasFilter =
          filters.types.length > 0 ||
          filters.fulfillmentStatus.length > 0 ||
          filters.prophecyCategories.length > 0 ||
          filters.yearRange.min > 0 ||
          filters.yearRange.max < 2024;
        return !hasFilter;
      }, [
        hasSearched,
        filters.dataSources,
        filters.types.length,
        filters.fulfillmentStatus.length,
        filters.prophecyCategories.length,
        filters.yearRange.min,
        filters.yearRange.max,
      ]);

      const hadithSelectedWithoutFilter = useMemo(() => {
        if (!hasSearched) return false;
        const hadithSelected = filters.dataSources.some(
          (s) => String(s).toLowerCase().trim() === "hadith"
        );
        if (!hadithSelected) return false;
        // Hadith: only chapter counts as "filter applied" (same as isSearchDisabled)
        return filters.hadithCategories.length === 0;
      }, [
        hasSearched,
        filters.dataSources,
        filters.hadithCategories.length,
      ]);

      // Disable Confirm Search when no data sources or any selected source has no filter applied
      const isSearchDisabled = useMemo(() => {
        if (filters.dataSources.length === 0) return true;
        const quranNoFilter =
          filters.dataSources.includes("quran") &&
          !(
            filters.quranSurahs.length > 0 ||
            filters.quranVerseRange.min !== 1 ||
            filters.quranVerseRange.max !== 6236 ||
            filters.quranPlaceOfRevelation.length > 0 ||
            filters.quranSajdahOnly
          );
        const islamicNoFilter =
          filters.dataSources.includes("islamic data") &&
          !(
            filters.types.length > 0 ||
            filters.fulfillmentStatus.length > 0 ||
            filters.prophecyCategories.length > 0 ||
            filters.yearRange.min > 0 ||
            filters.yearRange.max < 2024
          );
        const hadithSelected = filters.dataSources.some(
          (s) => String(s).toLowerCase().trim() === "hadith"
        );
        // Hadith: only chapter counts as "filter applied" for button (number range uses data min/max and can falsely enable)
        const hadithNoFilter =
          hadithSelected && filters.hadithCategories.length === 0;
        return quranNoFilter || islamicNoFilter || hadithNoFilter;
      }, [
        filters.dataSources,
        filters.quranSurahs.length,
        filters.quranVerseRange.min,
        filters.quranVerseRange.max,
        filters.quranPlaceOfRevelation.length,
        filters.quranSajdahOnly,
        filters.types.length,
        filters.fulfillmentStatus.length,
        filters.prophecyCategories.length,
        filters.yearRange.min,
        filters.yearRange.max,
        filters.hadithCategories.length,
      ]);

      // When filters change and no valid selection remains (search would be disabled), clear results and return to "ready to search" state
      useEffect(() => {
        if (!hasSearched) return;
        if (!isSearchDisabled) return;
        setHasSearched(false);
        setFilteredResults([]);
      }, [isSearchDisabled, hasSearched]);

      // Memoized percentage calculation - based on filtered data count
      const percentageOfTotal = useMemo(() => {
        // Only calculate if we have actual data loaded
        if (filteredDataCount === 0) {
          return "0.0";
        }

        if (filteredResults.length === 0) {
          return "0.0";
        }

        // Use the actual results count for percentage calculation
        const resultsCountForPercentage =
          actualResultsCount > 0 ? actualResultsCount : filteredResults.length;
        const percentage = (resultsCountForPercentage / totalDataCount) * 100;

        return percentage.toFixed(1);
      }, [
        filteredResults.length,
        filteredDataCount,
        data.length,
        quranData.length,
        hadithData.length,
        actualResultsCount,
        filters,
        totalDataCount,
      ]);

      return (
        <div className="space-y-6">
          {/* Search Header with Inline Search Bar */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {t("search.advancedSearch")}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 max-w-2xl">
                  {t("search.description")}
                </p>
              </div>
              <div className="lg:w-96">
                <SmartSearchBar
                  data={data} // Still passes Islamic data for auto-complete, might need adjustment later
                  onSearch={handleSearch}
                  placeholder={t("search.placeholder")}
                />
              </div>
            </div>
          </div>

          {/* Advanced Filter Panel */}
          <AdvancedFilterPanel
            data={data}
            quranData={quranData}
            hadithData={hadithData}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Confirm Search Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => performSearch(searchQuery)}
              disabled={isSearching || isSearchDisabled}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t("search.searching")}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t("search.confirmSearch")}
                </>
              )}
            </button>

            {hasSearched && (
              <button
                onClick={() => {
                  setHasSearched(false);
                  setFilteredResults([]);
                  setSearchQuery("");
                  setFilters({
                    types: [],
                    categories: [],
                    searchFields: [],
                    sortBy: "title",
                    sortOrder: "asc",
                    fulfillmentStatus: [],
                    prophecyCategories: [],
                    yearRange: { min: 0, max: 2024 },
                    dataSources: [], // Reset to nothing selected
                    quranSurahs: [],
                    quranVerseRange: { min: 1, max: 6236 },
                    quranPlaceOfRevelation: [],
                    quranSajdahOnly: false,
                    hadithNumberRange: { min: 1, max: 13143 },
                    hadithCategories: [],
                  });
                }}
                className="px-6 py-3 bg-stone-500 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t("search.newSearch")}
              </button>
            )}
          </div>

          {/* Search Results - Only show if user has searched */}
          {!hasSearched ? (
            <div
              className="py-12 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 relative overflow-hidden"
              style={{
                backgroundImage: `url(${mediaBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "overlay",
              }}
            >
              {/* Semi-transparent overlay to ensure text readability - Same opacity for both modes */}
              <div className="absolute inset-0 bg-neutral-500/50 dark:bg-neutral-800/50"></div>
              <div className="max-w-md mx-auto text-left relative z-10">
                <h3
                  className="text-lg font-semibold mb-2 search-ready-title flex items-center gap-2"
                  style={{
                    color: "#EDEADE",
                    textShadow: "0 3px 6px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  {t("search.readyToSearch")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-question-lg flex-shrink-0"
                    viewBox="0 0 16 16"
                    style={{
                      filter: "drop-shadow(0 3px 6px rgba(0, 0, 0, 0.9))",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"
                    />
                  </svg>
                </h3>
                <p
                  className="mb-4 search-ready-description"
                  style={{
                    color: "#fffdd0",
                    textShadow: "0 3px 6px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  {t("search.readyDescription")}
                </p>
                <div
                  className="text-sm search-ready-list"
                  style={{
                    color: "#fffdd0",
                    textShadow: "0 3px 6px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  {t("search.readyInstructions")
                    .split("\n")
                    .map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                </div>
              </div>

              {/* Dark mode styles for search ready section */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                   @media (prefers-color-scheme: dark) {
                     .dark .search-ready-title {
                       color: #f5f5dc !important;
                       text-shadow: 0 3px 6px rgba(0, 0, 0, 0.9) !important;
                     }
                                           .dark .search-ready-title svg {
                        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.9)) !important;
                        color: #f5f5dc !important;
                      }
                     .dark .search-ready-description {
                       color: #f5f5dc !important;
                       text-shadow: 0 3px 6px rgba(0, 0, 0, 0.9) !important;
                     }
                     .dark .search-ready-list {
                       color: #f5f5dc !important;
                       text-shadow: 0 3px 6px rgba(0, 0, 0, 0.9) !important;
                     }
                   }
                 `,
                }}
              />
            </div>
          ) : (
            <>
              {(quranSelectedWithoutFilter ||
                islamicSelectedWithoutFilter ||
                hadithSelectedWithoutFilter) && (
                <div
                  role="alert"
                  className="mb-4 space-y-2 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
                >
                  {quranSelectedWithoutFilter && (
                    <p className="font-medium">
                      {t("search.quranSelectFilter")}
                    </p>
                  )}
                  {islamicSelectedWithoutFilter && (
                    <p className="font-medium">
                      {t("search.islamicSelectFilter")}
                    </p>
                  )}
                  {hadithSelectedWithoutFilter && (
                    <p className="font-medium">
                      {t("search.hadithSelectFilter")}
                    </p>
                  )}
                </div>
              )}
              <div ref={searchResultsRef}>
                <SearchResults
                  results={filteredResults}
                  searchQuery={searchQuery}
                  totalResults={filteredResults.length}
                  onFavorite={onFavorite}
                  isFavorite={isFavorite}
                  isLoading={isSearching}
                />
              </div>

              {/* Enhanced Search Features */}
              <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
                <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
                  {t("search.features")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h5 className="font-medium text-stone-700 dark:text-stone-300">
                      {t("search.dataSources")}
                    </h5>
                    <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                      <li>
                        • <strong>{t("search.prophecies")}</strong>{" "}
                        {t("search.propheciesDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.quranVerses")}</strong>{" "}
                        {t("search.quranVersesDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.hadiths")}</strong>{" "}
                        {t("search.hadithsDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.crossReference")}</strong>{" "}
                        {t("search.crossReferenceDesc")}{" "}
                        <span className="text-red-500 dark:text-red-400">
                          {t("search.consultScholars")}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-stone-700 dark:text-stone-300">
                      {t("search.advancedFiltering")}
                    </h5>
                    <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                      <li>
                        • <strong>{t("search.quranFilters")}</strong>{" "}
                        {t("search.quranFiltersDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.hadithFilters")}</strong>{" "}
                        {t("search.hadithFiltersDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.islamicDataFilters")}</strong>{" "}
                        {t("search.islamicDataFiltersDesc")}
                      </li>
                      <li>
                        • <strong>{t("search.unifiedSearch")}</strong>{" "}
                        {t("search.unifiedSearchDesc")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Enhanced Search Statistics */}
          {hasSearched && filteredResults.length > 0 && totalDataCount > 0 && (
            <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
              <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-3">
                {t("search.statistics")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {filteredResults.length}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {t("search.totalResults")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {islamicDataCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {t("search.islamicData")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {quranCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {t("search.quranVerses")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {hadithCount}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {t("search.hadiths")}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                    {percentageOfTotal}%
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {t("search.ofTotalData")}
                  </div>
                </div>
              </div>
              {filteredResults.length === 1000 && (
                <div className="mt-3 text-xs text-stone-500 dark:text-stone-400 text-center">
                  {t("search.limitedResults")}
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
  );
