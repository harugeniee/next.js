import { z } from "zod";

/**
 * Schema for reviewing a contribution (approve)
 */
export const approveContributionSchema = z.object({
  adminNotes: z
    .string()
    .max(2000, "Admin notes must be less than 2000 characters")
    .optional(),
});

/**
 * Schema for reviewing a contribution (reject)
 */
export const rejectContributionSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, "Rejection reason is required")
    .max(2000, "Rejection reason must be less than 2000 characters"),
  adminNotes: z
    .string()
    .max(2000, "Admin notes must be less than 2000 characters")
    .optional(),
});

export type ApproveContributionFormData = z.infer<
  typeof approveContributionSchema
>;
export type RejectContributionFormData = z.infer<
  typeof rejectContributionSchema
>;
