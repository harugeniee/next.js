import { http } from "@/lib/http";
import type { Character } from "@/lib/interface/character.interface";
import type {
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  QueryParamsWithCursor,
} from "@/lib/types";
import type {
  CharacterListResponse,
  CharacterStatistics,
  CreateCharacterDto,
  GetCharacterDto,
  UpdateCharacterDto,
} from "@/lib/types/characters";

/**
 * Query Character Cursor DTO
 * Based on backend QueryCharacterCursorDto
 */
export interface QueryCharacterCursorDto extends QueryParamsWithCursor {
  seriesId?: string;
}

/**
 * Characters API wrapper
 * Handles all character-related API calls
 */
export class CharactersAPI {
  private static readonly BASE_URL = "/characters";

  /**
   * Get all characters with cursor pagination
   * Better for real-time feeds and infinite scroll
   * Supports filtering by seriesId via query parameters
   * @param params Cursor pagination parameters
   */
  static async getCharactersCursor(
    params?: QueryCharacterCursorDto,
  ): Promise<ApiResponseCursor<Character>> {
    const response = await http.get<ApiResponseCursor<Character>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Create a new character
   */
  static async createCharacter(
    createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    try {
      const response = await http.post<ApiResponse<Character>>(
        this.BASE_URL,
        createCharacterDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create character");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating character:", error);
      throw error;
    }
  }

  /**
   * Get all characters with optional filters (admin)
   */
  static async getCharacters(
    params?: GetCharacterDto,
  ): Promise<CharacterListResponse> {
    try {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.order) queryParams.order = params.order;
      if (params?.query) queryParams.query = params.query;
      if (params?.fields && params.fields.length > 0) {
        queryParams.fields = params.fields;
      }
      if (params?.seriesId) queryParams.seriesId = params.seriesId;
      if (params?.gender) queryParams.gender = params.gender;
      if (params?.myAnimeListId)
        queryParams.myAnimeListId = params.myAnimeListId;
      if (params?.aniListId) queryParams.aniListId = params.aniListId;

      const response = await http.get<ApiResponseOffset<Character>>(
        this.BASE_URL,
        { params: queryParams },
      );

      const paginationData = response.data.data;
      return {
        result: paginationData.result,
        metaData: {
          total: paginationData.metaData.totalRecords ?? 0,
          page: paginationData.metaData.currentPage ?? 1,
          limit: paginationData.metaData.pageSize,
          totalPages: paginationData.metaData.totalPages ?? 1,
        },
      };
    } catch (error) {
      console.error("Error fetching characters:", error);
      throw error;
    }
  }

  /**
   * Get character by ID
   */
  static async getCharacterById(id: string): Promise<Character> {
    try {
      const response = await http.get<ApiResponse<Character>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch character");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching character:", error);
      throw error;
    }
  }

  /**
   * Update character
   */
  static async updateCharacter(
    id: string,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    try {
      const response = await http.patch<ApiResponse<Character>>(
        `${this.BASE_URL}/${id}`,
        updateCharacterDto,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update character");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating character:", error);
      throw error;
    }
  }

  /**
   * Delete character
   */
  static async deleteCharacter(id: string): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      throw error;
    }
  }

  /**
   * Get character statistics
   */
  static async getCharacterStatistics(): Promise<CharacterStatistics> {
    try {
      const response = await http.get<ApiResponse<CharacterStatistics>>(
        `${this.BASE_URL}/stats/overview`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch character statistics",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching character statistics:", error);
      throw error;
    }
  }
}
