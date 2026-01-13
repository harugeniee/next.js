import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ContributionsAPI } from "@/lib/api/contributions";
import type {
  Contribution,
  ContributionListResponse,
  CreateContributionDto,
  QueryContributionDto,
  ReviewContributionDto,
} from "@/lib/types/contributions";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Hook for fetching contributions list with filters
 */
export function useContributions(
  params?: QueryContributionDto,
  enabled: boolean = true,
) {
  return useQuery<ContributionListResponse, Error>({
    queryKey: queryKeys.contributions.list(params),
    queryFn: () => ContributionsAPI.getContributions(params),
    enabled: enabled,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching pending contributions (for admin review)
 */
export function usePendingContributions(params?: QueryContributionDto) {
  return useQuery<ContributionListResponse, Error>({
    queryKey: queryKeys.contributions.pending(params),
    queryFn: () => ContributionsAPI.getPendingContributions(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching current user's contributions
 */
export function useMyContributions(params?: QueryContributionDto) {
  return useQuery<ContributionListResponse, Error>({
    queryKey: queryKeys.contributions.my(params),
    queryFn: () => ContributionsAPI.getMyContributions(params),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single contribution by ID
 */
export function useContribution(id: string) {
  return useQuery<Contribution, Error>({
    queryKey: queryKeys.contributions.detail(id),
    queryFn: () => ContributionsAPI.getContributionById(id),
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    enabled: !!id && id !== "undefined",
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for creating a new contribution
 */
export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation<Contribution, Error, CreateContributionDto>({
    mutationFn: (data) => ContributionsAPI.createContribution(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.all(),
      });
      toast.success("Contribution created successfully");
    },
    onError: (error) => {
      console.error("Create contribution error:", error);
      toast.error(error.message || "Failed to create contribution");
    },
  });
}

/**
 * Hook for approving a contribution (admin only)
 */
export function useApproveContribution() {
  const queryClient = useQueryClient();

  return useMutation<
    Contribution,
    Error,
    { id: string; data?: ReviewContributionDto }
  >({
    mutationFn: ({ id, data }) => ContributionsAPI.approveContribution(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.pending(),
      });
      toast.success("Contribution approved successfully");
    },
    onError: (error) => {
      console.error("Approve contribution error:", error);
      toast.error(error.message || "Failed to approve contribution");
    },
  });
}

/**
 * Hook for rejecting a contribution (admin only)
 */
export function useRejectContribution() {
  const queryClient = useQueryClient();

  return useMutation<
    Contribution,
    Error,
    { id: string; data: ReviewContributionDto }
  >({
    mutationFn: ({ id, data }) => ContributionsAPI.rejectContribution(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contributions.pending(),
      });
      toast.success("Contribution rejected successfully");
    },
    onError: (error) => {
      console.error("Reject contribution error:", error);
      toast.error(error.message || "Failed to reject contribution");
    },
  });
}
