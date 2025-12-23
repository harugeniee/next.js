"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateSeriesDto } from "@/lib/api/series";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import { cn } from "@/lib/utils";

export interface StepBasicInfoProps {
  formData: Partial<CreateSeriesDto>;
  onChange: (data: Partial<CreateSeriesDto>) => void;
  errors?: Record<string, string>;
  className?: string;
}

/**
 * Step 1: Basic Information Component
 * Series Type, Title fields, Format, and Status
 */
/**
 * Convert SNAKE_CASE to camelCase for i18n key lookup
 * Example: LIGHT_NOVEL -> lightNovel, TV_SHORT -> tvShort
 */
const snakeToCamel = (str: string): string => {
  return str
    .toLowerCase()
    .split("_")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
};

export function StepBasicInfo({
  formData,
  onChange,
  errors,
  className,
}: StepBasicInfoProps) {
  const { t } = useI18n();

  const handleTypeChange = (type: string) => {
    onChange({ type: type as CreateSeriesDto["type"] });
  };

  const handleTitleChange = (
    field: "romaji" | "english" | "native" | "userPreferred",
    value: string,
  ) => {
    onChange({
      title: {
        ...formData.title,
        [field]: value,
      },
    });
  };

  const handleFormatChange = (format: string) => {
    onChange({ format: format as CreateSeriesDto["format"] });
  };

  const handleStatusChange = (status: string) => {
    onChange({ status: status as CreateSeriesDto["status"] });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Title Fields */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          {t("create.form.title", "series")} *
        </Label>
        <div className="grid gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {t("create.form.titleRomaji", "series")}
            </Label>
            <Input
              value={formData.title?.romaji || ""}
              onChange={(e) => handleTitleChange("romaji", e.target.value)}
              placeholder={t("create.form.titleRomajiPlaceholder", "series")}
              className={errors?.title ? "border-destructive" : ""}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {t("create.form.titleEnglish", "series")}
            </Label>
            <Input
              value={formData.title?.english || ""}
              onChange={(e) => handleTitleChange("english", e.target.value)}
              placeholder={t("create.form.titleEnglishPlaceholder", "series")}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {t("create.form.titleNative", "series")}
            </Label>
            <Input
              value={formData.title?.native || ""}
              onChange={(e) => handleTitleChange("native", e.target.value)}
              placeholder={t("create.form.titleNativePlaceholder", "series")}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {t("create.form.titleUserPreferred", "series")}
            </Label>
            <Input
              value={formData.title?.userPreferred || ""}
              onChange={(e) =>
                handleTitleChange("userPreferred", e.target.value)
              }
              placeholder={t(
                "create.form.titleUserPreferredPlaceholder",
                "series",
              )}
            />
          </div>
        </div>
        {errors?.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {t("create.form.titleHint", "series")}
        </p>
      </div>

      {/* Series Type, Format, and Status - Inline */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Series Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.type", "series")} *
            </Label>
            <Select
              value={formData.type || ""}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger
                className={errors?.type ? "border-destructive" : ""}
              >
                <SelectValue
                  placeholder={
                    t("create.form.typePlaceholder", "series") ||
                    t("create.form.type", "series")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERIES_CONSTANTS.TYPE).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {t(`type.${snakeToCamel(key)}`, "series")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.format", "series")}
            </Label>
            <Select
              value={formData.format || ""}
              onValueChange={handleFormatChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("create.form.formatPlaceholder", "series")}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERIES_CONSTANTS.FORMAT).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {t(`format.${snakeToCamel(key)}`, "series")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.status", "series")}
            </Label>
            <Select
              value={formData.status || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("create.form.statusPlaceholder", "series")}
                />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERIES_CONSTANTS.RELEASING_STATUS).map(
                  ([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {t(`releasingStatus.${snakeToCamel(key)}`, "series")}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
