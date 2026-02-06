"use client";

import {
  Activity,
  BookOpen,
  FileText,
  Heart,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button, Card, CardContent } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useNewsFeed } from "@/hooks/follow";
import type { NewsFeedItem } from "@/lib/api/follow";

interface UserActivityFeedProps {
  readonly userId: string;
}

/**
 * User Activity Feed Component
 * Displays user's recent activity timeline grouped by date
 */
export function UserActivityFeed({ userId }: UserActivityFeedProps) {
  const { t } = useI18n();
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");

  const { data, isLoading, error } = useNewsFeed(userId, {
    limit: 50,
    sortBy: "createdAt",
    order: "DESC",
  });

  // Extract activities from response
  const activities = data?.data?.items || [];

  // Filter activities by type when filter is not "all"
  const filteredActivities =
    activityTypeFilter === "all"
      ? activities
      : activities.filter((a) => {
          const type = a.type.toLowerCase();
          if (activityTypeFilter === "article")
            return type === "article" || type === "published";
          if (activityTypeFilter === "segment")
            return type === "segment" || type === "uploaded";
          if (activityTypeFilter === "social")
            return [
              "comment",
              "commented",
              "follow",
              "followed",
              "like",
              "liked",
            ].includes(type);
          return true;
        });

  // Group activities by date
  const groupActivitiesByDate = (activities: NewsFeedItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: {
      today: NewsFeedItem[];
      yesterday: NewsFeedItem[];
      thisWeek: NewsFeedItem[];
      earlier: NewsFeedItem[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    };

    activities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);
      const activityDay = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate(),
      );

      if (activityDay.getTime() === today.getTime()) {
        groups.today.push(activity);
      } else if (activityDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(activity);
      } else if (activityDay > thisWeek) {
        groups.thisWeek.push(activity);
      } else {
        groups.earlier.push(activity);
      }
    });

    return groups;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "article":
      case "published":
        return <FileText className="h-4 w-4" />;
      case "segment":
      case "uploaded":
        return <BookOpen className="h-4 w-4" />;
      case "comment":
      case "commented":
        return <MessageSquare className="h-4 w-4" />;
      case "follow":
      case "followed":
        return <UserPlus className="h-4 w-4" />;
      case "like":
      case "liked":
        return <Heart className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get activity text
  const getActivityText = (activity: NewsFeedItem) => {
    const type = activity.type.toLowerCase();

    switch (type) {
      case "article":
      case "published":
        return t("activityPublished", "profile") || "Published an article";
      case "segment":
      case "uploaded":
        return t("activityUploaded", "profile") || "Uploaded a segment";
      case "comment":
      case "commented":
        return t("activityCommented", "profile") || "Commented on";
      case "follow":
      case "followed":
        return t("activityFollowed", "profile") || "Followed";
      case "like":
      case "liked":
        return t("activityLiked", "profile") || "Liked";
      default:
        return activity.type;
    }
  };

  // Get activity link
  const getActivityLink = (activity: NewsFeedItem) => {
    const content = activity.content as Record<string, unknown>;
    const type = activity.type.toLowerCase();

    if (type === "article" && content?.id) {
      return `/article/${content.id}`;
    }
    if (type === "segment" && content?.id) {
      return `/segment/${content.id}`;
    }
    if (type === "comment" && content?.subjectId) {
      return `/${content.subjectType}/${content.subjectId}#comment-${activity.id}`;
    }
    if (type === "follow" && content?.userId) {
      return `/user/${content.userId}`;
    }
    return "#";
  };

  // Get activity target title
  const getActivityTarget = (activity: NewsFeedItem) => {
    const content = activity.content as Record<string, unknown>;
    return (content?.title as string) || (content?.name as string) || "";
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Render activity group
  const renderActivityGroup = (title: string, activities: NewsFeedItem[]) => {
    if (activities.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="group hover:shadow-sm transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 bg-primary/10 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          {getActivityText(activity)}
                        </span>
                        {getActivityTarget(activity) && (
                          <>
                            {" "}
                            <Link
                              href={getActivityLink(activity)}
                              className="text-primary hover:underline"
                            >
                              {getActivityTarget(activity)}
                            </Link>
                          </>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {t("error.loadingActivity", "profile") || "Failed to load activity"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          {t("actions.retry", "common") || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {t("tabsActivity", "profile") || "Activity"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activities.length} recent{" "}
                {activities.length === 1 ? "activity" : "activities"}
              </p>
            </div>
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActivityTypeFilter("all")}>
                All Activity
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActivityTypeFilter("article")}
              >
                Articles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActivityTypeFilter("segment")}
              >
                Segments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActivityTypeFilter("social")}>
                Social
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Activity Timeline */}
      <Skeletonize loading={isLoading}>
        {activities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("noActivity", "profile") || "No recent activity"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {t("noActivityDescription", "profile") ||
                  "User activity will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {renderActivityGroup(
              t("activityToday", "profile") || "Today",
              groupedActivities.today,
            )}
            {renderActivityGroup(
              t("activityYesterday", "profile") || "Yesterday",
              groupedActivities.yesterday,
            )}
            {renderActivityGroup(
              t("activityThisWeek", "profile") || "This Week",
              groupedActivities.thisWeek,
            )}
            {renderActivityGroup(
              t("activityEarlier", "profile") || "Earlier",
              groupedActivities.earlier,
            )}
          </div>
        )}
      </Skeletonize>
    </div>
  );
}
