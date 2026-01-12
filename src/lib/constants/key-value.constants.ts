/**
 * Key-Value Store Constants
 *
 * Defines constants for the key-value storage functionality
 * Provides flexible storage for various application data types
 */

// Content type hints for key-value pairs
export const CONTENT_TYPES = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "json",
  "xml",
  "html",
  "markdown",
] as const;

// Derive ContentType from the constant array
export type ContentType = (typeof CONTENT_TYPES)[number];

// Key-value status for lifecycle management
export const KEY_VALUE_STATUS = ["active", "expired", "deleted"] as const;

export type KeyValueStatus = (typeof KEY_VALUE_STATUS)[number];
