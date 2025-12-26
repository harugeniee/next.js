"use client";

import { useState, useCallback, useMemo } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { Calendar } from "@/components/ui/core/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import type { DashboardQueryParams } from "@/lib/api/analytics";

interface AnalyticsFiltersProps {
  filters: DashboardQueryParams;
  onFiltersChange: (filters: DashboardQueryParams) => void;
}

/**
 * Analytics Filters Component
 * Provides filtering controls for analytics dashboard
 */
export function AnalyticsFilters({
  filters,
  onFiltersChange,
}: AnalyticsFiltersProps) {
  const { t } = useI18n();
  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.fromDate ? new Date(filters.fromDate) : undefined,
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.toDate ? new Date(filters.toDate) : undefined,
  );

  const handleFromDateChange = useCallback(
    (date: Date | undefined) => {
      setFromDate(date);
      onFiltersChange({
        ...filters,
        fromDate: date,
      });
    },
    [filters, onFiltersChange],
  );

  const handleToDateChange = useCallback(
    (date: Date | undefined) => {
      setToDate(date);
      onFiltersChange({
        ...filters,
        toDate: date,
      });
    },
    [filters, onFiltersChange],
  );

  const handleGranularityChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        granularity: value as "hour" | "day" | "week" | "month",
      });
    },
    [filters, onFiltersChange],
  );

  const handleEventTypesChange = useCallback(
    (value: string) => {
      const eventTypes = value
        ? value
            .split(",")
            .map((type) => type.trim())
            .filter(Boolean)
        : undefined;
      onFiltersChange({
        ...filters,
        eventTypes,
      });
    },
    [filters, onFiltersChange],
  );

  const handleUserIdsChange = useCallback(
    (value: string) => {
      const userIds = value
        ? value
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : undefined;
      onFiltersChange({
        ...filters,
        userIds,
      });
    },
    [filters, onFiltersChange],
  );

  const handleReset = useCallback(() => {
    setFromDate(undefined);
    setToDate(undefined);
    onFiltersChange({
      granularity: "day",
    });
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      fromDate ||
      toDate ||
      filters.granularity !== "day" ||
      filters.eventTypes?.length ||
      filters.userIds?.length
    );
  }, [fromDate, toDate, filters]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("dashboard.filters.title", "admin")}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t("dashboard.filters.reset", "admin")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* From Date */}
          <div className="space-y-2">
            <Label>{t("dashboard.filters.fromDate", "admin")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? (
                    format(fromDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">
                      {t("dashboard.filters.selectDate", "admin")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={handleFromDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label>{t("dashboard.filters.toDate", "admin")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? (
                    format(toDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">
                      {t("dashboard.filters.selectDate", "admin")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={handleToDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Granularity */}
          <div className="space-y-2">
            <Label>{t("dashboard.filters.granularity", "admin")}</Label>
            <Select
              value={filters.granularity || "day"}
              onValueChange={handleGranularityChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">
                  {t("dashboard.filters.granularityHour", "admin")}
                </SelectItem>
                <SelectItem value="day">
                  {t("dashboard.filters.granularityDay", "admin")}
                </SelectItem>
                <SelectItem value="week">
                  {t("dashboard.filters.granularityWeek", "admin")}
                </SelectItem>
                <SelectItem value="month">
                  {t("dashboard.filters.granularityMonth", "admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Types */}
          <div className="space-y-2">
            <Label>{t("dashboard.filters.eventTypes", "admin")}</Label>
            <Input
              placeholder={t(
                "dashboard.filters.eventTypesPlaceholder",
                "admin",
              )}
              value={filters.eventTypes?.join(", ") || ""}
              onChange={(e) => handleEventTypesChange(e.target.value)}
            />
          </div>

          {/* User IDs */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("dashboard.filters.userIds", "admin")}</Label>
            <Input
              placeholder={t("dashboard.filters.userIdsPlaceholder", "admin")}
              value={filters.userIds?.join(", ") || ""}
              onChange={(e) => handleUserIdsChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
