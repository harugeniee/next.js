"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { TagsInputComponent } from "@/components/ui/layout/tags-input";
import { Label } from "@/components/ui/core/label";
import { Input } from "@/components/ui/core/input";
import { useTags } from "@/hooks/tags/useTagQuery";
import type { CreateSeriesDto } from "@/lib/api/series";
import { cn } from "@/lib/utils";

export interface StepContentProps {
  formData: Partial<CreateSeriesDto>;
  onChange: (data: Partial<CreateSeriesDto>) => void;
  errors?: Record<string, string>;
  className?: string;
}

/**
 * Step 3: Content Details Component
 * Description, Genres, Tags, and Synonyms
 */
export function StepContent({
  formData,
  onChange,
  errors,
  className,
}: StepContentProps) {
  const { t } = useI18n();
  const { data: tagsData } = useTags({
    limit: 100,
    sortBy: "name",
    order: "ASC",
  });

  // Convert tags to TagData format
  const tags =
    tagsData?.data?.result?.map((tag) => ({
      id: tag.id,
      label: tag.name,
    })) || [];

  const handleDescriptionChange = (value: string) => {
    onChange({ description: value });
  };

  const handleTagIdsChange = (tagIds: string[]) => {
    onChange({ tagIds });
  };

  const handleTagCreate = (tag: { id: string; label: string }) => {
    // Tags are created via API, we just use the ID
    handleTagIdsChange([...(formData.tagIds || []), tag.id]);
  };

  const handleSynonymsChange = (value: string) => {
    // Parse comma-separated values
    const synonyms = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onChange({ synonyms });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.description", "series")}
        </Label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder={t("create.form.descriptionPlaceholder", "series")}
          rows={8}
          maxLength={5000}
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring transition-shadow resize-none",
            errors?.description && "border-destructive",
          )}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {(formData.description || "").length}/5000{" "}
            {t("create.form.characters", "series")}
          </span>
        </div>
        {errors?.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.tags", "series")}
        </Label>
        <TagsInputComponent
          tags={tags}
          selectedTags={formData.tagIds || []}
          onTagsChange={handleTagIdsChange}
          onTagCreate={handleTagCreate}
          placeholder={t("create.form.tagsPlaceholder", "series")}
          allowCreate={true}
          allowRemove={true}
        />
        <p className="text-xs text-muted-foreground">
          {(formData.tagIds || []).length}/20 {t("create.form.tags", "series")}
        </p>
      </div>

      {/* Synonyms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.synonyms", "series")}
        </Label>
        <Input
          value={(formData.synonyms || []).join(", ")}
          onChange={(e) => handleSynonymsChange(e.target.value)}
          placeholder={t("create.form.synonymsPlaceholder", "series")}
        />
        <p className="text-xs text-muted-foreground">
          {t("create.form.synonymsHint", "series")}
        </p>
      </div>

      {/* Genres - Note: Backend may need genre API endpoint */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.genres", "series")}
        </Label>
        <p className="text-xs text-muted-foreground">
          {t("create.form.genresHint", "series")}
        </p>
        {/* TODO: Implement genre selection when API is available */}
        <Input
          placeholder={t("create.form.genresPlaceholder", "series")}
          disabled={true}
        />
      </div>
    </div>
  );
}
