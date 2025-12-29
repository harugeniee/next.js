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
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { QuerySeriesDto } from "@/lib/api/series";

interface SeriesFiltersProps {
  readonly filters: QuerySeriesDto;
  readonly onFiltersChange: (filters: QuerySeriesDto) => void;
}

/**
 * Series Filters Component
 * Provides filtering controls for series list
 */
export function SeriesFilters({
  filters,
  onFiltersChange,
}: SeriesFiltersProps) {
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
        type:
          value && value !== "all"
            ? (value as QuerySeriesDto["type"])
            : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleFormatChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        format:
          value && value !== "all"
            ? (value as QuerySeriesDto["format"])
            : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSeasonChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        season:
          value && value !== "all"
            ? (value as QuerySeriesDto["season"])
            : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSeasonYearChange = useCallback(
    (value: string) => {
      const year = value ? parseInt(value, 10) : undefined;
      onFiltersChange({
        ...filters,
        seasonYear: year && !isNaN(year) ? year : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSourceChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        source:
          value && value !== "all"
            ? (value as QuerySeriesDto["source"])
            : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        seriesStatus:
          value && value !== "all"
            ? (value as QuerySeriesDto["seriesStatus"])
            : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleNsfwChange = useCallback(
    (checked: boolean) => {
      onFiltersChange({
        ...filters,
        isNsfw: checked ? true : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleLicensedChange = useCallback(
    (checked: boolean) => {
      onFiltersChange({
        ...filters,
        isLicensed: checked ? true : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleMinScoreChange = useCallback(
    (value: string) => {
      const score = value ? parseInt(value, 10) : undefined;
      onFiltersChange({
        ...filters,
        minScore: score && !isNaN(score) ? score : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleMaxScoreChange = useCallback(
    (value: string) => {
      const score = value ? parseInt(value, 10) : undefined;
      onFiltersChange({
        ...filters,
        maxScore: score && !isNaN(score) ? score : undefined,
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
      filters.format ||
      filters.season ||
      filters.seasonYear ||
      filters.source ||
      filters.seriesStatus ||
      filters.isNsfw !== undefined ||
      filters.isLicensed !== undefined ||
      filters.minScore ||
      filters.maxScore ||
      filters.sortBy ||
      filters.order
    );
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("filters.title", "series")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("filters.reset", "series")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("filters.search", "series")}</Label>
            <Input
              placeholder={t("filters.searchPlaceholder", "series")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>{t("filters.type", "series")}</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.TYPE.ANIME}>
                  {t("types.anime", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.TYPE.MANGA}>
                  {t("types.manga", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.TYPE.LIGHT_NOVEL}>
                  {t("types.lightNovel", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.TYPE.VISUAL_NOVEL}>
                  {t("types.visualNovel", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>{t("filters.format", "series")}</Label>
            <Select
              value={filters.format || "all"}
              onValueChange={handleFormatChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.TV}>
                  {t("formats.tv", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.MOVIE}>
                  {t("formats.movie", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.MANGA}>
                  {t("formats.manga", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.NOVEL}>
                  {t("formats.novel", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.OVA}>
                  {t("formats.ova", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.FORMAT.ONA}>
                  {t("formats.ona", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label>{t("filters.season", "series")}</Label>
            <Select
              value={filters.season || "all"}
              onValueChange={handleSeasonChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SEASON.WINTER}>
                  {t("seasons.winter", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SEASON.SPRING}>
                  {t("seasons.spring", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SEASON.SUMMER}>
                  {t("seasons.summer", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SEASON.FALL}>
                  {t("seasons.fall", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Season Year */}
          <div className="space-y-2">
            <Label>{t("filters.seasonYear", "series")}</Label>
            <Input
              type="number"
              placeholder={t("filters.seasonYearPlaceholder", "series")}
              value={filters.seasonYear || ""}
              onChange={(e) => handleSeasonYearChange(e.target.value)}
              min={1900}
              max={2100}
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>{t("filters.source", "series")}</Label>
            <Select
              value={filters.source || "all"}
              onValueChange={handleSourceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SOURCE.ORIGINAL}>
                  {t("sources.original", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SOURCE.MANGA}>
                  {t("sources.manga", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SOURCE.LIGHT_NOVEL}>
                  {t("sources.lightNovel", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.SOURCE.ANIME}>
                  {t("sources.anime", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t("filters.status", "series")}</Label>
            <Select
              value={filters.seriesStatus || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.STATUS.ACTIVE}>
                  {t("statuses.active", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.STATUS.INACTIVE}>
                  {t("statuses.inactive", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.STATUS.PENDING}>
                  {t("statuses.pending", "series")}
                </SelectItem>
                <SelectItem value={SERIES_CONSTANTS.STATUS.ARCHIVED}>
                  {t("statuses.archived", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NSFW Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="nsfw"
              checked={filters.isNsfw === true}
              onChange={(e) => handleNsfwChange(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            />
            <Label htmlFor="nsfw" className="cursor-pointer">
              {t("filters.nsfw", "series")}
            </Label>
          </div>

          {/* Licensed Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="licensed"
              checked={filters.isLicensed === true}
              onChange={(e) => handleLicensedChange(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            />
            <Label htmlFor="licensed" className="cursor-pointer">
              {t("filters.licensed", "series")}
            </Label>
          </div>

          {/* Min Score */}
          <div className="space-y-2">
            <Label>{t("filters.minScore", "series")}</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minScore || ""}
              onChange={(e) => handleMinScoreChange(e.target.value)}
              min={0}
              max={100}
            />
          </div>

          {/* Max Score */}
          <div className="space-y-2">
            <Label>{t("filters.maxScore", "series")}</Label>
            <Input
              type="number"
              placeholder="100"
              value={filters.maxScore || ""}
              onChange={(e) => handleMaxScoreChange(e.target.value)}
              min={0}
              max={100}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>{t("filters.sortBy", "series")}</Label>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.sortBy", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">
                  {t("filters.sortByCreatedAt", "series")}
                </SelectItem>
                <SelectItem value="updatedAt">
                  {t("filters.sortByUpdatedAt", "series")}
                </SelectItem>
                <SelectItem value="title">
                  {t("filters.sortByTitle", "series")}
                </SelectItem>
                <SelectItem value="popularity">
                  {t("filters.sortByPopularity", "series")}
                </SelectItem>
                <SelectItem value="averageScore">
                  {t("filters.sortByScore", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>{t("filters.order", "series")}</Label>
            <Select
              value={filters.order || "DESC"}
              onValueChange={handleOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.order", "series")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">
                  {t("filters.orderAsc", "series")}
                </SelectItem>
                <SelectItem value="DESC">
                  {t("filters.orderDesc", "series")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
