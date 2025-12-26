"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Badge } from "@/components/ui/core/badge";
import { Separator } from "@/components/ui/layout/separator";
import type { Comment } from "@/lib/api/comments";
import { COMMENT_CONSTANTS } from "@/lib/constants/comment.constants";

interface CommentDetailDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly comment: Comment | null;
}

/**
 * Comment Detail Dialog Component
 * Shows full comment details for admin inspection
 */
export function CommentDetailDialog({
  open,
  onOpenChange,
  comment,
}: CommentDetailDialogProps) {
  const { t } = useI18n();

  if (!comment) return null;

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

  // Format date for display
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleString();
    } catch {
      return "-";
    }
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

  const subjectLink = getSubjectLink(comment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("comments.detail.title", "admin")}</DialogTitle>
          <DialogDescription>
            {t("comments.detail.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* User Information */}
          <div className="flex items-center gap-4">
            {comment.user?.id ? (
              <Link href={`/user/${comment.user.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={comment.user.avatar?.url}
                    alt={comment.user.name || comment.user.username || "User"}
                  />
                  <AvatarFallback>
                    {getUserInitials(comment.user)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {comment.user?.name ||
                  (comment.user?.username
                    ? truncateUsername(comment.user.username)
                    : "Anonymous")}
              </h3>
              {comment.user?.username && (
                <p className="text-sm text-muted-foreground">
                  @{truncateUsername(comment.user.username)}
                </p>
              )}
              {comment.user?.id && (
                <p className="text-xs text-muted-foreground">
                  ID: {comment.user.id}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Comment Content */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              {t("comments.detail.content", "admin")}
            </h4>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words bg-muted/50 p-3 rounded-md">
              {comment.content}
            </p>
          </div>

          {/* Subject Information */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              {t("comments.detail.subject", "admin")}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{comment.subjectType}</Badge>
              {subjectLink ? (
                <Link
                  href={subjectLink}
                  className="text-sm text-primary hover:underline"
                >
                  {comment.subjectId}
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {comment.subjectId}
                </span>
              )}
            </div>
          </div>

          {/* Parent Comment */}
          {comment.parentId && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("comments.detail.parentComment", "admin")}
              </h4>
              <span className="text-sm text-muted-foreground">
                {comment.parentId}
              </span>
            </div>
          )}

          {/* Status Badges */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              {t("comments.detail.status", "admin")}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {comment.type || COMMENT_CONSTANTS.TYPES.TEXT}
              </Badge>
              {comment.pinned && (
                <Badge variant="secondary">
                  {t("comments.detail.pinned", "admin")}
                </Badge>
              )}
              {comment.edited && (
                <Badge variant="outline">
                  {t("comments.detail.edited", "admin")}
                </Badge>
              )}
              <Badge
                variant={
                  comment.visibility === COMMENT_CONSTANTS.VISIBILITY.PUBLIC
                    ? "default"
                    : comment.visibility === COMMENT_CONSTANTS.VISIBILITY.HIDDEN
                      ? "destructive"
                      : "secondary"
                }
              >
                {comment.visibility || COMMENT_CONSTANTS.VISIBILITY.PUBLIC}
              </Badge>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">
                {t("comments.detail.replyCount", "admin")}:{" "}
              </span>
              <span className="text-muted-foreground">
                {comment.replyCount || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">
                {t("comments.detail.createdAt", "admin")}:{" "}
              </span>
              <span className="text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            {comment.edited && comment.editedAt && (
              <div>
                <span className="font-medium">
                  {t("comments.detail.editedAt", "admin")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {formatDate(comment.editedAt)}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium">
                {t("comments.detail.updatedAt", "admin")}:{" "}
              </span>
              <span className="text-muted-foreground">
                {formatDate(comment.updatedAt)}
              </span>
            </div>
          </div>

          {/* Flags */}
          {comment.flags && comment.flags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("comments.detail.flags", "admin")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {comment.flags.map((flag) => (
                  <Badge key={flag} variant="destructive">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata JSON */}
          {comment.metadata && Object.keys(comment.metadata).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("comments.detail.metadata", "admin")}
              </h4>
              <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-auto">
                {JSON.stringify(comment.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
