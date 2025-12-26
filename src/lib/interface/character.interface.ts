/**
 * Character-related TypeScript interfaces
 * Defines types for character data structures used throughout the application
 */

import type { BaseEntityCustom } from "./base.interface";
import type { Media } from "./media.interface";
import type { SeriesTitle } from "./series.interface";

/**
 * Character Name structure
 * Stores character names in different languages and formats
 */
export interface CharacterName {
  first?: string;
  middle?: string;
  last?: string;
  full?: string;
  native?: string;
  alternative?: string[];
  alternativeSpoiler?: string[];
  userPreferred?: string;
}

/**
 * Staff Name structure
 * Stores staff (voice actor) names in different languages and formats
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
 * Staff Image URLs
 * Contains image URLs for staff members
 */
export interface StaffImageUrls {
  large?: string;
  medium?: string;
}

/**
 * Staff Entity
 * Represents a voice actor or staff member
 */
export interface Staff extends BaseEntityCustom {
  myAnimeListId?: string;
  aniListId?: string;
  name?: StaffName;
  language?: string;
  imageUrls?: StaffImageUrls;
  imageId?: string;
  description?: string;
  primaryOccupations?: string[];
  gender?: string;
  dateOfBirth?: Date | string;
  dateOfDeath?: Date | string | null;
  age?: number;
  debutDate?: Date | string | null;
  homeTown?: string;
  bloodType?: string;
  siteUrl?: string;
  notes?: string;
  favoriteCount?: number;
  status?: string;
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
}

/**
 * Character Entity
 * Represents a character that features in anime or manga
 */
export interface Character extends BaseEntityCustom {
  myAnimeListId?: string;
  aniListId?: string;
  name?: CharacterName;
  imageId?: string;
  image?: Media;
  description?: string;
  gender?: string;
  dateOfBirth?: Date | string | null;
  age?: string | null;
  bloodType?: string | null;
  siteUrl?: string;
  notes?: string;
  metadata?: Record<string, unknown> | null;
  voiceActors?: CharacterStaff[];
  seriesId?: string;
  series?: {
    id: string;
    title?: SeriesTitle;
  };
}
