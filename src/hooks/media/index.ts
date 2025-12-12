/**
 * Media management hooks
 * All media functionality consolidated in useMediaQuery.ts
 */

export {
  useDeleteMedia,
  useImageUpload,
  useMediaManagement,
  useMultipleImageUpload,
  useUserMedia,
} from "./useMediaQuery";

// Export image compression hook
export {
  useImageCompression,
  type UseImageCompressionOptions,
  type UseImageCompressionReturn,
} from "./useImageCompression";
