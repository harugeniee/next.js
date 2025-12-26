"use client";

import {
  Activity,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedGrid } from "@/components/shared/animated-grid";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { DashboardOverviewResponse } from "@/lib/api/analytics";

interface OverviewCardsProps {
  readonly data?: DashboardOverviewResponse;
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
 * Overview Cards Component
 * Displays key metrics in a responsive grid
 */
export function OverviewCards({ data, isLoading }: OverviewCardsProps) {
  const { t } = useI18n();

  const cards = useMemo(
    () => [
      {
        title: t("dashboard.metrics.totalEvents", "admin"),
        value: data?.totalEvents ?? 0,
        icon: Activity,
        description: t("dashboard.metrics.totalEventsDesc", "admin"),
      },
      {
        title: t("dashboard.metrics.uniqueUsers", "admin"),
        value: data?.uniqueUsers ?? 0,
        icon: Users,
        description: t("dashboard.metrics.uniqueUsersDesc", "admin"),
      },
      {
        title: t("dashboard.metrics.contentInteractions", "admin"),
        value: data?.contentInteractions ?? 0,
        icon: MessageCircle,
        description: t("dashboard.metrics.contentInteractionsDesc", "admin"),
      },
      {
        title: t("dashboard.metrics.socialInteractions", "admin"),
        value: data?.socialInteractions ?? 0,
        icon: Share2,
        description: t("dashboard.metrics.socialInteractionsDesc", "admin"),
      },
      {
        title: t("dashboard.metrics.systemInteractions", "admin"),
        value: data?.systemInteractions ?? 0,
        icon: Zap,
        description: t("dashboard.metrics.systemInteractionsDesc", "admin"),
      },
      {
        title: t("dashboard.metrics.engagementInteractions", "admin"),
        value: data?.engagementInteractions ?? 0,
        icon: Heart,
        description: t("dashboard.metrics.engagementInteractionsDesc", "admin"),
      },
    ],
    [data, t],
  );

  return (
    <Skeletonize loading={isLoading}>
      <AnimatedGrid
        loading={isLoading}
        data={cards}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {data
          ? cards.map((card) => {
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
          : // Placeholder divs for skeleton
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
            ))}
      </AnimatedGrid>
    </Skeletonize>
  );
}
