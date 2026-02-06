import { http } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/types/response";

/**
 * User Settings Interface
 * Defines the structure for user settings data
 */
export interface UserSettings {
  // Profile settings
  profile: {
    name?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    location?: string;
    socialLinks?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  };

  // Account settings
  account: {
    email?: string;
    phoneNumber?: string;
    twoFactorEnabled?: boolean;
    connectedAccounts?: {
      google?: boolean;
      github?: boolean;
      twitter?: boolean;
    };
  };

  // Appearance settings
  appearance: {
    theme?: string;
    colorScheme?: "light" | "dark" | "system";
    language?: string;
    editorSettings?: {
      fontSize?: number;
      lineHeight?: number;
      autoSave?: boolean;
      spellCheck?: boolean;
    };
  };

  // Notification settings
  notifications: {
    email: {
      comments?: boolean;
      mentions?: boolean;
      follows?: boolean;
      systemUpdates?: boolean;
    };
    push: {
      enabled?: boolean;
      comments?: boolean;
      mentions?: boolean;
      follows?: boolean;
    };
    frequency?: "realtime" | "daily" | "weekly";
  };

  // Privacy settings
  privacy: {
    profileVisibility?: "public" | "private" | "followers";
    showEmail?: boolean;
    showPhone?: boolean;
    analyticsEnabled?: boolean;
    cookiePreferences?: {
      necessary?: boolean;
      analytics?: boolean;
      marketing?: boolean;
    };
  };
}

/**
 * Settings Update Request Interface
 */
export interface UpdateSettingsRequest {
  section: keyof UserSettings;
  data: Partial<UserSettings[keyof UserSettings]>;
}

/**
 * Settings API wrapper
 * Handles all settings-related API calls
 */
export class SettingsAPI {
  private static readonly BASE_URL = "/settings";

  /**
   * Get user settings
   */
  static async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await http.get<ApiResponse<UserSettings>>(
        SettingsAPI.BASE_URL,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch user settings",
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user settings:", error);
      throw error;
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(
    updateData: UpdateSettingsRequest,
  ): Promise<UserSettings> {
    try {
      const response = await http.put<ApiResponse<UserSettings>>(
        SettingsAPI.BASE_URL,
        updateData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update settings");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  /**
   * Update specific settings section
   */
  static async updateSettingsSection(
    section: keyof UserSettings,
    data: Partial<UserSettings[keyof UserSettings]>,
  ): Promise<UserSettings> {
    return SettingsAPI.updateSettings({ section, data });
  }

  /**
   * Reset settings to default
   */
  static async resetSettings(): Promise<UserSettings> {
    try {
      const response = await http.post<ApiResponse<UserSettings>>(
        `${SettingsAPI.BASE_URL}/reset`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reset settings");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error resetting settings:", error);
      throw error;
    }
  }

  /**
   * Export user data (GDPR compliance)
   */
  static async exportUserData(): Promise<Blob> {
    try {
      const response = await http.get(`${SettingsAPI.BASE_URL}/export`, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("Error exporting user data:", error);
      throw error;
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<void> {
    try {
      const response = await http.delete<ApiResponse<void>>(
        `${SettingsAPI.BASE_URL}/account`,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
}
