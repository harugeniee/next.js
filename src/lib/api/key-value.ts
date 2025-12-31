import { http } from "@/lib/http";
import type {
  KeyValue,
  CreateKeyValueDto,
  UpdateKeyValueDto,
  QueryKeyValueDto,
  KeyValueListResponse,
  KeyValueApiResponse,
} from "@/lib/interface/key-value.interface";
import type { ApiResponse } from "@/lib/types";

/**
 * Key-Value API wrapper
 * Handles all key-value store-related API calls
 */
export class KeyValueAPI {
  private static readonly BASE_URL = "/key-value";

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  /**
   * Get key-value pairs with pagination and filters
   */
  static async getKeyValues(
    params?: QueryKeyValueDto,
  ): Promise<KeyValueListResponse> {
    try {
      const response = await http.get<KeyValueApiResponse>(
        this.BASE_URL,
        {
          params,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch key-value pairs",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching key-value pairs:", error);
      throw error;
    }
  }

  /**
   * Get a key-value pair by ID
   */
  static async getKeyValueById(id: string): Promise<KeyValue> {
    try {
      const response = await http.get<ApiResponse<KeyValue>>(
        `${this.BASE_URL}/${id}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch key-value pair",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching key-value pair:", error);
      throw error;
    }
  }

  /**
   * Get a key-value pair by key
   */
  static async getKeyValueByKey(
    key: string,
    namespace?: string,
  ): Promise<KeyValue> {
    try {
      const response = await http.get<ApiResponse<KeyValue>>(
        `${this.BASE_URL}/key/${key}`,
        {
          params: namespace ? { namespace } : undefined,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch key-value pair",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching key-value pair by key:", error);
      throw error;
    }
  }

  /**
   * Create a new key-value pair
   */
  static async createKeyValue(data: CreateKeyValueDto): Promise<KeyValue> {
    try {
      const response = await http.post<ApiResponse<KeyValue>>(
        this.BASE_URL,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create key-value pair",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating key-value pair:", error);
      throw error;
    }
  }

  /**
   * Update a key-value pair
   */
  static async updateKeyValue(
    id: string,
    data: UpdateKeyValueDto,
  ): Promise<KeyValue> {
    try {
      const response = await http.put<ApiResponse<KeyValue>>(
        `${this.BASE_URL}/${id}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update key-value pair",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating key-value pair:", error);
      throw error;
    }
  }

  /**
   * Delete a key-value pair
   */
  static async deleteKeyValue(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting key-value pair:", error);
      throw error;
    }
  }

  // ============================================================================
  // Batch Operations
  // ============================================================================

  /**
   * Set multiple key-value pairs
   */
  static async setMultiple(
    entries: Record<string, unknown>,
    namespace?: string,
  ): Promise<KeyValue[]> {
    try {
      const response = await http.post<ApiResponse<KeyValue[]>>(
        `${this.BASE_URL}/batch`,
        entries,
        {
          params: namespace ? { namespace } : undefined,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to set multiple key-value pairs",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error setting multiple key-value pairs:", error);
      throw error;
    }
  }

  /**
   * Get multiple key-value pairs by keys
   */
  static async getMultiple(
    keys: string[],
    namespace?: string,
  ): Promise<Record<string, unknown>> {
    try {
      const response = await http.get<ApiResponse<Record<string, unknown>>>(
        `${this.BASE_URL}/batch`,
        {
          params: {
            keys,
            ...(namespace ? { namespace } : {}),
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get multiple key-value pairs",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error getting multiple key-value pairs:", error);
      throw error;
    }
  }

  // ============================================================================
  // Specialized Operations
  // ============================================================================

  /**
   * Atomically increment a numeric value
   */
  static async increment(
    key: string,
    amount: number = 1,
    namespace?: string,
  ): Promise<number> {
    try {
      const response = await http.post<ApiResponse<{ value: number }>>(
        `${this.BASE_URL}/${key}/increment`,
        {
          amount,
          namespace,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to increment key-value",
        );
      }

      return response.data.data.value;
    } catch (error) {
      console.error("Error incrementing key-value:", error);
      throw error;
    }
  }

  /**
   * Set a key-value pair with TTL
   */
  static async setWithTTL(
    key: string,
    value: unknown,
    ttlSeconds: number,
    namespace?: string,
  ): Promise<KeyValue> {
    try {
      const response = await http.post<ApiResponse<KeyValue>>(
        `${this.BASE_URL}/ttl`,
        {
          key,
          value,
          ttlSeconds,
          namespace,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to set key-value with TTL",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error setting key-value with TTL:", error);
      throw error;
    }
  }

  /**
   * Get all key-value pairs in a namespace
   */
  static async getByNamespace(namespace: string): Promise<KeyValue[]> {
    try {
      const response = await http.get<ApiResponse<KeyValue[]>>(
        `${this.BASE_URL}/namespace/${namespace}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch key-value pairs by namespace",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching key-value pairs by namespace:", error);
      throw error;
    }
  }

  /**
   * Get key-value pairs by key pattern
   */
  static async getByPattern(
    pattern: string,
    namespace?: string,
  ): Promise<KeyValue[]> {
    try {
      const response = await http.get<ApiResponse<KeyValue[]>>(
        `${this.BASE_URL}/pattern/${pattern}`,
        {
          params: namespace ? { namespace } : undefined,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch key-value pairs by pattern",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching key-value pairs by pattern:", error);
      throw error;
    }
  }

  /**
   * Check if a key exists
   */
  static async exists(
    key: string,
    namespace?: string,
  ): Promise<boolean> {
    try {
      const response = await http.get<ApiResponse<{ exists: boolean }>>(
        `${this.BASE_URL}/${key}/exists`,
        {
          params: namespace ? { namespace } : undefined,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to check key existence",
        );
      }

      return response.data.data.exists;
    } catch (error) {
      console.error("Error checking key existence:", error);
      throw error;
    }
  }

  /**
   * Clean up expired key-value pairs
   */
  static async cleanupExpired(): Promise<number> {
    try {
      const response = await http.post<ApiResponse<{ deletedCount: number }>>(
        `${this.BASE_URL}/cleanup`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to cleanup expired entries",
        );
      }

      return response.data.data.deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired entries:", error);
      throw error;
    }
  }
}

