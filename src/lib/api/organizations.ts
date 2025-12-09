import { http } from "@/lib/http";
import type {
  ApiResponse,
  ApiResponseOffset,
  QueryParamsWithOffset,
} from "@/lib/types";
import type { Organization, CreateOrganizationDto } from "@/lib/interface";

/**
 * Query parameters for fetching organizations
 */
export interface QueryOrganizationsDto extends QueryParamsWithOffset {
  search?: string;
  visibility?: "public" | "private";
  status?: "active" | "inactive" | "suspended";
  ownerId?: string;
  memberId?: string;
}

/**
 * Organizations API wrapper
 * Handles all organization-related API calls
 */
export class OrganizationsAPI {
  private static readonly BASE_URL = "/organizations";

  /**
   * Create a new organization
   * Requires authentication
   * @param data Organization creation data
   */
  static async createOrganization(
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    const response = await http.post<ApiResponse<Organization>>(
      this.BASE_URL,
      data,
    );
    return response.data.data;
  }

  /**
   * Get all organizations with filtering and pagination
   * Public endpoint - anyone can view public organizations
   * @param params Query parameters for filtering and pagination
   */
  static async getOrganizations(
    params?: QueryOrganizationsDto,
  ): Promise<ApiResponseOffset<Organization>> {
    const response = await http.get<ApiResponseOffset<Organization>>(
      this.BASE_URL,
      { params },
    );
    return response.data;
  }

  /**
   * Get organization by ID
   * Public endpoint - anyone can view public organizations
   * @param id Organization ID
   */
  static async getOrganization(id: string): Promise<Organization> {
    const response = await http.get<ApiResponse<Organization>>(
      `${this.BASE_URL}/${id}`,
    );
    return response.data.data;
  }

  /**
   * Get organization by slug
   * Public endpoint for SEO-friendly URLs
   * @param slug Organization slug
   */
  static async getOrganizationBySlug(slug: string): Promise<Organization> {
    const response = await http.get<ApiResponse<Organization>>(
      `${this.BASE_URL}/slug/${slug}`,
    );
    return response.data.data;
  }

  /**
   * Update an organization
   * Requires authentication and ORGANIZATION_MANAGE_SETTINGS permission
   * @param id Organization ID
   * @param data Update data
   */
  static async updateOrganization(
    id: string,
    data: Partial<CreateOrganizationDto>,
  ): Promise<Organization> {
    const response = await http.patch<ApiResponse<Organization>>(
      `${this.BASE_URL}/${id}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete an organization (soft delete)
   * Requires authentication and ORGANIZATION_DELETE permission
   * @param id Organization ID
   */
  static async deleteOrganization(id: string): Promise<void> {
    await http.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get organizations owned by the authenticated user
   * Requires authentication
   */
  static async getMyOwnedOrganizations(): Promise<Organization[]> {
    const response = await http.get<ApiResponse<Organization[]>>(
      `${this.BASE_URL}/my/owned`,
    );
    return response.data.data;
  }

  /**
   * Get organizations where the authenticated user is a member
   * Requires authentication
   */
  static async getMyMemberships(): Promise<Organization[]> {
    const response = await http.get<ApiResponse<Organization[]>>(
      `${this.BASE_URL}/my/membership`,
    );
    return response.data.data;
  }
}
