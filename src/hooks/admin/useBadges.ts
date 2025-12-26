import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { BadgesAPI } from "@/lib/api/badges";
import type {
  AssignBadgeDto,
  Badge,
  BadgeAssignment,
  BadgeAssignmentListResponse,
  BadgeListResponse,
  BadgeStatistics,
  CreateBadgeDto,
  GetBadgeAssignmentDto,
  GetBadgeDto,
  RevokeBadgeDto,
  UpdateBadgeDto,
} from "@/lib/types/badges";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching badges list with filters
 */
export function useBadges(params?: GetBadgeDto) {
  return useQuery<BadgeListResponse, Error>({
    queryKey: queryKeys.badges.lists(params),
    queryFn: () => BadgesAPI.getBadges(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single badge by ID
 */
export function useBadge(id: string) {
  return useQuery<Badge, Error>({
    queryKey: queryKeys.badges.detail(id),
    queryFn: () => BadgesAPI.getBadgeById(id),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching badge statistics
 */
export function useBadgeStatistics() {
  return useQuery<BadgeStatistics, Error>({
    queryKey: queryKeys.badges.statistics(),
    queryFn: () => BadgesAPI.getBadgeStatistics(),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching badge assignments with filters
 */
export function useBadgeAssignments(params?: GetBadgeAssignmentDto) {
  return useQuery<BadgeAssignmentListResponse, Error>({
    queryKey: queryKeys.badges.assignments(params),
    queryFn: () => BadgesAPI.getBadgeAssignments(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for creating a new badge
 */
export function useCreateBadge() {
  const queryClient = useQueryClient();

  return useMutation<Badge, Error, CreateBadgeDto>({
    mutationFn: (data) => BadgesAPI.createBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.badges.all() });
      toast.success("Badge created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create badge");
    },
  });
}

/**
 * Hook for updating a badge
 */
export function useUpdateBadge() {
  const queryClient = useQueryClient();

  return useMutation<
    Badge,
    Error,
    { id: string; data: UpdateBadgeDto }
  >({
    mutationFn: ({ id, data }) => BadgesAPI.updateBadge(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.badges.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.badges.detail(data.id),
      });
      toast.success("Badge updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update badge");
    },
  });
}

/**
 * Hook for deleting a badge
 */
export function useDeleteBadge() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => BadgesAPI.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.badges.all() });
      toast.success("Badge deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete badge");
    },
  });
}

/**
 * Hook for assigning a badge to an entity
 */
export function useAssignBadge() {
  const queryClient = useQueryClient();

  return useMutation<BadgeAssignment, Error, AssignBadgeDto>({
    mutationFn: (data) => BadgesAPI.assignBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.badges.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.badges.assignments(),
      });
      toast.success("Badge assigned successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign badge");
    },
  });
}

/**
 * Hook for revoking a badge assignment
 */
export function useRevokeBadge() {
  const queryClient = useQueryClient();

  return useMutation<
    BadgeAssignment,
    Error,
    { assignmentId: string; data: RevokeBadgeDto }
  >({
    mutationFn: ({ assignmentId, data }) =>
      BadgesAPI.revokeBadge(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.badges.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.badges.assignments(),
      });
      toast.success("Badge revoked successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revoke badge");
    },
  });
}

