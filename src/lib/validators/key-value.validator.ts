import { z } from "zod";

/**
 * Key-Value validation constants
 */
const KEY_VALUE_CONSTANTS = {
  KEY_MIN_LENGTH: 1,
  KEY_MAX_LENGTH: 255,
  NAMESPACE_MAX_LENGTH: 255,
  CONTENT_TYPE_MAX_LENGTH: 50,
} as const;

/**
 * Content type enum for validation
 */
const contentTypeEnum = z.enum([
  "string",
  "number",
  "boolean",
  "object",
  "array",
]);

/**
 * Key validation regex - allows alphanumeric, hyphens, underscores, and colons
 */
const keyRegex = /^[a-zA-Z0-9_:-]+$/;

/**
 * Namespace validation regex - same as key
 */
const namespaceRegex = /^[a-zA-Z0-9_:-]+$/;

/**
 * Create Key-Value Schema
 * Matches the CreateKeyValueDto from the backend
 */
export const createKeyValueSchema = z.object({
  key: z
    .string()
    .min(KEY_VALUE_CONSTANTS.KEY_MIN_LENGTH, "Key is required")
    .max(
      KEY_VALUE_CONSTANTS.KEY_MAX_LENGTH,
      `Key must be less than ${KEY_VALUE_CONSTANTS.KEY_MAX_LENGTH} characters`,
    )
    .regex(
      keyRegex,
      "Key must contain only alphanumeric characters, hyphens, underscores, and colons",
    )
    .trim(),

  value: z
    .string()
    .min(1, "Value is required")
    .refine(
      (val) => {
        // Allow any JSON-serializable value
        // Try to parse as JSON first, if it fails, allow as string
        try {
          JSON.parse(val);
          return true;
        } catch {
          // If not valid JSON, allow as plain string
          return val.trim().length > 0;
        }
      },
      {
        message: "Value is required",
      },
    ),

  namespace: z
    .string()
    .max(
      KEY_VALUE_CONSTANTS.NAMESPACE_MAX_LENGTH,
      `Namespace must be less than ${KEY_VALUE_CONSTANTS.NAMESPACE_MAX_LENGTH} characters`,
    )
    .regex(
      namespaceRegex,
      "Namespace must contain only alphanumeric characters, hyphens, underscores, and colons",
    )
    .trim()
    .optional(),

  expiresAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        // Allow empty string or valid datetime
        if (!val || val.trim() === "") return true;
        try {
          // Try to parse as datetime-local format (YYYY-MM-DDTHH:mm)
          const date = new Date(val);
          return !isNaN(date.getTime());
        } catch {
          return false;
        }
      },
      {
        message: "Expiration date must be a valid datetime",
      },
    ),

  metadata: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        // Allow empty string or valid JSON object
        if (!val || val.trim() === "") return true;
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === "object" && parsed !== null;
        } catch {
          return false;
        }
      },
      {
        message: "Metadata must be a valid JSON object",
      },
    ),

  contentType: contentTypeEnum.optional(),
});

/**
 * Update Key-Value Schema
 * All fields are optional since updates can be partial
 * Matches the UpdateKeyValueDto from the backend
 */
export const updateKeyValueSchema = z.object({
  value: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If value is provided, it must be valid
        if (!val || val.trim() === "") return true;
        // Allow any JSON-serializable value
        try {
          JSON.parse(val);
          return true;
        } catch {
          // If not valid JSON, allow as plain string
          return val.trim().length > 0;
        }
      },
      {
        message: "Value must be JSON-serializable",
      },
    ),

  expiresAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        // Allow empty string or valid datetime
        if (!val || val.trim() === "") return true;
        try {
          // Try to parse as datetime-local format (YYYY-MM-DDTHH:mm)
          const date = new Date(val);
          return !isNaN(date.getTime());
        } catch {
          return false;
        }
      },
      {
        message: "Expiration date must be a valid datetime",
      },
    ),

  metadata: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        // Allow empty string or valid JSON object
        if (!val || val.trim() === "") return true;
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === "object" && parsed !== null;
        } catch {
          return false;
        }
      },
      {
        message: "Metadata must be a valid JSON object",
      },
    ),

  contentType: contentTypeEnum.optional(),
});

/**
 * Query Key-Value Schema
 * Used for search and filter parameters
 */
export const queryKeyValueSchema = z.object({
  page: z
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .optional(),

  limit: z
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional(),

  sortBy: z.string().optional(),

  order: z.enum(["ASC", "DESC"]).optional(),

  query: z.string().optional(),

  namespace: z
    .string()
    .max(
      KEY_VALUE_CONSTANTS.NAMESPACE_MAX_LENGTH,
      `Namespace filter cannot exceed ${KEY_VALUE_CONSTANTS.NAMESPACE_MAX_LENGTH} characters`,
    )
    .optional(),

  keyPattern: z
    .string()
    .max(255, "Key pattern cannot exceed 255 characters")
    .optional(),

  kvStatus: z.enum(["active", "expired", "all"]).optional(),

  contentType: contentTypeEnum.optional(),

  includeExpired: z.string().optional(),
});

export type CreateKeyValueFormData = z.infer<typeof createKeyValueSchema>;
export type UpdateKeyValueFormData = z.infer<typeof updateKeyValueSchema>;
export type QueryKeyValueFormData = z.infer<typeof queryKeyValueSchema>;

