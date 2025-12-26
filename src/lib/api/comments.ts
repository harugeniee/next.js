import { http } from "@/lib/http";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  PaginationOffset,
  QueryParamsWithCursor,
} from "@/lib/types";

/**
 * Comment interfaces based on backend DTOs
 */
export interface Comment {
  id: string;
  userId: string;
  subjectType: string;
  subjectId: string;
  parentId?: string;
  content: string;
  type?: string;
  pinned?: boolean;
  edited?: boolean;
  editedAt?: string | Date;
  visibility?: string;
  flags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    username?: string;
    avatar?: {
      url: string;
    };
  };
  replies?: Comment[];
  attachments?: unknown[];
  mentions?: unknown[];
  replyCount?: number;
  _count?: {
    replies: number;
    reactions: number;
  };
}

export interface CreateCommentMentionDto {
  userId: string;
  startIndex: number;
  length: number;
  type?: string;
  silent?: boolean;
  context?: Record<string, unknown>;
}

export interface CreateCommentMediaItemDto {
  kind: "image" | "video" | "audio" | "document" | "other" | "sticker";
  mediaId?: string;
  stickerId?: string;
  sortValue?: number;
}

export interface CreateCommentDto {
  subjectType: string;
  subjectId: string;
  parentId?: string;
  content?: string;
  type?: string;
  pinned?: boolean;
  media?: CreateCommentMediaItemDto[];
  mentions?: CreateCommentMentionDto[];
  metadata?: Record<string, unknown>;
  flags?: string[];
  visibility?: string;
}

export interface UpdateCommentDto {
  content?: string;
  type?: string;
  edited?: boolean;
  editedAt?: Date;
  pinned?: boolean;
  visibility?: string;
  media?: CreateCommentMediaItemDto[];
  mentions?: CreateCommentMentionDto[];
  metadata?: Record<string, unknown>;
  flags?: string[];
}

export interface QueryCommentsDto extends AdvancedQueryParams {
  subjectType?: string;
  subjectId?: string;
  parentId?: string;
  type?: string;
  pinned?: boolean;
  edited?: boolean;
  visibility?: string;
  includeReplies?: boolean;
  maxDepth?: number;
  includeMedia?: boolean;
  includeMentions?: boolean;
}

/**
 * DTO for querying comments with cursor pagination
 * Extends QueryParamsWithCursor to add comment-specific filters
 * Based on backend QueryCommentsCursorDto
 */
export interface QueryCommentsCursorDto extends QueryParamsWithCursor {
  subjectType?: string;
  subjectId?: string;
  parentId?: string;
  type?: string;
  pinned?: boolean;
  edited?: boolean;
  visibility?: string;
  includeReplies?: boolean;
  includeMedia?: boolean;
  includeMentions?: boolean;
}

export interface BatchCommentsDto {
  subjectType: string;
  subjectIds: string[];
  parentId?: string;
  includeReplies?: boolean;
  includeMedia?: boolean;
  includeMentions?: boolean;
  visibility?: string;
}

export interface CommentStats {
  totalComments: number;
  totalReplies: number;
  pinnedComments: number;
  recentComments: number;
}

/**
 * Comprehensive comment statistics overview for admin dashboard
 * Returns aggregate statistics across all comments
 */
export interface CommentStatsOverview {
  totalComments: number;
  totalTopLevelComments: number;
  totalReplies: number;
  pinnedComments: number;
  editedComments: number;
  commentsByType: Record<string, number>;
  commentsByVisibility: Record<string, number>;
  commentsBySubjectType: Record<string, number>;
  commentsWithMedia: number;
  totalMediaAttachments: number;
  commentsWithMentions: number;
  totalMentions: number;
  recentComments: number;
  averageReplyCount: number;
  topCommentedSubjects: Array<{
    subjectType: string;
    subjectId: string;
    count: number;
  }>;
}

/**
 * Comments API wrapper
 * Handles all comment-related API calls
 */
