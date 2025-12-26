"use client";

import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMENT_CONSTANTS } from "@/lib/constants/comment.constants";
import type { GetCommentDto } from "@/lib/types/comments";

interface CommentFiltersProps {
  readonly filters: GetCommentDto;
  readonly onFiltersChange: (filters: GetCommentDto) => void;
}

/**
 * Comment Filters Component
 * Provides filtering controls for comment list
 */
export function CommentFilters({
  filters,
  onFiltersChange,
}: CommentFiltersProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState(filters.query || "");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onFiltersChange({
        ...filters,
        query: value || undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSubjectTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        subjectType: value && value !== "all" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleVisibilityChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        visibility: value && value !== "all" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        type: value && value !== "all" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handlePinnedChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        pinned: value === "all" ? undefined : value === "true",
      });
    },
    [filters, onFiltersChange],
  );

  const handleEditedChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        edited: value === "all" ? undefined : value === "true",
      });
    },
    [filters, onFiltersChange],
  );

  const handleUserIdChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        userId: value || undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSortByChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        sortBy: value || undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleOrderChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        order: value === "ASC" || value === "DESC" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleReset = useCallback(() => {
    setSearchQuery("");
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.query ||
      filters.subjectType ||
      filters.visibility ||
      filters.type ||
      filters.pinned !== undefined ||
      filters.edited !== undefined ||
      filters.userId ||
      filters.sortBy ||
      filters.order
    );
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("comments.filters.title", "admin")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("comments.filters.reset", "admin")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("comments.filters.search", "admin")}</Label>
            <Input
              placeholder={t("comments.filters.searchPlaceholder", "admin")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Subject Type */}
          <div className="space-y-2">
            <Label>{t("comments.filters.subjectType", "admin")}</Label>
            <Select
              value={filters.subjectType || "all"}
              onValueChange={handleSubjectTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("comments.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("comments.filters.all", "admin")}
                </SelectItem>
                {Object.values(COMMENT_CONSTANTS.SUBJECT_TYPES).map(
                  (subjectType) => (
                    <SelectItem key={subjectType} value={subjectType}>
                      {t(
                        `comments.filters.subjectTypes.${subjectType}`,
                        "admin",
                      )}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>{t("comments.filters.visibility", "admin")}</Label>
            <Select
              value={filters.visibility || "all"}
              onValueChange={handleVisibilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("comments.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("comments.filters.all", "admin")}
                </SelectItem>
                {Object.values(COMMENT_CONSTANTS.VISIBILITY).map(
                  (visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {t(
                        `comments.filters.visibilityTypes.${visibility}`,
                        "admin",
                      )}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>{t("comments.filters.type", "admin")}</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("comments.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("comments.filters.all", "admin")}
                </SelectItem>
                {Object.values(COMMENT_CONSTANTS.TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`comments.filters.types.${type}`, "admin")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pinned */}
          <div className="space-y-2">
            <Label>{t("comments.filters.pinned", "admin")}</Label>
            <Select
              value={
                filters.pinned === undefined
                  ? "all"
                  : filters.pinned
                    ? "true"
                    : "false"
              }
              onValueChange={handlePinnedChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("comments.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("comments.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="true">
                  {t("comments.filters.pinned", "admin")}
                </SelectItem>
                <SelectItem value="false">
                  {t("comments.filters.notPinned", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Edited */}
          <div className="space-y-2">
            <Label>{t("comments.filters.edited", "admin")}</Label>
            <Select
              value={
                filters.edited === undefined
                  ? "all"
                  : filters.edited
                    ? "true"
                    : "false"
              }
              onValueChange={handleEditedChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("comments.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("comments.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="true">
                  {t("comments.filters.edited", "admin")}
                </SelectItem>
                <SelectItem value="false">
                  {t("comments.filters.notEdited", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <Label>{t("comments.filters.userId", "admin")}</Label>
            <Input
              placeholder={t("comments.filters.userIdPlaceholder", "admin")}
              value={filters.userId || ""}
              onChange={(e) => handleUserIdChange(e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>{t("comments.filters.sortBy", "admin")}</Label>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("comments.filters.sortBy", "admin")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">
                  {t("comments.filters.sortByCreatedAt", "admin")}
                </SelectItem>
                <SelectItem value="updatedAt">
                  {t("comments.filters.sortByUpdatedAt", "admin")}
                </SelectItem>
                <SelectItem value="replyCount">
                  {t("comments.filters.sortByReplyCount", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>{t("comments.filters.order", "admin")}</Label>
            <Select
              value={filters.order || "DESC"}
              onValueChange={handleOrderChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("comments.filters.order", "admin")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">
                  {t("comments.filters.orderAsc", "admin")}
                </SelectItem>
                <SelectItem value="DESC">
                  {t("comments.filters.orderDesc", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
