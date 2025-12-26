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
import type {
  BadgeCategory,
  BadgeRarity,
  BadgeStatus,
  GetBadgeDto,
} from "@/lib/types/badges";

interface BadgeFiltersProps {
  readonly filters: GetBadgeDto;
  readonly onFiltersChange: (filters: GetBadgeDto) => void;
}

/**
 * Badge Filters Component
 * Provides filtering controls for badge list
 */
export function BadgeFilters({ filters, onFiltersChange }: BadgeFiltersProps) {
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

  const handleCategoryChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        categories:
          value && value !== "all" ? [value as BadgeCategory] : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleRarityChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        rarities: value && value !== "all" ? [value as BadgeRarity] : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        statuses: value && value !== "all" ? [value as BadgeStatus] : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleVisibilityChange = useCallback(
    (value: string) => {
      let isVisible: boolean | undefined;
      if (value === "all") {
        isVisible = undefined;
      } else if (value === "true") {
        isVisible = true;
      } else if (value === "false") {
        isVisible = false;
      } else {
        isVisible = undefined;
      }
      onFiltersChange({
        ...filters,
        isVisible,
      });
    },
    [filters, onFiltersChange],
  );

  const handleObtainabilityChange = useCallback(
    (value: string) => {
      let isObtainable: boolean | undefined;
      if (value === "all") {
        isObtainable = undefined;
      } else if (value === "true") {
        isObtainable = true;
      } else if (value === "false") {
        isObtainable = false;
      } else {
        isObtainable = undefined;
      }
      onFiltersChange({
        ...filters,
        isObtainable,
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
      filters.categories?.length ||
      filters.rarities?.length ||
      filters.statuses?.length ||
      filters.isVisible !== undefined ||
      filters.isObtainable !== undefined
    );
  }, [filters]);

  const visibilityValue = useMemo(() => {
    if (filters.isVisible === true) return "true";
    if (filters.isVisible === false) return "false";
    return "all";
  }, [filters.isVisible]);

  const obtainabilityValue = useMemo(() => {
    if (filters.isObtainable === true) return "true";
    if (filters.isObtainable === false) return "false";
    return "all";
  }, [filters.isObtainable]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("badges.filters.title", "admin")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("badges.filters.reset", "admin")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("badges.filters.search", "admin")}</Label>
            <Input
              placeholder={t("badges.filters.searchPlaceholder", "admin")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{t("badges.filters.category", "admin")}</Label>
            <Select
              value={filters.categories?.[0] || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("badges.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("badges.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="common">
                  {t("badges.categories.common", "admin")}
                </SelectItem>
                <SelectItem value="paid">
                  {t("badges.categories.paid", "admin")}
                </SelectItem>
                <SelectItem value="rare">
                  {t("badges.categories.rare", "admin")}
                </SelectItem>
                <SelectItem value="unobtainable">
                  {t("badges.categories.unobtainable", "admin")}
                </SelectItem>
                <SelectItem value="app">
                  {t("badges.categories.app", "admin")}
                </SelectItem>
                <SelectItem value="custom">
                  {t("badges.categories.custom", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rarity */}
          <div className="space-y-2">
            <Label>{t("badges.filters.rarity", "admin")}</Label>
            <Select
              value={filters.rarities?.[0] || "all"}
              onValueChange={handleRarityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("badges.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("badges.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="common">
                  {t("badges.rarities.common", "admin")}
                </SelectItem>
                <SelectItem value="uncommon">
                  {t("badges.rarities.uncommon", "admin")}
                </SelectItem>
                <SelectItem value="rare">
                  {t("badges.rarities.rare", "admin")}
                </SelectItem>
                <SelectItem value="epic">
                  {t("badges.rarities.epic", "admin")}
                </SelectItem>
                <SelectItem value="legendary">
                  {t("badges.rarities.legendary", "admin")}
                </SelectItem>
                <SelectItem value="mythic">
                  {t("badges.rarities.mythic", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t("badges.filters.status", "admin")}</Label>
            <Select
              value={filters.statuses?.[0] || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("badges.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("badges.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="active">
                  {t("badges.statuses.active", "admin")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("badges.statuses.inactive", "admin")}
                </SelectItem>
                <SelectItem value="hidden">
                  {t("badges.statuses.hidden", "admin")}
                </SelectItem>
                <SelectItem value="discontinued">
                  {t("badges.statuses.discontinued", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>{t("badges.filters.visibility", "admin")}</Label>
            <Select
              value={visibilityValue}
              onValueChange={handleVisibilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("badges.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("badges.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="true">
                  {t("badges.filters.visible", "admin")}
                </SelectItem>
                <SelectItem value="false">
                  {t("badges.filters.hidden", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Obtainability */}
          <div className="space-y-2">
            <Label>{t("badges.filters.obtainability", "admin")}</Label>
            <Select
              value={obtainabilityValue}
              onValueChange={handleObtainabilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("badges.filters.all", "admin")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("badges.filters.all", "admin")}
                </SelectItem>
                <SelectItem value="true">
                  {t("badges.filters.obtainable", "admin")}
                </SelectItem>
                <SelectItem value="false">
                  {t("badges.filters.unobtainable", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
