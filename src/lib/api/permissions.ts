import { http } from "@/lib/http";
import type {
  Role,
  UserRole,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
} from "@/lib/interface/permission.interface";
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

  // ==================== ROLE ENDPOINTS ====================

  /**
   * Get all roles
   * @returns Promise with array of roles
   */
  static async getAllRoles(): Promise<Role[]> {
    try {
      const response = await http.get<ApiResponse<Role[]>>(
        `${this.BASE_URL}/roles`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch roles");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }

  /**
   * Get a role by ID
   * @param id - Role ID
   * @returns Promise with role
   */
  static async getRole(id: string): Promise<Role> {
    try {
      const response = await http.get<ApiResponse<Role>>(
        `${this.BASE_URL}/roles/${id}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch role");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching role:", error);
      throw error;
    }
  }

  /**
   * Create a new role
   * @param data - Role creation data
   * @returns Promise with created role
   */
  static async createRole(data: CreateRoleDto): Promise<Role> {
    try {
      const response = await http.post<ApiResponse<Role>>(
        `${this.BASE_URL}/roles`,
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create role");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  }

  /**
   * Update a role
   * @param id - Role ID
   * @param data - Role update data
   * @returns Promise with updated role
   */
  static async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    try {
      const response = await http.patch<ApiResponse<Role>>(
        `${this.BASE_URL}/roles/${id}`,
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update role");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  }

  /**
   * Delete a role
   * @param id - Role ID
   * @returns Promise void
   */
  static async deleteRole(id: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(`${this.BASE_URL}/roles/${id}`);
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  }

  // ==================== USER-ROLE ENDPOINTS ====================

  /**
   * Get all roles for a user
   * @param userId - User ID
   * @returns Promise with array of user roles
   */
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const response = await http.get<ApiResponse<UserRole[]>>(
        `${this.BASE_URL}/users/${userId}/roles`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user roles");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      throw error;
    }
  }

  /**
   * Get all users with a specific role
   * @param roleId - Role ID
   * @returns Promise with array of user roles
   */
  static async getUsersWithRole(roleId: string): Promise<UserRole[]> {
    try {
      const response = await http.get<ApiResponse<UserRole[]>>(
        `${this.BASE_URL}/roles/${roleId}/users`,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch users with role",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching users with role:", error);
      throw error;
    }
  }

  /**
   * Assign a role to a user
   * @param data - Role assignment data
   * @returns Promise with user role assignment
   */
  static async assignRole(data: AssignRoleDto): Promise<UserRole> {
    try {
      const response = await http.post<ApiResponse<UserRole>>(
        `${this.BASE_URL}/users/roles`,
        data,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to assign role");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error assigning role:", error);
      throw error;
    }
  }

  /**
   * Remove a role from a user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Promise void
   */
  static async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(
        `${this.BASE_URL}/users/${userId}/roles/${roleId}`,
      );
    } catch (error) {
      console.error("Error removing role:", error);
      throw error;
    }
  }
}
