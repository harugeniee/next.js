"use client";

import { EyeOff, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import type { LatestUpdateItem } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Language flag mapping
 */
const languageFlags: Record<string, string> = {
  ja: "🇯🇵",
  en: "🇺🇸",
  vi: "🇻🇳",
  zh: "🇨🇳",
  ko: "🇰🇷",
  pt: "🇵🇹",
  fr: "🇫🇷",
};

/**
 * Format relative time
 * Handles both Date objects and date strings (ISO format)
 */
function formatRelativeTime(
  date: Date | string,
  t: (key: string, ns?: string) => string,
): string {
  // Convert to Date object if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validate date
  if (isNaN(dateObj.getTime())) {
    return t("justNow", "series");
  }

  const minutes = Math.floor((Date.now() - dateObj.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return t("justNow", "series");
  if (minutes < 60)
    return t("minutesAgo", "series").replace("{{value}}", minutes.toString());
  if (hours < 24)
    return t("hoursAgo", "series").replace("{{value}}", hours.toString());
  return t("daysAgo", "series").replace("{{value}}", days.toString());
}

/**
 * Latest Update Item Card Component
 * Individual card for each latest update item with NSFW support
 */
export interface LatestUpdateItemCardProps {
  readonly item: LatestUpdateItem;
  readonly t: (key: string, ns?: string) => string;
}

export function LatestUpdateItemCard({ item, t }: LatestUpdateItemCardProps) {
  const [isNsfwRevealed, setIsNsfwRevealed] = useState(false);
  const isNsfw = item.isNsfw === true;

  return (
    <Link
      href={`/series/${item.id}`}
      className="flex gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg border border-border bg-card transition-colors hover:bg-accent/50 cursor-pointer group h-full"
    >
      {/* Cover - Full height of card */}
      <div className="relative w-12 sm:w-16 md:w-20 h-full min-h-[80px] sm:min-h-[100px] flex-shrink-0 overflow-hidden rounded bg-muted">
        <Image
          src={item.coverUrl}
          alt={item.title}
          fill
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105",
            isNsfw && !isNsfwRevealed && "blur-md",
          )}
          sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
        />
        {/* NSFW Overlay */}
        {isNsfw && !isNsfwRevealed && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-md cursor-pointer transition-opacity duration-300 hover:bg-background/95 border border-border/50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsNsfwRevealed(true);
            }}
          >
            <div className="text-center px-2">
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-foreground font-semibold text-[10px] sm:text-xs mb-0.5">
                NSFW
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1 min-w-0">
        {/* Title - Full width on mobile for better readability */}
        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary line-clamp-2 sm:line-clamp-1 min-w-0 transition-colors">
          {item.title}
        </h3>

        {/* Genres/Tags - Show first 2-3 genres, fallback to tags if no genres */}
        {(() => {
          const displayItems =
            item.genres && item.genres.length > 0
              ? item.genres
              : item.tags && item.tags.length > 0
                ? item.tags
                : [];

          if (displayItems.length === 0) return null;

          return (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
              {displayItems.slice(0, 3).map((genre, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 h-auto font-medium"
                >
                  <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  {genre}
                </Badge>
              ))}
              {displayItems.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 h-auto"
                >
                  +{displayItems.length - 3}
                </Badge>
              )}
            </div>
          );
        })()}

        {/* Chapter info - Stacked on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
            <span className="text-[10px] sm:text-xs flex-shrink-0">
              {languageFlags[item.chapter.language] ||
                `[${item.chapter.language.toUpperCase()}]`}
            </span>
            <span className="truncate">
              {t("chapter", "series")} {item.chapter.number}
              {item.chapter.title && (
                <span className="hidden sm:inline">
                  {` - ${item.chapter.title}`}
                </span>
              )}
            </span>
          </div>

          {/* Timestamp - Separate line on mobile for clarity */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex-shrink-0">
              {formatRelativeTime(item.timestamp, t)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Latest updates list component
 */
interface LatestUpdatesListProps {
  items: LatestUpdateItem[];
  className?: string;
}

export function LatestUpdatesList({
  items,
  className,
}: LatestUpdatesListProps) {
  const { t } = useI18n();

  return (
    <div className={className}>
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {t("latestUpdates", "series")}
        </h2>
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link href="/series/latest" className="text-xs sm:text-sm">
            {t("viewLastUpdatedTitles", "series")}
            <span className="ml-2">→</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-2 sm:gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <LatestUpdateItemCard key={item.id} item={item} t={t} />
        ))}
      </div>
    </div>
  );
}