export class CommentsAPI {
  private static readonly BASE_URL = "/comments";

  /**
   * Create a new comment
   */
  static async createComment(
    data: CreateCommentDto,
  ): Promise<ApiResponse<Comment>> {
    const response = await http.post<ApiResponse<Comment>>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Get comments with pagination and filtering
   */
  static async getComments(
    params?: QueryCommentsDto,
  ): Promise<PaginationOffset<Comment>> {
    const response = await http.get<ApiResponseOffset<Comment>>(this.BASE_URL, {
      params,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch comments");
    }
    // Extract the pagination data from the nested structure
    return response.data.data;
  }

  /**
   * Get comments with cursor-based pagination
   * Better for real-time feeds and infinite scroll
   * @param params Cursor pagination parameters with comment filters
   * @returns Cursor-paginated list of comments
   */
  static async getCommentsCursor(
    params?: QueryCommentsCursorDto,
  ): Promise<ApiResponseCursor<Comment>> {
    const response = await http.get<ApiResponseCursor<Comment>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Get comments for multiple subjects in batch
   */
  static async getCommentsBatch(
    data: BatchCommentsDto,
  ): Promise<ApiResponse<Comment[]>> {
    const response = await http.post<ApiResponse<Comment[]>>(
      `${this.BASE_URL}/batch`,
      data,
    );
    return response.data;
  }

  /**
   * Get comment statistics for a subject
   */
  static async getCommentStats(
    subjectType: string,
    subjectId: string,
  ): Promise<ApiResponse<CommentStats>> {
    const response = await http.get<ApiResponse<CommentStats>>(
      `${this.BASE_URL}/stats`,
      {
        params: { subjectType, subjectId },
      },
    );
    return response.data;
  }

  /**
   * Get comprehensive comment statistics overview (admin)
   * Returns aggregate statistics across all comments
   */
  static async getCommentStatsOverview(): Promise<
    ApiResponse<CommentStatsOverview>
  > {
    const response = await http.get<ApiResponse<CommentStatsOverview>>(
      `${this.BASE_URL}/stats/overview`,
    );
    return response.data;
  }

  /**
   * Get replies for a specific comment
   */
  static async getCommentReplies(
    commentId: string,
    params?: Omit<QueryCommentsDto, "parentId">,
  ): Promise<PaginationOffset<Comment>> {
    const response = await http.get<ApiResponseOffset<Comment>>(
      `${this.BASE_URL}/${commentId}/replies`,
      { params },
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch comment replies");
    }
    // Extract the pagination data from the nested structure
    return response.data.data;
  }

  /**
   * Get a single comment by ID
   */
  static async getComment(
    commentId: string,
    options?: {
      includeReplies?: boolean;
      includeAttachments?: boolean;
      includeMentions?: boolean;
    },
  ): Promise<ApiResponse<Comment>> {
    const params: Record<string, string> = {};
    if (options?.includeReplies) params.includeReplies = "true";
    if (options?.includeAttachments !== false)
      params.includeAttachments = "true";
    if (options?.includeMentions !== false) params.includeMentions = "true";

    const response = await http.get<ApiResponse<Comment>>(
      `${this.BASE_URL}/${commentId}`,
      { params },
    );
    return response.data;
  }

  /**
   * Update a comment
   */
  static async updateComment(
    commentId: string,
    data: UpdateCommentDto,
  ): Promise<ApiResponse<Comment>> {
    const response = await http.put<ApiResponse<Comment>>(
      `${this.BASE_URL}/${commentId}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete a comment (soft delete)
   */
  static async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${commentId}`,
    );
    return response.data;
  }

  /**
   * Pin/unpin a comment
   */
  static async togglePin(
    commentId: string,
    pinned: boolean,
  ): Promise<ApiResponse<Comment>> {
    const response = await http.post<ApiResponse<Comment>>(
      `${this.BASE_URL}/${commentId}/pin`,
      { pinned },
    );
    return response.data;
  }
}
