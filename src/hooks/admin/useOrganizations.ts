import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { OrganizationsAPI } from "@/lib/api/organizations";
import type {
  CreateOrganizationDto,
  Organization,
  UpdateOrganizationDto,
} from "@/lib/interface/organization.interface";
import type { AdvancedQueryParams, PaginationOffset } from "@/lib/types";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching organizations list with filters (Admin)
 */
export function useOrganizations(params?: AdvancedQueryParams) {
  return useQuery<PaginationOffset<Organization>, Error>({
    queryKey: queryKeys.organizations.list(params),
    queryFn: () =>
      OrganizationsAPI.getOrganizations(
        params || {
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          order: "DESC",
        },
      ),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single organization by ID (Admin)
 */
export function useOrganization(organizationId: string) {
  return useQuery<Organization, Error>({
    queryKey: queryKeys.organizations.detail(organizationId),
    queryFn: () => OrganizationsAPI.getOrganization(organizationId),
    enabled: !!organizationId,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for organization mutations
 */
export function useOrganizationMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const createOrganizationMutation = useMutation<
    Organization,
    Error,
    CreateOrganizationDto
  >({
    mutationFn: (data) => OrganizationsAPI.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.lists(),
      });
      toast.success(t("organizations.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("organizations.createError", "admin"));
    },
  });

  const updateOrganizationMutation = useMutation<
    Organization,
    Error,
    { id: string; data: UpdateOrganizationDto }
  >({
    mutationFn: ({ id, data }) => OrganizationsAPI.updateOrganization(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(data.id),
      });
      toast.success(t("organizations.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("organizations.updateError", "admin"));
    },
  });

  const deleteOrganizationMutation = useMutation<void, Error, string>({
    mutationFn: (id) => OrganizationsAPI.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.lists(),
      });
      toast.success(t("organizations.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("organizations.deleteError", "admin"));
    },
  });

  return {
    createOrganization: createOrganizationMutation,
    updateOrganization: updateOrganizationMutation,
    deleteOrganization: deleteOrganizationMutation,
  };
}
