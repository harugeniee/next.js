"use client";

import { ExternalLink, EyeOff, Frown, Heart, Plus, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Card } from "@/components/ui/core/card";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Format countdown time for episode airing
 * Returns formatted string like "1 day, 7 hours" or "6 hours, 59 mins"
 */
function formatAiringTime(targetDate: Date | string): string {
  const target =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Airing now";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0 && days === 0)
    parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "Airing soon";
}

/**
 * NSFW Overlay Component (Discord-style spoiler)
 * Declared outside component to prevent recreation on each render
 */
const NSFWOverlay = ({ onClick }: { onClick: () => void }) => (
  <div
    className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-md cursor-pointer transition-opacity duration-300 hover:bg-background/95 border border-border/50"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
  >
    <div className="text-center px-4">
      <EyeOff className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-foreground font-semibold text-xs sm:text-sm mb-1">
        NSFW
      </p>
      <p className="text-muted-foreground text-[10px] sm:text-xs">
        Click to reveal
      </p>
    </div>
  </div>
);

/**
 * Series card component with different variants
 * - anichart: AniChart-style vertical poster with gradient overlay
 * - default: Horizontal layout with cover image on left, content on right
 * - compact: Vertical compact card
 * - featured: Vertical card with featured badge
 * - tiny: Smallest vertical card variant
 */
interface SeriesCardProps {
  series: Series;
  variant?: "default" | "compact" | "featured" | "tiny" | "anichart";
  className?: string;
  // Optional props for detailed view
  currentEpisode?: number;
  totalEpisodes?: number;
  nextAiringDate?: Date | string;
  rank?: number;
  studio?: string;
  // Optional props for AniChart variant
  romajiTitle?: string; // Reserved for future use
  startDate?: Date | string;
  genres?: string[];
}

