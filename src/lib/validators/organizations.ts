import { z } from "zod";

/**
 * Organization form validation schemas
 * Centralized validation logic for all organization-related forms
 */

// ============================================================================
// Base Validation Schemas
// ============================================================================

// Organization name validation (1-100 characters)
const organizationNameSchema = z
  .string()
  .min(1, "Organization name is required")
  .max(100, "Organization name must be less than 100 characters")
  .trim();

// Organization slug validation (optional, max 100 characters, URL-friendly)
const organizationSlugSchema = z
  .string()
  .max(100, "Slug must be less than 100 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  )
  .optional()
  .or(z.literal(""));

// Organization description validation (optional, max 500 characters)
const organizationDescriptionSchema = z
  .string()
  .max(500, "Description must be less than 500 characters")
  .optional()
  .or(z.literal(""));

// Website URL validation (optional, must be valid URL)
const websiteUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .max(512, "Website URL must be less than 512 characters")
  .optional()
  .or(z.literal(""));

// Logo URL validation (optional, must be valid URL)
const logoUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .max(512, "Logo URL must be less than 512 characters")
  .optional()
  .or(z.literal(""));

// Logo ID validation (optional, must be a valid string)
const logoIdSchema = z
  .string()
  .min(1, "Logo ID must not be empty")
  .optional()
  .or(z.literal(""));

// Visibility enum validation
const visibilitySchema = z.enum(["public", "private"]).optional();

// ============================================================================
// Organization Forms
// ============================================================================

/**
 * Create organization form validation schema
 * Used for organization registration
 */
export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
  slug: organizationSlugSchema,
  description: organizationDescriptionSchema,
  websiteUrl: websiteUrlSchema,
  logoUrl: logoUrlSchema,
  logoId: logoIdSchema,
  visibility: visibilitySchema,
});

/**
 * Update organization form validation schema
 * Used for editing organization details
 */
export const updateOrganizationSchema = createOrganizationSchema.partial();

// ============================================================================
// Type Exports
// ============================================================================

export type CreateOrganizationFormData = z.infer<
  typeof createOrganizationSchema
>;
export type UpdateOrganizationFormData = z.infer<
  typeof updateOrganizationSchema
>;
