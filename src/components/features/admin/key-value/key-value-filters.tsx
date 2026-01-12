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
import type { QueryKeyValueDto } from "@/lib/interface/key-value.interface";
import {
  CONTENT_TYPES,
  type ContentType,
} from "@/lib/constants/key-value.constants";

interface KeyValueFiltersProps {
  filters: QueryKeyValueDto;
  onFiltersChange: (filters: QueryKeyValueDto) => void;
  className?: string;
}

const STATUS_OPTIONS = ["active", "expired", "all"] as const;

export function KeyValueFilters({
  filters,
  onFiltersChange,
  className,
}: KeyValueFiltersProps) {
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

  const handleNamespaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      namespace: e.target.value || undefined,
      page: 1,
    });
  };

  const handleKeyPatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      keyPattern: e.target.value || undefined,
      page: 1,
    });
  };

  const handleContentTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      contentType: value === "all" ? undefined : (value as ContentType),
      page: 1,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      kvStatus:
        value === "all"
          ? undefined
          : (value as (typeof STATUS_OPTIONS)[number]),
      page: 1,
    });
  };

  const handleIncludeExpiredChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      includeExpired: checked ? "true" : undefined,
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
    filters.namespace ||
    filters.keyPattern ||
    filters.contentType ||
    filters.kvStatus ||
    filters.includeExpired;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("keyValue.filters.keyPattern", "admin")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Namespace Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="namespace-filter" className="text-sm font-medium">
            {t("keyValue.filters.namespace", "admin")}
          </Label>
          <Input
            id="namespace-filter"
            placeholder={t("keyValue.filters.namespacePlaceholder", "admin")}
            value={filters.namespace || ""}
            onChange={handleNamespaceChange}
          />
        </div>

        {/* Key Pattern Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="key-pattern-filter" className="text-sm font-medium">
            {t("keyValue.filters.keyPattern", "admin")}
          </Label>
          <Input
            id="key-pattern-filter"
            placeholder={t("keyValue.filters.keyPatternPlaceholder", "admin")}
            value={filters.keyPattern || ""}
            onChange={handleKeyPatternChange}
          />
        </div>

        {/* Content Type Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content-type-filter" className="text-sm font-medium">
            {t("keyValue.filters.contentType", "admin")}
          </Label>
          <Select
            value={filters.contentType || "all"}
            onValueChange={handleContentTypeChange}
          >
            <SelectTrigger id="content-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("keyValue.filters.selectContentType", "admin")}
              </SelectItem>
              {CONTENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`keyValue.contentType.${type}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            {t("keyValue.filters.status", "admin")}
          </Label>
          <Select
            value={filters.kvStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("keyValue.filters.selectStatus", "admin")}
              </SelectItem>
              {STATUS_OPTIONS.filter((s) => s !== "all").map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`keyValue.status.${status}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Include Expired Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="include-expired"
          checked={filters.includeExpired === "true"}
          onChange={(e) => handleIncludeExpiredChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="include-expired" className="text-sm font-medium">
          {t("keyValue.filters.includeExpired", "admin")}
        </Label>
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
            {t("keyValue.filters.reset", "admin")}
          </Button>
        </div>
      )}
    </div>
  );
}
