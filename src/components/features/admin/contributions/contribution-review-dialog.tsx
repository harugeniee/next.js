"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewContributionDto } from "@/lib/types/contributions";
import {
  approveContributionSchema,
  rejectContributionSchema,
  type ApproveContributionFormData,
  type RejectContributionFormData,
} from "@/lib/validators/contributions";

interface ContributionReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "approve" | "reject";
  contributionId?: string;
  onSubmit: (data: ReviewContributionDto) => Promise<void>;
  isLoading?: boolean;
}

export function ContributionReviewDialog({
  open,
  onOpenChange,
  mode,
  onSubmit,
  isLoading = false,
}: ContributionReviewDialogProps) {
  const { t } = useI18n();

  const isApprove = mode === "approve";
  const schema = isApprove
    ? approveContributionSchema
    : rejectContributionSchema;

  const form = useForm<
    ApproveContributionFormData | RejectContributionFormData
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      adminNotes: "",
      ...(isApprove ? {} : { rejectionReason: "" }),
    },
  });

  const handleSubmit = async (
    data: ApproveContributionFormData | RejectContributionFormData,
  ) => {
    const reviewData: ReviewContributionDto = {
      adminNotes: data.adminNotes || undefined,
      ...(isApprove
        ? {}
        : {
            rejectionReason: (data as RejectContributionFormData)
              .rejectionReason,
          }),
    };

    await onSubmit(reviewData);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isApprove
              ? t("contributions.review.approve", "admin")
              : t("contributions.review.reject", "admin")}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? t(
                  "contributions.review.approveDescription",
                  "admin",
                  {},
                  "Approve this contribution and apply the changes",
                )
              : t(
                  "contributions.review.rejectDescription",
                  "admin",
                  {},
                  "Reject this contribution. A reason is required.",
                )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {!isApprove && (
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("contributions.review.rejectionReason", "admin")} *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "contributions.review.rejectionReasonPlaceholder",
                          "admin",
                          {},
                          "Enter the reason for rejection",
                        )}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("contributions.review.adminNotes", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "contributions.review.adminNotesPlaceholder",
                        "admin",
                        {},
                        "Optional internal notes",
                      )}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("actions.cancel", "common")}
              </Button>
              <Button
                type="submit"
                variant={isApprove ? "default" : "destructive"}
                disabled={isLoading}
                className={isApprove ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isLoading
                  ? t("actions.saving", "common")
                  : isApprove
                    ? t("contributions.review.approve", "admin")
                    : t("contributions.review.reject", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
