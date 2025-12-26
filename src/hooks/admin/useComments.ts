import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  useDeleteComment as useDeleteCommentBase,
  usePinComment as usePinCommentBase,
  useUpdateComment as useUpdateCommentBase,
} from "@/hooks/comments";
import type { QueryCommentsDto } from "@/lib/api/comments";
import { CommentsAPI } from "@/lib/api/comments";
import type { GetCommentDto } from "@/lib/types/comments";
import { queryKeys } from "@/lib/utils/query-keys";

const STALE_TIME_5_MIN = 5 * 60 * 1000;
const GC_TIME_10_MIN = 10 * 60 * 1000;

/**
 * Admin hook for fetching comments list with pagination and filters
 * Uses admin-specific query keys for better cache management
 */
export function useComments(params?: GetCommentDto) {
  return useQuery({
    queryKey: queryKeys.comments.admin.list(params),
    queryFn: () => CommentsAPI.getComments(params as QueryCommentsDto),
    enabled: params !== undefined,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Admin hook for fetching comment statistics overview
 * Returns comprehensive aggregate statistics across all comments
 */
export function useCommentsStatistics() {
  return useQuery({
    queryKey: queryKeys.comments.admin.statistics(),
    queryFn: () => CommentsAPI.getCommentStatsOverview(),
    enabled: true,
    staleTime: STALE_TIME_5_MIN,
    gcTime: GC_TIME_10_MIN,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Admin hook for deleting a comment
 * Reuses base hook with admin-specific cache invalidation
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();
  const baseMutation = useDeleteCommentBase();

  return {
    ...baseMutation,
    mutate: (
      commentId: string,
      options?: Parameters<typeof baseMutation.mutate>[1],
    ) => {
      baseMutation.mutate(commentId, {
        ...options,
        onSuccess: (data, variables, context) => {
          // Invalidate admin-specific queries
          queryClient.invalidateQueries({
            queryKey: queryKeys.comments.admin.all(),
          });
          // Call original onSuccess if provided
          if (options?.onSuccess) {
            options.onSuccess(data, variables, context);
          }
        },
      });
    },
    mutateAsync: async (commentId: string) => {
      const result = await baseMutation.mutateAsync(commentId);
      // Invalidate admin-specific queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.admin.all(),
      });
      return result;
    },
  };
}

/**
 * Admin hook for updating a comment
 * Reuses base hook with admin-specific cache invalidation
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();
  const baseMutation = useUpdateCommentBase();

  return {
    ...baseMutation,
    mutateAsync: async (
      variables: Parameters<typeof baseMutation.mutateAsync>[0],
    ) => {
      const result = await baseMutation.mutateAsync(variables);
      // Invalidate admin-specific queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.admin.all(),
      });
      return result;
    },
  };
}

/**
 * Admin hook for pinning/unpinning a comment
 * Reuses base hook with admin-specific cache invalidation
 */
export function usePinComment() {
  const queryClient = useQueryClient();
  const baseMutation = usePinCommentBase();

  return {
    ...baseMutation,
    mutateAsync: async (variables: { commentId: string; pinned: boolean }) => {
      const result = await baseMutation.mutateAsync(variables);
      // Invalidate admin-specific queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.admin.all(),
      });
      return result;
    },
  };
}

/**
 * Re-export base comment stats hook for subject-specific stats
 * Use this when you need stats for a specific subject (article, segment, etc.)
 */
export { useCommentStatsBase as useCommentStats } from "@/hooks/comments";
