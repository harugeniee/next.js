"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Comment } from "@/lib/api/comments";
import { COMMENT_CONSTANTS } from "@/lib/constants/comment.constants";
import type { CommentListResponse } from "@/lib/types/comments";
import type { UpdateCommentFormData } from "@/lib/validators/comments";
import { CommentActions } from "./comment-actions";
import { CommentDetailDialog } from "./comment-detail-dialog";

interface CommentListProps {
  readonly data?: CommentListResponse;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onLimitChange?: (limit: number) => void;
  readonly onDelete?: (comment: Comment) => void;
  readonly onUpdate?: (
    id: string,
    data: UpdateCommentFormData,
  ) => Promise<void>;
  readonly onPin?: (id: string, pinned: boolean) => Promise<void>;
  readonly isUpdating?: boolean;
  readonly isPinning?: boolean;
}

const MAX_CONTENT_LENGTH = 15;

/**
 * Comment List Component
 * Displays comments in a table view
 */
export function CommentList({
  data,
  isLoading,
  page,
  limit,
  onPageChange,
  onDelete,
  onUpdate,
  onPin,
  isUpdating,
  isPinning,
}: CommentListProps) {
  const { t } = useI18n();
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Format date for display
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // Get user initials for avatar
  const getUserInitials = (user?: Comment["user"]): string => {
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

  // Truncate username to 10 characters
  const truncateUsername = (username: string): string => {
    if (username.length <= 10) return username;
    return `${username.substring(0, 10)}...`;
  };

  // Truncate content
  const truncateContent = (
    content: string,
    maxLength: number = MAX_CONTENT_LENGTH,
  ): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  // Get subject link
  const getSubjectLink = (comment: Comment): string | null => {
    if (comment.subjectType === "article") {
      return `/article/${comment.subjectId}`;
    }
    if (comment.subjectType === "segment") {
      return `/segments/${comment.subjectId}`;
    }
    if (comment.subjectType === "user") {
      return `/user/${comment.subjectId}`;
    }
    return null;
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("comments.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("comments.list.description", "admin")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.result && data.result.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("comments.list.table.user", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.content", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.subject", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.parent", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.status", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.replies", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("comments.list.table.createdAt", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("comments.list.table.actions", "admin")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((comment) => {
                      const subjectLink = getSubjectLink(comment);
                      const truncatedContent = truncateContent(comment.content);
                      const shouldShowTooltip =
                        comment.content.length > MAX_CONTENT_LENGTH;

                      return (
                        <TableRow
                          key={comment.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSelectedComment(comment);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {comment.user?.id ? (
                                <Link
                                  href={`/user/${comment.user.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={comment.user.avatar?.url}
                                      alt={
                                        comment.user.name ||
                                        comment.user.username ||
                                        "User"
                                      }
                                    />
                                    <AvatarFallback>
                                      {getUserInitials(comment.user)}
                                    </AvatarFallback>
                                  </Avatar>
                                </Link>
                              ) : (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>?</AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate text-sm">
                                  {comment.user?.name ||
                                    (comment.user?.username
                                      ? truncateUsername(comment.user.username)
                                      : "Anonymous")}
                                </span>
                                {comment.user?.username &&
                                  comment.user?.name && (
                                    <span className="text-xs text-muted-foreground truncate">
                                      @{truncateUsername(comment.user.username)}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {shouldShowTooltip ? (
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedComment(comment);
                                      setIsDetailDialogOpen(true);
                                    }}
                                    className="text-sm text-left text-primary hover:underline"
                                  >
                                    {truncatedContent}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" sideOffset={5}>
                                  {comment.content}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-sm">{comment.content}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {subjectLink ? (
                              <Link
                                href={subjectLink}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-primary hover:underline"
                              >
                                <Badge variant="outline">
                                  {comment.subjectType}:{" "}
                                  {comment.subjectId.slice(0, 8)}...
                                </Badge>
                              </Link>
                            ) : (
                              <Badge variant="outline">
                                {comment.subjectType}:{" "}
                                {comment.subjectId.slice(0, 8)}...
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {comment.parentId ? (
                              <span className="text-sm text-muted-foreground">
                                {comment.parentId.slice(0, 8)}...
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {comment.type || COMMENT_CONSTANTS.TYPES.TEXT}
                              </Badge>
                              {comment.pinned && (
                                <Badge variant="secondary" className="text-xs">
                                  {t("comments.list.pinned", "admin")}
                                </Badge>
                              )}
                              {comment.edited && (
                                <Badge variant="outline" className="text-xs">
                                  {t("comments.list.edited", "admin")}
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  comment.visibility ===
                                  COMMENT_CONSTANTS.VISIBILITY.PUBLIC
                                    ? "default"
                                    : comment.visibility ===
                                        COMMENT_CONSTANTS.VISIBILITY.HIDDEN
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {comment.visibility ||
                                  COMMENT_CONSTANTS.VISIBILITY.PUBLIC}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {comment.replyCount || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatDate(comment.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell
                            className="text-right"
                            onClick={(e) => {
                              // Stop propagation to prevent row click when clicking actions
                              e.stopPropagation();
                            }}
                          >
                            {onUpdate && onDelete && onPin ? (
                              <CommentActions
                                comment={comment}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                onPin={onPin}
                                isUpdating={isUpdating}
                                isPinning={isPinning}
                              />
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="rounded-md border">
                <div className="h-10 w-full bg-muted/10" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 py-2 px-2 border-b last:border-b-0"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted/20" />
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-4 w-24 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination Info */}
          {data &&
            data.metaData.totalRecords &&
            data.metaData.totalRecords > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                {t("comments.list.pagination.showing", "admin", {
                  from: (page - 1) * limit + 1,
                  to: Math.min(page * limit, data.metaData.totalRecords),
                  total: data.metaData.totalRecords,
                })}
              </div>
            )}

          {/* Pagination Controls */}
          {data?.metaData.totalPages && data.metaData.totalPages > 1 ? (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) {
                          onPageChange(page - 1);
                        }
                      }}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: data.metaData.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      pageNum === 1 ||
                      pageNum === data.metaData.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                          }}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data.metaData.totalPages || 1)) {
                          onPageChange(page + 1);
                        }
                      }}
                      className={
                        page >= (data.metaData.totalPages || 1)
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Comment Detail Dialog */}
      <CommentDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        comment={selectedComment}
      />
    </AnimatedSection>
  );
}
