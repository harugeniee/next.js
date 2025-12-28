import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { UserAPI } from "@/lib/api/users";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from "@/lib/interface/user.interface";
import type { AdvancedQueryParams, PaginationOffset } from "@/lib/types";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching users list with filters
 */
export function useUsers(
  params?: AdvancedQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginationOffset<User>, Error>({
    queryKey: queryKeys.users.list(params),
    queryFn: () =>
      UserAPI.getUsers(
        params || {
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          order: "DESC",
        },
      ),
    enabled: options?.enabled !== false,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single user by ID (Admin)
 */
export function useUser(userId: string) {
  return useQuery<User, Error>({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => UserAPI.getUserById(userId),
    enabled: !!userId,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for user mutations
 */
export function useUserMutations() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const createUserMutation = useMutation<User, Error, CreateUserDto>({
    mutationFn: (data) => UserAPI.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      toast.success(t("users.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("users.createError", "admin"));
    },
  });

  const updateUserMutation = useMutation<
    User,
    Error,
    { id: string; data: UpdateUserDto }
  >({
    mutationFn: ({ id, data }) => UserAPI.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(data.id),
      });
      toast.success(t("users.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("users.updateError", "admin"));
    },
  });

  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: (id) => UserAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      toast.success(t("users.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("users.deleteError", "admin"));
    },
  });

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
  };
}
