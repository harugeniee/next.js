import { z } from "zod";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";

/**
 * Series validation constants
 * Matching backend SERIES_CONSTANTS
 */
const SERIES_VALIDATION = {
  TITLE_MAX_LENGTH: SERIES_CONSTANTS.TITLE_MAX_LENGTH || 255,
  DESCRIPTION_MAX_LENGTH: SERIES_CONSTANTS.DESCRIPTION_MAX_LENGTH || 10000,
  MOD_NOTES_MAX_LENGTH: SERIES_CONSTANTS.MOD_NOTES_MAX_LENGTH || 2000,
  COUNTRY_CODE_LENGTH: SERIES_CONSTANTS.COUNTRY_CODE_LENGTH || 2,
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  MIN_POPULARITY: 0,
} as const;

/**
 * Series Title Schema
 * Validates series title structure
 */
const seriesTitleSchema = z
  .object({
    romaji: z
      .string()
      .max(
        SERIES_VALIDATION.TITLE_MAX_LENGTH,
        `Romaji title must be less than ${SERIES_VALIDATION.TITLE_MAX_LENGTH} characters`,
      )
      .optional(),
    english: z
      .string()
      .max(
        SERIES_VALIDATION.TITLE_MAX_LENGTH,
        `English title must be less than ${SERIES_VALIDATION.TITLE_MAX_LENGTH} characters`,
      )
      .optional(),
    native: z
      .string()
      .max(
        SERIES_VALIDATION.TITLE_MAX_LENGTH,
        `Native title must be less than ${SERIES_VALIDATION.TITLE_MAX_LENGTH} characters`,
      )
      .optional(),
    userPreferred: z
      .string()
      .max(
        SERIES_VALIDATION.TITLE_MAX_LENGTH,
        `User preferred title must be less than ${SERIES_VALIDATION.TITLE_MAX_LENGTH} characters`,
      )
      .optional(),
  })
  .optional();

/**
 * Create Series Schema
 * Matches backend CreateSeriesDto validation
 */
export const createSeriesSchema = z.object({
  myAnimeListId: z.string().optional(),
  aniListId: z.string().optional(),
  title: seriesTitleSchema,
  type: z.enum([
    SERIES_CONSTANTS.TYPE.ANIME,
    SERIES_CONSTANTS.TYPE.MANGA,
    SERIES_CONSTANTS.TYPE.LIGHT_NOVEL,
    SERIES_CONSTANTS.TYPE.VISUAL_NOVEL,
    SERIES_CONSTANTS.TYPE.VIDEO_GAME,
    SERIES_CONSTANTS.TYPE.OTHER,
    SERIES_CONSTANTS.TYPE.DOUJINSHI,
    SERIES_CONSTANTS.TYPE.WEB_NOVEL,
  ]),
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
    ])
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
    ])
    .optional(),
  description: z
    .string()
    .max(
      SERIES_VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${SERIES_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  startDate: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date;
        return undefined;
      }
      return val;
    }),
  endDate: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date;
        return undefined;
      }
      return val;
    }),
  season: z
    .enum([
      SERIES_CONSTANTS.SEASON.WINTER,
      SERIES_CONSTANTS.SEASON.SPRING,
      SERIES_CONSTANTS.SEASON.SUMMER,
      SERIES_CONSTANTS.SEASON.FALL,
    ])
    .optional(),
  seasonYear: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_YEAR)
    .max(SERIES_VALIDATION.MAX_YEAR)
    .optional(),
  seasonInt: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_YEAR)
    .max(SERIES_VALIDATION.MAX_YEAR)
    .optional(),
  episodes: z.number().int().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  chapters: z.number().int().min(0).optional(),
  volumes: z.number().int().min(0).optional(),
  countryOfOrigin: z
    .string()
    .length(
      SERIES_VALIDATION.COUNTRY_CODE_LENGTH,
      `Country code must be exactly ${SERIES_VALIDATION.COUNTRY_CODE_LENGTH} characters`,
    )
    .optional(),
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
    ])
    .optional(),
  coverImageId: z.string().optional(),
  bannerImageId: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  averageScore: z.number().min(0).max(100).optional(),
  meanScore: z.number().min(0).max(100).optional(),
  popularity: z.number().int().min(SERIES_VALIDATION.MIN_POPULARITY).optional(),
  isLocked: z.boolean().optional(),
  trending: z.number().int().min(0).optional(),
  isNsfw: z.boolean().optional(),
  autoCreateForumThread: z.boolean().optional(),
  isRecommendationBlocked: z.boolean().optional(),
  isReviewBlocked: z.boolean().optional(),
  notes: z
    .string()
    .max(
      SERIES_VALIDATION.MOD_NOTES_MAX_LENGTH,
      `Notes must be less than ${SERIES_VALIDATION.MOD_NOTES_MAX_LENGTH} characters`,
    )
    .optional(),
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
    ])
    .optional(),
  externalLinks: z.record(z.string(), z.string()).optional(),
  streamingEpisodes: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Update Series Schema
 * Partial version of CreateSeriesSchema
 */
export const updateSeriesSchema = createSeriesSchema.partial();

/**
 * Query Series Schema
 * For filtering and pagination
 */
export const querySeriesSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  query: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
  type: z
    .enum([
      SERIES_CONSTANTS.TYPE.ANIME,
      SERIES_CONSTANTS.TYPE.MANGA,
      SERIES_CONSTANTS.TYPE.LIGHT_NOVEL,
      SERIES_CONSTANTS.TYPE.VISUAL_NOVEL,
      SERIES_CONSTANTS.TYPE.VIDEO_GAME,
      SERIES_CONSTANTS.TYPE.OTHER,
      SERIES_CONSTANTS.TYPE.DOUJINSHI,
      SERIES_CONSTANTS.TYPE.WEB_NOVEL,
    ])
    .optional(),
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
    ])
    .optional(),
  season: z
    .enum([
      SERIES_CONSTANTS.SEASON.WINTER,
      SERIES_CONSTANTS.SEASON.SPRING,
      SERIES_CONSTANTS.SEASON.SUMMER,
      SERIES_CONSTANTS.SEASON.FALL,
    ])
    .optional(),
  seasonYear: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_YEAR)
    .max(SERIES_VALIDATION.MAX_YEAR)
    .optional(),
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
    ])
    .optional(),
  genres: z.array(z.string()).optional(),
  isNsfw: z.boolean().optional(),
  isLicensed: z.boolean().optional(),
  minScore: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_SCORE)
    .max(SERIES_VALIDATION.MAX_SCORE)
    .optional(),
  maxScore: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_SCORE)
    .max(SERIES_VALIDATION.MAX_SCORE)
    .optional(),
  minPopularity: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_POPULARITY)
    .optional(),
  maxPopularity: z
    .number()
    .int()
    .min(SERIES_VALIDATION.MIN_POPULARITY)
    .optional(),
  seriesStatus: z
    .enum([
      SERIES_CONSTANTS.STATUS.ACTIVE,
      SERIES_CONSTANTS.STATUS.INACTIVE,
      SERIES_CONSTANTS.STATUS.PENDING,
      SERIES_CONSTANTS.STATUS.ARCHIVED,
    ])
    .optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateSeriesFormData = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesFormData = z.infer<typeof updateSeriesSchema>;
export type QuerySeriesFormData = z.infer<typeof querySeriesSchema>;
