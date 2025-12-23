"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { ImageUpload } from "@/components/ui/core/image-upload";
import { Label } from "@/components/ui/core/label";
import type { CreateSeriesDto } from "@/lib/api/series";
import { cn } from "@/lib/utils";

export interface StepMediaProps {
  formData: Partial<CreateSeriesDto> & {
    coverImageFile?: File | null;
    bannerImageFile?: File | null;
  };
  onChange: (
    data: Partial<CreateSeriesDto> & {
      coverImageFile?: File | null;
      bannerImageFile?: File | null;
    },
  ) => void;
  errors?: Record<string, string>;
  className?: string;
}

/**
 * Step 2: Media & Visuals Component
 * Cover Image and Banner Image selection (upload on submit)
 */
export function StepMedia({
  formData,
  onChange,
  errors,
  className,
}: StepMediaProps) {
  const { t } = useI18n();

  const handleCoverImageChange = (file: File | null) => {
    onChange({
      coverImageFile: file || null,
      coverImageId: undefined, // Clear existing ID if file is removed
    });
  };

  const handleBannerImageChange = (file: File | null) => {
    onChange({
      bannerImageFile: file || null,
      bannerImageId: undefined, // Clear existing ID if file is removed
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.coverImage", "series")} *
        </Label>
        <p className="text-xs text-muted-foreground">
          {t("create.form.coverImageDescription", "series")}
        </p>
        <ImageUpload
          value={formData.coverImageFile || null}
          onChange={handleCoverImageChange}
          placeholder={t("create.form.coverImagePlaceholder", "series")}
          maxSizeInMB={10}
          acceptedTypes={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
          ]}
          enableCrop={true}
          aspectRatio={2 / 3}
        />
        {errors?.coverImageId && (
          <p className="text-sm text-destructive">{errors.coverImageId}</p>
        )}
      </div>

      {/* Banner Image */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("create.form.bannerImage", "series")}
        </Label>
        <p className="text-xs text-muted-foreground">
          {t("create.form.bannerImageDescription", "series")}
        </p>
        <ImageUpload
          value={formData.bannerImageFile || null}
          onChange={handleBannerImageChange}
          placeholder={t("create.form.bannerImagePlaceholder", "series")}
          maxSizeInMB={10}
          acceptedTypes={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
          ]}
          enableCrop={true}
          aspectRatio={16 / 9}
        />
      </div>
    </div>
  );
}
