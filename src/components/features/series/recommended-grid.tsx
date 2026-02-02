"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";
import { SeriesCard } from "./series-card";

/**
 * Recommended grid component
 */
interface RecommendedGridProps {
  readonly series: Series[];
  readonly titleI18nKey: string;
  readonly viewAllI18nKey: string;
  readonly viewAllHref?: string;
  /** When false, hides the "View all" link and button (e.g. on the full list page). Default true. */
  readonly showViewAll?: boolean;
  /** When false, hides the title row (use when page already has its own heading). Default true. */
  readonly showTitle?: boolean;
  readonly variant?: "default" | "compact";
  readonly className?: string;
}

export function RecommendedGrid({
  series,
  titleI18nKey,
  viewAllI18nKey,
  viewAllHref = "/series",
  showViewAll = true,
  showTitle = true,
  variant = "default",
  className,
}: RecommendedGridProps) {
  const { t } = useI18n();
  const isCompact = variant === "compact";

  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              {t(titleI18nKey, "series")}
            </h2>
            {/* Arrow icon - visible on mobile only when showViewAll */}
            {showViewAll && (
              <Link
                href={viewAllHref}
                className="sm:hidden flex items-center justify-center"
                aria-label={t(viewAllI18nKey, "series")}
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            )}
          </div>
          {/* Button with text - visible on desktop only when showViewAll */}
          {showViewAll && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm hidden sm:flex"
            >
              <Link
                href={viewAllHref}
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <span>{t(viewAllI18nKey, "series")}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              </Link>
            </Button>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid",
          // Gap spacing - optimized for each breakpoint
          // 320px: gap-2 (8px), 375px: gap-2 (8px), 425px: gap-2.5 (10px)
          // 768px: gap-3 (12px), 1024px: gap-3 (12px), 1280px: gap-4 (16px), 1536px: gap-4 (16px)
          "gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-4",
          // Grid columns - optimized for specific breakpoints
          isCompact
            ? // Compact variant: vertical cards - more columns
              // 320px: 2 cols, 375px: 2 cols, 425px: 2 cols, 768px: 3 cols, 1024px: 4 cols, 1280px: 5 cols, 1536px: 6 cols
              "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            : // Default variant: horizontal cards - 2 cols on mobile, 3 cols on tablet, 6 cols on large screens
              // 320px: 2 cols, 375px: 2 cols, 425px: 2 cols, 768px: 2 cols, 1024px: 3 cols, 1280px: 6 cols, 1536px: 6 cols
              "grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6",
        )}
      >
        {series.map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            variant={isCompact ? "compact" : "default"}
          />
        ))}
      </div>
    </div>
  );
}
