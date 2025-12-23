import { z } from "zod";

import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";

/**
 * Series Title validation schema
 * At least one title field must be provided
 */
export const seriesTitleSchema = z
  .object({
    romaji: z.string().max(255).optional(),
    english: z.string().max(255).optional(),
    native: z.string().max(255).optional(),
    userPreferred: z.string().max(255).optional(),
  })
  .refine(
    (data) => data.romaji || data.english || data.native || data.userPreferred,
    {
      message: "At least one title field is required",
      path: ["userPreferred"], // Show error on userPreferred field
    },
  );

/**
 * Create Series validation schema
 * Based on backend CreateSeriesDto
 */
export const createSeriesSchema = z.object({
  // Required fields
  type: z.enum([
    SERIES_CONSTANTS.TYPE.ANIME,
    SERIES_CONSTANTS.TYPE.MANGA,
    SERIES_CONSTANTS.TYPE.LIGHT_NOVEL,
    SERIES_CONSTANTS.TYPE.VISUAL_NOVEL,
    SERIES_CONSTANTS.TYPE.VIDEO_GAME,
    SERIES_CONSTANTS.TYPE.OTHER,
    SERIES_CONSTANTS.TYPE.DOUJINSHI,
    SERIES_CONSTANTS.TYPE.WEB_NOVEL,
  ] as [string, ...string[]]),

  // Title (at least one required)
  title: seriesTitleSchema.optional(),

  // Optional fields
  myAnimeListId: z.string().optional(),
  aniListId: z.string().optional(),
  format: z
    .enum([
      SERIES_CONSTANTS.FORMAT.TV,
      SERIES_CONSTANTS.FORMAT.TV_SHORT,
      SERIES_CONSTANTS.FORMAT.MOVIE,
      SERIES_CONSTANTS.FORMAT.SPECIAL,
      SERIES_CONSTANTS.FORMAT.OVA,
      SERIES_CONSTANTS.FORMAT.ONA,
      SERIES_CONSTANTS.FORMAT.MUSIC,
      SERIES_CONSTANTS.FORMAT.MANGA,
      SERIES_CONSTANTS.FORMAT.NOVEL,
      SERIES_CONSTANTS.FORMAT.ONE_SHOT,
    ] as [string, ...string[]])
    .optional(),
  status: z
    .enum([
      SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      SERIES_CONSTANTS.RELEASING_STATUS.ONGOING,
      SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON,
      SERIES_CONSTANTS.RELEASING_STATUS.COMPLETED,
      SERIES_CONSTANTS.RELEASING_STATUS.NOT_YET_RELEASED,
      SERIES_CONSTANTS.RELEASING_STATUS.CANCELLED,
      SERIES_CONSTANTS.RELEASING_STATUS.HIATUS,
    ] as [string, ...string[]])
    .optional(),
  description: z.string().max(5000).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  season: z
    .enum([
      SERIES_CONSTANTS.SEASON.WINTER,
      SERIES_CONSTANTS.SEASON.SPRING,
      SERIES_CONSTANTS.SEASON.SUMMER,
      SERIES_CONSTANTS.SEASON.FALL,
    ] as [string, ...string[]])
    .optional(),
  seasonYear: z.number().int().min(1900).max(2100).optional(),
  seasonInt: z.number().int().min(1900).max(2100).optional(),
  episodes: z.number().int().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  chapters: z.number().int().min(0).optional(),
  volumes: z.number().int().min(0).optional(),
  countryOfOrigin: z.string().max(2).optional(), // ISO 3166-1 alpha-2
  isLicensed: z.boolean().optional(),
  source: z
    .enum([
      SERIES_CONSTANTS.SOURCE.ORIGINAL,
      SERIES_CONSTANTS.SOURCE.MANGA,
      SERIES_CONSTANTS.SOURCE.LIGHT_NOVEL,
      SERIES_CONSTANTS.SOURCE.VISUAL_NOVEL,
      SERIES_CONSTANTS.SOURCE.VIDEO_GAME,
      SERIES_CONSTANTS.SOURCE.OTHER,
      SERIES_CONSTANTS.SOURCE.NOVEL,
      SERIES_CONSTANTS.SOURCE.DOUJINSHI,
      SERIES_CONSTANTS.SOURCE.ANIME,
      SERIES_CONSTANTS.SOURCE.WEB_NOVEL,
      SERIES_CONSTANTS.SOURCE.LIVE_ACTION,
      SERIES_CONSTANTS.SOURCE.GAME,
      SERIES_CONSTANTS.SOURCE.COMIC,
      SERIES_CONSTANTS.SOURCE.MULTIMEDIA_PROJECT,
      SERIES_CONSTANTS.SOURCE.PICTURE_BOOK,
    ] as [string, ...string[]])
    .optional(),
  coverImageId: z.string().optional(),
  bannerImageId: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  averageScore: z.number().optional(),
  meanScore: z.number().optional(),
  popularity: z.number().min(0).optional(),
  isLocked: z.boolean().optional(),
  trending: z.number().min(0).optional(),
  isNsfw: z.boolean().optional(),
  autoCreateForumThread: z.boolean().optional(),
  isRecommendationBlocked: z.boolean().optional(),
  isReviewBlocked: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  releasingStatus: z
    .enum([
      SERIES_CONSTANTS.RELEASING_STATUS.FINISHED,
      SERIES_CONSTANTS.RELEASING_STATUS.RELEASING,
      SERIES_CONSTANTS.RELEASING_STATUS.ONGOING,
      SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON,
      SERIES_CONSTANTS.RELEASING_STATUS.COMPLETED,
      SERIES_CONSTANTS.RELEASING_STATUS.NOT_YET_RELEASED,
      SERIES_CONSTANTS.RELEASING_STATUS.CANCELLED,
      SERIES_CONSTANTS.RELEASING_STATUS.HIATUS,
    ] as [string, ...string[]])
    .optional(),
  externalLinks: z.record(z.string(), z.string()).optional(),
  streamingEpisodes: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Step-specific validation schemas
 */

// Step 1: Basic Information
export const step1BasicInfoSchema = z.object({
  type: createSeriesSchema.shape.type,
  title: seriesTitleSchema.optional(),
  format: createSeriesSchema.shape.format,
  status: createSeriesSchema.shape.status,
});

// Step 2: Media
export const step2MediaSchema = z.object({
  coverImageId: z.string().min(1, "Cover image is required"),
  bannerImageId: z.string().optional(),
});

// Step 3: Content (all optional)
export const step3ContentSchema = z.object({
  description: createSeriesSchema.shape.description,
  genreIds: createSeriesSchema.shape.genreIds,
  tagIds: createSeriesSchema.shape.tagIds,
  synonyms: createSeriesSchema.shape.synonyms,
});

// Step 4: Release Info (all optional)
export const step4ReleaseInfoSchema = z.object({
  startDate: createSeriesSchema.shape.startDate,
  endDate: createSeriesSchema.shape.endDate,
  season: createSeriesSchema.shape.season,
  seasonYear: createSeriesSchema.shape.seasonYear,
  seasonInt: createSeriesSchema.shape.seasonInt,
  countryOfOrigin: createSeriesSchema.shape.countryOfOrigin,
  source: createSeriesSchema.shape.source,
  episodes: createSeriesSchema.shape.episodes,
  duration: createSeriesSchema.shape.duration,
  chapters: createSeriesSchema.shape.chapters,
  volumes: createSeriesSchema.shape.volumes,
});

// Step 5: Advanced (all optional)
export const step5AdvancedSchema = z.object({
  isNsfw: createSeriesSchema.shape.isNsfw,
  isLicensed: createSeriesSchema.shape.isLicensed,
  externalLinks: createSeriesSchema.shape.externalLinks,
  streamingEpisodes: createSeriesSchema.shape.streamingEpisodes,
  notes: createSeriesSchema.shape.notes,
  metadata: createSeriesSchema.shape.metadata,
});

export type CreateSeriesFormData = z.infer<typeof createSeriesSchema>;
export type Step1BasicInfoFormData = z.infer<typeof step1BasicInfoSchema>;
export type Step2MediaFormData = z.infer<typeof step2MediaSchema>;
export type Step3ContentFormData = z.infer<typeof step3ContentSchema>;
export type Step4ReleaseInfoFormData = z.infer<typeof step4ReleaseInfoSchema>;
export type Step5AdvancedFormData = z.infer<typeof step5AdvancedSchema>;
