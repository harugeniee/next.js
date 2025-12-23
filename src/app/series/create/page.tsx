"use client";

import { ProtectedRoute } from "@/components/features/auth";
import { BreadcrumbNav } from "@/components/features/navigation";
import {
  SeriesCreateStepper,
  StepAdvanced,
  StepBasicInfo,
  StepContent,
  StepMedia,
  StepReleaseInfo,
  StepSelection,
} from "@/components/features/series/create";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { useRequireRole } from "@/hooks/permissions";
import { useSeriesFormState } from "@/hooks/series/useSeriesFormState";
import { useCreateSeries } from "@/hooks/series/useSeriesQuery";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import { useBreadcrumb } from "@/hooks/ui/useBreadcrumb";
import type { CreateSeriesDto } from "@/lib/api/series";
import {
  createSeriesSchema,
  step1BasicInfoSchema,
  step2MediaSchema,
  type CreateSeriesFormData,
} from "@/lib/validators/series-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TOTAL_STEPS = 6; // Step 0: Selection, Step 1-5: Form steps

/**
 * Create Series Page Component
 * Multi-step wizard for creating a new series
 * URL pattern: /series/create
 */
export default function CreateSeriesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (selection)
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  // Check authentication and uploader role
  const { isLoading: isCheckingPermission } = useRequireRole("uploader");

  // Form state management
  const { formData, updateFormData, resetForm, clearDraft } =
    useSeriesFormState();

  // Store image files separately (not in localStorage)
  const [imageFiles, setImageFiles] = useState<{
    coverImageFile?: File | null;
    bannerImageFile?: File | null;
  }>({});

  // React Hook Form for validation
  const form = useForm<CreateSeriesFormData>({
    resolver: zodResolver(createSeriesSchema),
    defaultValues: formData as CreateSeriesFormData,
    mode: "onChange",
  });

  // Sync form data with React Hook Form
  useEffect(() => {
    form.reset(formData as CreateSeriesFormData);
  }, [formData, form]);

  // Create series mutation
  const { mutate: createSeries, isPending: isCreating } = useCreateSeries();

  // Breadcrumb navigation
  const breadcrumbItems = useBreadcrumb([
    { label: t("nav.home", "common") || "Home", href: "/" },
    { label: t("create.title", "series"), href: "/series/create" },
  ]);

  // Page metadata
  usePageMetadata({
    title: t("create.title", "series"),
    description: t("create.description", "series"),
    type: "website",
  });

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    // Step 0 (selection) doesn't need validation
    if (step === 0) {
      return true;
    }

    let schema;
    let dataToValidate: Partial<CreateSeriesFormData>;

    switch (step) {
      case 1:
        schema = step1BasicInfoSchema;
        dataToValidate = {
          type: formData.type,
          title: formData.title,
          format: formData.format,
          status: formData.status,
        };
        break;
      case 2:
        schema = step2MediaSchema;
        dataToValidate = {
          coverImageId: formData.coverImageId,
          bannerImageId: formData.bannerImageId,
        };
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        // Steps 3-6 are optional, no validation needed
        return true;
      default:
        return false;
    }

    try {
      await schema.parseAsync(dataToValidate);
      // Clear errors for this step
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[step];
        return newErrors;
      });
      return true;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        const errors: Record<string, string> = {};
        zodError.errors.forEach((err) => {
          const field = err.path.join(".");
          errors[field] = err.message;
        });
        setStepErrors((prev) => ({
          ...prev,
          [step]: errors,
        }));
      }
      return false;
    }
  };

  // Scroll to top when step changes
  useEffect(() => {
    // Scroll to top after step change (with small delay to ensure DOM is updated)
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Handle step navigation
  const handleNext = async () => {
    // Step 0 (selection) doesn't need validation
    if (currentStep === 0) {
      setCurrentStep(1);
      if (!completedSteps.includes(0)) {
        setCompletedSteps((prev) => [...prev, 0]);
      }
      return;
    }

    const isValid = await validateStep(currentStep);
    if (!isValid) {
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    // Move to next step
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    // Don't allow going back to step 0 from step 1
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleManualClick = () => {
    // Mark step 0 as completed and move to step 1
    if (!completedSteps.includes(0)) {
      setCompletedSteps((prev) => [...prev, 0]);
    }
    setCurrentStep(1);
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps
    if (completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Handle form submission
  const handleCreateSeries = async () => {
    // Validate all steps (skip step 0)
    let allValid = true;
    for (let step = 1; step < TOTAL_STEPS; step++) {
      const isValid = await validateStep(step);
      if (!isValid && step <= 2) {
        // Steps 1-2 are required
        allValid = false;
        setCurrentStep(step); // Jump to first invalid step
        break;
      }
    }

    if (!allValid) {
      return;
    }

    try {
      // Upload images first if they exist
      let coverImageId = formData.coverImageId;
      let bannerImageId = formData.bannerImageId;

      if (imageFiles.coverImageFile) {
        const { MediaAPI } = await import("@/lib/api/media");
        const response = await MediaAPI.upload([imageFiles.coverImageFile], {
          scramble: false,
        });
        if (response.data && response.data[0]) {
          coverImageId = response.data[0].id;
        }
      }

      if (imageFiles.bannerImageFile) {
        const { MediaAPI } = await import("@/lib/api/media");
        const response = await MediaAPI.upload([imageFiles.bannerImageFile], {
          scramble: false,
        });
        if (response.data && response.data[0]) {
          bannerImageId = response.data[0].id;
        }
      }

      // Prepare data for API
      const seriesData: CreateSeriesDto = {
        ...formData,
        type: formData.type!,
        coverImageId,
        bannerImageId,
      } as CreateSeriesDto;

      // Create series
      createSeries(seriesData, {
        onSuccess: (series) => {
          // Clear draft, form, and image files
          clearDraft();
          resetForm();
          setImageFiles({});
          // Redirect to series page
          router.push(`/series/${series.id}`);
        },
      });
    } catch (error) {
      console.error("Failed to upload images or create series:", error);
      // Error will be handled by createSeries mutation
    }
  };

  // Handle image file changes (for step 2)
  const handleImageFilesChange = (data: {
    coverImageFile?: File | null;
    bannerImageFile?: File | null;
  }) => {
    setImageFiles((prev) => ({ ...prev, ...data }));
  };

  // Render current step component
  const renderStep = () => {
    const commonErrors = stepErrors[currentStep] || {};

    switch (currentStep) {
      case 0:
        return <StepSelection onManualClick={handleManualClick} />;
      case 1:
        return (
          <StepBasicInfo
            formData={formData}
            onChange={updateFormData}
            errors={commonErrors}
          />
        );
      case 2:
        return (
          <StepMedia
            formData={{ ...formData, ...imageFiles }}
            onChange={handleImageFilesChange}
            errors={commonErrors}
          />
        );
      case 3:
        return (
          <StepContent
            formData={formData}
            onChange={updateFormData}
            errors={commonErrors}
          />
        );
      case 4:
        return (
          <StepReleaseInfo
            formData={formData}
            onChange={updateFormData}
            errors={commonErrors}
          />
        );
      case 5:
        return (
          <StepAdvanced
            formData={formData}
            onChange={updateFormData}
            errors={commonErrors}
          />
        );
      default:
        return null;
    }
  };

  const isLoading = isCheckingPermission;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 max-w-5xl">
          <Skeletonize loading={isLoading}>
            <AnimatedSection
              loading={isLoading}
              data={!isLoading}
              className="space-y-6"
            >
              {/* Breadcrumb */}
              <BreadcrumbNav items={breadcrumbItems} />

              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  {t("create.title", "series")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("create.description", "series")}
                </p>
              </div>

              {/* Stepper */}
              <Card>
                <CardContent className="pt-6">
                  <SeriesCreateStepper
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={handleStepClick}
                  />
                </CardContent>
              </Card>

              {/* Step Content */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      `create.steps.${["selection", "basic", "media", "content", "release", "advanced"][currentStep]}`,
                      "series",
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderStep()}</CardContent>
              </Card>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep <= 1 || isCreating}
                >
                  {t("create.actions.previous", "series")}
                </Button>
                <div className="flex gap-2">
                  {currentStep < TOTAL_STEPS - 1 ? (
                    <Button onClick={handleNext} disabled={isCreating}>
                      {t("create.actions.next", "series")}
                    </Button>
                  ) : (
                    <Button onClick={handleCreateSeries} disabled={isCreating}>
                      {isCreating
                        ? t("create.actions.creating", "series")
                        : t("create.actions.createSeries", "series")}
                    </Button>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </Skeletonize>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border shadow-lg">
          <div className="container mx-auto px-3 py-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="default"
                className="flex-1 h-11"
                onClick={handlePrevious}
                disabled={currentStep <= 1 || isCreating}
              >
                {t("create.actions.previous", "series")}
              </Button>
              {currentStep < TOTAL_STEPS - 1 ? (
                <Button
                  size="default"
                  className="flex-1 h-11"
                  onClick={handleNext}
                  disabled={isCreating}
                >
                  {t("create.actions.next", "series")}
                </Button>
              ) : (
                <Button
                  size="default"
                  className="flex-1 h-11"
                  onClick={handleCreateSeries}
                  disabled={isCreating}
                >
                  {isCreating
                    ? t("create.actions.creating", "series")
                    : t("create.actions.createSeries", "series")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
