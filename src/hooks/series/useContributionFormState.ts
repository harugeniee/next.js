import { useState, useCallback, useMemo } from "react";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { CreateSeriesDto } from "@/lib/api/series";
import { ContributionCategory } from "@/lib/validators/contribution-series";

/**
 * Transform BackendSeries to CreateSeriesDto format
 * This prepares the data for contribution submission
 */
/**
 * Fields that should NOT be included in contribution submissions
 * These are admin-only or system-managed fields
 */
const EXCLUDED_FIELDS = [
  "meanScore",
  "isLocked",
  "trending",
  "autoCreateForumThread",
  "isRecommendationBlocked",
  "isReviewBlocked",
  "notes",
] as const;

/**
 * Transform BackendSeries to CreateSeriesDto format
 * This prepares the data for contribution submission
 * Excludes admin-only and system-managed fields
 */
function transformSeriesToDto(series: BackendSeries): Partial<CreateSeriesDto> {
  return {
    myAnimeListId: series.myAnimeListId,
    aniListId: series.aniListId,
    title: series.title,
    type: series.type as CreateSeriesDto["type"],
    format: series.format as CreateSeriesDto["format"],
    status: series.status as CreateSeriesDto["status"],
    description: series.description,
    startDate: series.startDate ? new Date(series.startDate) : undefined,
    endDate: series.endDate ? new Date(series.endDate) : undefined,
    season: series.season as CreateSeriesDto["season"],
    seasonYear: series.seasonYear,
    seasonInt: series.seasonInt,
    episodes: series.episodes,
    duration: series.duration,
    chapters: series.chapters,
    volumes: series.volumes,
    countryOfOrigin: series.countryOfOrigin,
    isLicensed: series.isLicensed,
    source: series.source as CreateSeriesDto["source"],
    coverImageId: series.coverImage?.id,
    bannerImageId: series.bannerImage?.id,
    genreIds: series.genres
      ?.map((g) => g.genre?.id)
      .filter(Boolean) as string[],
    tagIds: series.tags?.map((t) => t.tag?.id).filter(Boolean) as string[],
    synonyms: series.synonyms,
    averageScore: series.averageScore,
    // Excluded: meanScore, isLocked, trending, autoCreateForumThread, isRecommendationBlocked, isReviewBlocked, notes
    popularity: series.popularity,
    isNsfw: series.isNsfw,
    releasingStatus: series.releasingStatus as CreateSeriesDto["status"],
    externalLinks: series.externalLinks,
  };
}

/**
 * Hook for managing contribution form state
 */
export function useContributionFormState(originalSeries?: BackendSeries) {
  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState<
    ContributionCategory[]
  >([]);

  // Form data (proposed changes)
  const [formData, setFormData] = useState<Partial<CreateSeriesDto>>({});

  // Contributor note
  const [contributorNote, setContributorNote] = useState<string>("");

  // Initialize form data from original series
  const initializeFormData = useCallback(() => {
    if (originalSeries) {
      const initialData = transformSeriesToDto(originalSeries);
      setFormData(initialData);
    }
  }, [originalSeries]);

  // Update form data (excludes restricted fields)
  const updateFormData = useCallback((updates: Partial<CreateSeriesDto>) => {
    // Filter out excluded fields
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(
        ([key]) =>
          !EXCLUDED_FIELDS.includes(key as (typeof EXCLUDED_FIELDS)[number]),
      ),
    );
    setFormData((prev) => ({ ...prev, ...filteredUpdates }));
  }, []);

  // Toggle category selection
  const toggleCategory = useCallback((category: ContributionCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  }, []);

  // Select all categories
  const selectAllCategories = useCallback(() => {
    setSelectedCategories(Object.values(ContributionCategory));
  }, []);

  // Deselect all categories
  const deselectAllCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Helper function to normalize values for comparison
  const normalizeValue = (value: unknown): unknown => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) {
      // Normalize dates to ISO string for comparison
      return value.toISOString().split("T")[0]; // YYYY-MM-DD format
    }
    if (Array.isArray(value)) {
      // Sort arrays for consistent comparison
      return [...value].sort();
    }
    if (typeof value === "object") {
      // Sort object keys for consistent comparison
      return Object.keys(value)
        .sort()
        .reduce(
          (acc, k) => {
            acc[k] = normalizeValue((value as Record<string, unknown>)[k]);
            return acc;
          },
          {} as Record<string, unknown>,
        );
    }
    return value;
  };

  // Calculate diff between original and proposed data (excludes restricted fields)
  const getChanges = useMemo(() => {
    if (!originalSeries) return {};

    const original = transformSeriesToDto(originalSeries);
    const proposed = formData;

    const changes: Record<string, { old: unknown; new: unknown }> = {};

    // Get all unique keys from both original and proposed
    const allKeys = new Set([
      ...Object.keys(original),
      ...Object.keys(proposed),
    ]);

    // Compare each field (excluding restricted fields)
    allKeys.forEach((key) => {
      // Skip excluded fields
      if (EXCLUDED_FIELDS.includes(key as (typeof EXCLUDED_FIELDS)[number])) {
        return;
      }

      const originalValue = original[key as keyof typeof original];
      const proposedValue = proposed[key as keyof typeof proposed];

      // Normalize values for comparison
      const normalizedOriginal = normalizeValue(originalValue);
      const normalizedProposed = normalizeValue(proposedValue);

      // Compare normalized values
      if (
        JSON.stringify(normalizedOriginal) !==
        JSON.stringify(normalizedProposed)
      ) {
        changes[key] = {
          old: originalValue,
          new: proposedValue,
        };
      }
    });

    return changes;
  }, [originalSeries, formData]);

  // Check if there are any changes
  const hasChanges = useMemo(() => {
    return Object.keys(getChanges).length > 0;
  }, [getChanges]);

  // Reset form
  const resetForm = useCallback(() => {
    setSelectedCategories([]);
    setFormData({});
    setContributorNote("");
    initializeFormData();
  }, [initializeFormData]);

  return {
    selectedCategories,
    formData,
    contributorNote,
    setContributorNote,
    updateFormData,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    getChanges,
    hasChanges,
    resetForm,
    initializeFormData,
  };
}
