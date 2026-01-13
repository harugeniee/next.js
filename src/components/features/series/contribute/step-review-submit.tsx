"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/core/card";
import { Label } from "@/components/ui/core/label";
import { Textarea } from "@/components/ui/textarea";
import { JsonDiffViewer } from "@/components/shared/json-diff-viewer";
import type { CreateSeriesDto } from "@/lib/api/series";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface StepReviewSubmitProps {
  originalData: Partial<CreateSeriesDto>;
  proposedData: Partial<CreateSeriesDto>;
  changedFields: string[];
  contributorNote: string;
  onContributorNoteChange: (note: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  className?: string;
}

export function StepReviewSubmit({
  originalData,
  proposedData,
  changedFields,
  contributorNote,
  onContributorNoteChange,
  onSubmit,
  isSubmitting,
  className,
}: StepReviewSubmitProps) {
  const { t } = useI18n();

  const handleSubmit = async () => {
    if (changedFields.length === 0) {
      console.warn("No changes to submit");
      return;
    }
    await onSubmit();
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {t("contribute.steps.reviewSubmit", "series")}
        </h2>
        <p className="text-muted-foreground">
          {t("contribute.review.description", "series")}
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("contribute.review.summary", "series", {}, "Summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("contribute.review.fieldsChanged", "series", { count: changedFields.length }, `${changedFields.length} field(s) will be updated`)}
            </p>
            {changedFields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {changedFields.map((field) => (
                  <span
                    key={field}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Changes Preview */}
      {changedFields.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {t("contribute.review.changesPreview", "series", {}, "Changes Preview")}
          </h3>
          <JsonDiffViewer
            oldJson={originalData as Record<string, unknown>}
            newJson={proposedData as Record<string, unknown>}
          />
        </div>
      )}

      {changedFields.length === 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                {t("contribute.review.noChanges", "series", {}, "No changes detected. Please go back and make some updates.")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contributor Note */}
      <div className="space-y-2">
        <Label htmlFor="contributor-note">
          {t("contribute.review.contributorNote", "series")}
        </Label>
        <Textarea
          id="contributor-note"
          value={contributorNote}
          onChange={(e) => onContributorNoteChange(e.target.value)}
          placeholder={t("contribute.review.contributorNotePlaceholder", "series")}
          rows={4}
          maxLength={2000}
          className="resize-none"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {t("contribute.review.noteHint", "series", {}, "Optional: Explain your changes to help reviewers")}
          </span>
          <span>{contributorNote.length}/2000</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || changedFields.length === 0}
          className="flex-1"
        >
          {isSubmitting
            ? t("contribute.review.submitting", "series")
            : t("contribute.review.submit", "series")}
        </Button>
      </div>
    </div>
  );
}
