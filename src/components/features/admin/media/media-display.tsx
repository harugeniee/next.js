"use client";

import {
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  Presentation,
  Table,
} from "lucide-react";
import Image from "next/image";

import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";
import type { Media } from "@/lib/interface/media.interface";
import { cn } from "@/lib/utils";

interface MediaDisplayProps {
  readonly media: Media;
  readonly size?: "sm" | "md" | "lg";
  readonly showName?: boolean;
  readonly className?: string;
}

/**
 * Media Display Component
 * Reusable component to display media with preview/thumbnail and name
 */
export function MediaDisplay({
  media,
  size = "md",
  showName = true,
  className,
}: MediaDisplayProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  // Get media display name
  const displayName =
    media.name || media.originalName || media.title || "Unknown Media";

  // Determine media type
  const mediaType = media.type?.toLowerCase() || "";
  const mimeType = media.mimeType?.toLowerCase() || "";

  // Check if it's an image
  const isImage =
    mediaType === MEDIA_CONSTANTS.TYPES.IMAGE || mimeType.startsWith("image/");

  // Check if it's a video
  const isVideo =
    mediaType === MEDIA_CONSTANTS.TYPES.VIDEO || mimeType.startsWith("video/");

  // Check if it's audio
  const isAudio =
    mediaType === MEDIA_CONSTANTS.TYPES.AUDIO || mimeType.startsWith("audio/");

  // Check if it's a document
  const isDocument =
    mediaType === MEDIA_CONSTANTS.TYPES.DOCUMENT ||
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("text/plain");

  // Check if it's a presentation
  const isPresentation =
    mediaType === MEDIA_CONSTANTS.TYPES.PRESENTATION ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("presentation");

  // Check if it's a spreadsheet
  const isSpreadsheet =
    mediaType === MEDIA_CONSTANTS.TYPES.SPREADSHEET ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("csv");

  // Check if it's an archive
  const isArchive =
    mediaType === MEDIA_CONSTANTS.TYPES.ARCHIVE ||
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("tar") ||
    mimeType.includes("gzip");

  // Get appropriate icon
  const getIcon = () => {
    if (isImage) return FileImage;
    if (isVideo) return FileVideo;
    if (isAudio) return FileAudio;
    if (isDocument) return FileText;
    if (isPresentation) return Presentation;
    if (isSpreadsheet) return Table;
    if (isArchive) return Archive;
    return File;
  };

  const Icon = getIcon();

  // Get preview URL (thumbnail for images, preview for videos)
  const previewUrl = media.thumbnailUrl || media.previewUrl || media.url;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative rounded-md flex items-center justify-center overflow-hidden bg-muted border",
          sizeClasses[size],
        )}
      >
        {isImage && previewUrl ? (
          <Image
            src={previewUrl}
            alt={displayName}
            width={size === "sm" ? 40 : size === "md" ? 64 : 96}
            height={size === "sm" ? 40 : size === "md" ? 64 : 96}
            className="object-cover w-full h-full"
            unoptimized={previewUrl.startsWith("data:")}
          />
        ) : isVideo && previewUrl ? (
          <div className="relative w-full h-full">
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Video className={cn(iconSizeClasses[size], "text-white")} />
            </div>
          </div>
        ) : isAudio ? (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <Music
              className={cn(iconSizeClasses[size], "text-muted-foreground")}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <Icon
              className={cn(iconSizeClasses[size], "text-muted-foreground")}
            />
          </div>
        )}
      </div>
      {showName && (
        <span className={cn("font-medium truncate", textSizeClasses[size])}>
          {displayName}
        </span>
      )}
    </div>
  );
}
