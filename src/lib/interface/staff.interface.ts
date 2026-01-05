/**
 * Staff-related TypeScript interfaces
 * Defines types for staff data structures used throughout the application
 */

import type { BaseEntityCustom } from "./base.interface";
import type { Media } from "./media.interface";
import type { SeriesTitle } from "./series.interface";

/**
 * Staff Name structure
 * Stores staff (voice actor, director, producer) names in different languages and formats
 */
export interface StaffName {
  first?: string;
  middle?: string;
  last?: string;
  full?: string;
  native?: string;
  alternative?: string[];
  userPreferred?: string;
}

/**
 * Staff Entity
 * Represents a voice actor, director, producer, or other staff member
 */
export interface Staff extends BaseEntityCustom {
  myAnimeListId?: string;
  aniListId?: string;
  name?: StaffName;
  language?: string;
  imageUrls?: Record<string, string>;
  imageId?: string;
  image?: Media;
  description?: string;
  primaryOccupations?: string[];
  gender?: string;
  dateOfBirth?: Date | string | null;
  dateOfDeath?: Date | string | null;
  age?: number;
  debutDate?: Date | string | null;
  homeTown?: string;
  bloodType?: string;
  siteUrl?: string;
  notes?: string;
  favoriteCount?: number;
  status?: string;
  characterRoles?: CharacterStaff[];
  seriesRoles?: StaffSeries[];
  metadata?: Record<string, unknown> | null;
}

/**
 * Character Staff Entity
 * Junction entity representing the relationship between Characters and Staff (voice actors)
 */
export interface CharacterStaff extends BaseEntityCustom {
  characterId: string;
  staffId: string;
  language?: string;
  isPrimary: boolean;
  sortOrder: number;
  notes?: string;
  staff?: Staff;
  character?: {
    id: string;
    name?: {
      first?: string;
      middle?: string;
      last?: string;
      full?: string;
      native?: string;
      alternative?: string[];
      userPreferred?: string;
    };
    image?: Media;
  };
}

/**
 * Staff Series Entity
 * Junction entity representing the relationship between Staff and Series
 */
export interface StaffSeries extends BaseEntityCustom {
  staffId: string;
  staff?: Staff;
  seriesId: string;
  series?: {
    id: string;
    title?: SeriesTitle;
  };
  role?: string;
  isMain: boolean;
  notes?: string;
  sortOrder: number;
}
