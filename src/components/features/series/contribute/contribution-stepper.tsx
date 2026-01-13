"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ContributionStepperProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

const TOTAL_STEPS = 3; // Step 0: Select Categories, Step 1: Edit Fields, Step 2: Review & Submit

/**
 * Contribution Stepper Component
 * Visual timeline showing completed/current/pending states for contribution form
 * Supports clicking on completed steps to jump back
 */
export function ContributionStepper({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: ContributionStepperProps) {
  const { t } = useI18n();

  const stepLabels = [
    t("contribute.steps.selectCategories", "series"),
    t("contribute.steps.editFields", "series"),
    t("contribute.steps.reviewSubmit", "series"),
  ];

  const getStepState = (step: number) => {
    if (completedSteps.includes(step)) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps
    if (completedSteps.includes(step) && onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto pb-2", className)}>
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex items-start w-full relative py-4">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const step = i;
          const state = getStepState(step);
          const isClickable = completedSteps.includes(step);
          const isLastStep = step === TOTAL_STEPS - 1;

          return (
            <div
              key={step}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Step Circle Container */}
              <div className="flex flex-col items-center relative z-10 w-full">
                <button
                  type="button"
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all relative z-10",
                    state === "completed" &&
                      "bg-primary border-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                    state === "current" &&
                      "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                    state === "pending" &&
                      "bg-background border-border text-muted-foreground cursor-not-allowed",
                    !isClickable && "cursor-not-allowed",
                  )}
                  aria-label={`Step ${step + 1}: ${stepLabels[step]}`}
                >
                  {state === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step + 1}</span>
                  )}
                </button>

                {/* Connector Line (between steps) */}
                {!isLastStep && (
                  <div
                    className={cn(
                      "absolute top-1/2 left-1/2 h-0.5 z-0",
                      completedSteps.includes(step) ? "bg-primary" : "bg-border",
                    )}
                    style={{
                      width: "calc(100% - 20px)",
                      left: "calc(50% + 20px)",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[120px]",
                  state === "current" && "text-foreground font-semibold",
                  state === "completed" && "text-muted-foreground",
                  state === "pending" && "text-muted-foreground/60",
                )}
              >
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: Horizontal scrollable */}
      <div className="flex md:hidden items-center gap-4 min-w-max px-4 relative">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const step = i;
          const state = getStepState(step);
          const isClickable = completedSteps.includes(step);

          return (
            <div
              key={step}
              className="flex items-center gap-2 flex-shrink-0 relative"
            >
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 relative z-10",
                  state === "completed" &&
                    "bg-primary border-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                  state === "current" &&
                    "bg-primary border-primary text-primary-foreground ring-2 ring-primary/20",
                  state === "pending" &&
                    "bg-background border-border text-muted-foreground cursor-not-allowed",
                  !isClickable && "cursor-not-allowed",
                )}
                aria-label={`Step ${step + 1}: ${stepLabels[step]}`}
              >
                {state === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{step + 1}</span>
                )}
              </button>

              {/* Step Label */}
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  state === "current" && "text-foreground font-semibold",
                  state === "completed" && "text-muted-foreground",
                  state === "pending" && "text-muted-foreground/60",
                )}
              >
                {stepLabels[step]}
              </span>

              {/* Static Connector Line (always show, except last step) */}
              {step < TOTAL_STEPS - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 flex-shrink-0 relative",
                    completedSteps.includes(step) ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
