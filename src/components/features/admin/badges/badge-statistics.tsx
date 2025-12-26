"use client";

import { Award, BarChart3, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedGrid } from "@/components/shared/animated-grid";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { BadgeStatistics } from "@/lib/types/badges";

interface BadgeStatisticsProps {
  readonly data?: BadgeStatistics;
  readonly isLoading: boolean;
}

/**
 * Format large numbers with K/M suffixes
 */
function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Badge Statistics Component
 * Displays badge overview statistics in cards
 */
export function BadgeStatisticsCards({
  data,
  isLoading,
}: BadgeStatisticsProps) {
  const { t } = useI18n();

  const cards = useMemo(
    () => [
      {
        title: t("badges.stats.totalBadges", "admin"),
        value: data?.totalBadges ?? 0,
        icon: Award,
        description: t("badges.stats.totalBadgesDesc", "admin"),
      },
      {
        title: t("badges.stats.activeBadges", "admin"),
        value: data?.activeBadges ?? 0,
        icon: BarChart3,
        description: t("badges.stats.activeBadgesDesc", "admin"),
      },
      {
        title: t("badges.stats.totalAssignments", "admin"),
        value: data?.totalAssignments ?? 0,
        icon: Users,
        description: t("badges.stats.totalAssignmentsDesc", "admin"),
      },
      {
        title: t("badges.stats.categories", "admin"),
        value: data?.badgesByCategory
          ? Object.keys(data.badgesByCategory).length
          : 0,
        icon: TrendingUp,
        description: t("badges.stats.categoriesDesc", "admin"),
      },
    ],
    [data, t],
  );

  return (
    <Skeletonize loading={isLoading}>
      <AnimatedGrid
        loading={isLoading}
        data={cards}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        {data ? (
          cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(card.value)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          // Placeholder divs for skeleton
          cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        )}
      </AnimatedGrid>
    </Skeletonize>
  );
}

