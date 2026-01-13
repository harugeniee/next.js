import { z } from "zod";
import { createSeriesSchema } from "./series";

/**
 * Contribution categories that can be updated
 */
export enum ContributionCategory {
  BASIC_INFO = "basicInfo",
  MEDIA = "media",
  CONTENT = "content",
  RELEASE_INFO = "releaseInfo",
  ADVANCED = "advanced",
}

/**
 * Schema for contribution form data
 * Reuses createSeriesSchema but makes all fields optional
 * since we're only updating selected fields
 */
export const contributionSeriesSchema = createSeriesSchema.partial().refine(
  (data) => {
    // At least one field must be provided
    return Object.keys(data).length > 0;
  },
  {
    message: "At least one field must be updated",
  },
);

/**
 * Schema for contributor note
 */
export const contributorNoteSchema = z
  .string()
  .max(2000, "Contributor note must be less than 2000 characters")
  .optional();

/**
 * Complete contribution form schema
 */
export const contributionFormSchema = z.object({
  selectedCategories: z
    .array(z.nativeEnum(ContributionCategory))
    .min(1, "At least one category must be selected"),
  formData: contributionSeriesSchema,
  contributorNote: contributorNoteSchema,
});

export type ContributionFormData = z.infer<typeof contributionFormSchema>;
export type ContributionSeriesFormData = z.infer<typeof contributionSeriesSchema>;
