import type { BaseEntityCustom } from "./base.interface";
import type { AdvancedQueryParams } from "@/lib/types";
import type { ApiResponseOffset } from "@/lib/types/response";

/**
 * Content type for key-value pairs
 */
export type ContentType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array";

/**
 * Key-value status
 */
export type KeyValueStatus = "active" | "expired" | "deleted";

/**
 * Key-Value entity interface
 * Represents a flexible key-value storage system for various application data
 */
export interface KeyValue extends BaseEntityCustom {
  /**
   * Unique key identifier
   * Must be unique within a namespace
   */
  key: string;

  /**
   * Flexible value storage
   * Can store any JSON-serializable data
   */
  value: unknown;

  /**
   * Optional namespace for grouping keys
   * Allows logical separation of key spaces
   */
  namespace?: string;

  /**
   * Optional TTL for automatic expiration
   * Entries are automatically marked as expired when this time is reached
   */
  expiresAt?: Date | string;

  /**
   * Additional metadata for the key-value pair
   * Can store tags, version info, or other contextual data
   */
  metadata?: Record<string, unknown>;

  /**
   * Content type hint for the value
   * Helps with type inference and validation
   */
  contentType?: ContentType;

  /**
   * Status for lifecycle management
   * Controls visibility and behavior of the key-value pair
   */
  status: KeyValueStatus;
}

/**
 * DTO for creating a new key-value pair
 */
export interface CreateKeyValueDto {
  /**
   * Unique key identifier
   */
  key: string;

  /**
   * Value to store (any JSON-serializable data)
   */
  value: unknown;

  /**
   * Optional namespace for grouping keys
   */
  namespace?: string;

  /**
   * Optional expiration timestamp (ISO 8601)
   */
  expiresAt?: string;

  /**
   * Additional metadata for the key-value pair
   */
  metadata?: Record<string, unknown>;

  /**
   * Content type hint for the value
   */
  contentType?: ContentType;
}

/**
 * DTO for updating an existing key-value pair
 */
export interface UpdateKeyValueDto {
  /**
   * New value to store (any JSON-serializable data)
   */
  value?: unknown;

  /**
   * New expiration timestamp (ISO 8601)
   */
  expiresAt?: string;

  /**
   * Updated metadata for the key-value pair
   */
  metadata?: Record<string, unknown>;

  /**
   * Updated content type hint
   */
  contentType?: ContentType;
}

/**
 * DTO for querying key-value pairs with advanced filtering and pagination
 */
export interface QueryKeyValueDto extends AdvancedQueryParams {
  /**
   * Filter by namespace
   */
  namespace?: string;

  /**
   * Pattern to match keys (supports SQL LIKE patterns)
   */
  keyPattern?: string;

  /**
   * Filter by key-value status
   */
  kvStatus?: "active" | "expired" | "all";

  /**
   * Filter by content type
   */
  contentType?: ContentType;

  /**
   * Whether to include expired entries
   */
  includeExpired?: string;
}

/**
 * Paginated response for key-value list
 */
export interface KeyValueListResponse {
  result: KeyValue[];
  metaData: {
    currentPage?: number;
    totalPages?: number;
    totalRecords?: number;
    pageSize?: number;
    nextCursor?: string | null;
    hasNextPage?: boolean;
  };
}

/**
 * Response type for key-value API calls
 */
export type KeyValueApiResponse = ApiResponseOffset<KeyValue>;

