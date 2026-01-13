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
import type { QueryContributionDto } from "@/lib/types/contributions";
import {
  ContributionAction,
  ContributionEntityType,
  ContributionStatus,
} from "@/lib/types/contributions";

interface ContributionsFiltersProps {
  filters: QueryContributionDto;
  onFiltersChange: (filters: QueryContributionDto) => void;
  className?: string;
}

export function ContributionsFilters({
  filters,
  onFiltersChange,
  className,
}: ContributionsFiltersProps) {
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

  const handleEntityTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      entityType: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleActionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      action: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      ...filters,
      query: undefined,
      entityType: undefined,
      action: undefined,
      status: undefined,
      page: 1,
    });
  };

  const hasActiveFilters =
    searchValue || filters.entityType || filters.action || filters.status;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("contributions.filters.searchPlaceholder", "admin")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="entity-type-filter" className="text-sm font-medium">
            {t("contributions.filters.entityType", "admin")}
          </Label>
          <Select
            value={filters.entityType || "all"}
            onValueChange={handleEntityTypeChange}
          >
            <SelectTrigger
              id="entity-type-filter"
              className="w-full sm:w-[150px]"
            >
              <SelectValue
                placeholder={t("contributions.filters.entityType", "admin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("contributions.filters.all", "admin")}
              </SelectItem>
              {Object.values(ContributionEntityType).map((entityType) => (
                <SelectItem key={entityType} value={entityType}>
                  {t(`contributions.entityType.${entityType}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="action-filter" className="text-sm font-medium">
            {t("contributions.filters.action", "admin")}
          </Label>
          <Select
            value={filters.action || "all"}
            onValueChange={handleActionChange}
          >
            <SelectTrigger id="action-filter" className="w-full sm:w-[150px]">
              <SelectValue
                placeholder={t("contributions.filters.action", "admin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("contributions.filters.all", "admin")}
              </SelectItem>
              {Object.values(ContributionAction).map((action) => (
                <SelectItem key={action} value={action}>
                  {t(`contributions.action.${action}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            {t("contributions.filters.status", "admin")}
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter" className="w-full sm:w-[150px]">
              <SelectValue
                placeholder={t("contributions.filters.status", "admin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("contributions.filters.all", "admin")}
              </SelectItem>
              {Object.values(ContributionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`contributions.status.${status}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title={t("actions.clear", "common")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