export function SeriesCard({
  series,
  variant = "default",
  className,
  currentEpisode,
  totalEpisodes,
  nextAiringDate,
  rank,
  studio,
  startDate,
  genres,
  // romajiTitle reserved for future use
}: SeriesCardProps) {
  const { t } = useI18n();
  const [isNsfwRevealed, setIsNsfwRevealed] = useState(false);

  const isCompact = variant === "compact";
  const isTiny = variant === "tiny";
  const isFeatured = variant === "featured";
  const isDefault = variant === "default";
  const isAniChart = variant === "anichart";
  const isNsfw = series.isNsfw === true;

  // Calculate rating percentage from averageScore (0-100 scale)
  const rating = series.averageScore
    ? Math.round(series.averageScore / 10)
    : null;
  const ratingIcon = useMemo(() => {
    if (rating === null) return null;
    return rating >= 70 ? (
      <Smile className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
    ) : (
      <Frown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
    );
  }, [rating]);

  // Format episode info
  const episodeInfo = useMemo(() => {
    if (!currentEpisode || !totalEpisodes) return null;
    const airingText = nextAiringDate
      ? formatAiringTime(nextAiringDate)
      : "Airing";
    return `Ep ${currentEpisode} of ${totalEpisodes} airing in ${airingText}`;
  }, [currentEpisode, totalEpisodes, nextAiringDate]);

  // Format airing date for AniChart variant
  const formatAiringDate = useMemo(() => {
    if (startDate) {
      const date =
        typeof startDate === "string" ? new Date(startDate) : startDate;
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (series.season && series.seasonYear) {
      // If no specific date, show "Airing in [Month] [Year]"
      const monthMap: Record<string, string> = {
        winter: "January",
        spring: "April",
        summer: "July",
        fall: "October",
      };
      return `${monthMap[series.season] || series.season} ${series.seasonYear}`;
    }
    return null;
  }, [startDate, series.season, series.seasonYear]);

  // Get genres for AniChart variant (use provided genres or fallback to tags)
  const displayGenres = useMemo(() => {
    return genres || series.tags || [];
  }, [genres, series.tags]);

  // AniChart-style variant: horizontal layout with cover image on left, info panel on right
  if (isAniChart) {
    return (
      <Card
        className={cn(
          "group flex flex-row items-stretch overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md p-0",
          className,
        )}
      >
        {/* Left Section: Cover Image - Optimized width for mobile */}
        <Link
          href={`/series/${series.id}`}
          className="relative w-24 sm:w-32 md:w-36 lg:w-40 xl:w-44 flex-shrink-0 overflow-hidden bg-muted block h-full m-0 p-0"
        >
          <div className="relative w-full h-full m-0 p-0 leading-none">
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                isNsfw && !isNsfwRevealed && "blur-md",
              )}
              sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 144px, (max-width: 1280px) 160px, 176px"
            />

            {/* NSFW Overlay */}
            {isNsfw && !isNsfwRevealed && (
              <NSFWOverlay onClick={() => setIsNsfwRevealed(true)} />
            )}

            {/* View Details Button - Top Right (only on hover, hidden on mobile) */}
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="rounded-full bg-background/90 backdrop-blur-sm p-1 sm:p-1.5 shadow-lg border border-border/50">
                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              </div>
            </div>

            {/* Dark Gradient Overlay at Bottom with Title and Studio */}
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 sm:pt-8 pb-1.5 sm:pb-2 px-1.5 sm:px-2 md:px-3">
              <h3 className="text-white font-semibold text-[11px] sm:text-xs md:text-sm line-clamp-2 mb-0.5 sm:mb-1 drop-shadow-lg leading-tight">
                {series.title}
              </h3>
              {studio && (
                <p className="text-blue-300 text-[9px] sm:text-[10px] md:text-xs line-clamp-1 drop-shadow-md">
                  {studio}
                </p>
              )}
            </div>
          </div>
        </Link>

        {/* Right Section: Information Panel - Optimized spacing for mobile */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-3 md:p-4 min-w-0 h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px]">
          {/* Top Row: Airing Date and Ranking */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 flex-wrap">
                <span className="text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                  Airing on
                </span>
                {formatAiringDate && (
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-foreground">
                    {formatAiringDate}
                  </span>
                )}
              </div>
              {/* Sequel/Source Info */}
              {(series.status ===
                SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON ||
                series.source) && (
                <p className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground line-clamp-1">
                  {series.status ===
                  SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON
                    ? `Sequel to ${series.title}`
                    : series.source
                      ? `Source • ${series.source.replace(/_/g, " ")}`
                      : null}
                </p>
              )}
            </div>
            {/* Ranking Badge */}
            {rank && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-pink-500 flex-shrink-0">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  #{rank}
                </span>
              </div>
            )}
          </div>

          {/* Synopsis/Description - Optimized min-height for mobile */}
          <div className="flex-1 min-h-[48px] sm:min-h-[60px] md:min-h-[72px] mb-2 sm:mb-3">
            {series.description ? (
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 md:line-clamp-4 leading-relaxed h-full">
                {series.description}
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground/50 italic line-clamp-2 sm:line-clamp-3 md:line-clamp-4 leading-relaxed h-full">
                <i>No description available.</i>
              </p>
            )}
          </div>

          {/* Bottom: Genre Pills - Show fewer on mobile */}
          {displayGenres.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-auto pt-1.5 sm:pt-2 flex-shrink-0">
              <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 flex-1">
                {displayGenres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] md:text-xs font-semibold bg-amber-600 text-white border-0 whitespace-nowrap"
                  >
                    {genre}
                  </span>
                ))}
                {/* Show +N indicator on mobile if more genres exist */}
                {displayGenres.length > 3 && (
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] md:text-xs font-semibold bg-muted text-muted-foreground border-0">
                    +{displayGenres.length - 3}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
                aria-label="Add to list"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Show horizontal layout only for default variant
  if (isDefault && (episodeInfo || rank || studio)) {
    return (
      <Card
        className={cn(
          "group flex flex-row gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg border border-border bg-card transition-all duration-150 hover:shadow-md hover:border-border/80",
          className,
        )}
      >
        {/* Cover Image - Left side - Optimized for mobile readability */}
        <Link
          href={`/series/${series.id}`}
          className="relative w-16 sm:w-20 md:w-24 lg:w-28 h-22 sm:h-26 md:h-32 lg:h-36 flex-shrink-0 overflow-hidden rounded bg-muted"
        >
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isNsfw && !isNsfwRevealed && "blur-md",
            )}
            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
          />
          {/* NSFW Overlay */}
          {isNsfw && !isNsfwRevealed && (
            <NSFWOverlay onClick={() => setIsNsfwRevealed(true)} />
          )}
        </Link>

        {/* Content - Right side - Better mobile spacing */}
        <div className="flex flex-1 flex-col gap-1 sm:gap-1.5 md:gap-2 min-w-0 min-h-[88px] sm:min-h-[104px] md:min-h-[128px]">
          {/* Header: Episode info, Rating, Rank */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[10px] sm:text-[11px] md:text-xs text-muted-foreground flex-shrink-0">
            {episodeInfo && <span className="truncate">{episodeInfo}</span>}
            {rating !== null && (
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <span>{rating}%</span>
                {ratingIcon}
              </div>
            )}
            {rank && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-red-500 flex-shrink-0 ml-auto">
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                <span>#{rank}</span>
              </div>
            )}
          </div>

          {/* Title - Improved mobile readability */}
          <Link
            href={`/series/${series.id}`}
            className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-foreground hover:text-primary line-clamp-2 leading-tight flex-shrink-0"
          >
            {series.title}
          </Link>

          {/* Subtitle/Source */}
          {series.season && series.seasonYear && (
            <p className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground flex-shrink-0">
              {series.season} {series.seasonYear}
              {series.source && (
                <span className="hidden sm:inline">
                  {` • Source • ${series.source}`}
                </span>
              )}
            </p>
          )}

          {/* Description - Optimized line-clamp for mobile */}
          <div className="flex-1 min-h-[32px] sm:min-h-[40px] md:min-h-[48px]">
            {series.description ? (
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-2 md:line-clamp-3 leading-relaxed">
                {series.description}
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground/50 italic line-clamp-2 sm:line-clamp-2 md:line-clamp-3 leading-relaxed">
                <i>No description available.</i>
              </p>
            )}
          </div>

          {/* Studio/Source */}
          {studio && (
            <p className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground flex-shrink-0 truncate">
              {studio}
            </p>
          )}

          {/* Genre Tags - Show 2-3 tags max on mobile */}
          {series.tags && series.tags.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-auto pt-1 flex-shrink-0">
              <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 flex-1">
                {series.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] md:text-[11px] font-medium bg-accent text-accent-foreground border border-border/50 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
                {/* Show +N for additional tags */}
                {series.tags.length > 2 && (
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] md:text-[11px] font-medium bg-muted text-muted-foreground">
                    +{series.tags.length - 2}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0"
                aria-label="View more"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Original vertical layout for other variants - Mobile optimized
  return (
    <Link href={`/series/${series.id}`} className="block h-full">
      <Card
        className={cn(
          "group flex h-full flex-col overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md p-0 cursor-pointer",
          className,
        )}
      >
        {/* Cover Image - Aspect ratio optimized for mobile */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isNsfw && !isNsfwRevealed && "blur-md",
            )}
            sizes={
              isTiny
                ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 10vw"
                : isCompact
                  ? "(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 33vw, 25vw"
                  : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
          />
          {/* NSFW Overlay */}
          {isNsfw && !isNsfwRevealed && (
            <NSFWOverlay onClick={() => setIsNsfwRevealed(true)} />
          )}
          {/* View Details Button - Top Right - Hidden on tiny variant mobile */}
          <div
            className={cn(
              "absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              isTiny
                ? "top-1 right-1 sm:top-1.5 sm:right-1.5"
                : "top-1.5 right-1.5 sm:top-2 sm:right-2",
            )}
          >
            <div
              className={cn(
                "rounded-full bg-background/90 backdrop-blur-sm shadow-lg border border-border/50",
                isTiny ? "p-1 sm:p-1.5" : "p-1 sm:p-1.5",
              )}
            >
              <ExternalLink
                className={cn(
                  "text-foreground",
                  isTiny
                    ? "h-2 w-2 sm:h-2.5 sm:w-2.5"
                    : "h-2.5 w-2.5 sm:h-3 sm:w-3",
                )}
              />
            </div>
          </div>
          {isFeatured && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 rounded bg-primary px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold text-primary-foreground">
              {t("featured", "series")}
            </div>
          )}
        </div>

        {/* Title Section - Optimized padding and font sizes for mobile */}
        <div
          className={cn(
            "flex-shrink-0",
            isTiny
              ? "p-1 sm:p-1.5 md:p-2"
              : isCompact
                ? "p-1.5 sm:p-2 md:p-2.5"
                : "px-2 sm:px-2.5 pt-1.5 pb-1.5 sm:pt-2 sm:pb-2",
          )}
        >
          <h3
            className={cn(
              "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight",
              isTiny
                ? "text-[10px] sm:text-xs md:text-sm lg:text-base"
                : isCompact
                  ? "text-xs sm:text-sm md:text-base lg:text-lg"
                  : "text-sm sm:text-base md:text-lg lg:text-xl",
            )}
          >
            {series.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
}
