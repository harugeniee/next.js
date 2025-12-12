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
