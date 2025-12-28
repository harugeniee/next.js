import { z } from "zod";

/**
 * Assign Role validation schema
 * Matches backend AssignRoleDto validation
 */
export const assignRoleSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    roleId: z.string().min(1, "Role ID is required"),
    reason: z.string().max(1000, "Reason must be less than 1000 characters").optional(),
    assignedBy: z.string().optional(),
    isTemporary: z.boolean().optional().default(false),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) => {
      // If isTemporary is true, expiresAt must be provided
      if (data.isTemporary && !data.expiresAt) {
        return false;
      }
      return true;
    },
    {
      message: "Expiration date is required for temporary assignments",
      path: ["expiresAt"],
    },
  )
  .refine(
    (data) => {
      // If expiresAt is provided, it must be a valid future date
      if (data.expiresAt) {
        const expiresDate = new Date(data.expiresAt);
        const now = new Date();
        if (isNaN(expiresDate.getTime()) || expiresDate <= now) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Expiration date must be in the future",
      path: ["expiresAt"],
    },
  );

/**
 * Type for assign role form data
 */
export type AssignRoleFormData = z.infer<typeof assignRoleSchema>;

