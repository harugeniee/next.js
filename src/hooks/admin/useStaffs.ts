import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { StaffsAPI } from "@/lib/api/staffs";
import type { Staff } from "@/lib/interface/staff.interface";
import type {
  CreateStaffDto,
  GetStaffDto,
  LinkCharactersDto,
  StaffListResponse,
  StaffStatistics,
  UpdateCharacterRoleDto,
  UpdateStaffDto,
} from "@/lib/types/staffs";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching staffs list with filters
 */
export function useStaffs(params?: GetStaffDto) {
  return useQuery<StaffListResponse, Error>({
    queryKey: queryKeys.staffs.admin.lists(params),
    queryFn: () => StaffsAPI.getStaffs(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single staff by ID
 */
export function useStaff(id: string) {
  return useQuery<Staff, Error>({
    queryKey: queryKeys.staffs.admin.detail(id),
    queryFn: () => StaffsAPI.getStaffById(id),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching staff statistics
 */
export function useStaffStatistics() {
  return useQuery<StaffStatistics, Error>({
    queryKey: queryKeys.staffs.admin.statistics(),
    queryFn: () => StaffsAPI.getStaffStatistics(),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for creating a new staff member
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Staff, Error, CreateStaffDto>({
    mutationFn: (data) => StaffsAPI.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.all(),
      });
      toast.success(t("staffs.createSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("staffs.createError", "admin"));
    },
  });
}

/**
 * Hook for updating a staff member
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<Staff, Error, { id: string; data: UpdateStaffDto }>({
    mutationFn: ({ id, data }) => StaffsAPI.updateStaff(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.detail(data.id),
      });
      toast.success(t("staffs.updateSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("staffs.updateError", "admin"));
    },
  });
}

/**
 * Hook for deleting a staff member
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, Error, string>({
    mutationFn: (id) => StaffsAPI.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.all(),
      });
      toast.success(t("staffs.deleteSuccess", "admin"));
    },
    onError: (error) => {
      toast.error(error.message || t("staffs.deleteError", "admin"));
    },
  });
}

/**
 * Hook for linking characters to a staff member
 */
export function useLinkCharacters() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: LinkCharactersDto;
    }) => StaffsAPI.linkCharacters(staffId, data),
    onSuccess: (_, variables) => {
      toast.success(t("linkCharactersSuccess", "staff"));
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.detail(variables.staffId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.lists({}),
      });
    },
    onError: () => {
      toast.error(t("linkCharactersError", "staff"));
    },
  });
}

/**
 * Hook for fetching staffs of a specific series
 */
export function useSeriesStaffs(
  seriesId: string,
  params?: Partial<GetStaffDto>,
) {
  return useQuery<StaffListResponse, Error>({
    queryKey: queryKeys.staffs.admin.lists({ ...params, seriesId }),
    queryFn: () => StaffsAPI.getStaffs({ ...params, seriesId }),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!seriesId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for updating a character role
 */
export function useUpdateCharacterRole() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      characterStaffId,
      data,
    }: {
      staffId: string;
      characterStaffId: string;
      data: UpdateCharacterRoleDto;
    }) => StaffsAPI.updateCharacterRole(staffId, characterStaffId, data),
    onSuccess: (_, variables) => {
      toast.success(t("updateSuccess", "staff"));
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.detail(variables.staffId),
      });
    },
    onError: () => {
      toast.error(t("updateError", "staff"));
    },
  });
}

/**
 * Hook for removing a character role
 */
export function useRemoveCharacterRole() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      characterStaffId,
    }: {
      staffId: string;
      characterStaffId: string;
    }) => StaffsAPI.removeCharacterRole(staffId, characterStaffId),
    onSuccess: (_, variables) => {
      toast.success(t("deleteSuccess", "staff"));
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffs.admin.detail(variables.staffId),
      });
    },
    onError: () => {
      toast.error(t("deleteError", "staff"));
    },
  });
}
