"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Label } from "@/components/ui/core/label";
import { Input } from "@/components/ui/core/input";
import { DatePicker } from "@/components/ui/core/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { CreateSeriesDto } from "@/lib/api/series";
import { cn } from "@/lib/utils";

/**
 * Convert SNAKE_CASE to camelCase for i18n key lookup
 * Example: LIGHT_NOVEL -> lightNovel, VIDEO_GAME -> videoGame
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

export interface StepReleaseInfoProps {
  formData: Partial<CreateSeriesDto>;
  onChange: (data: Partial<CreateSeriesDto>) => void;
  errors?: Record<string, string>;
  className?: string;
}

/**
 * Step 4: Release Information Component
 * Dates, Season, Country, Source, and conditional Episode/Chapter fields
 */
export function StepReleaseInfo({
  formData,
  onChange,
  errors,
  className,
}: StepReleaseInfoProps) {
  const { t } = useI18n();

  const isAnime = formData.type === SERIES_CONSTANTS.TYPE.ANIME;
  const isManga = formData.type === SERIES_CONSTANTS.TYPE.MANGA;

  const handleStartDateChange = (date: Date | undefined) => {
    onChange({ startDate: date });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onChange({ endDate: date });
  };

  const handleSeasonChange = (season: string) => {
    onChange({ season: season as CreateSeriesDto["season"] });
  };

  const handleSeasonYearChange = (value: string) => {
    const year = parseInt(value, 10);
    if (!isNaN(year)) {
      onChange({ seasonYear: year });
    } else {
      onChange({ seasonYear: undefined });
    }
  };

  const handleCountryChange = (value: string) => {
    onChange({ countryOfOrigin: value || undefined });
  };

  const handleSourceChange = (source: string) => {
    onChange({ source: source as CreateSeriesDto["source"] });
  };

  const handleEpisodesChange = (value: string) => {
    const episodes = parseInt(value, 10);
    if (!isNaN(episodes)) {
      onChange({ episodes });
    } else {
      onChange({ episodes: undefined });
    }
  };

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value, 10);
    if (!isNaN(duration)) {
      onChange({ duration });
    } else {
      onChange({ duration: undefined });
    }
  };

  const handleChaptersChange = (value: string) => {
    const chapters = parseInt(value, 10);
    if (!isNaN(chapters)) {
      onChange({ chapters });
    } else {
      onChange({ chapters: undefined });
    }
  };

  const handleVolumesChange = (value: string) => {
    const volumes = parseInt(value, 10);
    if (!isNaN(volumes)) {
      onChange({ volumes });
    } else {
      onChange({ volumes: undefined });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Start Date */}
      <DatePicker
        value={formData.startDate}
        onChange={handleStartDateChange}
        placeholder={t(
          "create.form.startDate",
          "series",
          {},
          "Select start date",
        )}
        label={t("create.form.startDate", "series")}
        maxDate={formData.endDate || new Date(2100, 11, 31)}
      />
      {errors?.startDate && (
        <p className="text-sm text-destructive">{errors.startDate}</p>
      )}

      {/* End Date */}
      <DatePicker
        value={formData.endDate}
        onChange={handleEndDateChange}
        placeholder={t("create.form.endDate", "series", {}, "Select end date")}
        label={t("create.form.endDate", "series")}
        minDate={formData.startDate}
        maxDate={new Date(2100, 11, 31)}
      />

      {/* Season */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.season", "series")}
        </Label>
        <Select
          value={formData.season || ""}
          onValueChange={handleSeasonChange}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("create.form.seasonPlaceholder", "series")}
            />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SERIES_CONSTANTS.SEASON).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {t(`create.season.${key.toLowerCase()}`, "series") ||
                  t(`seasons.${key.toLowerCase()}`, "series") ||
                  key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.seasonYear", "series")}
        </Label>
        <Input
          type="number"
          min={1900}
          max={2100}
          value={formData.seasonYear || ""}
          onChange={(e) => handleSeasonYearChange(e.target.value)}
          placeholder={t("create.form.seasonYearPlaceholder", "series")}
        />
      </div>

      {/* Country of Origin */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.countryOfOrigin", "series")}
        </Label>
        <Input
          value={formData.countryOfOrigin || ""}
          onChange={(e) => handleCountryChange(e.target.value)}
          placeholder={t("create.form.countryOfOriginPlaceholder", "series")}
          maxLength={2}
        />
        <p className="text-xs text-muted-foreground">
          {t("create.form.countryOfOriginHint", "series")}
        </p>
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.source", "series")}
        </Label>
        <Select
          value={formData.source || ""}
          onValueChange={handleSourceChange}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("create.form.sourcePlaceholder", "series")}
            />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SERIES_CONSTANTS.SOURCE).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {t(`create.source.${snakeToCamel(key)}`, "series") ||
                  t(`source.${snakeToCamel(key)}`, "series") ||
                  key.replace(/_/g, " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Fields: Episodes & Duration (for Anime) */}
      {isAnime && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.episodes", "series")}
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.episodes || ""}
              onChange={(e) => handleEpisodesChange(e.target.value)}
              placeholder={t("create.form.episodesPlaceholder", "series")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.duration", "series")} (
              {t("create.form.minutes", "series")})
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.duration || ""}
              onChange={(e) => handleDurationChange(e.target.value)}
              placeholder={t("create.form.durationPlaceholder", "series")}
            />
          </div>
        </>
      )}

      {/* Conditional Fields: Chapters & Volumes (for Manga) */}
      {isManga && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.chapters", "series")}
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.chapters || ""}
              onChange={(e) => handleChaptersChange(e.target.value)}
              placeholder={t("create.form.chaptersPlaceholder", "series")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("create.form.volumes", "series")}
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.volumes || ""}
              onChange={(e) => handleVolumesChange(e.target.value)}
              placeholder={t("create.form.volumesPlaceholder", "series")}
            />
          </div>
        </>
      )}
    </div>
  );
}
