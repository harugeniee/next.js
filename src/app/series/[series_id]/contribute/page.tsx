"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ProtectedRoute } from "@/components/features/auth";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui/core/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useBreadcrumb } from "@/hooks/ui/useBreadcrumb";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { useSeriesFull } from "@/hooks/series";
import { useContributionFormState } from "@/hooks/series/useContributionFormState";
import { useSubmitContribution } from "@/hooks/series/useSubmitContribution";
import { transformBackendSeries } from "@/lib/utils/series-utils";
import { ContributionStepper } from "@/components/features/series/contribute/contribution-stepper";
import { StepSelectCategories } from "@/components/features/series/contribute/step-select-categories";
import { StepEditFields } from "@/components/features/series/contribute/step-edit-fields";
import { StepReviewSubmit } from "@/components/features/series/contribute/step-review-submit";
import { ContributionCategory } from "@/lib/validators/contribution-series";
import type { CreateSeriesDto } from "@/lib/api/series";

const TOTAL_STEPS = 3; // Step 0: Select Categories, Step 1: Edit Fields, Step 2: Review & Submit

/**
 * Series Contribution Page
 * Allows users to submit updates to a series through the contributions system
 * URL pattern: /series/[series_id]/contribute
 */
export default function ContributePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const seriesId = params.series_id as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Fetch series data
  const {
    data: backendSeries,
    isLoading: isLoadingSeries,
    error: seriesError,
  } = useSeriesFull(seriesId);

  // Transform backend data
  const seriesDisplay = backendSeries
    ? transformBackendSeries(backendSeries)
    : undefined;

  // Contribution form state
  const {
    selectedCategories,
    formData,
    contributorNote,
    setContributorNote,
    updateFormData,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    getChanges,
    hasChanges,
    initializeFormData,
  } = useContributionFormState(backendSeries);

  // Initialize form data when series loads
  useEffect(() => {
    if (backendSeries) {
      initializeFormData();
    }
  }, [backendSeries, initializeFormData]);

  // Submit contribution hook
  const { submitContribution, isSubmitting } = useSubmitContribution();

  // Breadcrumb
  const breadcrumbItems = useBreadcrumb(undefined, {
    series_id: seriesId,
    series_title: seriesDisplay?.title,
  });

  // Page metadata
  usePageMetadata({
    title: t("contribute.title", "series"),
    description: t("contribute.description", "series"),
  });

  // Handle step navigation
  const handleNext = () => {
    // Step 0: Validate categories selected
    if (currentStep === 0) {
      if (selectedCategories.length === 0) {
        // Show error or prevent navigation
        return;
      }
      if (!completedSteps.includes(0)) {
        setCompletedSteps((prev) => [...prev, 0]);
      }
      setCurrentStep(1);
      return;
    }

    // Step 1: Validate form data (basic validation)
    if (currentStep === 1) {
      if (!hasChanges) {
        // Show warning but allow navigation
      }
      if (!completedSteps.includes(1)) {
        setCompletedSteps((prev) => [...prev, 1]);
      }
      setCurrentStep(2);
      return;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps
    if (completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const changes = getChanges;
    const changedFieldsCount = Object.keys(changes).length;

    console.log("Submit attempt:", {
      hasChanges,
      changedFieldsCount,
      changes: Object.keys(changes),
      formDataKeys: Object.keys(formData),
    });

    if (!hasChanges || changedFieldsCount === 0) {
      console.warn("No changes detected, cannot submit contribution", {
        hasChanges,
        changedFieldsCount,
        changes,
      });
      return;
    }

    try {
      // Only submit the changed fields, not all formData
      const changedData: Partial<CreateSeriesDto> = {};

      // Extract only the new values from changes
      Object.keys(changes).forEach((key) => {
        changedData[key as keyof CreateSeriesDto] = changes[key]
          .new as CreateSeriesDto[keyof CreateSeriesDto];
      });

      console.log("Submitting contribution with data:", changedData);
      await submitContribution(seriesId, changedData, contributorNote);
      // Redirect happens in submitContribution hook
    } catch (error) {
      // Error is handled by the hook
      console.error("Failed to submit contribution:", error);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepSelectCategories
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            onSelectAll={selectAllCategories}
            onDeselectAll={deselectAllCategories}
          />
        );
      case 1:
        return (
          <StepEditFields
            selectedCategories={selectedCategories}
            formData={
              formData as Partial<CreateSeriesDto> & {
                coverImageFile?: File | null;
                bannerImageFile?: File | null;
              }
            }
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <StepReviewSubmit
            originalData={
              backendSeries
                ? (() => {
                    // Transform backend series to DTO format for comparison
                    const original: Partial<CreateSeriesDto> = {
                      myAnimeListId: backendSeries.myAnimeListId,
                      aniListId: backendSeries.aniListId,
                      title: backendSeries.title,
                      type: backendSeries.type as CreateSeriesDto["type"],
                      format: backendSeries.format as CreateSeriesDto["format"],
                      status: backendSeries.status as CreateSeriesDto["status"],
                      description: backendSeries.description,
                      startDate: backendSeries.startDate
                        ? new Date(backendSeries.startDate)
                        : undefined,
                      endDate: backendSeries.endDate
                        ? new Date(backendSeries.endDate)
                        : undefined,
                      season: backendSeries.season as CreateSeriesDto["season"],
                      seasonYear: backendSeries.seasonYear,
                      episodes: backendSeries.episodes,
                      chapters: backendSeries.chapters,
                      volumes: backendSeries.volumes,
                      countryOfOrigin: backendSeries.countryOfOrigin,
                      isLicensed: backendSeries.isLicensed,
                      source: backendSeries.source as CreateSeriesDto["source"],
                      coverImageId: backendSeries.coverImage?.id,
                      bannerImageId: backendSeries.bannerImage?.id,
                      genreIds: backendSeries.genres
                        ?.map((g) => g.genre?.id)
                        .filter(Boolean) as string[],
                      tagIds: backendSeries.tags
                        ?.map((t) => t.tag?.id)
                        .filter(Boolean) as string[],
                      synonyms: backendSeries.synonyms,
                      averageScore: backendSeries.averageScore,
                      popularity: backendSeries.popularity,
                      isNsfw: backendSeries.isNsfw,
                      externalLinks: backendSeries.externalLinks,
                    };
                    return original;
                  })()
                : {}
            }
            proposedData={formData}
            changedFields={Object.keys(getChanges)}
            contributorNote={contributorNote}
            onContributorNoteChange={setContributorNote}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const isLoading = isLoadingSeries;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 max-w-5xl">
          <Skeletonize loading={isLoading}>
            <AnimatedSection
              loading={isLoading}
              data={!isLoading && !seriesError}
              className="space-y-6"
            >
              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      {t("nav.home", "common") || "Home"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {seriesDisplay && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={`/series/${seriesId}`}>
                          {seriesDisplay.title}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  )}
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {t("contribute.title", "series")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {t("contribute.title", "series")}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t("contribute.description", "series")}
                  </p>
                </div>
                <Link href={`/series/${seriesId}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("actions.back", "common")}
                  </Button>
                </Link>
              </div>

              {/* Error State */}
              {seriesError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <p className="text-sm text-destructive">
                    {t(
                      "contribute.error.loadSeries",
                      "series",
                      {},
                      "Failed to load series data",
                    )}
                  </p>
                </div>
              )}

              {/* Timeline Stepper */}
              {!seriesError && (
                <ContributionStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              )}

              {/* Step Content */}
              {!seriesError && <div className="mt-8">{renderStep()}</div>}

              {/* Navigation Buttons */}
              {!seriesError && (
                <div className="flex justify-between gap-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    {t("actions.previous", "common", {}, "Previous")}
                  </Button>
                  {currentStep < TOTAL_STEPS - 1 && (
                    <Button onClick={handleNext}>
                      {t("actions.next", "common", {}, "Next")}
                    </Button>
                  )}
                </div>
              )}
            </AnimatedSection>
          </Skeletonize>
        </div>
      </div>
    </ProtectedRoute>
  );
}
