import { z } from "zod";

/**
 * Staff validation constants
 * Matching backend STAFF_CONSTANTS
 */
const STAFF_CONSTANTS = {
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 5000,
  LANGUAGE_MAX_LENGTH: 50,
  GENDER_MAX_LENGTH: 50,
  OCCUPATION_MAX_LENGTH: 100,
  HOME_TOWN_MAX_LENGTH: 255,
  BLOOD_TYPE_MAX_LENGTH: 10,
  SITE_URL_MAX_LENGTH: 512,
  MOD_NOTES_MAX_LENGTH: 2000,
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
    ARCHIVED: "archived",
  },
  GENDER: {
    MALE: "male",
    FEMALE: "female",
    NON_BINARY: "non_binary",
    OTHER: "other",
  },
  BLOOD_TYPES: {
    A: "A",
    B: "B",
    AB: "AB",
    O: "O",
  },
} as const;

/**
 * Helper function to create a name field schema that accepts string, null, or empty string
 * and transforms them to undefined if empty/null
 * Applies max length validation to string values only
 */
const createNameFieldSchema = (fieldName: string) => {
  const stringSchema = z
    .string()
    .max(
      STAFF_CONSTANTS.NAME_MAX_LENGTH,
      `${fieldName} must be less than ${STAFF_CONSTANTS.NAME_MAX_LENGTH} characters`,
    );

  return z
    .union([stringSchema, z.null(), z.literal("")])
    .optional()
    .transform((val) => (val === null || val === "" ? undefined : val));
};

/**
 * Staff Name Schema
 * Validates staff name structure
 * Handles empty strings and null values by converting them to undefined
 */
export const staffNameSchema = z
  .object({
    first: createNameFieldSchema("First name"),
    middle: createNameFieldSchema("Middle name"),
    last: createNameFieldSchema("Last name"),
    full: createNameFieldSchema("Full name"),
    native: createNameFieldSchema("Native name"),
    alternative: z.array(z.string()).optional(),
    userPreferred: createNameFieldSchema("User preferred name"),
  })
  .optional();

/**
 * Character Role Schema
 * For linking characters to staff members
 */
export const characterRoleSchema = z.object({
  characterId: z.string().min(1, "Character ID is required"),
  notes: z.string().max(500).optional(),
  dubGroup: z.string().max(100).optional(),
});

/**
 * Create Staff Schema
 * Matches backend CreateStaffDto validation
 */
export const createStaffSchema = z.object({
  myAnimeListId: z.string().optional(),
  aniListId: z.string().optional(),
  name: staffNameSchema,
  language: z
    .string()
    .max(STAFF_CONSTANTS.LANGUAGE_MAX_LENGTH)
    .optional()
    .or(z.literal("")),
  imageId: z.string().optional(),
  description: z
    .string()
    .max(
      STAFF_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${STAFF_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  primaryOccupations: z
    .array(
      z
        .string()
        .max(STAFF_CONSTANTS.OCCUPATION_MAX_LENGTH, "Occupation too long"),
    )
    .optional(),
  gender: z
    .enum([
      STAFF_CONSTANTS.GENDER.MALE,
      STAFF_CONSTANTS.GENDER.FEMALE,
      STAFF_CONSTANTS.GENDER.NON_BINARY,
      STAFF_CONSTANTS.GENDER.OTHER,
    ])
    .optional()
    .or(z.literal("")),
  dateOfBirth: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string" && val.trim() !== "") {
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date.toISOString();
        return val;
      }
      return undefined;
    }),
  dateOfDeath: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string" && val.trim() !== "") {
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date.toISOString();
        return val;
      }
      return undefined;
    }),
  age: z
    .number()
    .int()
    .min(0, "Age must be positive")
    .max(150, "Age must be realistic")
    .optional()
    .nullable(),
  debutDate: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string" && val.trim() !== "") {
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date.toISOString();
        return val;
      }
      return undefined;
    }),
  homeTown: z
    .string()
    .max(
      STAFF_CONSTANTS.HOME_TOWN_MAX_LENGTH,
      `Home town must be less than ${STAFF_CONSTANTS.HOME_TOWN_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  bloodType: z
    .union([
      z.enum([
        STAFF_CONSTANTS.BLOOD_TYPES.A,
        STAFF_CONSTANTS.BLOOD_TYPES.B,
        STAFF_CONSTANTS.BLOOD_TYPES.AB,
        STAFF_CONSTANTS.BLOOD_TYPES.O,
      ]),
      z.null(),
      z.literal(""),
    ])
    .optional()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  siteUrl: z
    .string()
    .url("Site URL must be a valid URL")
    .max(
      STAFF_CONSTANTS.SITE_URL_MAX_LENGTH,
      `Site URL must be less than ${STAFF_CONSTANTS.SITE_URL_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(
      STAFF_CONSTANTS.MOD_NOTES_MAX_LENGTH,
      `Notes must be less than ${STAFF_CONSTANTS.MOD_NOTES_MAX_LENGTH} characters`,
    )
    .optional(),
  status: z
    .enum([
      STAFF_CONSTANTS.STATUS.ACTIVE,
      STAFF_CONSTANTS.STATUS.INACTIVE,
      STAFF_CONSTANTS.STATUS.PENDING,
      STAFF_CONSTANTS.STATUS.ARCHIVED,
    ])
    .optional()
    .or(z.literal("")),
  characters: z.array(characterRoleSchema).optional(),
  metadata: z
    .union([z.record(z.string(), z.unknown()), z.null()])
    .optional()
    .transform((val) => (val === null ? undefined : val)),
});

/**
 * Update Staff Schema
 * Partial version of CreateStaffSchema
 */
export const updateStaffSchema = createStaffSchema.partial();

/**
 * Update Character Role Schema
 * For updating a character role (CharacterStaff junction entity)
 */
export const UpdateCharacterRoleSchema = z.object({
  language: z.string().max(50).optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;
export type UpdateCharacterRoleFormData = z.infer<
  typeof UpdateCharacterRoleSchema
>;

// Export constants for use in components
export { STAFF_CONSTANTS };
