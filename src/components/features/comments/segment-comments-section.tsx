"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Input } from "@/components/ui/core/input";
import { useCurrentUser } from "@/hooks/auth";
import {
  useCommentReplies,
  useCommentsInfinite,
  useCommentStats,
  useCreateComment,
} from "@/hooks/comments";
import type { Comment, CreateCommentMentionDto } from "@/lib/api/comments";
import { COMMENT_CONSTANTS } from "@/lib/constants/comment.constants";
import { cn } from "@/lib/utils";

interface SegmentCommentsSectionProps {
  segmentId: string;
  className?: string;
}

/**
 * Segment Comments Section Component
 * Displays comments for a segment with lazy loading
 * Only loads comments when user scrolls to this section
 */
export function SegmentCommentsSection({
  segmentId,
  className,
}: SegmentCommentsSectionProps) {
  const { t } = useI18n();
  const { data: currentUser } = useCurrentUser();
  const isAuthenticated = !!currentUser;

  // Lazy loading state - only load when in viewport
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Comment form state
  const [commentContent, setCommentContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before reaching the section
        threshold: 0.1,
      },
    );

    const currentRef = commentSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isInView]);

  // Fetch comments with infinite scroll only when in view
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: commentsError,
  } = useCommentsInfinite("segment", segmentId, {
    parentId: undefined, // Only top-level comments
    enabled: isInView,
    limit: 20,
    sortBy: "createdAt",
    order: "DESC",
    includeReplies: false,
  });

  // Fetch comment stats only when in view
  const { data: statsData } = useCommentStats(
    isInView ? "segment" : "",
    isInView ? segmentId : "",
  );

  // Create comment mutation
  const createCommentMutation = useCreateComment();

  // Flatten all pages into a single array
  const comments = commentsData?.pages.flatMap((page) => page.result) ?? [];
  const stats = statsData?.data;
  const totalComments = stats?.total || comments.length;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isInView || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before reaching the bottom
        threshold: 0.1,
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle comment submission (for top form - new comments only)
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !commentContent.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        subjectType: "segment",
        subjectId: segmentId,
        parentId: undefined, // Top form is only for new top-level comments
        content: commentContent.trim(),
        type: COMMENT_CONSTANTS.TYPES.TEXT,
        visibility: COMMENT_CONSTANTS.VISIBILITY.PUBLIC,
      });

      // Reset form
      setCommentContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  // Handle reply - set replyingToId to show inline form
  const handleReply = (commentId: string) => {
    setReplyingToId(commentId);
  };

  // Cancel reply - clear replyingToId
  const handleCancelReply = () => {
    setReplyingToId(null);
  };

  // Handle inline reply submission
  const handleSubmitReply = async (parentComment: Comment, content: string) => {
    if (!isAuthenticated || !content.trim()) return;

    // Get username with fallback priority: username > name > "User"
    const username =
      parentComment.user?.username || parentComment.user?.name || "User";

    // Content already contains "@username " prefix from form
    // Extract the mention prefix and user's actual content
    const mentionPrefix = `@${username} `;

    // If content doesn't start with mention prefix, add it (safety check)
    const formattedContent = content.startsWith(mentionPrefix)
      ? content.trim()
      : `${mentionPrefix}${content.trim()}`;

    // Validate content length - truncate if exceeds max length
    const finalContent =
      formattedContent.length > COMMENT_CONSTANTS.CONTENT_MAX_LENGTH
        ? formattedContent.slice(0, COMMENT_CONSTANTS.CONTENT_MAX_LENGTH)
        : formattedContent;

    // Ensure mention prefix is still at the start after truncation
    const safeContent = finalContent.startsWith(mentionPrefix)
      ? finalContent
      : `${mentionPrefix}${finalContent.slice(mentionPrefix.length)}`;

    // Create mention object
    // Only create mention if parentComment.userId exists
    const mentions: CreateCommentMentionDto[] = [];
    if (parentComment.userId) {
      mentions.push({
        userId: parentComment.userId,
        startIndex: 0,
        length: mentionPrefix.length,
        type: "user",
      });
    }

    try {
      await createCommentMutation.mutateAsync({
        subjectType: "segment",
        subjectId: segmentId,
        parentId: parentComment.id,
        content: safeContent,
        mentions: mentions.length > 0 ? mentions : undefined,
        type: COMMENT_CONSTANTS.TYPES.TEXT,
        visibility: COMMENT_CONSTANTS.VISIBILITY.PUBLIC,
      });

      // Close reply form after successful submission
      setReplyingToId(null);
    } catch (error) {
      console.error("Failed to create reply:", error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (user?: Comment["user"]) => {
    if (!user) return "?";
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "?";
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div ref={commentSectionRef} className={cn("mt-8 sm:mt-12", className)}>
      <AnimatedSection
        loading={!isInView && isLoadingComments}
        data={isInView ? comments : undefined}
        className="space-y-4 sm:space-y-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("title", "comments")}
                </CardTitle>
                {stats && (
                  <CardDescription className="mt-1">
                    {totalComments > 0
                      ? t("stats.total", "comments", { count: totalComments })
                      : t("noComments", "comments")}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeletonize loading={!isInView && isLoadingComments}>
              {isInView ? (
                <>
                  {/* Comment Form - Only for new top-level comments */}
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={currentUser?.avatar?.url}
                            alt={
                              currentUser?.name ||
                              currentUser?.username ||
                              "User"
                            }
                          />
                          <AvatarFallback>
                            {getUserInitials({
                              name: currentUser?.name,
                              username: currentUser?.username,
                            } as Comment["user"])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder={t("placeholder", "comments")}
                            maxLength={COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}
                            className="w-full"
                            disabled={createCommentMutation.isPending}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {commentContent.length} /{" "}
                              {COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}{" "}
                              {t("charactersRemaining", "comments")}
                            </span>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={
                                !commentContent.trim() ||
                                createCommentMutation.isPending
                              }
                              className="gap-2"
                            >
                              <Send className="h-4 w-4" />
                              {t("submit", "comments")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 text-center border border-border rounded-md bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        {t("loginToComment", "comments")}
                      </p>
                    </div>
                  )}

                  {/* Comments List */}
                  {commentsError ? (
                    <div className="p-4 text-center text-sm text-destructive">
                      {t("error", "comments")}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {t("noComments", "comments")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          replyingToId={replyingToId}
                          onReply={handleReply}
                          onCancelReply={handleCancelReply}
                          onSubmitReply={handleSubmitReply}
                          isAuthenticated={isAuthenticated}
                          currentUser={currentUser}
                          getUserInitials={getUserInitials}
                          formatDate={formatDate}
                          isSubmitting={createCommentMutation.isPending}
                        />
                      ))}
                      {/* Load more trigger */}
                      {hasNextPage && (
                        <div ref={loadMoreRef} className="py-4">
                          {isFetchingNextPage && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              <span>{t("loadingMore", "comments")}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Placeholder for skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-md" />
                  ))}
                </div>
              )}
            </Skeletonize>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}

/**
 * Inline Reply Form Component
 * Displays reply form directly below a comment
 */
interface ReplyFormProps {
  parentComment: Comment;
  onSubmit: (parentComment: Comment, content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  currentUser: ReturnType<typeof useCurrentUser>["data"];
  getUserInitials: (user?: Comment["user"]) => string;
}

function ReplyForm({
  parentComment,
  onSubmit,
  onCancel,
  isSubmitting,
  currentUser,
  getUserInitials,
}: ReplyFormProps) {
  const { t } = useI18n();

  // Get username with fallback priority: username > name > "User"
  const username =
    parentComment.user?.username || parentComment.user?.name || "User";

  // Calculate mention prefix - this will be used as initial value
  const mentionPrefix = `@${username} `;

  // Initialize reply content with "@username " prefix
  // Component will remount when key changes (set in parent), so initial state is always correct
  const [replyContent, setReplyContent] = useState(mentionPrefix);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-focus input and scroll into view when form opens
  useEffect(() => {
    inputRef.current?.focus();
    // Move cursor to end of input (after "@username ")
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
    // Smooth scroll to form if needed
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }, []);

  // Handle ESC key to cancel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    await onSubmit(parentComment, replyContent);
    setReplyContent("");
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-3 ml-11 space-y-2 rounded-md border border-border bg-muted/20 p-3 transition-all duration-200"
    >
      <div className="flex gap-3">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage
            src={currentUser?.avatar?.url}
            alt={currentUser?.name || currentUser?.username || "User"}
          />
          <AvatarFallback>
            {getUserInitials({
              name: currentUser?.name,
              username: currentUser?.username,
            } as Comment["user"])}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>
              {t("replyTo", "comments")}{" "}
              <span className="font-medium text-foreground">
                {parentComment.user?.name ||
                  parentComment.user?.username ||
                  "User"}
              </span>
            </span>
          </div>
          <Input
            ref={inputRef}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={t("reply", "comments")}
            maxLength={COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}
            className="w-full text-sm"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {replyContent.length} / {COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-7 text-xs"
              >
                {t("cancel", "comments")}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!replyContent.trim() || isSubmitting}
                className="h-7 text-xs gap-1"
              >
                <Send className="h-3 w-3" />
                {t("reply", "comments")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/**
 * Comment Item Component
 * Displays a single comment with replies
 */
interface CommentItemProps {
  comment: Comment;
  replyingToId: string | null;
  onReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentComment: Comment, content: string) => Promise<void>;
  isAuthenticated: boolean;
  currentUser: ReturnType<typeof useCurrentUser>["data"];
  getUserInitials: (user?: Comment["user"]) => string;
  formatDate: (dateString: string) => string;
  isSubmitting: boolean;
}

function CommentItem({
  comment,
  replyingToId,
  onReply,
  onCancelReply,
  onSubmitReply,
  isAuthenticated,
  currentUser,
  getUserInitials,
  formatDate,
  isSubmitting,
}: CommentItemProps) {
  const { t } = useI18n();

  // Determine the user id for navigation based on available user data
  const commentUserId = comment.user?.id || comment.userId;

  // Get reply count from comment metadata
  // Backend returns replyCount as a direct property on the Comment entity
  const replyCount = comment.replyCount ?? 0;

  // Auto-fetch replies when replyCount > 0
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    error: repliesError,
  } = useCommentReplies(comment.id, {
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    order: "ASC",
    enabled: replyCount > 0,
  });

  // Get replies from API response or empty array
  const replies = repliesData?.data?.result || [];

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="flex gap-3">
        {commentUserId ? (
          <Link
            href={`/user/${commentUserId}`}
            aria-label={
              comment.user?.name || comment.user?.username
                ? `View profile of ${comment.user.name || comment.user.username}`
                : "View user profile"
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage
                src={comment.user?.avatar?.url}
                alt={comment.user?.name || comment.user?.username || "User"}
              />
              <AvatarFallback>{getUserInitials(comment.user)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage
              src={comment.user?.avatar?.url}
              alt={comment.user?.name || comment.user?.username || "User"}
            />
            <AvatarFallback>{getUserInitials(comment.user)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {commentUserId ? (
              <Link
                href={`/user/${commentUserId}`}
                className="text-sm font-medium text-foreground hover:underline"
              >
                {comment.user?.name || comment.user?.username || "Anonymous"}
              </Link>
            ) : (
              <span className="text-sm font-medium text-foreground">
                {comment.user?.name || comment.user?.username || "Anonymous"}
              </span>
            )}
            {comment.pinned && (
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {t("pinned", "comments")}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.edited && (
              <span className="text-xs text-muted-foreground">
                ({t("edited", "comments")})
              </span>
            )}
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="h-7 text-xs mt-1"
            >
              {t("reply", "comments")}
            </Button>
          )}
        </div>
      </div>

      {/* Inline Reply Form - Show when this comment is being replied to */}
      {replyingToId === comment.id && isAuthenticated && (
        <ReplyForm
          key={`reply-form-${comment.id}`}
          parentComment={comment}
          onSubmit={onSubmitReply}
          onCancel={onCancelReply}
          isSubmitting={isSubmitting}
          currentUser={currentUser}
          getUserInitials={getUserInitials}
        />
      )}

      {/* Replies - Auto-display below parent comment with indent */}
      {replyCount > 0 && (
        <div className="ml-11 space-y-3 mt-3">
          {isLoadingReplies ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>{t("loadingReplies", "comments")}</span>
              </div>
            </div>
          ) : repliesError ? (
            <div className="p-4 text-center text-sm text-destructive">
              {t("errorLoadingReplies", "comments")}
            </div>
          ) : replies.length > 0 ? (
            <div className="space-y-3">
              {replies.map((reply) => {
                const replyUserId = reply.user?.id || reply.userId;
                return (
                  <div
                    key={reply.id}
                    className="flex gap-3 rounded-md border border-border bg-muted/20 p-2 sm:p-3"
                  >
                    {replyUserId ? (
                      <Link
                        href={`/user/${replyUserId}`}
                        aria-label={
                          reply.user?.name || reply.user?.username
                            ? `View profile of ${reply.user.name || reply.user.username}`
                            : "View user profile"
                        }
                      >
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage
                            src={reply.user?.avatar?.url}
                            alt={
                              reply.user?.name || reply.user?.username || "User"
                            }
                          />
                          <AvatarFallback>
                            {getUserInitials(reply.user)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    ) : (
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage
                          src={reply.user?.avatar?.url}
                          alt={
                            reply.user?.name || reply.user?.username || "User"
                          }
                        />
                        <AvatarFallback>
                          {getUserInitials(reply.user)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {replyUserId ? (
                          <Link
                            href={`/user/${replyUserId}`}
                            className="text-sm font-medium text-foreground hover:underline"
                          >
                            {reply.user?.name ||
                              reply.user?.username ||
                              "Anonymous"}
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-foreground">
                            {reply.user?.name ||
                              reply.user?.username ||
                              "Anonymous"}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                        {reply.edited && (
                          <span className="text-xs text-muted-foreground">
                            ({t("edited", "comments")})
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("noReplies", "comments")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
