import { http } from "@/lib/http";
import type {
  ApiKey,
  CacheStats,
  CreateApiKeyDto,
  CreateIpWhitelistDto,
  CreatePlanDto,
  CreateRateLimitPolicyDto,
  IpWhitelist,
  Plan,
  PolicyMatchResponse,
  RateLimitInfo,
  RateLimitPolicy,
  TestPolicyMatchDto,
  UpdateApiKeyDto,
  UpdateIpWhitelistDto,
  UpdatePlanDto,
  UpdateRateLimitPolicyDto,
} from "@/lib/interface/rate-limit.interface";
import type { ApiResponse } from "@/lib/types";

/**
 * Rate Limit API wrapper
 * Handles all rate limit-related API calls
 */
export class RateLimitAPI {
  private static readonly BASE_URL = "/admin/rate-limit";

  // ============================================================================
  // Plans Management
  // ============================================================================

  /**
   * Get all rate limit plans
   */
  static async getPlans(): Promise<Plan[]> {
    try {
      const response = await http.get<ApiResponse<Plan[]>>(
        `${this.BASE_URL}/plans`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch rate limit plans",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching rate limit plans:", error);
      throw error;
    }
  }

  /**
   * Create a new rate limit plan
   */
  static async createPlan(data: CreatePlanDto): Promise<Plan> {
    try {
      const response = await http.post<ApiResponse<Plan>>(
        `${this.BASE_URL}/plans`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create rate limit plan",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating rate limit plan:", error);
      throw error;
    }
  }

  /**
   * Update a rate limit plan
   */
  static async updatePlan(name: string, data: UpdatePlanDto): Promise<Plan> {
    try {
      const response = await http.put<ApiResponse<Plan>>(
        `${this.BASE_URL}/plans/${name}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update rate limit plan",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating rate limit plan:", error);
      throw error;
    }
  }

  // ============================================================================
  // API Keys Management
  // ============================================================================

  /**
   * Get all API keys
   */
  static async getApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await http.get<ApiResponse<ApiKey[]>>(
        `${this.BASE_URL}/api-keys`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch API keys");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching API keys:", error);
      throw error;
    }
  }

  /**
   * Create a new API key
   */
  static async createApiKey(data: CreateApiKeyDto): Promise<ApiKey> {
    try {
      const response = await http.post<ApiResponse<ApiKey>>(
        `${this.BASE_URL}/api-keys`,
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create API key");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating API key:", error);
      throw error;
    }
  }

  /**
   * Update an API key
   */
  static async updateApiKey(
    id: string,
    data: UpdateApiKeyDto,
  ): Promise<ApiKey> {
    try {
      const response = await http.put<ApiResponse<ApiKey>>(
        `${this.BASE_URL}/api-keys/${id}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update API key");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating API key:", error);
      throw error;
    }
  }

  /**
   * Delete an API key
   */
  static async deleteApiKey(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(`${this.BASE_URL}/api-keys/${id}`);
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  }

  // ============================================================================
  // IP Whitelist Management
  // ============================================================================

  /**
   * Get all IP whitelist entries
   */
  static async getIpWhitelist(): Promise<IpWhitelist[]> {
    try {
      const response = await http.get<ApiResponse<IpWhitelist[]>>(
        `${this.BASE_URL}/ip-whitelist`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch IP whitelist",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching IP whitelist:", error);
      throw error;
    }
  }

  /**
   * Add IP to whitelist
   */
  static async addIpToWhitelist(
    data: CreateIpWhitelistDto,
  ): Promise<IpWhitelist> {
    try {
      const response = await http.post<ApiResponse<IpWhitelist>>(
        `${this.BASE_URL}/ip-whitelist`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to add IP to whitelist",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error adding IP to whitelist:", error);
      throw error;
    }
  }

