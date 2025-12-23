import { useEffect, useState } from "react";

import type { CreateSeriesDto } from "@/lib/api/series";

const STORAGE_KEY = "series-create-form-draft";

/**
 * Hook for managing series creation form state across steps
 * Includes auto-save to localStorage and form reset functionality
 */
export function useSeriesFormState() {
  const [formData, setFormData] = useState<Partial<CreateSeriesDto>>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert date strings back to Date objects
          if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
          if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);
          return parsed;
        } catch {
          // Invalid JSON, return empty object
        }
      }
    }
    return {};
  });

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Failed to save form draft:", error);
      }
    }
  }, [formData]);

  /**
   * Update form data (merges with existing data)
   */
  const updateFormData = (updates: Partial<CreateSeriesDto>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  /**
   * Reset form data and clear localStorage
   */
  const resetForm = () => {
    setFormData({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Clear draft from localStorage (but keep current formData in memory)
   */
  const clearDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    formData,
    setFormData,
    updateFormData,
    resetForm,
    clearDraft,
  };
}
