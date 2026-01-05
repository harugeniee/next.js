"use client";

import { BookOpen } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import { Skeletonize } from "@/components/shared/skeletonize";
import type { Staff } from "@/lib/interface/staff.interface";

interface StaffSeriesListProps {
  staff?: Staff;
  isLoading: boolean;
}

/**
 * Staff Series List Component
 * Displays series this staff member worked on
 */
export function StaffSeriesList({ staff, isLoading }: StaffSeriesListProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.seriesRoles", "staff")}</CardTitle>
        <CardDescription>
          {t("detail.seriesRolesDescription", "staff")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeletonize loading={isLoading}>
          {staff?.seriesRoles && staff.seriesRoles.length > 0 ? (
            <div className="space-y-3">
              {staff.seriesRoles.map((role) => {
                const seriesTitle =
                  role.series?.title?.english ||
                  role.series?.title?.romaji ||
                  role.series?.title?.native ||
                  "Unknown Series";

                return (
                  <div
                    key={role.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{seriesTitle}</p>
                      {role.role && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {role.role}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.isMain && (
                          <Badge variant="secondary" className="text-xs">
                            {t("detail.mainRole", "staff")}
                          </Badge>
                        )}
                      </div>
                      {role.notes && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {role.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <p>{t("detail.noSeriesRoles", "staff")}</p>
              )}
            </div>
          )}
        </Skeletonize>
      </CardContent>
    </Card>
  );
}

