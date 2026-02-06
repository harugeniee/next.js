import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { SettingsAPI, type UserSettings } from "@/lib/api/settings";
import { currentUserAtom } from "@/lib/auth";

/**
 * Hook for managing user settings
 * Provides settings data, loading states, and update functions
 */
export function useSettings() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [currentUser] = useAtom(currentUserAtom);

  // Query for user settings
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings", currentUser?.id],
    queryFn: SettingsAPI.getUserSettings,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: SettingsAPI.updateSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["settings", currentUser?.id], updatedSettings);
      toast.success(t("messages.updateSuccess", "settings"));
    },
    onError: (error) => {
      console.error("Settings update error:", error);
      toast.error(t("messages.updateError", "settings"));
    },
  });

  // Mutation for resetting settings
  const resetSettingsMutation = useMutation({
    mutationFn: SettingsAPI.resetSettings,
    onSuccess: (resetSettings) => {
      queryClient.setQueryData(["settings", currentUser?.id], resetSettings);
      toast.success(t("messages.resetSuccess", "settings"));
    },
    onError: (error) => {
      console.error("Settings reset error:", error);
      toast.error(t("messages.resetError", "settings"));
    },
  });

  // Mutation for exporting user data
  const exportDataMutation = useMutation({
    mutationFn: SettingsAPI.exportUserData,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t("messages.exportSuccess", "settings"));
    },
    onError: (error) => {
      console.error("Data export error:", error);
      toast.error(t("messages.exportError", "settings"));
    },
  });

  // Mutation for deleting account
  const deleteAccountMutation = useMutation({
    mutationFn: SettingsAPI.deleteAccount,
    onSuccess: () => {
      toast.success(t("messages.accountDeleted", "settings"));
      // Redirect to home page or show logout
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Account deletion error:", error);
      toast.error(t("messages.accountDeleteError", "settings"));
    },
  });

  // Helper function to update specific section
  const updateSection = (
    section: keyof UserSettings,
    data: Partial<UserSettings[keyof UserSettings]>,
  ) => {
    updateSettingsMutation.mutate({ section, data });
  };

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSection,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    resetSettings: resetSettingsMutation.mutate,
    isResetting: resetSettingsMutation.isPending,
    exportData: exportDataMutation.mutate,
    isExporting: exportDataMutation.isPending,
    deleteAccount: deleteAccountMutation.mutate,
    isDeleting: deleteAccountMutation.isPending,
  };
}

/**
 * Hook for profile settings
 * Focused on profile-related settings management
 */
export function useProfileSettings() {
  const { settings, updateSection, isUpdating } = useSettings();

  const updateProfile = (data: Partial<UserSettings["profile"]>) => {
    updateSection("profile", data);
  };

  return {
    profile: settings?.profile,
    updateProfile,
    isUpdating,
  };
}

/**
 * Hook for appearance settings
 * Focused on theme and display preferences
 */
export function useAppearanceSettings() {
  const { settings, updateSection, isUpdating } = useSettings();

  const updateAppearance = (data: Partial<UserSettings["appearance"]>) => {
    updateSection("appearance", data);
  };

  return {
    appearance: settings?.appearance,
    updateAppearance,
    isUpdating,
  };
}

/**
 * Hook for notification settings
 * Focused on notification preferences
 */
export function useNotificationSettings() {
  const { settings, updateSection, isUpdating } = useSettings();

  const updateNotifications = (
    data: Partial<UserSettings["notifications"]>,
  ) => {
    updateSection("notifications", data);
  };

  return {
    notifications: settings?.notifications,
    updateNotifications,
    isUpdating,
  };
}

/**
 * Hook for privacy settings
 * Focused on privacy and data management
 */
export function usePrivacySettings() {
  const { settings, updateSection, isUpdating } = useSettings();

  const updatePrivacy = (data: Partial<UserSettings["privacy"]>) => {
    updateSection("privacy", data);
  };

  return {
    privacy: settings?.privacy,
    updatePrivacy,
    isUpdating,
  };
}