  /**
   * Update IP whitelist entry
   */
  static async updateIpWhitelist(
    id: string,
    data: UpdateIpWhitelistDto,
  ): Promise<IpWhitelist> {
    try {
      const response = await http.put<ApiResponse<IpWhitelist>>(
        `${this.BASE_URL}/ip-whitelist/${id}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update IP whitelist entry",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating IP whitelist entry:", error);
      throw error;
    }
  }

  /**
   * Remove IP from whitelist
   */
  static async removeIpFromWhitelist(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(
        `${this.BASE_URL}/ip-whitelist/${id}`,
      );
    } catch (error) {
      console.error("Error removing IP from whitelist:", error);
      throw error;
    }
  }

  // ============================================================================
  // Policies Management
  // ============================================================================

  /**
   * Get all rate limit policies
   */
  static async getPolicies(): Promise<RateLimitPolicy[]> {
    try {
      const response = await http.get<ApiResponse<RateLimitPolicy[]>>(
        `${this.BASE_URL}/policies`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch rate limit policies",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching rate limit policies:", error);
      throw error;
    }
  }

  /**
   * Create a new rate limit policy
   */
  static async createPolicy(
    data: CreateRateLimitPolicyDto,
  ): Promise<RateLimitPolicy> {
    try {
      const response = await http.post<ApiResponse<RateLimitPolicy>>(
        `${this.BASE_URL}/policies`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create rate limit policy",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating rate limit policy:", error);
      throw error;
    }
  }

  /**
   * Update a rate limit policy
   */
  static async updatePolicy(
    id: string,
    data: UpdateRateLimitPolicyDto,
  ): Promise<RateLimitPolicy> {
    try {
      const response = await http.put<ApiResponse<RateLimitPolicy>>(
        `${this.BASE_URL}/policies/${id}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update rate limit policy",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating rate limit policy:", error);
      throw error;
    }
  }

  /**
   * Delete a rate limit policy
   */
  static async deletePolicy(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(`${this.BASE_URL}/policies/${id}`);
    } catch (error) {
      console.error("Error deleting rate limit policy:", error);
      throw error;
    }
  }

  /**
   * Get policy by name
   */
  static async getPolicyByName(name: string): Promise<RateLimitPolicy | null> {
    try {
      const response = await http.get<ApiResponse<RateLimitPolicy | null>>(
        `${this.BASE_URL}/policies/name/${name}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch policy by name",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching policy by name:", error);
      throw error;
    }
  }

  /**
   * Test policy matching
   */
  static async testPolicyMatch(
    id: string,
    context: TestPolicyMatchDto,
  ): Promise<PolicyMatchResponse> {
    try {
      const response = await http.post<ApiResponse<PolicyMatchResponse>>(
        `${this.BASE_URL}/policies/${id}/test`,
        context,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to test policy match");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error testing policy match:", error);
      throw error;
    }
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await http.get<ApiResponse<CacheStats>>(
        `${this.BASE_URL}/cache/stats`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch cache statistics",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching cache statistics:", error);
      throw error;
    }
  }

  /**
   * Invalidate cache across all instances
   */
  static async invalidateCache(): Promise<{
    message: string;
    timestamp: string;
  }> {
    try {
      const response = await http.post<
        ApiResponse<{ message: string; timestamp: string }>
      >(`${this.BASE_URL}/cache/invalidate`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to invalidate cache");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error invalidating cache:", error);
      throw error;
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  static async resetRateLimit(key: string): Promise<{ message: string }> {
    try {
      const response = await http.post<ApiResponse<{ message: string }>>(
        `${this.BASE_URL}/reset/${encodeURIComponent(key)}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reset rate limit");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error resetting rate limit:", error);
      throw error;
    }
  }

  /**
   * Get rate limit information for a specific key
   */
  static async getRateLimitInfo(key: string): Promise<RateLimitInfo> {
    try {
      const response = await http.get<ApiResponse<RateLimitInfo>>(
        `${this.BASE_URL}/info/${encodeURIComponent(key)}`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch rate limit info",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching rate limit info:", error);
      throw error;
    }
  }
}
