import { z } from "zod";

/**
 * Character validation constants
 * Matching backend CHARACTER_CONSTANTS
 */
const CHARACTER_CONSTANTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  AGE_MAX_LENGTH: 50,
  URL_MAX_LENGTH: 2048,
  NOTES_MAX_LENGTH: 2000,
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
      CHARACTER_CONSTANTS.NAME_MAX_LENGTH,
      `${fieldName} must be less than ${CHARACTER_CONSTANTS.NAME_MAX_LENGTH} characters`,
    );

  return z
    .union([stringSchema, z.null(), z.literal("")])
    .optional()
    .transform((val) => (val === null || val === "" ? undefined : val));
};

/**
 * Character Name Schema
 * Validates character name structure
 * Handles empty strings and null values by converting them to undefined
 */
const characterNameSchema = z
  .object({
    first: createNameFieldSchema("First name"),
    middle: createNameFieldSchema("Middle name"),
    last: createNameFieldSchema("Last name"),
    full: createNameFieldSchema("Full name"),
    native: createNameFieldSchema("Native name"),
    alternative: z.array(z.string()).optional(),
    alternativeSpoiler: z.array(z.string()).optional(),
    userPreferred: createNameFieldSchema("User preferred name"),
  })
  .optional();

/**
 * Create Character Schema
 * Matches backend CreateCharacterDto validation
 */
export const createCharacterSchema = z.object({
  myAnimeListId: z.string().optional(),
  aniListId: z.string().optional(),
  name: characterNameSchema,
  imageId: z.string().optional(),
  description: z
    .string()
    .max(
      CHARACTER_CONSTANTS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${CHARACTER_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`,
    )
    .optional(),
  gender: z.string().optional(),
  dateOfBirth: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return undefined;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string") {
        // Try to parse as date
        const date = new Date(val);
        if (!isNaN(date.getTime())) return date.toISOString();
        return val;
      }
      return val;
    }),
  age: z
    .string()
    .max(
      CHARACTER_CONSTANTS.AGE_MAX_LENGTH,
      `Age must be less than ${CHARACTER_CONSTANTS.AGE_MAX_LENGTH} characters`,
    )
    .optional()
    .nullable(),
  bloodType: z.string().optional().nullable(),
  siteUrl: z
    .string()
    .url("Site URL must be a valid URL")
    .max(
      CHARACTER_CONSTANTS.URL_MAX_LENGTH,
      `Site URL must be less than ${CHARACTER_CONSTANTS.URL_MAX_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(
      CHARACTER_CONSTANTS.NOTES_MAX_LENGTH,
      `Notes must be less than ${CHARACTER_CONSTANTS.NOTES_MAX_LENGTH} characters`,
    )
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  seriesId: z.string().optional(),
});

/**
 * Update Character Schema
 * Partial version of CreateCharacterSchema
 */
export const updateCharacterSchema = createCharacterSchema.partial();

// ============================================================================
// Type Exports
// ============================================================================

export type CreateCharacterFormData = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterFormData = z.infer<typeof updateCharacterSchema>;
