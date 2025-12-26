/**
 * Character Admin TypeScript Types
 * Matches backend DTOs and entities for admin character management
 */

import type { Character } from "@/lib/interface/character.interface";

/**
 * Get Character DTO (Query Parameters)
 * Matches backend GetCharacterDto for filtering and pagination
 */
export interface GetCharacterDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  query?: string;
  fields?: string[];
  seriesId?: string;
  gender?: string;
  myAnimeListId?: string;
  aniListId?: string;
}

/**
 * Create Character DTO
 * Matches backend CreateCharacterDto
 */
export interface CreateCharacterDto {
  myAnimeListId?: string;
  aniListId?: string;
  name?: {
    first?: string;
    middle?: string;
    last?: string;
    full?: string;
    native?: string;
    alternative?: string[];
    alternativeSpoiler?: string[];
    userPreferred?: string;
  };
  imageId?: string;
  description?: string;
  gender?: string;
  dateOfBirth?: string | Date | null;
  age?: string | null;
  bloodType?: string | null;
  siteUrl?: string;
  notes?: string;
  metadata?: Record<string, unknown> | null;
  seriesId?: string;
}

/**
 * Update Character DTO
 * Matches backend UpdateCharacterDto (all fields optional)
 */
export type UpdateCharacterDto = Partial<CreateCharacterDto>;

/**
 * Character List Response with Pagination
 */
export interface CharacterListResponse {
  result: Character[];
  metaData: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Character Statistics Response
 * Matches backend characters.controller.ts getCharacterStatistics response
 */
export interface CharacterStatistics {
  totalCharacters: number;
  activeCharacters: number;
  charactersByStatus: Record<string, number>;
  charactersByGender: Record<string, number>;
  charactersByBloodType: Record<string, number>;
  charactersWithImages: number;
  charactersWithVoiceActors: number;
  totalVoiceActors: number;
  totalReactions: number;
  charactersBySeries: Array<{
    seriesId: string;
    count: number;
  }>;
}

