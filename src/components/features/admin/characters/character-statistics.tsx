"use client";

import {
  BarChart3,
  Calendar,
  Heart,
  Image as ImageIcon,
  Mic,
  TrendingUp,
  Users,
  UserCheck,
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
import type { CharacterStatistics } from "@/lib/types/characters";

interface CharacterStatisticsCardsProps {
  readonly data?: CharacterStatistics;
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
 * Character Statistics Component
 * Displays character overview statistics in cards
 */
export function CharacterStatisticsCards({
  data,
  isLoading,
}: CharacterStatisticsCardsProps) {
  const { t } = useI18n();

  const cards = useMemo(
    () => [
      {
        title: t("stats.totalCharacters", "characters"),
        value: data?.totalCharacters ?? 0,
        icon: Users,
        description: t("stats.totalCharactersDesc", "characters"),
      },
      {
        title: t("stats.activeCharacters", "characters"),
        value: data?.activeCharacters ?? 0,
        icon: UserCheck,
        description: t("stats.activeCharactersDesc", "characters"),
      },
      {
        title: t("stats.byGender", "characters"),
        value: data?.charactersByGender
          ? Object.keys(data.charactersByGender).length
          : 0,
        icon: BarChart3,
        description: t("stats.byGenderDesc", "characters"),
      },
      {
        title: t("stats.byBloodType", "characters"),
        value: data?.charactersByBloodType
          ? Object.keys(data.charactersByBloodType).length
          : 0,
        icon: TrendingUp,
        description: t("stats.byBloodTypeDesc", "characters"),
      },
      {
        title: t("stats.withImages", "characters"),
        value: data?.charactersWithImages ?? 0,
        icon: ImageIcon,
        description: t("stats.withImagesDesc", "characters"),
      },
      {
        title: t("stats.withVoiceActors", "characters"),
        value: data?.charactersWithVoiceActors ?? 0,
        icon: Mic,
        description: t("stats.withVoiceActorsDesc", "characters"),
      },
      {
        title: t("stats.totalVoiceActors", "characters"),
        value: data?.totalVoiceActors ?? 0,
        icon: Mic,
        description: t("stats.totalVoiceActorsDesc", "characters"),
      },
      {
        title: t("stats.totalReactions", "characters"),
        value: data?.totalReactions ?? 0,
        icon: Heart,
        description: t("stats.totalReactionsDesc", "characters"),
      },
      {
        title: t("stats.bySeries", "characters"),
        value: data?.charactersBySeries?.length ?? 0,
        icon: Calendar,
        description: t("stats.bySeriesDesc", "characters"),
      },
    ],
    [data, t],
  );

  return (
    <Skeletonize loading={isLoading}>
      <AnimatedGrid
        loading={isLoading}
        data={cards}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5"
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
