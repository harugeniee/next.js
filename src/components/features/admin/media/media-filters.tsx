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
import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";
import type { GetMediaDto } from "@/lib/types/media";

interface MediaFiltersProps {
  readonly filters: GetMediaDto;
  readonly onFiltersChange: (filters: GetMediaDto) => void;
}

/**
 * Media Filters Component
 * Provides filtering controls for media list
 */
export function MediaFilters({ filters, onFiltersChange }: MediaFiltersProps) {
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

  const handleTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        type: value && value !== "all" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value && value !== "all" ? value : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleIsPublicChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        isPublic:
          value === "all"
            ? undefined
            : value === "true"
              ? true
              : value === "false"
                ? false
                : undefined,
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
      filters.type ||
      filters.status ||
      filters.userId ||
      filters.mimeType ||
      filters.isPublic !== undefined ||
      filters.sortBy ||
      filters.order
    );
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("filters.title", "media")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("filters.reset", "media")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("filters.search", "media")}</Label>
            <Input
              placeholder={t("filters.searchPlaceholder", "media")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>{t("filters.type", "media")}</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "media")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all", "media")}</SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.IMAGE}>
                  {t("filters.types.image", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.VIDEO}>
                  {t("filters.types.video", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.AUDIO}>
                  {t("filters.types.audio", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.DOCUMENT}>
                  {t("filters.types.document", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.PRESENTATION}>
                  {t("filters.types.presentation", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.SPREADSHEET}>
                  {t("filters.types.spreadsheet", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.ARCHIVE}>
                  {t("filters.types.archive", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.TYPES.OTHER}>
                  {t("filters.types.other", "media")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t("filters.status", "media")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "media")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all", "media")}</SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.STATUS.ACTIVE}>
                  {t("filters.statuses.active", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.STATUS.INACTIVE}>
                  {t("filters.statuses.inactive", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.STATUS.PROCESSING}>
                  {t("filters.statuses.processing", "media")}
                </SelectItem>
                <SelectItem value={MEDIA_CONSTANTS.STATUS.FAILED}>
                  {t("filters.statuses.failed", "media")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Public/Private */}
          <div className="space-y-2">
            <Label>{t("filters.visibility", "media")}</Label>
            <Select
              value={
                filters.isPublic === undefined
                  ? "all"
                  : filters.isPublic
                    ? "true"
                    : "false"
              }
              onValueChange={handleIsPublicChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "media")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all", "media")}</SelectItem>
                <SelectItem value="true">
                  {t("filters.public", "media")}
                </SelectItem>
                <SelectItem value="false">
                  {t("filters.private", "media")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>{t("filters.sortBy", "media")}</Label>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.sortBy", "media")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">
                  {t("filters.sortByCreatedAt", "media")}
                </SelectItem>
                <SelectItem value="updatedAt">
                  {t("filters.sortByUpdatedAt", "media")}
                </SelectItem>
                <SelectItem value="name">
                  {t("filters.sortByName", "media")}
                </SelectItem>
                <SelectItem value="size">
                  {t("filters.sortBySize", "media")}
                </SelectItem>
                <SelectItem value="type">
                  {t("filters.sortByType", "media")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>{t("filters.order", "media")}</Label>
            <Select
              value={filters.order || "DESC"}
              onValueChange={handleOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.order", "media")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">
                  {t("filters.orderAsc", "media")}
                </SelectItem>
                <SelectItem value="DESC">
                  {t("filters.orderDesc", "media")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
