"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { DashboardOverviewResponse } from "@/lib/api/analytics";

interface TopUsersTableProps {
  data?: DashboardOverviewResponse;
  isLoading: boolean;
}

/**
 * Top Users Table Component
 * Displays top active users
 */
export function TopUsersTable({ data, isLoading }: TopUsersTableProps) {
  const { t } = useI18n();

  const topUsers = useMemo(() => {
    if (!data?.topUsers) return [];
    return Object.entries(data.topUsers)
      .map(([userId, count]) => ({
        userId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data.topUsers]);

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.tables.topUsers", "admin")}</CardTitle>
          <CardDescription>
            {t("dashboard.tables.topUsersDesc", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && topUsers.length > 0 ? (
              <div className="space-y-2">
                {topUsers.map((item) => (
                  <div
                    key={item.userId}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {item.userId.slice(0, 16)}...
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {item.count}
                      </span>
                      <Link
                        href={`/user/${item.userId}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Placeholder for skeleton
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
