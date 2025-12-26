"use client";

import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { BadgeDisplay } from "./badge-display";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Badge, BadgeListResponse } from "@/lib/types/badges";

interface BadgeListProps {
  readonly data?: BadgeListResponse;
  readonly isLoading: boolean;
  readonly onCreate?: () => void;
  readonly onEdit?: (badge: Badge) => void;
  readonly onDelete?: (badge: Badge) => void;
  readonly onAssign?: (badge: Badge) => void;
}

/**
 * Badge List Component
 * Displays badges in a table/grid view
 */
export function BadgeList({
  data,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onAssign,
}: BadgeListProps) {
  const { t } = useI18n();

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("badges.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("badges.list.description", "admin")}
              </CardDescription>
            </div>
            {onCreate && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("badges.list.create", "admin")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && data.result.length > 0 ? (
              <div className="space-y-2">
                {data.result.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <BadgeDisplay badge={badge} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {badge.name}
                          </span>
                          <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                            {badge.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {t(`badges.categories.${badge.category}`, "admin")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t(`badges.rarities.${badge.rarity}`, "admin")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {badge.assignmentCount}{" "}
                            {t("badges.list.assignments", "admin")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onAssign && (
                            <DropdownMenuItem onClick={() => onAssign(badge)}>
                              <Plus className="h-4 w-4 mr-2" />
                              {t("badges.list.assign", "admin")}
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(badge)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("badges.list.edit", "admin")}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(badge)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("badges.list.delete", "admin")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
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
