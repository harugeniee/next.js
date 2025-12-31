"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useDebounce } from "@/hooks/ui/useSimpleHooks";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAG_CONSTANTS } from "@/lib/constants/tag.constants";
import type { QueryTagsDto } from "@/lib/api/tags";

interface TagFiltersProps {
  filters: QueryTagsDto;
  onFiltersChange: (filters: QueryTagsDto) => void;
  className?: string;
}

export function TagFilters({
  filters,
  onFiltersChange,
  className,
}: TagFiltersProps) {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState(filters.query || "");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Trigger search when debounced value changes
  useEffect(() => {
    onFiltersChange({
      ...filters,
      query: debouncedSearchValue,
      page: 1, // Reset to page 1 when search changes
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleIsActiveChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "true",
      page: 1,
    });
  };

  const handleIsFeaturedChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isFeatured: value === "all" ? undefined : value === "true",
      page: 1,
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleColorChange = (value: string) => {
    onFiltersChange({
      ...filters,
      color: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleMinUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      minUsageCount: value ? parseInt(value, 10) : undefined,
      page: 1,
    });
  };

  const handleMaxUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      maxUsageCount: value ? parseInt(value, 10) : undefined,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      page: 1,
      limit: filters.limit || 20,
    });
  };

  const hasActiveFilters =
    searchValue ||
    filters.isActive !== undefined ||
    filters.isFeatured !== undefined ||
    filters.category ||
    filters.color ||
    filters.minUsageCount !== undefined ||
    filters.maxUsageCount !== undefined;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("filters.searchPlaceholder", "tags")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            {t("list.status", "tags")}
          </Label>
          <Select
            value={
              filters.isActive === undefined
                ? "all"
                : filters.isActive
                  ? "true"
                  : "false"
            }
            onValueChange={handleIsActiveChange}
          >
            <SelectTrigger id="status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              <SelectItem value="true">{t("status.active", "tags")}</SelectItem>
              <SelectItem value="false">
                {t("status.inactive", "tags")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="featured-filter" className="text-sm font-medium">
            {t("list.featured", "tags")}
          </Label>
          <Select
            value={
              filters.isFeatured === undefined
                ? "all"
                : filters.isFeatured
                  ? "true"
                  : "false"
            }
            onValueChange={handleIsFeaturedChange}
          >
            <SelectTrigger id="featured-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              <SelectItem value="true">{t("featured.yes", "tags")}</SelectItem>
              <SelectItem value="false">{t("featured.no", "tags")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-filter" className="text-sm font-medium">
            {t("filters.category", "tags")}
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.values(TAG_CONSTANTS.CATEGORIES).map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`filters.categories.${category}`, "tags", {}, category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="color-filter" className="text-sm font-medium">
            {t("form.color", "tags")}
          </Label>
          <Select
            value={filters.color || "all"}
            onValueChange={handleColorChange}
          >
            <SelectTrigger id="color-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {TAG_CONSTANTS.DEFAULT_COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-xs">{color}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Usage Count Range */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="min-usage-filter" className="text-sm font-medium">
            {t("filters.minUsage", "tags")}
          </Label>
          <Input
            id="min-usage-filter"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minUsageCount || ""}
            onChange={handleMinUsageChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="max-usage-filter" className="text-sm font-medium">
            {t("filters.maxUsage", "tags")}
          </Label>
          <Input
            id="max-usage-filter"
            type="number"
            min="0"
            placeholder="∞"
            value={filters.maxUsageCount || ""}
            onChange={handleMaxUsageChange}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t("clearFilters", "common")}
          </Button>
        </div>
      )}
    </div>
  );
}
