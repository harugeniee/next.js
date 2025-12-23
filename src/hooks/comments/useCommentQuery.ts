import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { CommentsAPI } from "@/lib/api/comments";
import type {
  BatchCommentsDto,
  CreateCommentDto,
  QueryCommentsCursorDto,
  QueryCommentsDto,
  UpdateCommentDto,
} from "@/lib/api/comments";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching comments with pagination and filtering
 */
export function useComments(params?: QueryCommentsDto) {
  return useQuery({
    queryKey: queryKeys.comments.list(params),
    queryFn: () => CommentsAPI.getComments(params),
    enabled: params !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching comments with cursor-based infinite scroll
 * Better for real-time feeds and infinite scroll
 * @param subjectType - Type of subject (e.g., "segment", "article")
 * @param subjectId - ID of the subject
 * @param parentId - Optional parent comment ID for replies
 * @param enabled - Whether to enable the query
 * @param options - Additional filter options
 */
export function useCommentsInfinite(
  subjectType: string,
  subjectId: string,
  options?: {
    parentId?: string;
    enabled?: boolean;
    type?: string;
    pinned?: boolean;
    edited?: boolean;
    visibility?: string;
    includeMedia?: boolean;
    includeMentions?: boolean;
    limit?: number;
    sortBy?: string;
    order?: "ASC" | "DESC";
  },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments.cursor(
      subjectType,
      subjectId,
      undefined,
    ),
    queryFn: async ({ pageParam }) => {
      const params: QueryCommentsCursorDto = {
        subjectType,
        subjectId,
        parentId: options?.parentId,
        cursor: pageParam as string | undefined,
        limit: options?.limit || 20,
        sortBy: options?.sortBy || "createdAt",
        order: options?.order || "DESC",
        type: options?.type,
        pinned: options?.pinned,
        edited: options?.edited,
        visibility: options?.visibility,
        includeMedia: options?.includeMedia ?? true,
        includeMentions: options?.includeMentions ?? true,
      };
      const response = await CommentsAPI.getCommentsCursor(params);
      return response.data;
    },
    enabled:
      (options?.enabled !== false &&
        !!subjectType &&
        !!subjectId &&
        subjectId !== "undefined" &&
        subjectId !== "null") ||
      false,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // Return next cursor if available, otherwise undefined to stop pagination
      return lastPage.metaData.nextCursor ?? undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching a single comment by ID
 */
export function useComment(
  commentId: string,
  options?: {
    includeReplies?: boolean;
    includeAttachments?: boolean;
    includeMentions?: boolean;
  },
) {
  return useQuery({
    queryKey: queryKeys.comments.detail(commentId, options),
    queryFn: () => CommentsAPI.getComment(commentId, options),
    enabled: !!commentId && commentId !== "undefined" && commentId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

/**
 * Hook for fetching comment replies
 */
export function useCommentReplies(
  commentId: string,
  params?: Omit<QueryCommentsDto, "parentId">,
) {
  return useQuery({
    queryKey: queryKeys.comments.replies(commentId, params),
    queryFn: () => CommentsAPI.getCommentReplies(commentId, params),
    enabled: !!commentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching comment statistics
 */
export function useCommentStats(subjectType: string, subjectId: string) {
  return useQuery({
    queryKey: queryKeys.comments.stats(subjectType, subjectId),
    queryFn: () => CommentsAPI.getCommentStats(subjectType, subjectId),
    enabled: !!subjectType && !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching comments in batch
 */
export function useCommentsBatch(data: BatchCommentsDto) {
  return useQuery({
    queryKey: queryKeys.comments.batch(data),
    queryFn: () => CommentsAPI.getCommentsBatch(data),
    enabled: data.subjectIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for creating a comment
 */
export function useCreateComment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => CommentsAPI.createComment(data),
    onSuccess: (response, variables) => {
      // Invalidate comments list for the subject
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list({
          subjectType: variables.subjectType,
          subjectId: variables.subjectId,
        }),
      });

      // Invalidate cursor-based comments list for the subject
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.cursor(
          variables.subjectType,
          variables.subjectId,
        ),
      });

      // Invalidate comment stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.stats(
          variables.subjectType,
          variables.subjectId,
        ),
      });

      // If it's a reply, invalidate parent comment replies
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.replies(variables.parentId),
        });
      }

      toast.success(
        t("commentCreated", "comments") || "Comment created successfully",
      );
    },
    onError: (error) => {
      console.error("Create comment error:", error);
      toast.error(
        t("commentCreateError", "comments") || "Failed to create comment",
      );
    },
  });
}

/**
 * Hook for updating a comment
 */
export function useUpdateComment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: UpdateCommentDto;
    }) => CommentsAPI.updateComment(commentId, data),
    onSuccess: (response, variables) => {
      // Update comment in cache
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        response.data,
      );

      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });

      // Invalidate cursor-based comments (will invalidate all cursor queries)
      queryClient.invalidateQueries({
        queryKey: ["comments", "cursor"],
      });

      toast.success(
        t("commentUpdated", "comments") || "Comment updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update comment error:", error);
      toast.error(
        t("commentUpdateError", "comments") || "Failed to update comment",
      );
    },
  });
}

/**
 * Hook for deleting a comment
 */
export function useDeleteComment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => CommentsAPI.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Remove comment from cache
      queryClient.removeQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });

      // Invalidate cursor-based comments (will invalidate all cursor queries)
      queryClient.invalidateQueries({
        queryKey: ["comments", "cursor"],
      });

      toast.success(
        t("commentDeleted", "comments") || "Comment deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete comment error:", error);
      toast.error(
        t("commentDeleteError", "comments") || "Failed to delete comment",
      );
    },
  });
}

/**
 * Hook for pinning/unpinning a comment
 */
export function usePinComment() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      pinned,
    }: {
      commentId: string;
      pinned: boolean;
    }) => CommentsAPI.togglePin(commentId, pinned),
    onSuccess: (response, variables) => {
      // Update comment in cache
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        response.data,
      );

      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });

      // Invalidate cursor-based comments (will invalidate all cursor queries)
      queryClient.invalidateQueries({
        queryKey: ["comments", "cursor"],
      });

      toast.success(
        variables.pinned
          ? t("commentPinned", "comments") || "Comment pinned"
          : t("commentUnpinned", "comments") || "Comment unpinned",
      );
    },
    onError: (error) => {
      console.error("Pin comment error:", error);
      toast.error(
        t("commentPinError", "comments") ||
          "Failed to update comment pin status",
      );
    },
  });
}
