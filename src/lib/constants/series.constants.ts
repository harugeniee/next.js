/**
 * Series Constants
 * Based on backend/src/shared/constants/series.constants.ts
 * These constants match the backend API expectations
 */

export const SERIES_CONSTANTS = {
  // Field length limits
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 10000,
  MOD_NOTES_MAX_LENGTH: 2000,
  COUNTRY_CODE_LENGTH: 2,

  // Media types (Anime or Manga)
  TYPE: {
    ANIME: "anime",
    MANGA: "manga",
    LIGHT_NOVEL: "light_novel",
    VISUAL_NOVEL: "visual_novel",
    VIDEO_GAME: "video_game",
    OTHER: "other",
    DOUJINSHI: "doujinshi",
    WEB_NOVEL: "web_novel",
  },

  // Media formats
  FORMAT: {
    // Anime formats
    TV: "tv",
    TV_SHORT: "tv_short",
    MOVIE: "movie",
    SPECIAL: "special",
    OVA: "ova",
    ONA: "ona",
    MUSIC: "music",
    // Manga formats
    MANGA: "manga",
    NOVEL: "novel",
    ONE_SHOT: "one_shot",
  },

  // Media status (releasing status)
  RELEASING_STATUS: {
    FINISHED: "finished",
    RELEASING: "releasing",
    ONGOING: "ongoing",
    COMING_SOON: "coming_soon",
    COMPLETED: "completed",
    NOT_YET_RELEASED: "not_yet_released",
    CANCELLED: "cancelled",
    HIATUS: "hiatus",
  },

  // Media source
  SOURCE: {
    ORIGINAL: "original",
    MANGA: "manga",
    LIGHT_NOVEL: "light_novel",
    VISUAL_NOVEL: "visual_novel",
    VIDEO_GAME: "video_game",
    OTHER: "other",
    NOVEL: "novel",
    DOUJINSHI: "doujinshi",
    ANIME: "anime",
    WEB_NOVEL: "web_novel",
    LIVE_ACTION: "live_action",
    GAME: "game",
    COMIC: "comic",
    MULTIMEDIA_PROJECT: "multimedia_project",
    PICTURE_BOOK: "picture_book",
  },

  // Media season
  SEASON: {
    WINTER: "winter",
    SPRING: "spring",
    SUMMER: "summer",
    FALL: "fall",
  },

  // Series status (internal status)
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    ARCHIVED: "archived",
  },
} as const;

// Type definitions for better TypeScript support
export type SeriesType =
  (typeof SERIES_CONSTANTS.TYPE)[keyof typeof SERIES_CONSTANTS.TYPE];

export type SeriesFormat =
  (typeof SERIES_CONSTANTS.FORMAT)[keyof typeof SERIES_CONSTANTS.FORMAT];

export type SeriesReleasingStatus =
  (typeof SERIES_CONSTANTS.RELEASING_STATUS)[keyof typeof SERIES_CONSTANTS.RELEASING_STATUS];

export type SeriesSource =
  (typeof SERIES_CONSTANTS.SOURCE)[keyof typeof SERIES_CONSTANTS.SOURCE];

export type SeriesSeason =
  (typeof SERIES_CONSTANTS.SEASON)[keyof typeof SERIES_CONSTANTS.SEASON];

export type SeriesStatus =
  (typeof SERIES_CONSTANTS.STATUS)[keyof typeof SERIES_CONSTANTS.STATUS];
