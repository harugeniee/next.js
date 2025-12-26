"use client";

import {
  BarChart3,
  Calendar,
  Database,
  FileImage,
  HardDrive,
  TrendingUp,
  Upload,
  Users,
  CheckCircle,
  Eye,
  Download,
  Lock,
  Unlock,
  Image as ImageIcon,
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
import type { MediaStatistics } from "@/lib/types/media";

interface MediaStatisticsCardsProps {
  readonly data?: MediaStatistics;
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
 * Media Statistics Component
 * Displays media overview statistics in cards
 */
export function MediaStatisticsCards({
  data,
  isLoading,
}: MediaStatisticsCardsProps) {
  const { t } = useI18n();

  const cards = useMemo(
    () => [
      {
        title: t("stats.totalMedia", "media"),
        value: data?.totalMedia ?? 0,
        icon: Database,
        description: t("stats.totalMediaDesc", "media"),
      },
      {
        title: t("stats.totalActiveMedia", "media"),
        value: data?.totalActiveMedia ?? 0,
        icon: CheckCircle,
        description: t("stats.totalActiveMediaDesc", "media"),
      },
      {
        title: t("stats.byType", "media"),
        value: data?.mediaByType
          ? Object.keys(data.mediaByType).length
          : 0,
        icon: BarChart3,
        description: t("stats.byTypeDesc", "media"),
      },
      {
        title: t("stats.byMimeType", "media"),
        value: data?.mediaByMimeType?.length ?? 0,
        icon: FileImage,
        description: t("stats.byMimeTypeDesc", "media"),
      },
      {
        title: t("stats.topUploaders", "media"),
        value: data?.topUploaders?.length ?? 0,
        icon: Users,
        description: t("stats.topUploadersDesc", "media"),
      },
      {
        title: t("stats.totalStorageSize", "media"),
        value: data?.totalStorageSize ?? 0,
        icon: HardDrive,
        description: t("stats.totalStorageSizeDesc", "media"),
        formatValue: (val: number) => formatFileSize(val),
      },
      {
        title: t("stats.recentUploads", "media"),
        value: data?.recentUploads ?? 0,
        icon: Upload,
        description: t("stats.recentUploadsDesc", "media"),
      },
      {
        title: t("stats.byStatus", "media"),
        value: data?.mediaByStatus
          ? Object.keys(data.mediaByStatus).length
          : 0,
        icon: TrendingUp,
        description: t("stats.byStatusDesc", "media"),
      },
      {
        title: t("stats.publicMedia", "media"),
        value: data?.publicMedia ?? 0,
        icon: Unlock,
        description: t("stats.publicMediaDesc", "media"),
      },
      {
        title: t("stats.privateMedia", "media"),
        value: data?.privateMedia ?? 0,
        icon: Lock,
        description: t("stats.privateMediaDesc", "media"),
      },
      {
        title: t("stats.scrambledImages", "media"),
        value: data?.scrambledImages ?? 0,
        icon: ImageIcon,
        description: t("stats.scrambledImagesDesc", "media"),
      },
      {
        title: t("stats.totalViews", "media"),
        value: data?.totalViews ?? 0,
        icon: Eye,
        description: t("stats.totalViewsDesc", "media"),
      },
    ],
    [data, t],
  );

  return (
    <Skeletonize loading={isLoading}>
      <AnimatedGrid
        loading={isLoading}
        data={cards}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        {data
          ? cards.map((card) => {
              const Icon = card.icon;
              const displayValue = card.formatValue
                ? card.formatValue(card.value as number)
                : formatNumber(card.value as number);
              return (
                <Card key={card.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayValue}</div>
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

