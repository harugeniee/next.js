import { z } from "zod";

/**
 * Zod schema for creating a new genre.
 * Matches the CreateGenreDto from the backend.
 */
export const createGenreSchema = z.object({
  slug: z
    .string()
    .min(1, "Genre slug is required")
    .max(255, "Genre slug cannot exceed 255 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Genre slug must contain only lowercase letters, numbers, and hyphens",
    ),

  name: z
    .string()
    .min(1, "Genre name is required")
    .max(255, "Genre name cannot exceed 255 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  icon: z.string().max(255, "Icon URL cannot exceed 255 characters").optional(),

  color: z
    .string()
    .max(50, "Color code cannot exceed 50 characters")
    .optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .optional(),

  isNsfw: z.boolean().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for updating an existing genre.
 * All fields are optional since updates can be partial.
 * Matches the UpdateGenreDto from the backend.
 */
export const updateGenreSchema = z.object({
  slug: z
    .string()
    .min(1, "Genre slug is required")
    .max(255, "Genre slug cannot exceed 255 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Genre slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),

  name: z
    .string()
    .min(1, "Genre name is required")
    .max(255, "Genre name cannot exceed 255 characters")
    .optional(),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  icon: z.string().max(255, "Icon URL cannot exceed 255 characters").optional(),

  color: z
    .string()
    .max(50, "Color code cannot exceed 50 characters")
    .optional(),

  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .optional(),

  isNsfw: z.boolean().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for querying genres.
 * Used for search and filter parameters.
 */
export const queryGenreSchema = z.object({
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

  slug: z
    .string()
    .max(255, "Slug filter cannot exceed 255 characters")
    .optional(),

  name: z
    .string()
    .max(255, "Name filter cannot exceed 255 characters")
    .optional(),

  isNsfw: z.boolean().optional(),

  hasIcon: z.boolean().optional(),

  hasColor: z.boolean().optional(),
});

export type CreateGenreFormData = z.infer<typeof createGenreSchema>;
export type UpdateGenreFormData = z.infer<typeof updateGenreSchema>;
export type QueryGenreFormData = z.infer<typeof queryGenreSchema>;
