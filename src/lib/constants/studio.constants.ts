// Studio Entity Constants
export const STUDIO_CONSTANTS = {
  // Field lengths
  NAME_MAX_LENGTH: 255,
  SITE_URL_MAX_LENGTH: 512,

  // Status values
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    ARCHIVED: "archived",
  },

  TYPES: {
    ANIMATION_STUDIO: "animation_studio",
    PRODUCTION_COMPANY: "production_company",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
} as const;

// Type definitions for better TypeScript support
export type StudioType =
  (typeof STUDIO_CONSTANTS.TYPES)[keyof typeof STUDIO_CONSTANTS.TYPES];
export type StudioStatus =
  (typeof STUDIO_CONSTANTS.STATUS)[keyof typeof STUDIO_CONSTANTS.STATUS];

