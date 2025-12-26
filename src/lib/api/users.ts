import { http } from "@/lib/http";
import type {
  User,
  UpdateUserDto,
  CreateUserDto,
} from "@/lib/interface/user.interface";
import type {
  ApiResponse,
  ApiResponseOffset,
  AdvancedQueryParams,
  PaginationOffset,
} from "@/lib/types";

/**
 * Public user profile structure
 * Used in user profile pages with engagement metrics
 */
export interface UserProfile {
  id: string;
  name?: string;
  username?: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
  };
  location?: string;
  website?: string;
  createdAt: string;
  _count?: {
    articles: number;
    followers: number;
    following: number;
    segments: number;
  };
}

/**
 * User API wrapper
 * Handles all user-related API calls
 */
export class UserAPI {
  private static readonly BASE_URL = "/users";

  /**
   * Fetch user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await http.get<ApiResponse<UserProfile>>(
        `${this.BASE_URL}/${userId}`,
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch user profile",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Fetch current user profile
   */
  static async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await http.get<ApiResponse<UserProfile>>(
        `${this.BASE_URL}/me`,
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch current user",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    userData: Partial<UserProfile>,
  ): Promise<UserProfile> {
    try {
      const response = await http.put<ApiResponse<UserProfile>>(
        `${this.BASE_URL}/${userId}`,
        userData,
      );

      // Check if API response is successful
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update user profile",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Get all users with pagination and filters
   */
  static async getUsers(
    params: AdvancedQueryParams,
  ): Promise<PaginationOffset<User>> {
    try {
      const response = await http.get<ApiResponseOffset<User>>(
        `${this.BASE_URL}`,
        {
          params,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch users");
      }

      // Extract the pagination data from the nested structure
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await http.delete<ApiResponse<void>>(`${this.BASE_URL}/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const response = await http.post<ApiResponse<User>>(
        `${this.BASE_URL}/register`,
        userData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create user");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Update user by ID (Admin)
   */
  static async updateUser(
    userId: string,
    userData: UpdateUserDto,
  ): Promise<User> {
    try {
      const response = await http.patch<ApiResponse<User>>(
        `${this.BASE_URL}/${userId}`,
        userData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update user");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (Admin) - Returns full User object
   */
  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await http.get<ApiResponse<User>>(
        `${this.BASE_URL}/${userId}`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}
