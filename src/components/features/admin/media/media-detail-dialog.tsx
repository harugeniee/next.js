"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";
import type { Media } from "@/lib/interface/media.interface";
import { MediaDisplay } from "./media-display";

interface MediaDetailDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly media: Media | null;
}

/**
 * Format file size in bytes to human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in seconds to human-readable format
 */
function formatDuration(seconds?: number): string {
  if (!seconds) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Parse tags from JSON string or array
 */
function parseTags(tags?: string | string[]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Media Detail Dialog Component
 * Shows full media details including file information, user info, and statistics
 */
export function MediaDetailDialog({
  open,
  onOpenChange,
  media,
}: MediaDetailDialogProps) {
  const { t } = useI18n();

  if (!media) return null;

  const displayName =
    media.name || media.originalName || media.title || "Unknown Media";

  const tags = parseTags(media.tags);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <DialogDescription>
            {t("detail.description", "media")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Media Preview */}
          <div className="flex items-start gap-4">
            <MediaDisplay media={media} size="lg" showName={false} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{displayName}</h3>
              {media.type && (
                <p className="text-sm text-muted-foreground">
                  {t(`types.${media.type.toLowerCase()}`, "media") ||
                    media.type}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t("detail.sections.basicInfo", "media")}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {media.name && (
                <div>
                  <span className="font-medium">
                    {t("fields.name", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">{media.name}</span>
                </div>
              )}
              {media.originalName && (
                <div>
                  <span className="font-medium">
                    {t("fields.originalName", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {media.originalName}
                  </span>
                </div>
              )}
              {media.type && (
                <div>
                  <span className="font-medium">
                    {t("fields.type", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">{media.type}</span>
                </div>
              )}
              {media.mimeType && (
                <div>
                  <span className="font-medium">
                    {t("fields.mimeType", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {media.mimeType}
                  </span>
                </div>
              )}
              {media.status && (
                <div>
                  <span className="font-medium">
                    {t("fields.status", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">{media.status}</span>
                </div>
              )}
              <div>
                <span className="font-medium">
                  {t("fields.isPublic", "media")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {media.isPublic
                    ? t("common.yes", "common")
                    : t("common.no", "common")}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {media.description && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("fields.description", "media")}
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                {media.description}
              </p>
            </div>
          )}

          {/* File Details */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t("detail.sections.fileDetails", "media")}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">
                  {t("fields.size", "media")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {formatFileSize(media.size)}
                </span>
              </div>
              {media.width && media.height && (
                <div>
                  <span className="font-medium">
                    {t("fields.dimensions", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {media.width} × {media.height}
                  </span>
                </div>
              )}
              {media.duration && (
                <div>
                  <span className="font-medium">
                    {t("fields.duration", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {formatDuration(media.duration)}
                  </span>
                </div>
              )}
              {media.extension && (
                <div>
                  <span className="font-medium">
                    {t("fields.extension", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {media.extension}
                  </span>
                </div>
              )}
              {media.storageProvider && (
                <div>
                  <span className="font-medium">
                    {t("fields.storageProvider", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {media.storageProvider}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          {media.user && (
            <div>
              <h4 className="text-sm font-medium mb-3">
                {t("detail.sections.userInfo", "media")}
              </h4>
              <div className="text-sm">
                <span className="font-medium">
                  {t("fields.user", "media")}:{" "}
                </span>
                {media.userId ? (
                  <Link
                    href={`/admin/users/${media.userId}`}
                    className="text-primary hover:underline"
                  >
                    {media.user.name || media.user.email || media.userId}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">
                    {media.user.name || media.user.email || "-"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t("detail.sections.statistics", "media")}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">
                  {t("fields.downloadCount", "media")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {media.downloadCount ?? 0}
                </span>
              </div>
              <div>
                <span className="font-medium">
                  {t("fields.viewCount", "media")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {media.viewCount ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("fields.tags", "media")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t("detail.sections.metadata", "media")}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {media.createdAt && (
                <div>
                  <span className="font-medium">
                    {t("fields.createdAt", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(media.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
              {media.updatedAt && (
                <div>
                  <span className="font-medium">
                    {t("fields.updatedAt", "media")}:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(media.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
