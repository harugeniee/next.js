"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Label } from "@/components/ui/core/label";
import type { CreateSeriesDto } from "@/lib/api/series";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ExternalLinksBuilder } from "./external-links-builder";

export interface StepAdvancedProps {
  formData: Partial<CreateSeriesDto>;
  onChange: (data: Partial<CreateSeriesDto>) => void;
  errors?: Record<string, string>;
  className?: string;
  /**
   * If true, hides fields that should not be editable in contribution mode
   * (e.g., notes, meanScore, isLocked, etc.)
   */
  isContributionMode?: boolean;
}

/**
 * Step 5: Advanced Settings Component
 * NSFW, Licensed, External Links, Streaming Episodes, Notes, Metadata
 */
export function StepAdvanced({
  formData,
  onChange,
  className,
  isContributionMode = false,
}: StepAdvancedProps) {
  const { t } = useI18n();
  const [showMetadata, setShowMetadata] = useState(false);

  const handleToggle = (field: "isNsfw" | "isLicensed", value: boolean) => {
    onChange({ [field]: value });
  };

  const handleExternalLinksChange = (links: Record<string, string>) => {
    onChange({ externalLinks: links });
  };

  const handleStreamingEpisodesChange = (episodes: Record<string, string>) => {
    onChange({ streamingEpisodes: episodes });
  };

  const handleNotesChange = (value: string) => {
    onChange({ notes: value });
  };

  const handleMetadataChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      onChange({ metadata: parsed });
    } catch {
      // Invalid JSON, ignore
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* NSFW Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-md">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">
            {t("create.form.isNsfw", "series")}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("create.form.isNsfwDescription", "series")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle("isNsfw", !formData.isNsfw)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            formData.isNsfw ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              formData.isNsfw ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>

      {/* Is Licensed Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-md">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">
            {t("create.form.isLicensed", "series")}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("create.form.isLicensedDescription", "series")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle("isLicensed", !formData.isLicensed)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            formData.isLicensed ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              formData.isLicensed ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>

      {/* External Links */}
      <div className="space-y-2">
        <ExternalLinksBuilder
          links={formData.externalLinks || {}}
          onChange={handleExternalLinksChange}
          label={t("create.form.externalLinks", "series")}
        />
      </div>

      {/* Streaming Episodes */}
      <div className="space-y-2">
        <ExternalLinksBuilder
          links={formData.streamingEpisodes || {}}
          onChange={handleStreamingEpisodesChange}
          label={t("create.form.streamingEpisodes", "series")}
          noLinksLabel={
            t("create.form.noStreamingEpisodes", "series") ||
            t("create.form.noExternalLinks", "series")
          }
        />
      </div>

      {/* Notes - Hidden in contribution mode */}
      {!isContributionMode && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("create.form.notes", "series")}
          </Label>
          <textarea
            value={formData.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={t("create.form.notesPlaceholder", "series")}
            rows={4}
            maxLength={1000}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-shadow resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {(formData.notes || "").length}/1000{" "}
              {t("create.form.characters", "series")}
            </span>
          </div>
        </div>
      )}

      {/* Metadata (Advanced) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {t("create.form.metadata", "series")}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowMetadata(!showMetadata)}
          >
            {showMetadata
              ? t("create.form.hideMetadata", "series")
              : t("create.form.showMetadata", "series")}
          </Button>
        </div>
        {showMetadata && (
          <div className="space-y-2">
            <textarea
              value={JSON.stringify(formData.metadata || {}, null, 2)}
              onChange={(e) => handleMetadataChange(e.target.value)}
              placeholder={t("create.form.metadataPlaceholder", "series")}
              rows={8}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-shadow resize-none font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              {t("create.form.metadataHint", "series")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
