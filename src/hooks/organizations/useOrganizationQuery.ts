import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  OrganizationsAPI,
  type QueryOrganizationsDto,
} from "@/lib/api/organizations";
import type { CreateOrganizationDto } from "@/lib/interface";

/**
 * Query keys for organization queries
 */
export const organizationQueryKeys = {
  all: () => ["organizations"] as const,
  lists: () => [...organizationQueryKeys.all(), "list"] as const,
  list: (params?: QueryOrganizationsDto) =>
    [...organizationQueryKeys.lists(), params] as const,
  details: () => [...organizationQueryKeys.all(), "detail"] as const,
  detail: (id: string) => [...organizationQueryKeys.details(), id] as const,
  bySlug: (slug: string) =>
    [...organizationQueryKeys.all(), "slug", slug] as const,
  myOwned: () => [...organizationQueryKeys.all(), "my", "owned"] as const,
  myMemberships: () =>
    [...organizationQueryKeys.all(), "my", "memberships"] as const,
};

/**
 * Hook for fetching organizations list with filtering and pagination
 * @param params Query parameters for filtering and pagination
 */
export function useOrganizations(params?: QueryOrganizationsDto) {
  return useQuery({
    queryKey: organizationQueryKeys.list(params),
    queryFn: async () => {
      return await OrganizationsAPI.getOrganizations(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single organization by ID
 * @param id Organization ID
 * @param enabled Optional flag to control when the query should run
 */
export function useOrganization(id: string, enabled = true) {
  return useQuery({
    queryKey: organizationQueryKeys.detail(id),
    queryFn: async () => {
      return await OrganizationsAPI.getOrganization(id);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching organization by slug
 * @param slug Organization slug
 * @param enabled Optional flag to control when the query should run
 */
export function useOrganizationBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: organizationQueryKeys.bySlug(slug),
    queryFn: async () => {
      return await OrganizationsAPI.getOrganizationBySlug(slug);
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching organizations owned by the authenticated user
 */
export function useMyOwnedOrganizations() {
  return useQuery({
    queryKey: organizationQueryKeys.myOwned(),
    queryFn: async () => {
      return await OrganizationsAPI.getMyOwnedOrganizations();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching organizations where the authenticated user is a member
 */
export function useMyMemberships() {
  return useQuery({
    queryKey: organizationQueryKeys.myMemberships(),
    queryFn: async () => {
      return await OrganizationsAPI.getMyMemberships();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating an organization
 */
export function useCreateOrganization() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationDto) => {
      return await OrganizationsAPI.createOrganization(data);
    },
    onSuccess: (organization) => {
      // Invalidate and refetch organization lists
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.lists(),
      });
      // Set the new organization in cache
      queryClient.setQueryData(
        organizationQueryKeys.detail(organization.id),
        organization,
      );
      // Invalidate my owned organizations
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.myOwned(),
      });
      toast.success(
        t("organizationCreated", "organizations") ||
          "Organization created successfully",
      );
    },
    onError: (error) => {
      console.error("Create organization error:", error);
      toast.error(
        t("organizationCreateError", "organizations") ||
          "Failed to create organization",
      );
    },
  });
}

/**
 * Hook for updating an organization
 */
export function useUpdateOrganization() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateOrganizationDto>;
    }) => {
      return await OrganizationsAPI.updateOrganization(id, data);
    },
    onSuccess: (organization) => {
      // Update the organization in cache
      queryClient.setQueryData(
        organizationQueryKeys.detail(organization.id),
        organization,
      );
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.lists(),
      });
      toast.success(
        t("organizationUpdated", "organizations") ||
          "Organization updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update organization error:", error);
      toast.error(
        t("organizationUpdateError", "organizations") ||
          "Failed to update organization",
      );
    },
  });
}

/**
 * Hook for deleting an organization
 */
export function useDeleteOrganization() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await OrganizationsAPI.deleteOrganization(id);
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: organizationQueryKeys.detail(id),
      });
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.lists(),
      });
      // Invalidate my owned organizations
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.myOwned(),
      });
      toast.success(
        t("organizationDeleted", "organizations") ||
          "Organization deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete organization error:", error);
      toast.error(
        t("organizationDeleteError", "organizations") ||
          "Failed to delete organization",
      );
    },
  });
}
