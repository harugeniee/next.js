import { z } from "zod";

import { MEDIA_CONSTANTS } from "@/lib/constants/media.constants";

/**
 * Media validation schema
 * Validates media update form data
 */
export const updateMediaSchema = z.object({
  name: z
    .string()
    .max(
      MEDIA_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${MEDIA_CONSTANTS.NAME_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(
      MEDIA_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${MEDIA_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  altText: z
    .string()
    .max(
      MEDIA_CONSTANTS.ALT_TEXT_MAX_LENGTH,
      `Alt text must be less than ${MEDIA_CONSTANTS.ALT_TEXT_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean().optional(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      }
      return val;
    }),
});

export type UpdateMediaFormData = z.infer<typeof updateMediaSchema>;
