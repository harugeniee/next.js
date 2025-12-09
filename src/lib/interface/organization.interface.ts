/**
 * Organization-related TypeScript interfaces
 * Defines types for organization data structures used throughout the application
 */

/**
 * Organization visibility levels
 */
export type OrganizationVisibility = "public" | "private";

/**
 * Organization status
 */
export type OrganizationStatus = "active" | "inactive" | "suspended";

/**
 * Organization entity from backend
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  logoId?: string;
  visibility: OrganizationVisibility;
  status: OrganizationStatus;
  ownerId: string;
  owner?: {
    id: string;
    username: string;
    avatar?: {
      url: string;
    };
  };
  memberCount: number;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * DTO for creating a new organization
 */
export interface CreateOrganizationDto {
  name: string;
  slug?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  logoId?: string;
  visibility?: OrganizationVisibility;
  // ownerId is set automatically by backend from authenticated user
}

/**
 * DTO for updating an organization
 */
export type UpdateOrganizationDto = Partial<
  Omit<CreateOrganizationDto, "ownerId">
>;
