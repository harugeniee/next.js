import { http } from "@/lib/http";
import type { ApiResponse } from "@/lib/types";

/**
 * Response structure for role check endpoint
 */
export interface CheckRoleResponse {
  hasRole: boolean;
}

/**
 * Permissions API wrapper
 * Handles all permissions-related API calls
 */
export class PermissionsAPI {
  private static readonly BASE_URL = "/permissions";

  /**
   * Check if current user has a specific role
   * @param roleName - Name of the role to check (e.g., "uploader")
   * @returns Promise with hasRole boolean
   */
  static async checkRole(roleName: string): Promise<CheckRoleResponse> {
    try {
      const response = await http.get<ApiResponse<CheckRoleResponse>>(
        `${this.BASE_URL}/me/roles/check`,
        {
          params: {
            roleName,
          },
        },
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to check user role");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
  }
}
