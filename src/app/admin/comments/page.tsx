"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  CommentFilters,
  CommentList,
  CommentStatisticsCards,
} from "@/components/features/admin/comments";
import {
  useComments,
  useCommentsStatistics,
  useDeleteComment,
  usePinComment,
  useUpdateComment,
} from "@/hooks/admin/useComments";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Comment } from "@/lib/api/comments";
import type { GetCommentDto } from "@/lib/types/comments";
import type { UpdateCommentFormData } from "@/lib/validators/comments";

/**
 * Comments Management Page
 * Displays comment management interface with statistics, filters, and list
 */
export default function CommentsPage() {
  const { t } = useI18n();
  const [commentFilters, setCommentFilters] = useState<GetCommentDto>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "DESC",
  });

  const { data: commentsData, isLoading: commentsLoading } =
    useComments(commentFilters);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useCommentsStatistics();

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const pinCommentMutation = usePinComment();

  usePageMetadata({
    title: t("comments.title", "admin"),
    description: t("comments.description", "admin"),
  });

  const handleCommentFiltersChange = (newFilters: GetCommentDto) => {
    // Reset to page 1 when filters change
    setCommentFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setCommentFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setCommentFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleCommentSubmit = async (
    id: string,
    data: UpdateCommentFormData,
  ) => {
    try {
      await updateCommentMutation.mutateAsync({ commentId: id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleCommentDelete = async (comment: Comment) => {
    const commentPreview = comment.content
      ? comment.content.substring(0, 50) + "..."
      : "this comment";

    if (
      !confirm(
        t("comments.list.deleteConfirm", "admin", { preview: commentPreview }),
      )
    ) {
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync(comment.id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCommentPin = async (id: string, pinned: boolean) => {
    try {
      await pinCommentMutation.mutateAsync({ commentId: id, pinned });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                {t("comments.breadcrumb.admin", "admin")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("comments.breadcrumb.comments", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("comments.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("comments.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Statistics Cards */}
      <CommentStatisticsCards
        data={statisticsData?.data}
        isLoading={statisticsLoading}
      />

      {/* Comment Filters */}
      <AnimatedSection loading={false} data={true}>
        <CommentFilters
          filters={commentFilters}
          onFiltersChange={handleCommentFiltersChange}
        />
      </AnimatedSection>

      {/* Comments List */}
      <CommentList
        data={commentsData}
        isLoading={commentsLoading}
        page={commentFilters.page || 1}
        limit={commentFilters.limit || 20}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDelete={handleCommentDelete}
        onUpdate={handleCommentSubmit}
        onPin={handleCommentPin}
        isUpdating={updateCommentMutation.isPending}
        isPinning={pinCommentMutation.isPending}
      />
    </div>
  );
}
