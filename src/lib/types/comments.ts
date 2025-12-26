import type {
  Comment,
  CommentStatsOverview,
  QueryCommentsDto,
} from "@/lib/api/comments";
import type { PaginationOffset } from "@/lib/types/response";

/**
 * Admin-specific type aliases for consistency with other admin pages
 */

/**
 * DTO for querying comments in admin interface
 * Type alias for QueryCommentsDto to maintain consistency with other admin pages
 */
export type GetCommentDto = QueryCommentsDto;

/**
 * Response type for paginated comments list
 * Uses PaginationOffset to match actual API response structure
 */
export type CommentListResponse = PaginationOffset<Comment>;

/**
 * Comment statistics type
 * Type alias for CommentStatsOverview to maintain consistency
 */
export type CommentStatistics = CommentStatsOverview;
