"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { StepBasicInfo } from "@/components/features/series/create/step-basic-info";
import { StepMedia } from "@/components/features/series/create/step-media";
import { StepContent } from "@/components/features/series/create/step-content";
import { StepReleaseInfo } from "@/components/features/series/create/step-release-info";
import { StepAdvanced } from "@/components/features/series/create/step-advanced";
import type { CreateSeriesDto } from "@/lib/api/series";
import { ContributionCategory } from "@/lib/validators/contribution-series";
import { cn } from "@/lib/utils";

export interface StepEditFieldsProps {
  selectedCategories: ContributionCategory[];
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

export function StepEditFields({
  selectedCategories,
  formData,
  onChange,
  errors,
  className,
}: StepEditFieldsProps) {
  const { t } = useI18n();

  const showBasicInfo = selectedCategories.includes(
    ContributionCategory.BASIC_INFO,
  );
  const showMedia = selectedCategories.includes(ContributionCategory.MEDIA);
  const showContent = selectedCategories.includes(ContributionCategory.CONTENT);
  const showReleaseInfo = selectedCategories.includes(
    ContributionCategory.RELEASE_INFO,
  );
  const showAdvanced = selectedCategories.includes(
    ContributionCategory.ADVANCED,
  );

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {t("contribute.steps.editFields", "series")}
        </h2>
        <p className="text-muted-foreground">
          {t("contribute.editFields.description", "series")}
        </p>
      </div>

      {selectedCategories.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t(
              "contribute.editFields.noCategories",
              "series",
              {},
              "Please go back and select at least one category",
            )}
          </p>
        </div>
      )}

      {showBasicInfo && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("contribute.categories.basicInfo", "series")}
          </h3>
          <StepBasicInfo
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      )}

      {showMedia && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("contribute.categories.media", "series")}
          </h3>
          <StepMedia formData={formData} onChange={onChange} errors={errors} />
        </div>
      )}

      {showContent && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("contribute.categories.content", "series")}
          </h3>
          <StepContent
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      )}

      {showReleaseInfo && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("contribute.categories.releaseInfo", "series")}
          </h3>
          <StepReleaseInfo
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      )}

      {showAdvanced && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("contribute.categories.advanced", "series")}
          </h3>
          <StepAdvanced
            formData={formData}
            onChange={onChange}
            errors={errors}
            isContributionMode={true}
          />
        </div>
      )}
    </div>
  );
}
