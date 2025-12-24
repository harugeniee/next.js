import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { useCurrentUser } from "@/hooks/auth";
import type {
  BatchCommentsDto,
  Comment,
  CreateCommentDto,
  QueryCommentsCursorDto,
  QueryCommentsDto,
  UpdateCommentDto,
} from "@/lib/api/comments";
import { CommentsAPI } from "@/lib/api/comments";
import type { ApiResponseOffset, PaginationCursor } from "@/lib/types";
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
    includeReplies?: boolean;
    includeMedia?: boolean;
    includeMentions?: boolean;
    limit?: number;
    sortBy?: string;
    order?: "ASC" | "DESC";
  },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments.cursor(subjectType, subjectId, undefined),
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
        includeReplies: options?.includeReplies ?? false,
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
  params?: Omit<QueryCommentsDto, "parentId"> & { enabled?: boolean },
) {
  const enabled = params?.enabled;
  // Extract queryParams without enabled field
  const queryParams: Omit<QueryCommentsDto, "parentId"> | undefined = params
    ? (({ ...rest }) => rest)(params)
    : undefined;

  return useQuery({
    queryKey: queryKeys.comments.replies(commentId, queryParams),
    queryFn: () => CommentsAPI.getCommentReplies(commentId, queryParams),
    enabled: enabled === true && !!commentId,
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
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => CommentsAPI.createComment(data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.cursor(
          variables.subjectType,
          variables.subjectId,
        ),
      });

      // If it's a reply, also cancel replies queries (all params variations)
      if (variables.parentId) {
        await queryClient.cancelQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[0] === "comments" &&
              key[1] === "replies" &&
              key[2] === variables.parentId
            );
          },
        });
      }

      // Snapshot previous values for rollback
      const previousCursorData = queryClient.getQueryData(
        queryKeys.comments.cursor(variables.subjectType, variables.subjectId),
      );

      const previousRepliesData = variables.parentId
        ? queryClient.getQueryData(
            queryKeys.comments.replies(variables.parentId),
          )
        : null;

      // Create optimistic reply object
      if (variables.parentId && currentUser) {
        const optimisticReply: Comment = {
          id: `temp-${Date.now()}`,
          userId: currentUser.id,
          subjectType: variables.subjectType,
          subjectId: variables.subjectId,
          parentId: variables.parentId,
          content: variables.content || "",
          pinned: false,
          edited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            avatar: currentUser.avatar
              ? { url: currentUser.avatar.url || "" }
              : undefined,
          },
          replyCount: 0,
        };

        // Optimistically add reply to replies cache
        // Use query key pattern matching to update all replies queries for this parent
        queryClient.setQueriesData<ApiResponseOffset<Comment>>(
          {
            predicate: (query) => {
              const key = query.queryKey;
              return (
                Array.isArray(key) &&
                key[0] === "comments" &&
                key[1] === "replies" &&
                key[2] === variables.parentId
              );
            },
          },
          (old) => {
            if (!old) {
              return {
                success: true,
                message: "",
                metadata: { messageKey: "", messageArgs: {} },
                data: {
                  result: [optimisticReply],
                  metaData: {
                    currentPage: 1,
                    pageSize: 50,
                    totalRecords: 1,
                    totalPages: 1,
                  },
                },
              };
            }

            return {
              ...old,
              data: {
                ...old.data,
                result: [...(old.data?.result || []), optimisticReply],
                metaData: {
                  ...old.data?.metaData,
                  totalRecords: (old.data?.metaData?.totalRecords || 0) + 1,
                },
              },
            };
          },
        );

        // Optimistically update parent comment's replyCount in cursor queries
        queryClient.setQueryData<InfiniteData<PaginationCursor<Comment>>>(
          queryKeys.comments.cursor(variables.subjectType, variables.subjectId),
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages?.map((page) => ({
                ...page,
                result: page.result?.map((comment) => {
                  if (comment.id === variables.parentId) {
                    return {
                      ...comment,
                      replyCount: (comment.replyCount || 0) + 1,
                    };
                  }
                  return comment;
                }),
              })),
            };
          },
        );
      }

      // Return context with snapshot for potential rollback
      return { previousCursorData, previousRepliesData };
    },
    onSuccess: (response, variables) => {
      // If it's a reply, update the replies cache with the real response
      if (variables.parentId && response.data) {
        // Update all replies queries for this parent with real response data
        queryClient.setQueriesData<ApiResponseOffset<Comment>>(
          {
            predicate: (query) => {
              const key = query.queryKey;
              return (
                Array.isArray(key) &&
                key[0] === "comments" &&
                key[1] === "replies" &&
                key[2] === variables.parentId
              );
            },
          },
          (old) => {
            if (!old) {
              // If cache doesn't exist, create it with the new reply
              return {
                success: true,
                message: "",
                metadata: { messageKey: "", messageArgs: {} },
                data: {
                  result: [response.data],
                  metaData: {
                    currentPage: 1,
                    pageSize: 50,
                    totalRecords: 1,
                    totalPages: 1,
                  },
                },
              };
            }

            // Replace optimistic reply with real one or add if not found
            const result = [...(old.data?.result || [])];
            const optimisticIndex = result.findIndex((r) =>
              r.id?.startsWith("temp-"),
            );

            if (optimisticIndex >= 0) {
              // Replace optimistic reply with real one
              result[optimisticIndex] = response.data;
            } else {
              // Add if not found (optimistic update might not have run)
              // Insert at the end to maintain chronological order (ASC)
              result.push(response.data);
            }

            return {
              ...old,
              data: {
                ...old.data,
                result,
                metaData: {
                  ...old.data.metaData,
                  totalRecords: result.length,
                },
              },
            };
          },
        );

        // Refetch replies queries in background to ensure consistency with server
        // Only refetch if the queries are currently active/enabled
        queryClient.refetchQueries(
          {
            predicate: (query) => {
              const key = query.queryKey;
              return (
                Array.isArray(key) &&
                key[0] === "comments" &&
                key[1] === "replies" &&
                key[2] === variables.parentId
              );
            },
          },
          { cancelRefetch: false },
        );
      }

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

      toast.success(
        t("commentCreated", "comments") || "Comment created successfully",
      );
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousCursorData) {
        queryClient.setQueryData(
          queryKeys.comments.cursor(variables.subjectType, variables.subjectId),
          context.previousCursorData,
        );
      }

      if (context?.previousRepliesData && variables.parentId) {
        queryClient.setQueryData(
          queryKeys.comments.replies(variables.parentId),
          context.previousRepliesData,
        );
      }

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
