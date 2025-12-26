"use client";

import {
  Edit,
  Image as ImageIcon,
  MessageSquare,
  Pin,
  Reply,
  TrendingUp,
  Type,
  Users,
  Eye,
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
import type { CommentStatistics } from "@/lib/types/comments";

interface CommentStatisticsCardsProps {
  readonly data?: CommentStatistics;
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
 * Comment Statistics Component
 * Displays comment overview statistics in cards
 */
export function CommentStatisticsCards({
  data,
  isLoading,
}: CommentStatisticsCardsProps) {
  const { t } = useI18n();

  const cards = useMemo(
    () => [
      {
        title: t("comments.statistics.totalComments", "admin"),
        value: data?.totalComments ?? 0,
        icon: MessageSquare,
        description: t("comments.statistics.totalCommentsDesc", "admin"),
      },
      {
        title: t("comments.statistics.totalTopLevelComments", "admin"),
        value: data?.totalTopLevelComments ?? 0,
        icon: MessageSquare,
        description: t(
          "comments.statistics.totalTopLevelCommentsDesc",
          "admin",
        ),
      },
      {
        title: t("comments.statistics.totalReplies", "admin"),
        value: data?.totalReplies ?? 0,
        icon: Reply,
        description: t("comments.statistics.totalRepliesDesc", "admin"),
      },
      {
        title: t("comments.statistics.pinnedComments", "admin"),
        value: data?.pinnedComments ?? 0,
        icon: Pin,
        description: t("comments.statistics.pinnedCommentsDesc", "admin"),
      },
      {
        title: t("comments.statistics.editedComments", "admin"),
        value: data?.editedComments ?? 0,
        icon: Edit,
        description: t("comments.statistics.editedCommentsDesc", "admin"),
      },
      {
        title: t("comments.statistics.recentComments", "admin"),
        value: data?.recentComments ?? 0,
        icon: TrendingUp,
        description: t("comments.statistics.recentCommentsDesc", "admin"),
      },
      {
        title: t("comments.statistics.commentsWithMedia", "admin"),
        value: data?.commentsWithMedia ?? 0,
        icon: ImageIcon,
        description: t("comments.statistics.commentsWithMediaDesc", "admin"),
      },
      {
        title: t("comments.statistics.totalMediaAttachments", "admin"),
        value: data?.totalMediaAttachments ?? 0,
        icon: ImageIcon,
        description: t(
          "comments.statistics.totalMediaAttachmentsDesc",
          "admin",
        ),
      },
      {
        title: t("comments.statistics.commentsWithMentions", "admin"),
        value: data?.commentsWithMentions ?? 0,
        icon: Users,
        description: t("comments.statistics.commentsWithMentionsDesc", "admin"),
      },
      {
        title: t("comments.statistics.totalMentions", "admin"),
        value: data?.totalMentions ?? 0,
        icon: Users,
        description: t("comments.statistics.totalMentionsDesc", "admin"),
      },
      {
        title: t("comments.statistics.averageReplyCount", "admin"),
        value: data?.averageReplyCount
          ? parseFloat(data.averageReplyCount.toFixed(2))
          : 0,
        icon: TrendingUp,
        description: t("comments.statistics.averageReplyCountDesc", "admin"),
      },
      {
        title: t("comments.statistics.commentsByType", "admin"),
        value: data?.commentsByType
          ? Object.keys(data.commentsByType).length
          : 0,
        icon: Type,
        description: t("comments.statistics.commentsByTypeDesc", "admin"),
      },
      {
        title: t("comments.statistics.commentsByVisibility", "admin"),
        value: data?.commentsByVisibility
          ? Object.keys(data.commentsByVisibility).length
          : 0,
        icon: Eye,
        description: t("comments.statistics.commentsByVisibilityDesc", "admin"),
      },
      {
        title: t("comments.statistics.commentsBySubjectType", "admin"),
        value: data?.commentsBySubjectType
          ? Object.keys(data.commentsBySubjectType).length
          : 0,
        icon: MessageSquare,
        description: t(
          "comments.statistics.commentsBySubjectTypeDesc",
          "admin",
        ),
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
