import { z } from "zod";
import { COMMENT_CONSTANTS } from "@/lib/constants/comment.constants";

/**
 * Zod schema for updating a comment in admin interface
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .max(COMMENT_CONSTANTS.CONTENT_MAX_LENGTH, {
      message: `Content must be at most ${COMMENT_CONSTANTS.CONTENT_MAX_LENGTH} characters`,
    })
    .optional(),
  visibility: z
    .enum([
      COMMENT_CONSTANTS.VISIBILITY.PUBLIC,
      COMMENT_CONSTANTS.VISIBILITY.PRIVATE,
      COMMENT_CONSTANTS.VISIBILITY.HIDDEN,
      COMMENT_CONSTANTS.VISIBILITY.DELETED,
    ])
    .optional(),
  flags: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
});

/**
 * Form data type for updating a comment
 */
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
