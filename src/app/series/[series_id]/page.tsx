"use client";

import {
  BookOpen,
  CheckCircle2,
  Edit,
  ExternalLink,
  FileText,
  GitMerge,
  Heart,
  Share2,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import {
  ChaptersList,
  CharactersList,
  ContributionCard,
} from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/core/badge";
import { Card, CardContent } from "@/components/ui/core/card";
import { useContributions } from "@/hooks/admin/useContributions";
import { useCheckRole } from "@/hooks/permissions";
import { useSeriesFull } from "@/hooks/series";
import { usePageMetadata } from "@/hooks/ui";
import { useMediaQuery } from "@/hooks/ui/useSimpleHooks";
import { currentUserAtom } from "@/lib/auth";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import {
  ContributionEntityType,
  ContributionStatus,
} from "@/lib/types/contributions";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/utils/query-keys";
import { transformBackendSeries } from "@/lib/utils/series-utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

/**
 * Series Detail Page Component
 * MangaDex-style layout with banner, cover, metadata, and chapters
 * URL pattern: /series/[series_id]
 */
export default function SeriesDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const seriesId = params.series_id as string;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "chapters" | "characters" | "contribute"
  >("chapters");
  const [areLinksExpanded, setAreLinksExpanded] = useState(false);
  const [currentUser] = useAtom(currentUserAtom);
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Check if user has uploader role
  const { data: roleCheckData, isLoading: isCheckingRole } = useCheckRole(
    "uploader",
    !!currentUser,
  );
  const hasUploaderRole = roleCheckData?.hasRole ?? false;

  // Refetch role check when user logs in
  useEffect(() => {
    if (currentUser) {
      // User just logged in, refetch role check immediately
      queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.checkRole("uploader"),
      });
    }
  }, [currentUser, queryClient]);

  // Fetch full backend series data (single API call)
  const {
    data: backendSeries,
    isLoading,
    error,
    isFetched: isSeriesFetched,
  } = useSeriesFull(seriesId);

  // Transform to display format using utility function
  const series = backendSeries
    ? transformBackendSeries(backendSeries)
    : undefined;

  // Only enable chapters loading after series data is fully loaded
  const shouldLoadChapters =
    isSeriesFetched && !isLoading && !error && !!series;

  // Fetch approved contributions for this series - only when contribute tab is active
  const shouldLoadContributions =
    isSeriesFetched &&
    !isLoading &&
    !error &&
    !!series &&
    activeTab === "contribute";

  const { data: contributionsData, isLoading: contributionsLoading } =
    useContributions(
      {
        entityId: seriesId,
        entityType: ContributionEntityType.SERIES,
        status: ContributionStatus.APPROVED,
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        order: "DESC",
      },
      shouldLoadContributions,
    );

  // Update page metadata
  usePageMetadata({
    title: series?.title,
    description: series?.description
      ? series.description.substring(0, 160)
      : undefined,
    image: series?.coverUrl,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    keywords: series?.tags,
    type: "website",
  });

  // Show 404 if series not found
  if (!isLoading && !error && !series) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status text
  const getStatusText = (status: string | undefined) => {
    if (!status) return t("status.unknown", "series");
    const statusMap: Record<string, string> = {
      [SERIES_CONSTANTS.RELEASING_STATUS.FINISHED]: t(
        "status.finished",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.RELEASING]: t(
        "status.releasing",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.ONGOING]: t(
        "status.ongoing",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON]: t(
        "status.comingSoon",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.COMPLETED]: t(
        "status.completed",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.NOT_YET_RELEASED]: t(
        "status.notYetReleased",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.CANCELLED]: t(
        "status.cancelled",
        "series",
      ),
      [SERIES_CONSTANTS.RELEASING_STATUS.HIATUS]: t("status.hiatus", "series"),
    };
    return statusMap[status] || status;
  };

  // Get type text
  const getTypeText = (type: string | undefined) => {
    if (!type) return "N/A";
    const typeMap: Record<string, string> = {
      [SERIES_CONSTANTS.TYPE.ANIME]: t("type.anime", "series"),
      [SERIES_CONSTANTS.TYPE.MANGA]: t("type.manga", "series"),
      [SERIES_CONSTANTS.TYPE.LIGHT_NOVEL]: t("type.lightNovel", "series"),
      [SERIES_CONSTANTS.TYPE.VISUAL_NOVEL]: t("type.visualNovel", "series"),
      [SERIES_CONSTANTS.TYPE.VIDEO_GAME]: t("type.videoGame", "series"),
      [SERIES_CONSTANTS.TYPE.DOUJINSHI]: t("type.doujinshi", "series"),
      [SERIES_CONSTANTS.TYPE.WEB_NOVEL]: t("type.webNovel", "series"),
    };
    return typeMap[type] || type;
  };

  // Get format text
  const getFormatText = (format: string | undefined) => {
    if (!format) return "N/A";
    const formatMap: Record<string, string> = {
      [SERIES_CONSTANTS.FORMAT.TV]: t("format.tv", "series"),
      [SERIES_CONSTANTS.FORMAT.TV_SHORT]: t("format.tvShort", "series"),
      [SERIES_CONSTANTS.FORMAT.MOVIE]: t("format.movie", "series"),
      [SERIES_CONSTANTS.FORMAT.SPECIAL]: t("format.special", "series"),
      [SERIES_CONSTANTS.FORMAT.OVA]: t("format.ova", "series"),
      [SERIES_CONSTANTS.FORMAT.ONA]: t("format.ona", "series"),
      [SERIES_CONSTANTS.FORMAT.MUSIC]: t("format.music", "series"),
      [SERIES_CONSTANTS.FORMAT.MANGA]: t("format.manga", "series"),
      [SERIES_CONSTANTS.FORMAT.NOVEL]: t("format.novel", "series"),
      [SERIES_CONSTANTS.FORMAT.ONE_SHOT]: t("format.oneShot", "series"),
    };
    return formatMap[format] || format;
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection loading={isLoading} data={series} className="w-full">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="text-center max-w-md mx-auto">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-foreground mb-2">
                  {t("error.title", "series")}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {error.message || t("error.message", "series")}
                </p>
                <Link href="/">
                  <Button>{t("error.backToHome", "series")}</Button>
                </Link>
              </div>
            </div>
          )}

          {!error && series && (
            <>
              {/* Banner Image - Full width at top */}
              {series.bannerUrl && (
                <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 overflow-hidden">
                  <Image
                    src={series.bannerUrl}
                    alt={series.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  {/* Gradient overlay for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
                </div>
              )}

              {/* Main Content Container */}
              <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {/* Left Column - Cover Image and Metadata */}
                  <aside className="w-full md:w-56 lg:w-64 xl:w-80 flex-shrink-0">
                    {/* Cover Image - Overlapping banner on mobile, sidebar on desktop */}
                    <div
                      className={cn(
                        "relative w-full max-w-[200px] mx-auto md:max-w-none md:w-full aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg mb-3 sm:mb-4 md:mb-6",
                        series.bannerUrl &&
                          "-mt-16 sm:-mt-20 md:-mt-24 md:mt-0",
                      )}
                    >
                      <Image
                        src={series.coverUrl}
                        alt={series.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 200px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
                        priority
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mb-3 sm:mb-4 md:mb-6">
                      <Button
                        className="w-full text-sm sm:text-base h-10 sm:h-11"
                        size="default"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t("actions.read", "series")}
                      </Button>
                      {/* Show update button if user is authenticated */}
                      {currentUser && (
                        <Link
                          href={`/series/${seriesId}/contribute`}
                          className="w-full"
                        >
                          <Button
                            variant="secondary"
                            className="w-full text-sm sm:text-base h-10 sm:h-11"
                            size="default"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t(
                              "contribute.updateButton",
                              "series",
                              {},
                              "Update",
                            )}
                          </Button>
                        </Link>
                      )}
                      {/* Only show upload button if user is authenticated and has uploader role */}
                      {currentUser && !isCheckingRole && hasUploaderRole && (
                        <Link
                          href={`/series/${seriesId}/upload-segment`}
                          className="w-full"
                        >
                          <Button
                            variant="secondary"
                            className="w-full text-sm sm:text-base h-10 sm:h-11"
                            size="default"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {t("segments.title", "series")}
                          </Button>
                        </Link>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                          size="default"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          {t("actions.follow", "series")}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="border-t border-border pt-4 sm:pt-5 md:pt-6">
                      {/* Responsive Grid Layout: 2 cols mobile, 2 cols tablet, 1 col desktop */}
                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-3.5 md:gap-y-4 lg:gap-y-3 mb-4 sm:mb-5 md:mb-0">
                        {/* Status */}
                        {series.status && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.status", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {getStatusText(series.status)}
                            </p>
                          </div>
                        )}

                        {/* Type */}
                        {series.type && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.type", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {getTypeText(series.type)}
                            </p>
                          </div>
                        )}

                        {/* Format */}
                        {series.format && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.format", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {getFormatText(series.format)}
                            </p>
                          </div>
                        )}

                        {/* Chapters/Volumes */}
                        {backendSeries?.chapters !== undefined && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.chapters", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {backendSeries.chapters ??
                                t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Volumes */}
                        {backendSeries?.volumes !== undefined && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.volumes", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {backendSeries.volumes ??
                                t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Episodes (for anime) */}
                        {backendSeries?.episodes !== undefined && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.episodes", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {backendSeries.episodes ??
                                t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Start Date */}
                        {backendSeries?.startDate && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.startDate", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {formatDate(backendSeries.startDate)}
                            </p>
                          </div>
                        )}

                        {/* End Date */}
                        {backendSeries?.endDate && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.endDate", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {formatDate(backendSeries.endDate)}
                            </p>
                          </div>
                        )}

                        {/* Season */}
                        {backendSeries?.season && backendSeries?.seasonYear && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.season", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground capitalize break-words leading-relaxed">
                              {backendSeries.season} {backendSeries.seasonYear}
                            </p>
                          </div>
                        )}

                        {/* Source */}
                        {backendSeries?.source && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.source", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground capitalize break-words leading-relaxed">
                              {backendSeries.source.replace(/_/g, " ")}
                            </p>
                          </div>
                        )}

                        {/* Country of Origin */}
                        {backendSeries?.countryOfOrigin && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.country", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {backendSeries.countryOfOrigin}
                            </p>
                          </div>
                        )}

                        {/* Licensed */}
                        {backendSeries?.isLicensed !== undefined && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.licensed", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                              {backendSeries.isLicensed
                                ? t("metadata.yes", "series")
                                : t("metadata.no", "series")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Full-width items below grid */}
                      <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-3">
                        {/* NSFW Warning */}
                        {backendSeries?.isNsfw && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 sm:p-3 md:p-3.5">
                            <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-destructive">
                              {t("metadata.nsfw", "series")}
                            </p>
                          </div>
                        )}

                        {/* Score */}
                        {series.averageScore && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.score", "series")}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 text-yellow-500 fill-current" />
                              <p className="text-xs sm:text-sm md:text-sm text-foreground">
                                {Math.round(series.averageScore / 10)}%
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Popularity */}
                        {series.popularity && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.popularity", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-sm text-foreground">
                              {Math.floor(series.popularity).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {/* Authors */}
                        {backendSeries?.authorRoles &&
                          backendSeries.authorRoles.length > 0 && (
                            <div className="space-y-1 sm:space-y-1.5">
                              <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                                {t("metadata.authors", "series")}
                              </h3>
                              <div className="space-y-1.5 sm:space-y-2">
                                {backendSeries.authorRoles.map((authorRole) => {
                                  const author = authorRole.author;
                                  if (!author) return null;
                                  return (
                                    <div
                                      key={authorRole.id}
                                      className="flex items-start sm:items-center gap-1.5 sm:gap-2 flex-wrap"
                                    >
                                      <p className="text-xs sm:text-sm md:text-sm text-foreground break-words leading-relaxed">
                                        {author.name}
                                        {authorRole.role && (
                                          <span className="text-[10px] sm:text-xs md:text-xs text-muted-foreground ml-1">
                                            ({authorRole.role})
                                          </span>
                                        )}
                                      </p>
                                      {authorRole.isMain && (
                                        <Badge
                                          variant="default"
                                          className="text-[10px] sm:text-xs md:text-xs flex-shrink-0"
                                        >
                                          {t("metadata.main", "series")}
                                        </Badge>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {/* Genres */}
                        {backendSeries?.genres &&
                          backendSeries.genres.length > 0 && (
                            <div className="space-y-1 sm:space-y-1.5">
                              <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                                {t("metadata.genres", "series")}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {backendSeries.genres.map((genreItem) => {
                                  const genre = genreItem.genre;
                                  if (!genre) return null;
                                  return (
                                    <Badge
                                      key={genre.id || genre.name}
                                      variant="secondary"
                                      className="text-[10px] sm:text-xs md:text-xs px-2 py-0.5"
                                    >
                                      {genre.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        {/* Tags */}
                        {series.tags && series.tags.length > 0 && (
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                              {t("metadata.tags", "series")}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {series.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-[10px] sm:text-xs md:text-xs px-2 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* External Links */}
                        {backendSeries?.externalLinks &&
                          Object.keys(backendSeries.externalLinks).length >
                            0 && (
                            <div className="space-y-1 sm:space-y-1.5">
                              <h3 className="text-[11px] sm:text-xs md:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                                {t("metadata.links", "series")}
                              </h3>
                              <div className="flex flex-col gap-2 sm:gap-2.5">
                                {Object.entries(backendSeries.externalLinks)
                                  .slice(
                                    0,
                                    isMobile && !areLinksExpanded
                                      ? 2
                                      : undefined,
                                  )
                                  .map(([label, url], index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-xs sm:text-sm md:text-sm text-primary hover:underline py-1.5 sm:py-1 min-h-[44px] sm:min-h-0 transition-colors"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span className="break-words">
                                        {label}
                                      </span>
                                    </a>
                                  ))}
                                {/* Show More/Less button for mobile when more than 2 links */}
                                {isMobile &&
                                  Object.keys(backendSeries.externalLinks)
                                    .length > 2 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setAreLinksExpanded(!areLinksExpanded)
                                      }
                                      className="h-auto py-1.5 text-xs text-primary hover:text-primary/80 hover:underline min-h-[44px] justify-start"
                                    >
                                      {areLinksExpanded
                                        ? t("description.readLess", "series") ||
                                          "Show Less"
                                        : t("description.readMore", "series") ||
                                          `Show ${Object.keys(backendSeries.externalLinks).length - 2} more`}
                                    </Button>
                                  )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </aside>

                  {/* Right Column - Main Content */}
                  <main className="flex-1 min-w-0">
                    {/* Title Section */}
                    <header className="mb-4 sm:mb-5 md:mb-6">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight break-words">
                        {series.title}
                      </h1>

                      {/* Alternative Titles */}
                      {backendSeries?.title && (
                        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
                          {backendSeries.title.romaji &&
                            backendSeries.title.romaji !== series.title && (
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                <span className="font-medium">Romaji:</span>{" "}
                                {backendSeries.title.romaji}
                              </p>
                            )}
                          {backendSeries.title.english &&
                            backendSeries.title.english !== series.title && (
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                <span className="font-medium">English:</span>{" "}
                                {backendSeries.title.english}
                              </p>
                            )}
                          {backendSeries.title.native &&
                            backendSeries.title.native !== series.title && (
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                <span className="font-medium">Native:</span>{" "}
                                {backendSeries.title.native}
                              </p>
                            )}
                          {backendSeries.synonyms &&
                            backendSeries.synonyms.length > 0 && (
                              <div className="mt-2 sm:mt-3">
                                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5">
                                  Synonyms:
                                </p>
                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                  {backendSeries.synonyms.map(
                                    (synonym, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-[10px] sm:text-xs"
                                      >
                                        {synonym}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}

                      {/* Description - Expandable */}
                      {series.description && (
                        <div className="mt-4 sm:mt-5 md:mt-6">
                          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                            {t("description.title", "series")}
                          </h2>
                          <div className="space-y-2">
                            <p
                              className={cn(
                                "text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line break-words",
                                !isDescriptionExpanded &&
                                  "line-clamp-3 sm:line-clamp-4 md:line-clamp-5",
                              )}
                            >
                              {series.description}
                            </p>
                            {/* Show Read More/Less button if description is long */}
                            {series.description.length > 200 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setIsDescriptionExpanded(
                                    !isDescriptionExpanded,
                                  )
                                }
                                className="h-auto p-0 text-xs sm:text-sm text-primary hover:text-primary/80 hover:underline"
                              >
                                {isDescriptionExpanded
                                  ? t("description.readLess", "series") ||
                                    "Read Less"
                                  : t("description.readMore", "series") ||
                                    "Read More"}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab Navigation */}
                      <div className="mt-4 sm:mt-6 md:mt-8">
                        <Tabs
                          value={activeTab}
                          onValueChange={(value) =>
                            setActiveTab(
                              value as "chapters" | "characters" | "contribute",
                            )
                          }
                          className="w-full"
                        >
                          <TabsList className="w-full sm:w-auto">
                            <TabsTrigger value="chapters">
                              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>
                                {t("chapters.title", "series") || "Chapters"}
                              </span>
                            </TabsTrigger>
                            <TabsTrigger value="characters">
                              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>
                                {t("characters.title", "series") ||
                                  "Characters"}
                              </span>
                            </TabsTrigger>
                            <TabsTrigger value="contribute">
                              <GitMerge className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>
                                {t(
                                  "contribute.tabTitle",
                                  "series",
                                  {},
                                  "Contributions",
                                )}
                              </span>
                            </TabsTrigger>
                          </TabsList>
                          <TabsContents className="mt-4 sm:mt-6 md:mt-8">
                            <TabsContent value="chapters">
                              <ChaptersList
                                seriesId={seriesId}
                                enabled={
                                  shouldLoadChapters && activeTab === "chapters"
                                }
                              />
                            </TabsContent>
                            <TabsContent value="characters">
                              <CharactersList
                                seriesId={seriesId}
                                enabled={
                                  shouldLoadChapters &&
                                  activeTab === "characters"
                                }
                              />
                            </TabsContent>
                            <TabsContent value="contribute">
                              <AnimatedSection
                                loading={contributionsLoading}
                                data={contributionsData}
                              >
                                <div className="space-y-6">
                                  {/* Header */}
                                  <div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                                      {t(
                                        "contribute.approvedTitle",
                                        "series",
                                        {},
                                        "Approved Contributions",
                                      )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {t(
                                        "contribute.approvedDescription",
                                        "series",
                                        {},
                                        "List of approved contribution requests for this series",
                                      )}
                                    </p>
                                  </div>

                                  {/* Contributions List */}
                                  {contributionsData?.result &&
                                  contributionsData.result.length > 0 ? (
                                    <div className="space-y-4">
                                      {contributionsData.result.map(
                                        (contribution) => (
                                          <ContributionCard
                                            key={contribution.id}
                                            contribution={contribution}
                                          />
                                        ),
                                      )}
                                    </div>
                                  ) : (
                                    <Card className="border-dashed">
                                      <CardContent className="py-12">
                                        <div className="text-center space-y-2">
                                          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                                          <p className="text-sm font-medium text-muted-foreground">
                                            {t(
                                              "contribute.noApproved",
                                              "series",
                                              {},
                                              "No approved contributions yet",
                                            )}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {t(
                                              "contribute.noApprovedHint",
                                              "series",
                                              {},
                                              "Be the first to contribute to this series!",
                                            )}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </AnimatedSection>
                            </TabsContent>
                          </TabsContents>
                        </Tabs>
                      </div>
                    </header>
                  </main>
                </div>
              </div>
            </>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}
