"use client";

import { Skeletonize } from "@/components/shared/skeletonize";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CustomImageContentRendererProps {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Custom Image Content Renderer Component
 * Uses Next.js Image component with proper optimization through _next/image
 */
export function CustomImageContentRenderer({
  src,
  alt = "",
  title = "",
  width = 800,
  height = 600,
  className = "",
}: CustomImageContentRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading/error when image source changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25 my-4 ${className}`}
      >
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-2">
            Failed to load image
          </div>
          <div className="text-xs text-muted-foreground/70">{src}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group my-4 inline-block max-w-full ${className}`}>
      <Skeletonize loading={isLoading}>
        <Image
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className="rounded-lg max-w-full h-auto"
          onLoadingComplete={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={false}
          placeholder="empty"
        />
      </Skeletonize>

      {/* Image info */}
      {(alt || title) && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {alt && <div>Alt: {alt}</div>}
          {title && <div>Title: {title}</div>}
        </div>
      )}
    </div>
  );
}
