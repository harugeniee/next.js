"use client";

import { AuthorCard } from "@/components/features/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button, TagsInputComponent } from "@/components/ui";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { useArticle } from "@/hooks/article/useArticleQuery";
import { useReactions } from "@/hooks/reactions";
import { ARTICLE_CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Clock, Eye, FileText, Heart, Share2, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Article View Page Component
 * Displays a single article with full content, metadata, and author information
 * URL pattern: /article/[article_id]/[article_slug]
 * Layout inspired by note.jp design
 */
export default function ArticleViewPage() {
  const params = useParams();
  const { t } = useI18n();

  const articleId = params.article_id as string;

  // Fetch article data
  const { data: article, isLoading, error } = useArticle(articleId);

  // Initialize reactions using React Query
  const { data: reactionsData } = useReactions(articleId);

  // Derive reaction data from React Query
  const likeCount =
    reactionsData?.data?.find((r) => r.kind === "like")?.count || 0;

  // For now, we'll assume user hasn't liked (this should be fetched separately)
  const isLiked = false; // TODO: Implement user reaction status check

  // Initialize reactions when article is loaded
  useEffect(() => {
    if (article && !isLoading && !error) {
      // Reactions are automatically fetched by React Query
      // No need for manual fetching
    }
  }, [article, isLoading, error]);

  // Show 404 if article not found
  if (!isLoading && !error && !article) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get visibility text
  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case ARTICLE_CONSTANTS.VISIBILITY.PUBLIC:
        return t("visibility.public", "article");
      case ARTICLE_CONSTANTS.VISIBILITY.UNLISTED:
        return t("visibility.unlisted", "article");
      case ARTICLE_CONSTANTS.VISIBILITY.PRIVATE:
        return t("visibility.private", "article");
      default:
        return visibility;
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case ARTICLE_CONSTANTS.STATUS.DRAFT:
        return t("status.draft", "article");
      case ARTICLE_CONSTANTS.STATUS.PUBLISHED:
        return t("status.published", "article");
      case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
        return t("status.scheduled", "article");
      case ARTICLE_CONSTANTS.STATUS.ARCHIVED:
        return t("status.archived", "article");
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto px-4">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {t("notFound", "article")}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {error.message ||
                    "Something went wrong while loading the article."}
                </p>
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    {t("backToHome", "article")}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!error && article && (
            <article className="max-w-4xl mx-auto">
              {/* Back Button - Mobile optimized */}
              <div className="mb-4 sm:mb-6">
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    ← {t("backToHome", "article")}
                  </Button>
                </Link>
              </div>

              {/* Cover Image Hero Section - Clean and modern */}
              {article.coverImage && (
                <div className="mb-6 sm:mb-8">
                  <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-lg">
                    <Image
                      src={article.coverImage.url}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
                      priority
                    />
                    {/* Subtle gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
              )}

              {/* Article Header */}
              <header className="mb-6 sm:mb-8">
                {/* Title - Clean typography */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
                  {article.title}
                </h1>

                {/* Author and Metadata Row - Clean layout */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        User ID {article.userId}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {article.publishedAt
                          ? formatDate(article.publishedAt)
                          : formatDate(article.createdAt ?? new Date())}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* <CompactLikeButton articleId={articleId} /> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 justify-center"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {t("actions.share", "article")}
                      </span>
                    </Button>
                  </div>
                </div>

              

                {/* Article Metadata - Clean badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                  {/* Visibility */}
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {getVisibilityText(article.visibility)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {getStatusText(article.status)}
                    </span>
                  </div>
                </div>

                {/* Tags - Interactive Tags Component */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {t("tags", "article")}
                      </span>
                    </div>
                    <TagsInputComponent
                      tags={article.tags.map((tag: string) => ({
                        id: tag.toLowerCase().replace(/\s+/g, "-"),
                        label: tag,
                      }))}
                      selectedTags={article.tags.map((tag: string) =>
                        tag.toLowerCase().replace(/\s+/g, "-"),
                      )}
                      onTagsChange={() => {}} // Read-only for article view
                      onTagCreate={() => {}} // Not needed for read-only view
                      placeholder={
                        t("actions.search", "common") +
                        " " +
                        t("tags", "article").toLowerCase() +
                        "..."
                      }
                      allowCreate={false}
                      allowRemove={false}
                      disabled={true}
                      className="w-full"
                    />
                  </div>
                )}
              </header>

              {/* Article Content - Clean typography */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-p:leading-relaxed">
                <ContentRenderer
                  content={article.content}
                  className="article-content"
                  enableSyntaxHighlighting={true}
                  useTipTapStyling={true}
                  variant="default"
                />
              </div>

              {/* Article Engagement Stats - Moved below content, above author card */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8 sm:mt-10 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-border">
                {/* Like Count */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Heart
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6 transition-colors",
                        isLiked && "text-red-500 fill-current",
                      )}
                    />
                    <span className="text-lg sm:text-xl font-semibold text-foreground">
                      {likeCount}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {likeCount === 1
                      ? t("actions.reactions.like", "article")
                      : t("actions.reactions.likes", "article")}
                  </span>
                </div>

                {/* Read Time */}
                {article.readTimeMinutes && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      <span className="text-lg sm:text-xl font-semibold text-foreground">
                        {article.readTimeMinutes}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {t("actions.readTime", "article")}
                    </span>
                  </div>
                )}

                {/* Word Count */}
                {article.wordCount && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      <span className="text-lg sm:text-xl font-semibold text-foreground">
                        {article.wordCount}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {t("actions.wordCount", "article")}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Profile Card - Using reusable component */}
              <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-border">
                <AuthorCard
                  author={{
                    id: article.userId,
                    name: `User ID ${article.userId}`,
                    bio: "This is a sample author bio. In a real application, this would come from the user's profile data. The author shares insights about technology, business, and innovation through their articles.",
                    website: "https://example.com",
                    socialLinks: {
                      github: "#",
                      x: "#",
                      instagram: "#",
                      rss: "#",
                    },
                    stats: {
                      followers: 1234,
                      articles: 42,
                    },
                  }}
                  onFollow={(authorId) => {
                    console.log(`Following author: ${authorId}`);
                    // TODO: Implement follow functionality
                  }}
                />
              </div>
            </article>
          )}
        </Skeletonize>
      </div>
    </div>
  );
}
