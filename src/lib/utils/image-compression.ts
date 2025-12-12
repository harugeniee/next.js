/**
 * Image Compression Utility
 * Client-side image compression using Canvas API
 * Reduces file size before upload to improve performance and reduce bandwidth
 */

/**
 * Compression options interface
 */
export interface CompressionOptions {
  /**
   * Image quality (0-1)
   * Higher values = better quality but larger file size
   * Default: 0.8
   */
  quality?: number;

  /**
   * Maximum width in pixels
   * Image will be resized if larger while preserving aspect ratio
   * Default: 1920
   */
  maxWidth?: number;

  /**
   * Maximum height in pixels
   * Image will be resized if larger while preserving aspect ratio
   * Default: 1920
   */
  maxHeight?: number;

  /**
   * Output image format
   * Default: 'jpeg'
   */
  outputFormat?: "jpeg" | "png" | "webp";

  /**
   * Whether to preserve EXIF metadata
   * Note: Canvas API strips EXIF by default
   * Default: false
   */
  preserveExif?: boolean;
}

/**
 * Compression result interface
 */
export interface CompressionResult {
  /**
   * Compressed file
   */
  file: File;

  /**
   * Original file size in bytes
   */
  originalSize: number;

  /**
   * Compressed file size in bytes
   */
  compressedSize: number;

  /**
   * Size reduction percentage (0-100)
   */
  reductionPercent: number;

  /**
   * Whether compression was successful
   */
  success: boolean;

  /**
   * Error message if compression failed
   */
  error?: string;
}

/**
 * Default compression options
 */
const DEFAULT_OPTIONS: Required<Omit<CompressionOptions, "preserveExif">> = {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1920,
  outputFormat: "jpeg",
};

/**
 * Check if WebP format is supported by the browser
 */
function isWebPSupported(): boolean {
  const canvas = document.createElement("canvas");
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

/**
 * Get MIME type for output format
 */
function getMimeType(format: "jpeg" | "png" | "webp"): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      // Fallback to JPEG if WebP is not supported
      return isWebPSupported() ? "image/webp" : "image/jpeg";
    default:
      return "image/jpeg";
  }
}

/**
 * Calculate new dimensions while preserving aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  // If image is smaller than max dimensions, return original
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculate scaling factor
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Load image from File object
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Compress a single image file
 *
 * @param file - Original image file
 * @param options - Compression options
 * @returns Promise resolving to compressed file or original file if compression fails
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions,
): Promise<File> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  // Merge options with defaults
  const opts: Required<Omit<CompressionOptions, "preserveExif">> = {
    quality: options?.quality ?? DEFAULT_OPTIONS.quality,
    maxWidth: options?.maxWidth ?? DEFAULT_OPTIONS.maxWidth,
    maxHeight: options?.maxHeight ?? DEFAULT_OPTIONS.maxHeight,
    outputFormat: options?.outputFormat ?? DEFAULT_OPTIONS.outputFormat,
  };

  try {
    // Load image
    const img = await loadImage(file);

    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.width,
      img.height,
      opts.maxWidth,
      opts.maxHeight,
    );

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Draw image to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Use high-quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Get MIME type (with WebP fallback)
    const mimeType = getMimeType(opts.outputFormat);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        mimeType,
        opts.quality,
      );
    });

    // Create new File object with original name
    const compressedFile = new File([blob], file.name, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    // If compression fails, return original file
    console.error("Image compression failed:", error);
    return file;
  }
}

/**
 * Compress image with detailed result information
 *
 * @param file - Original image file
 * @param options - Compression options
 * @returns Promise resolving to compression result
 */
export async function compressImageWithResult(
  file: File,
  options?: CompressionOptions,
): Promise<CompressionResult> {
  const originalSize = file.size;

  try {
    const compressedFile = await compressImage(file, options);
    const compressedSize = compressedFile.size;
    const reductionPercent =
      originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      reductionPercent,
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      file,
      originalSize,
      compressedSize: originalSize,
      reductionPercent: 0,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Compress multiple image files
 *
 * @param files - Array of image files
 * @param options - Compression options
 * @param onProgress - Optional progress callback (0-100)
 * @returns Promise resolving to array of compressed files
 */
export async function compressImages(
  files: File[],
  options?: CompressionOptions,
  onProgress?: (progress: number) => void,
): Promise<File[]> {
  const results: File[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Only compress image files
    if (file.type.startsWith("image/")) {
      const compressed = await compressImage(file, options);
      results.push(compressed);
    } else {
      // Non-image files are added as-is
      results.push(file);
    }

    // Update progress
    if (onProgress) {
      const progress = Math.round(((i + 1) / total) * 100);
      onProgress(progress);
    }
  }

  return results;
}

/**
 * Compress multiple images with detailed results
 *
 * @param files - Array of image files
 * @param options - Compression options
 * @param onProgress - Optional progress callback (0-100)
 * @returns Promise resolving to array of compression results
 */
export async function compressImagesWithResults(
  files: File[],
  options?: CompressionOptions,
  onProgress?: (progress: number) => void,
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Only compress image files
    if (file.type.startsWith("image/")) {
      const result = await compressImageWithResult(file, options);
      results.push(result);
    } else {
      // Non-image files return as-is with no compression
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        reductionPercent: 0,
        success: true,
      });
    }

    // Update progress
    if (onProgress) {
      const progress = Math.round(((i + 1) / total) * 100);
      onProgress(progress);
    }
  }

  return results;
}
