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
import type { GetCharacterDto } from "@/lib/types/characters";

interface CharacterFiltersProps {
  readonly filters: GetCharacterDto;
  readonly onFiltersChange: (filters: GetCharacterDto) => void;
}

/**
 * Character Filters Component
 * Provides filtering controls for character list
 */
export function CharacterFilters({
  filters,
  onFiltersChange,
}: CharacterFiltersProps) {
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

  const handleGenderChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        gender: value && value !== "all" ? value : undefined,
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
      filters.gender ||
      filters.seriesId ||
      filters.sortBy ||
      filters.order
    );
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("filters.title", "characters")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("filters.reset", "characters")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("filters.search", "characters")}</Label>
            <Input
              placeholder={t("filters.searchPlaceholder", "characters")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>{t("filters.gender", "characters")}</Label>
            <Select
              value={filters.gender || "all"}
              onValueChange={handleGenderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.all", "characters")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.all", "characters")}
                </SelectItem>
                <SelectItem value="male">
                  {t("genders.male", "characters")}
                </SelectItem>
                <SelectItem value="female">
                  {t("genders.female", "characters")}
                </SelectItem>
                <SelectItem value="other">
                  {t("genders.other", "characters")}
                </SelectItem>
                <SelectItem value="unknown">
                  {t("genders.unknown", "characters")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>{t("filters.sortBy", "characters")}</Label>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.sortBy", "characters")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">
                  {t("filters.sortByCreatedAt", "characters")}
                </SelectItem>
                <SelectItem value="updatedAt">
                  {t("filters.sortByUpdatedAt", "characters")}
                </SelectItem>
                <SelectItem value="name">
                  {t("filters.sortByName", "characters")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>{t("filters.order", "characters")}</Label>
            <Select
              value={filters.order || "DESC"}
              onValueChange={handleOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.order", "characters")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">
                  {t("filters.orderAsc", "characters")}
                </SelectItem>
                <SelectItem value="DESC">
                  {t("filters.orderDesc", "characters")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
