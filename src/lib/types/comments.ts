import type { ApiResponseOffset } from "@/lib/types";
import type {
  Comment,
  CommentStatsOverview,
  QueryCommentsDto,
} from "@/lib/api/comments";

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
 * Type alias for ApiResponseOffset<Comment> to maintain consistency
 */
export type CommentListResponse = ApiResponseOffset<Comment>;

/**
 * Comment statistics type
 * Type alias for CommentStatsOverview to maintain consistency
 */
export type CommentStatistics = CommentStatsOverview;
