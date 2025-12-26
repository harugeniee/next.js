import { z } from "zod";

import {
  BadgeCategory,
  BadgeEntityType,
  BadgeRarity,
  BadgeStatus,
  BadgeType,
} from "@/lib/types/badges";

/**
 * Badge validation constants
 * Matching backend BADGE_CONSTANTS
 */
const BADGE_CONSTANTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  ICON_URL_MAX_LENGTH: 2048,
  DISPLAY_ORDER_MIN: 0,
  DISPLAY_ORDER_MAX: 9999,
  ASSIGNMENT_REASON_MAX_LENGTH: 500,
} as const;

/**
 * Create Badge Schema
 * Matches backend CreateBadgeDto validation
 */
export const createBadgeSchema = z.object({
  type: z.nativeEnum(BadgeType, {
    required_error: "Badge type is required",
  }),
  name: z
    .string()
    .min(BADGE_CONSTANTS.NAME_MIN_LENGTH, "Name is required")
    .max(
      BADGE_CONSTANTS.NAME_MAX_LENGTH,
      `Name must be less than ${BADGE_CONSTANTS.NAME_MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      BADGE_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${BADGE_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  category: z.nativeEnum(BadgeCategory, {
    required_error: "Category is required",
  }),
  rarity: z.nativeEnum(BadgeRarity, {
    required_error: "Rarity is required",
  }),
  status: z.nativeEnum(BadgeStatus).optional(),
  isVisible: z.boolean().optional(),
  isObtainable: z.boolean().optional(),
  displayOrder: z
    .number()
    .int()
    .min(
      BADGE_CONSTANTS.DISPLAY_ORDER_MIN,
      `Display order must be at least ${BADGE_CONSTANTS.DISPLAY_ORDER_MIN}`,
    )
    .max(
      BADGE_CONSTANTS.DISPLAY_ORDER_MAX,
      `Display order must be at most ${BADGE_CONSTANTS.DISPLAY_ORDER_MAX}`,
    )
    .optional(),
  iconUrl: z
    .string()
    .url("Icon URL must be a valid URL")
    .max(
      BADGE_CONSTANTS.ICON_URL_MAX_LENGTH,
      `Icon URL must be less than ${BADGE_CONSTANTS.ICON_URL_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid hex color (e.g., #FF0000)",
    )
    .optional()
    .or(z.literal("")),
  requirements: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  isAutoAssigned: z.boolean().optional(),
  isManuallyAssignable: z.boolean().optional(),
  isRevokable: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
});

/**
 * Update Badge Schema
 * Partial version of CreateBadgeSchema
 */
export const updateBadgeSchema = createBadgeSchema.partial();

/**
 * Assign Badge Schema
 * Matches backend AssignBadgeDto validation
 */
export const assignBadgeSchema = z.object({
  badgeId: z.string().min(1, "Badge ID is required"),
  entityType: z.nativeEnum(BadgeEntityType, {
    required_error: "Entity type is required",
  }),
  entityId: z.string().min(1, "Entity ID is required"),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
  assignmentReason: z
    .string()
    .max(
      BADGE_CONSTANTS.ASSIGNMENT_REASON_MAX_LENGTH,
      `Assignment reason must be less than ${BADGE_CONSTANTS.ASSIGNMENT_REASON_MAX_LENGTH} characters`,
    )
    .optional(),
  isVisible: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Revoke Badge Schema
 * Matches backend RevokeBadgeDto validation
 */
export const revokeBadgeSchema = z.object({
  revocationReason: z
    .string()
    .max(
      BADGE_CONSTANTS.ASSIGNMENT_REASON_MAX_LENGTH,
      `Revocation reason must be less than ${BADGE_CONSTANTS.ASSIGNMENT_REASON_MAX_LENGTH} characters`,
    )
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateBadgeFormData = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeFormData = z.infer<typeof updateBadgeSchema>;
export type AssignBadgeFormData = z.infer<typeof assignBadgeSchema>;
export type RevokeBadgeFormData = z.infer<typeof revokeBadgeSchema>;
