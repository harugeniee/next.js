import { http } from "@/lib/http/client";
import type {
  BackendGenre,
  CreateGenreDto,
  QueryGenreDto,
  UpdateGenreDto,
} from "@/lib/interface/genres.interface";
import type { ApiResponseOffset } from "@/lib/types/response";

/**
 * Genres API Service
 * Provides methods for interacting with the backend genres API.
 */
export const genresApi = {
  /**
   * Fetches a list of genres with offset pagination.
   * @param query - Query parameters for filtering and pagination.
   * @returns A promise that resolves to an ApiResponseOffset of BackendGenre.
   */
  async getGenres(
    query?: QueryGenreDto,
  ): Promise<ApiResponseOffset<BackendGenre>> {
    const response = await http.get<ApiResponseOffset<BackendGenre>>(
      "/genres",
      {
        params: query,
      },
    );
    return response.data;
  },

  /**
   * Creates a new genre.
   * @param data - The data for the new genre.
   * @returns A promise that resolves to the created BackendGenre.
   */
  async createGenre(data: CreateGenreDto): Promise<BackendGenre> {
    const response = await http.post<BackendGenre>("/genres", data);
    return response.data;
  },

  /**
   * Updates an existing genre.
   * @param id - The ID of the genre to update.
   * @param data - The update data for the genre.
   * @returns A promise that resolves to the updated BackendGenre.
   */
  async updateGenre(id: string, data: UpdateGenreDto): Promise<BackendGenre> {
    const response = await http.patch<BackendGenre>(`/genres/${id}`, data);
    return response.data;
  },

  /**
   * Deletes a genre.
   * @param id - The ID of the genre to delete.
   * @returns A promise that resolves when the genre is successfully deleted.
   */
  async deleteGenre(id: string): Promise<void> {
    await http.delete(`/genres/${id}`);
  },
};
