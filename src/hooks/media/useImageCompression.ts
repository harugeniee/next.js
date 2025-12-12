import { useCallback, useState } from "react";

import type {
  CompressionOptions,
  CompressionResult,
} from "@/lib/utils/image-compression";
import {
  compressImage,
  compressImages,
  compressImagesWithResults,
} from "@/lib/utils/image-compression";

/**
 * Options for useImageCompression hook
 */
export interface UseImageCompressionOptions extends CompressionOptions {
  /**
   * Whether compression is enabled
   * Default: true
   */
  enabled?: boolean;

  /**
   * Progress callback
   * Called with progress percentage (0-100)
   */
  onProgress?: (progress: number) => void;
}

/**
 * Return type for useImageCompression hook
 */
export interface UseImageCompressionReturn {
  /**
   * Compress a single image file
   */
  compress: (file: File) => Promise<File>;

  /**
   * Compress multiple image files
   */
  compressMultiple: (files: File[]) => Promise<File[]>;

  /**
   * Compress multiple images with detailed results
   */
  compressMultipleWithResults: (files: File[]) => Promise<CompressionResult[]>;

  /**
   * Whether compression is currently in progress
   */
  isCompressing: boolean;

  /**
   * Current compression progress (0-100)
   */
  progress: number;

  /**
   * Error if compression failed
   */
  error: Error | null;

  /**
   * Reset compression state
   */
  reset: () => void;
}

/**
 * React hook for image compression
 * Provides state management and compression functionality
 *
 * @param options - Compression options
 * @returns Compression functions and state
 */
export function useImageCompression(
  options?: UseImageCompressionOptions,
): UseImageCompressionReturn {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled ?? true;

  /**
   * Update progress state and call callback if provided
   */
  const updateProgress = useCallback(
    (newProgress: number) => {
      setProgress(newProgress);
      options?.onProgress?.(newProgress);
    },
    [options],
  );

  /**
   * Compress a single image file
   */
  const compress = useCallback(
    async (file: File): Promise<File> => {
      if (!enabled) {
        return file;
      }

      // Only compress image files
      if (!file.type.startsWith("image/")) {
        return file;
      }

      setError(null);
      setIsCompressing(true);
      setProgress(0);

      try {
        updateProgress(50);
        const compressed = await compressImage(file, options);
        updateProgress(100);
        return compressed;
      } catch (err) {
        const compressionError =
          err instanceof Error ? err : new Error("Compression failed");
        setError(compressionError);
        console.error("Image compression error:", compressionError);
        // Return original file on error
        return file;
      } finally {
        setIsCompressing(false);
        // Reset progress after a short delay
        setTimeout(() => setProgress(0), 500);
      }
    },
    [enabled, options, updateProgress],
  );

  /**
   * Compress multiple image files
   */
  const compressMultiple = useCallback(
    async (files: File[]): Promise<File[]> => {
      if (!enabled) {
        return files;
      }

      setError(null);
      setIsCompressing(true);
      setProgress(0);

      try {
        const compressed = await compressImages(files, options, (prog) => {
          updateProgress(prog);
        });
        return compressed;
      } catch (err) {
        const compressionError =
          err instanceof Error ? err : new Error("Compression failed");
        setError(compressionError);
        console.error("Multiple image compression error:", compressionError);
        // Return original files on error
        return files;
      } finally {
        setIsCompressing(false);
        // Reset progress after a short delay
        setTimeout(() => setProgress(0), 500);
      }
    },
    [enabled, options, updateProgress],
  );

  /**
   * Compress multiple images with detailed results
   */
  const compressMultipleWithResults = useCallback(
    async (files: File[]): Promise<CompressionResult[]> => {
      if (!enabled) {
        // Return results with no compression
        return files.map((file) => ({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          reductionPercent: 0,
          success: true,
        }));
      }

      setError(null);
      setIsCompressing(true);
      setProgress(0);

      try {
        const results = await compressImagesWithResults(
          files,
          options,
          (prog) => {
            updateProgress(prog);
          },
        );
        return results;
      } catch (err) {
        const compressionError =
          err instanceof Error ? err : new Error("Compression failed");
        setError(compressionError);
        console.error("Multiple image compression error:", compressionError);
        // Return results with original files on error
        return files.map((file) => ({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          reductionPercent: 0,
          success: false,
          error: compressionError.message,
        }));
      } finally {
        setIsCompressing(false);
        // Reset progress after a short delay
        setTimeout(() => setProgress(0), 500);
      }
    },
    [enabled, options, updateProgress],
  );

  /**
   * Reset compression state
   */
  const reset = useCallback(() => {
    setIsCompressing(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    compress,
    compressMultiple,
    compressMultipleWithResults,
    isCompressing,
    progress,
    error,
    reset,
  };
}
