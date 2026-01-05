/**
 * Staff-related type definitions
 * DTOs and response types for staff API operations
 */

import type { Staff, StaffName } from "@/lib/interface/staff.interface";
import type { QueryParams } from "./index";

/**
 * Pagination metadata for staff list responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Staff list response structure
 */
export interface StaffListResponse {
  result: Staff[];
  metaData: PaginationMeta;
}

/**
 * Query parameters for fetching staff list
 */
export interface GetStaffDto extends QueryParams {
  gender?: string;
  language?: string;
  occupation?: string;
  characterIds?: string[];
  seriesId?: string;
  myAnimeListId?: string;
  aniListId?: string;
}

/**
 * Character role data for linking characters to staff
 */
export interface CharacterRoleDto {
  characterId: string;
  notes?: string;
  dubGroup?: string;
}

/**
 * DTO for creating a new staff member
 */
export interface CreateStaffDto {
  myAnimeListId?: string;
  aniListId?: string;
  name?: StaffName;
  language?: string;
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
  status?: string;
  characters?: CharacterRoleDto[];
  metadata?: Record<string, unknown>;
}

/**
 * DTO for updating an existing staff member
 */
export interface UpdateStaffDto {
  myAnimeListId?: string;
  aniListId?: string;
  name?: StaffName;
  language?: string;
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
  status?: string;
  characters?: CharacterRoleDto[];
  metadata?: Record<string, unknown>;
}

/**
 * DTO for linking characters to a staff member
 */
export interface LinkCharactersDto {
  characters: CharacterRoleDto[];
}

/**
 * Staff statistics response
 */
export interface StaffStatistics {
  total: number;
  byGender: Record<string, number>;
  byLanguage: Record<string, number>;
  byOccupation: Record<string, number>;
  recentlyAdded: number;
}

/**
 * Form data for creating staff (client-side)
 */
export interface CreateStaffFormData {
  myAnimeListId?: string;
  aniListId?: string;
  name?: {
    first?: string;
    middle?: string;
    last?: string;
    full?: string;
    native?: string;
    alternative?: string[];
    userPreferred?: string;
  };
  language?: string;
  imageId?: string;
  description?: string;
  primaryOccupations?: string[];
  gender?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  age?: number;
  debutDate?: string;
  homeTown?: string;
  bloodType?: string;
  siteUrl?: string;
  notes?: string;
  status?: string;
  characters?: CharacterRoleDto[];
  metadata?: Record<string, unknown>;
}

/**
 * Form data for updating staff (client-side)
 */
export interface UpdateStaffFormData extends CreateStaffFormData {}

/**
 * DTO for updating a character role for a staff member
 */
export interface UpdateCharacterRoleDto {
  language?: string;
  isPrimary?: boolean;
  sortOrder?: number;
  notes?: string;
}

