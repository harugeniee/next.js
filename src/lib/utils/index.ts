import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export error utilities
export {
  extractAndTranslateErrorMessage,
  extractErrorMessage,
} from "./error-extractor";

// Re-export image scrambler utilities
export {
  base64UrlToUint8Array,
  createRngFromSeed,
  generatePermutation,
} from "./image-scrambler";

// Re-export image compression utilities
export {
  compressImage,
  compressImages,
  compressImagesWithResults,
  compressImageWithResult,
  type CompressionOptions,
  type CompressionResult,
} from "./image-compression";

// Re-export query utilities
export { createQueryClient, queryClient } from "./query-client";
export { queryKeys } from "./query-keys";
export {
  createInfiniteQueryConfig,
  createMutationErrorHandler,
  createMutationSuccessHandler,
  createOptimisticUpdate,
  queryInvalidation,
} from "./query-utils";

// Re-export series utilities
export {
  transformBackendSeries,
  transformBackendSeriesList,
  transformToPopularSeries,
} from "./series-utils";

// Re-export permission utilities
export {
  isPermissionDeniedPage,
  redirectToPermissionDenied,
} from "./permission-utils";

/**
 * Get avatar URL from User object
 * Priority: photoUrl > avatar.url > fallback
 */
export function getUserAvatarUrl(
  user: { photoUrl?: string; avatar?: { url?: string } } | null | undefined,
  fallback: string = "/avatar.png",
): string {
  if (!user) return fallback;
  return user.photoUrl || user.avatar?.url || fallback;
}

/**
 * Get user display name from User object
 * Priority: name > username > fallback
 */
export function getUserDisplayName(
  user: { name?: string; username?: string } | null | undefined,
  fallback: string = "User",
): string {
  if (!user) return fallback;
  return user.name || user.username || fallback;
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(
  user: { name?: string; username?: string } | null | undefined,
): string {
  if (!user) return "U";
  const name = user.name || user.username || "";
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
