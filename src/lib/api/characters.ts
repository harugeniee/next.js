import { http } from "@/lib/http";
import type { Character } from "@/lib/interface/character.interface";
import type { ApiResponseCursor, QueryParamsWithCursor } from "@/lib/types";

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
}
