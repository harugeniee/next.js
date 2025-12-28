import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { PermissionsAPI } from "@/lib/api/permissions";
import type {
  Role,
  UserRole,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
} from "@/lib/interface/permission.interface";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching all roles
 */
export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: queryKeys.permissions.roles.all(),
    queryFn: () => PermissionsAPI.getAllRoles(),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single role by ID
 */
export function useRole(roleId: string) {
  return useQuery<Role, Error>({
    queryKey: queryKeys.permissions.roles.detail(roleId),
    queryFn: () => PermissionsAPI.getRole(roleId),
    enabled: !!roleId,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching user's roles
 */
export function useUserRoles(userId: string) {
  return useQuery<UserRole[], Error>({
    queryKey: queryKeys.permissions.userRoles.byUser(userId),
    queryFn: () => PermissionsAPI.getUserRoles(userId),
    enabled: !!userId,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching users with a specific role
 */
export function useUsersWithRole(roleId: string) {
  return useQuery<UserRole[], Error>({
    queryKey: queryKeys.permissions.userRoles.byRole(roleId),
    queryFn: () => PermissionsAPI.getUsersWithRole(roleId),
    enabled: !!roleId,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for role mutations (create, update, delete)
 */
export function useRoleMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const createRoleMutation = useMutation<Role, Error, CreateRoleDto>({
    mutationFn: (data) => PermissionsAPI.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.roles.all(),
      });
      toast.success(t("createSuccess", "permissions"));
    },
    onError: (error) => {
      toast.error(error.message || t("createError", "permissions"));
    },
  });

  const updateRoleMutation = useMutation<
    Role,
    Error,
    { id: string; data: UpdateRoleDto }
  >({
    mutationFn: ({ id, data }) => PermissionsAPI.updateRole(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.roles.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.roles.detail(data.id),
      });
      toast.success(t("updateSuccess", "permissions"));
    },
    onError: (error) => {
      toast.error(error.message || t("updateError", "permissions"));
    },
  });

  const deleteRoleMutation = useMutation<void, Error, string>({
    mutationFn: (id) => PermissionsAPI.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.roles.all(),
      });
      toast.success(t("deleteSuccess", "permissions"));
    },
    onError: (error) => {
      toast.error(error.message || t("deleteError", "permissions"));
    },
  });

  return {
    createRole: createRoleMutation,
    updateRole: updateRoleMutation,
    deleteRole: deleteRoleMutation,
  };
}

/**
 * Hook for user-role mutations (assign, remove)
 */
export function useUserRoleMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const assignRoleMutation = useMutation<UserRole, Error, AssignRoleDto>({
    mutationFn: (data) => PermissionsAPI.assignRole(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.userRoles.byUser(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.userRoles.byRole(data.roleId),
      });
      toast.success(t("assignRole.success", "permissions"));
    },
    onError: (error) => {
      toast.error(error.message || t("assignRole.error", "permissions"));
    },
  });

  const removeRoleMutation = useMutation<
    void,
    Error,
    { userId: string; roleId: string }
  >({
    mutationFn: ({ userId, roleId }) =>
      PermissionsAPI.removeRole(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.userRoles.byUser(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.userRoles.byRole(variables.roleId),
      });
      toast.success(t("removeRole.success", "permissions"));
    },
    onError: (error) => {
      toast.error(error.message || t("removeRole.error", "permissions"));
    },
  });

  return {
    assignRole: assignRoleMutation,
    removeRole: removeRoleMutation,
  };
}

