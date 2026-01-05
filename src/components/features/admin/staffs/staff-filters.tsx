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
import type { GetStaffDto } from "@/lib/types/staffs";
import { STAFF_CONSTANTS } from "@/lib/validators/staffs";

interface StaffFiltersProps {
  filters: GetStaffDto;
  onFiltersChange: (filters: GetStaffDto) => void;
  className?: string;
}

export function StaffFilters({
  filters,
  onFiltersChange,
  className,
}: StaffFiltersProps) {
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

  const handleGenderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      gender: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleLanguageChange = (value: string) => {
    onFiltersChange({
      ...filters,
      language: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      occupation: value || undefined,
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
    filters.gender ||
    filters.language ||
    filters.occupation;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("filters.search", "staff")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Gender Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gender-filter" className="text-sm font-medium">
            {t("filters.gender", "staff")}
          </Label>
          <Select
            value={filters.gender || "all"}
            onValueChange={handleGenderChange}
          >
            <SelectTrigger id="gender-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.entries(STAFF_CONSTANTS.GENDER).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {t(
                    `staffs.form.gender.${key.toLowerCase()}`,
                    "admin",
                    {},
                    key,
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="language-filter" className="text-sm font-medium">
            {t("filters.language", "staff")}
          </Label>
          <Select
            value={filters.language || "all"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Korean">Korean</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Italian">Italian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Occupation Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="occupation-filter" className="text-sm font-medium">
            {t("filters.occupation", "staff")}
          </Label>
          <Input
            id="occupation-filter"
            placeholder={t("form.primaryOccupations", "staff")}
            value={filters.occupation || ""}
            onChange={handleOccupationChange}
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

