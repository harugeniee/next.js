"use client";

import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Filter,
  MessageSquare,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Input,
} from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useComments } from "@/hooks/comments";
import type { Comment, QueryCommentsDto } from "@/lib/api/comments";
import { cn } from "@/lib/utils";

interface UserCommentsLayoutProps {
  readonly userId: string;
}

/**
 * User Comments Layout Component
 * Displays user's comments across articles and segments
 */
export function UserCommentsLayout({ userId }: UserCommentsLayoutProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectTypeFilter, setSubjectTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  const queryParams: QueryCommentsDto = {
    userId,
    query: searchQuery || undefined,
    subjectType: subjectTypeFilter !== "all" ? subjectTypeFilter : undefined,
    page: currentPage,
    limit: 20,
    sortBy,
    order: "DESC",
    includeReplies: false, // Don't include nested replies for simplicity
  };

  const { data, isLoading, error } = useComments(queryParams);

  // Extract comments from response (data is PaginationOffset<Comment>)
  const comments = data?.result || [];
  const totalCount = data?.metaData?.totalRecords || 0;
  const totalPages = data?.metaData?.totalPages || 0;
  const hasNextPage = data?.metaData?.hasNextPage || false;

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get subject type label
  const getSubjectTypeLabel = (subjectType: string) => {
    switch (subjectType) {
      case "article":
        return "Article";
      case "segment":
        return "Segment";
      default:
        return subjectType;
    }
  };

  // Get subject type icon
  const getSubjectTypeIcon = (subjectType: string) => {
    switch (subjectType) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "segment":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Get link to original context
  const getSubjectLink = (comment: (typeof comments)[0]) => {
    const { subjectType, subjectId } = comment;
    if (subjectType === "article") {
      return `/article/${subjectId}#comment-${comment.id}`;
    }
    if (subjectType === "segment") {
      return `/segment/${subjectId}#comment-${comment.id}`;
    }
    return "#";
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setSubjectTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {t("error.loadingComments", "user") || "Failed to load comments"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          {t("actions.retry", "common") || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t("commentsTitle", "user") || "Comments"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Type:{" "}
                  {subjectTypeFilter === "all"
                    ? "All"
                    : getSubjectTypeLabel(subjectTypeFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("article")}>
                  Articles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("segment")}>
                  Segments
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortChange("createdAt")}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("updatedAt")}>
                  Recently Updated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <Skeletonize loading={isLoading}>
        {comments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("noCommentsYet", "user") || "No comments yet"}
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {t("noCommentsDescription", "user") ||
                  "Comments on articles and segments will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment: Comment) => {
              const displayName =
                comment.user?.name || comment.user?.username || "Unknown User";
              const initials = displayName.slice(0, 2).toUpperCase();

              return (
                <Card
                  key={comment.id}
                  className="group hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10">
                          {comment.user?.avatar?.url && (
                            <AvatarImage
                              src={comment.user.avatar.url}
                              alt={`${displayName}'s avatar`}
                            />
                          )}
                          <AvatarFallback className="text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                            {comment.edited && (
                              <span className="ml-1">(edited)</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Subject Type Badge */}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md">
                        {getSubjectTypeIcon(comment.subjectType)}
                        <span className="text-xs font-medium">
                          {getSubjectTypeLabel(comment.subjectType)}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="pl-13">
                      <p
                        className={cn(
                          "text-sm text-foreground leading-relaxed",
                          comment.content.length > 300 && "line-clamp-3",
                        )}
                      >
                        {comment.content}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pl-13 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {comment._count?.replies !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {comment._count.replies} replies
                          </span>
                        )}
                      </div>

                      <Link href={getSubjectLink(comment)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                        >
                          {t("viewOriginal", "user") || "View original"}
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Skeletonize>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
