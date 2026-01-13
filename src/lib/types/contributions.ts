/**
 * Contributions System TypeScript Types
 * Matches backend DTOs and entities from backend/src/contributions
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Entity types that can be contributed
 */
export enum ContributionEntityType {
  SERIES = "series",
  SEGMENT = "segment",
  CHARACTER = "character",
  STAFF = "staff",
}

/**
 * Contribution actions
 */
export enum ContributionAction {
  CREATE = "create",
  UPDATE = "update",
}

/**
 * Contribution status
 */
export enum ContributionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// ============================================================================
// Base Entity Interface
// ============================================================================

/**
 * Base entity with common fields
 */
export interface BaseEntityCustom {
  id: string;
  uuid: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  version: number;
}

/**
 * User interface (minimal for contributor/reviewer)
 */
export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
}

// ============================================================================
// Contribution Entity
// ============================================================================

/**
 * Contribution Entity
 * Matches backend/src/contributions/entities/contribution.entity.ts
 */
export interface Contribution extends BaseEntityCustom {
  entityType: ContributionEntityType | string;
  entityId?: string | null;
  action: ContributionAction | string;
  proposedData: Record<string, unknown>;
  originalData?: Record<string, unknown> | null;
  status: ContributionStatus | string;
  contributorId: string;
  reviewerId?: string | null;
  rejectionReason?: string | null;
  adminNotes?: string | null;
  contributorNote?: string | null;
  reviewedAt?: Date | string | null;
  contributor?: User;
  reviewer?: User;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Query parameters for listing contributions
 * Extends AdvancedPaginationDto from backend
 */
export interface QueryContributionDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  entityType?: ContributionEntityType | string;
  action?: ContributionAction | string;
  contributorId?: string;
  entityId?: string;
  status?: ContributionStatus | string;
  query?: string;
}

/**
 * DTO for creating a new contribution
 */
export interface CreateContributionDto {
  entityType: ContributionEntityType | string;
  entityId?: string;
  action: ContributionAction | string;
  proposedData: Record<string, unknown>;
  contributorNote?: string;
}

/**
 * DTO for reviewing a contribution (approve/reject)
 */
export interface ReviewContributionDto {
  adminNotes?: string;
  rejectionReason?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Paginated list response for contributions
 */
export interface ContributionListResponse {
  result: Contribution[];
  metaData: {
    currentPage?: number;
    pageSize: number;
    totalRecords?: number;
    totalPages?: number;
    hasNextPage?: boolean;
  };
}
