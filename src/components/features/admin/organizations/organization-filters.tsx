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
import { ORGANIZATION_CONSTANTS } from "@/lib/constants/organization.constants";

interface OrganizationFiltersProps {
  onSearch: (query: string) => void;
  onStatusChange: (status: string) => void;
  onVisibilityChange: (visibility: string) => void;
  status?: string;
  visibility?: string;
  className?: string;
}

export function OrganizationFilters({
  onSearch,
  onStatusChange,
  onVisibilityChange,
  status,
  visibility,
  className,
}: OrganizationFiltersProps) {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearFilters = () => {
    setSearchValue("");
    onSearch("");
    onStatusChange("all");
    onVisibilityChange("all");
  };

  const hasActiveFilters =
    searchValue ||
    (status && status !== "all") ||
    (visibility && visibility !== "all");

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("organizations.filters.searchPlaceholder", "admin")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            {t("organizations.filters.status", "admin")}
          </Label>
          <Select value={status || "all"} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter" className="w-full sm:w-[150px]">
              <SelectValue
                placeholder={t("organizations.filters.status", "admin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.values(ORGANIZATION_CONSTANTS.STATUS).map(
                (statusValue) => (
                  <SelectItem key={statusValue} value={statusValue}>
                    {t(`organizations.status.${statusValue}`, "admin")}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visibility-filter" className="text-sm font-medium">
            {t("organizations.filters.visibility", "admin")}
          </Label>
          <Select
            value={visibility || "all"}
            onValueChange={onVisibilityChange}
          >
            <SelectTrigger
              id="visibility-filter"
              className="w-full sm:w-[150px]"
            >
              <SelectValue
                placeholder={t("organizations.filters.visibility", "admin")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.values(ORGANIZATION_CONSTANTS.VISIBILITY).map(
                (visibilityValue) => (
                  <SelectItem key={visibilityValue} value={visibilityValue}>
                    {t(`organizations.visibility.${visibilityValue}`, "admin")}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title={t("clearFilters", "common")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

