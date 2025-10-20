import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ArticleAPI } from "@/lib/api/article";
import { ARTICLE_CONSTANTS } from "@/lib/constants";
import type {
  Article,
  CreateArticleDto,
  UpdateArticleRequest,
} from "@/lib/interface/article.interface";
import type { AdvancedQueryParams } from "@/lib/types";
import { queryKeys } from "@/lib/utils/query-keys";

// Helper functions for layout formatting
function getStatusColor(status: string): string {
  switch (status) {
    case ARTICLE_CONSTANTS.STATUS.PUBLISHED:
      return "text-green-600 bg-green-50 border-green-200";
    case ARTICLE_CONSTANTS.STATUS.DRAFT:
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
      return "text-blue-600 bg-blue-50 border-blue-200";
    case ARTICLE_CONSTANTS.STATUS.ARCHIVED:
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

function getVisibilityIcon(visibility: string): string {
  switch (visibility) {
    case ARTICLE_CONSTANTS.VISIBILITY.PUBLIC:
      return "🌐";
    case ARTICLE_CONSTANTS.VISIBILITY.UNLISTED:
      return "🔗";
    case ARTICLE_CONSTANTS.VISIBILITY.PRIVATE:
      return "🔒";
    default:
      return "❓";
  }
}

function getStatusBadge(status: string): { text: string; color: string } {
  switch (status) {
    case ARTICLE_CONSTANTS.STATUS.PUBLISHED:
      return { text: "Published", color: "bg-green-100 text-green-800" };
    case ARTICLE_CONSTANTS.STATUS.DRAFT:
      return { text: "Draft", color: "bg-yellow-100 text-yellow-800" };
    case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
      return { text: "Scheduled", color: "bg-blue-100 text-blue-800" };
    case ARTICLE_CONSTANTS.STATUS.ARCHIVED:
      return { text: "Archived", color: "bg-gray-100 text-gray-800" };
    default:
      return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
  }
}

function getVisibilityBadge(visibility: string): {
  text: string;
  color: string;
} {
  switch (visibility) {
    case ARTICLE_CONSTANTS.VISIBILITY.PUBLIC:
      return { text: "Public", color: "bg-green-100 text-green-800" };
    case ARTICLE_CONSTANTS.VISIBILITY.UNLISTED:
      return { text: "Unlisted", color: "bg-blue-100 text-blue-800" };
    case ARTICLE_CONSTANTS.VISIBILITY.PRIVATE:
      return { text: "Private", color: "bg-red-100 text-red-800" };
    default:
      return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case ARTICLE_CONSTANTS.STATUS.PUBLISHED:
      return "Published";
    case ARTICLE_CONSTANTS.STATUS.DRAFT:
      return "Draft";
    case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
      return "Scheduled";
    case ARTICLE_CONSTANTS.STATUS.ARCHIVED:
      return "Archived";
    default:
      return "Unknown";
  }
}

function getVisibilityText(visibility: string): string {
  switch (visibility) {
    case ARTICLE_CONSTANTS.VISIBILITY.PUBLIC:
      return "Public";
    case ARTICLE_CONSTANTS.VISIBILITY.UNLISTED:
      return "Unlisted";
    case ARTICLE_CONSTANTS.VISIBILITY.PRIVATE:
      return "Private";
    default:
      return "Unknown";
  }
}

/**
 * Hook for fetching a single article by ID
 * Replaces the complex manual implementation with React Query
 */
export function useArticle(articleId: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(articleId),
    queryFn: () => ArticleAPI.getArticle(articleId),
    enabled: !!articleId && articleId !== "undefined" && articleId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching articles list with pagination
 */
export function useArticles(params?: AdvancedQueryParams) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => ArticleAPI.getArticlesOffset(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
}

/**
 * Hook for fetching my articles list with pagination and layout support
 * Supports multiple layout types: grid, list, card
 */
export function useMyArticles(userId: string, params?: AdvancedQueryParams) {
  return useQuery({
    queryKey: queryKeys.articles.myList(userId, params),
    queryFn: () => ArticleAPI.myArticlesOffset(params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
}

/**
 * Hook for managing user articles with different layout types
 * Provides layout-specific data formatting and management
 */
export function useUserArticlesLayout(
  userId: string,
  layout: "grid" | "list" | "card" = "grid",
  params?: AdvancedQueryParams,
) {
  const { data, isLoading, error, refetch } = useMyArticles(userId, params);

  // Format articles data based on layout type
  const formattedArticles =
    data?.data?.result?.map((article: Article) => {
      const baseArticle = {
        id: article.id,
        title: article.title,
        content: article.content,
        status: article.status,
        visibility: article.visibility,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        scheduledAt: article.scheduledAt,
        tags: article.tags || [],
        author: article.user,
        coverImage: article.coverImage,
        slug: article.slug,
      };

      // Add layout-specific properties
      switch (layout) {
        case "grid":
          return {
            ...baseArticle,
            // Grid-specific formatting
            readTime: Math.max(
              1,
              Math.ceil((article.content?.split(/\s+/).length || 0) / 200),
            ),
            formattedDate: new Date(article.createdAt).toLocaleDateString(),
            statusColor: getStatusColor(article.status),
            visibilityIcon: getVisibilityIcon(article.visibility),
            statusText: getStatusText(article.status),
            visibilityText: getVisibilityText(article.visibility),
            // Format cover image data
            coverImage: article.coverImage
              ? {
                  url: article.coverImage.url,
                  thumbnailUrl: article.coverImage.thumbnailUrl,
                  altText: article.coverImage.altText || article.title,
                }
              : undefined,
          };

        case "list":
          return {
            ...baseArticle,
            // List-specific formatting
            readTime: Math.max(
              1,
              Math.ceil((article.content?.split(/\s+/).length || 0) / 200),
            ),
            formattedDate: new Date(article.createdAt).toLocaleDateString(),
            statusBadge: getStatusBadge(article.status),
            visibilityBadge: getVisibilityBadge(article.visibility),
            // Format cover image data
            coverImage: article.coverImage
              ? {
                  url: article.coverImage.url,
                  thumbnailUrl: article.coverImage.thumbnailUrl,
                  altText: article.coverImage.altText || article.title,
                }
              : undefined,
          };

        case "card":
          return {
            ...baseArticle,
            // Card-specific formatting
            readTime: Math.max(
              1,
              Math.ceil((article.content?.split(/\s+/).length || 0) / 200),
            ),
            formattedDate: new Date(article.createdAt).toLocaleDateString(),
            statusText: getStatusText(article.status),
            visibilityText: getVisibilityText(article.visibility),
            // Format cover image data
            coverImage: article.coverImage
              ? {
                  url: article.coverImage.url,
                  thumbnailUrl: article.coverImage.thumbnailUrl,
                  altText: article.coverImage.altText || article.title,
                }
              : undefined,
          };

        default:
          return baseArticle;
      }
    }) || [];

  // Layout-specific configuration
  const layoutConfig = {
    grid: {
      containerClass: "grid gap-6 sm:grid-cols-2",
      itemClass: "w-full",
    },
    list: {
      containerClass: "space-y-4",
      itemClass: "w-full",
    },
    card: {
      containerClass: "space-y-6",
      itemClass: "w-full",
    },
  };

  return {
    articles: formattedArticles,
    isLoading,
    error,
    refetch,
    layoutConfig: layoutConfig[layout],
    totalCount: data?.data?.metaData?.totalRecords || 0,
    hasMore: data?.data?.metaData?.hasNextPage || false,
    // Pagination info
    currentPage: data?.data?.metaData?.currentPage || 1,
    totalPages: data?.data?.metaData?.totalPages || 1,
    pageSize: data?.data?.metaData?.pageSize || 10,
    hasNextPage: data?.data?.metaData?.hasNextPage || false,
    hasPreviousPage: (data?.data?.metaData?.currentPage || 1) > 1,
    // Layout-specific helpers
    getStatusColor,
    getVisibilityIcon,
    getStatusBadge,
    getVisibilityBadge,
    getStatusText,
    getVisibilityText,
  };
}

/**
 * Hook for creating articles
 * Replaces the manual useCreateArticle implementation
 * Handles toast notifications internally for better separation of concerns
 */
export function useCreateArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateArticleDto) => {
      // Auto-set visibility to PRIVATE for drafts only
      const finalData = {
        ...data,
        visibility:
          data.status === ARTICLE_CONSTANTS.STATUS.DRAFT
            ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
            : data.visibility,
        // Ensure scheduledAt is properly set for scheduled articles
        scheduledAt:
          data.status === ARTICLE_CONSTANTS.STATUS.SCHEDULED
            ? data.scheduledAt
            : undefined,
      };

      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.createArticle(finalData);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.creating", "article") || "Creating article...",
        success: (article) => {
          // Invalidate and refetch articles list
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          // Add the new article to cache
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );

          // Handle different success scenarios with appropriate messages
          switch (article.status) {
            case ARTICLE_CONSTANTS.STATUS.DRAFT:
              return (
                t("status.draft", "article") +
                " " +
                t("schedule.success", "article")
              );
            case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
              return (
                t("schedule.success", "article") +
                " - " +
                t("schedule.scheduledFor", "article", {
                  date: article.scheduledAt?.toLocaleString(),
                })
              );
            default:
              return (
                t("status.published", "article") +
                " " +
                t("schedule.success", "article")
              );
          }
        },
        error: (error) => {
          console.error("Article creation error:", error);
          return error instanceof Error
            ? error.message
            : t("schedule.error", "article") || "Failed to create article";
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for updating articles
 */
export function useUpdateArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) => {
      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.updateArticle(id, data);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.updating", "article") || "Updating article...",
        success: (article) => {
          // Update the article in cache
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );

          // Invalidate articles list to refetch
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          return (
            t("status.published", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Article update error:", error);
          return t("schedule.error", "article") || "Failed to update article";
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for deleting articles
 */
export function useDeleteArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.deleteArticle(id);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.deleting", "article") || "Deleting article...",
        success: () => {
          // Remove article from cache
          queryClient.removeQueries({
            queryKey: queryKeys.articles.detail(id),
          });

          // Invalidate articles list
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          return (
            t("status.archived", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Article deletion error:", error);
          return t("schedule.error", "article") || "Failed to delete article";
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for managing article form state
 * Provides form state management for creating/editing articles
 */
export function useArticleFormState() {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<string>(
    ARTICLE_CONSTANTS.VISIBILITY.PUBLIC,
  );
  const [scheduledPublish, setScheduledPublish] = useState<Date | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Calculate word count and read time
  const wordCount = content
    ? content.split(/\s+/).filter((word) => word.length > 0).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute

  const validateForm = () => {
    if (!title.trim()) {
      setShowValidationErrors(true);
      return false;
    }
    if (!content.trim()) {
      setShowValidationErrors(true);
      return false;
    }
    setShowValidationErrors(false);
    return true;
  };

  const resetForm = () => {
    setCoverImage(null);
    setTitle("");
    setContent("");
    setTags([]);
    setVisibility(ARTICLE_CONSTANTS.VISIBILITY.PUBLIC);
    setScheduledPublish(null);
    setShowValidationErrors(false);
  };

  return {
    coverImage,
    setCoverImage,
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    scheduledPublish,
    setScheduledPublish,
    validateForm,
    resetForm,
    showValidationErrors,
    wordCount,
    readTimeMinutes,
  };
}
