"use client";

import { useAtom } from "jotai";
import {
    BookOpen,
    Calendar,
    EyeOff,
    Filter,
    Grid3X3,
    List,
    Loader2,
    Search,
    Square,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent } from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useSeries, useUserSegmentsInfinite } from "@/hooks/series";
import { currentUserAtom } from "@/lib/auth";
import type { SeriesSegment } from "@/lib/interface/series.interface";
import type { PaginationCursor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserSegmentsLayoutProps {
  readonly userId: string;
  readonly initialLayout?: "grid" | "list" | "card";
  readonly className?: string;
}

/**
 * User Segments Layout Component
 * Displays user's uploaded segments with multiple layout options
 */
export function UserSegmentsLayout({
  userId,
  initialLayout = "grid",
  className = "",
}: UserSegmentsLayoutProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [currentUser] = useAtom(currentUserAtom);
  const [layout, setLayout] = useState<"grid" | "list" | "card">(initialLayout);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch segments with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useUserSegmentsInfinite(
    userId,
    true,
    typeFilter !== "all" ? typeFilter : undefined,
    statusFilter !== "all" ? statusFilter : undefined,
  );

  // Flatten all pages into a single array
  const segments =
    data?.pages.flatMap(
      (page) => (page as PaginationCursor<SeriesSegment>).result,
    ) ?? [];

  // Filter segments by search query (client-side filtering)
  const filteredSegments = segments.filter((segment) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      segment.title?.toLowerCase().includes(query) ||
      segment.number.toString().includes(query) ||
      segment.seriesId.toLowerCase().includes(query)
    );
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isOwnProfile = currentUser?.id === userId;

  const handleSegmentClick = (segmentId: string) => {
    router.push(`/segments/${segmentId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (type: "type" | "status", value: string) => {
    if (type === "type") {
      setTypeFilter(value);
    } else {
      setStatusFilter(value);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {t("error.loadingSegments", "user") || "Failed to load segments"}
        </p>
        <Button onClick={() => fetchNextPage()} variant="outline">
          {t("actions.retry", "common") || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="space-y-6">
        {/* Title and Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("userSegmentsTitle", "user") || "Segments"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredSegments.length}{" "}
                  {filteredSegments.length === 1 ? "segment" : "segments"}
                </p>
              </div>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-xl p-1">
              <Button
                variant={layout === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayout("grid")}
                className={cn(
                  "h-9 px-3 transition-all duration-200",
                  layout === "grid" && "shadow-sm",
                )}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={layout === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayout("list")}
                className={cn(
                  "h-9 px-3 transition-all duration-200",
                  layout === "list" && "shadow-sm",
                )}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={layout === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayout("card")}
                className={cn(
                  "h-9 px-3 transition-all duration-200",
                  layout === "card" && "shadow-sm",
                )}
              >
                <Square className="h-4 w-4 mr-2" />
                Card
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                t("searchSegmentsPlaceholder", "user") || "Search segments..."
              }
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
                  Type: {typeFilter === "all" ? "All" : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("type", "all")}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("type", "chapter")}
                >
                  Chapter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("type", "episode")}
                >
                  Episode
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("type", "trailer")}
                >
                  Trailer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "all")}
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "pending")}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "inactive")}
                >
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "archived")}
                >
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Segments Grid/List */}
      <AnimatedSection loading={isLoading} data={segments}>
        <Skeletonize loading={isLoading}>
          {filteredSegments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("contentNoSegments", "user") || "No segments yet"}
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                  {isOwnProfile
                    ? t("contentNoSegmentsDescriptionOwn", "user") ||
                      "Start uploading segments to share your content."
                    : t("contentNoSegmentsDescription", "user") ||
                      "This user hasn't uploaded any segments yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={cn(
                layout === "grid" &&
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
                layout === "list" && "space-y-4",
                layout === "card" &&
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
              )}
            >
              {filteredSegments.map((segment) => (
                <SegmentItem
                  key={segment.id}
                  segment={segment}
                  layout={layout}
                  onSegmentClick={handleSegmentClick}
                  t={t}
                />
              ))}
            </div>
          )}
        </Skeletonize>
      </AnimatedSection>

      {/* Load More Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {t("chapters.loading", "series") || "Loading more segments..."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* End of list indicator */}
      {!hasNextPage && filteredSegments.length > 0 && (
        <div className="text-center py-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("chapters.endOfList", "series") || "No more segments"}
          </p>
        </div>
      )}
    </div>
  );
}

interface SegmentItemProps {
  readonly segment: SeriesSegment;
  readonly layout: "grid" | "list" | "card";
  readonly onSegmentClick: (id: string) => void;
  readonly t: (key: string, ns?: string) => string;
}

/**
 * Segment Item Component
 * Displays individual segment in different layouts
 */
function SegmentItem({ segment, layout, onSegmentClick, t }: SegmentItemProps) {
  // Use series data from segment response (included in API response)
  // Fallback to fetching if not available (for backward compatibility)
  const seriesFromSegment = segment.series;
  const { data: seriesFromApi } = useSeries(
    segment.seriesId,
    !seriesFromSegment, // Only fetch if series data is not included in segment
  );

  // Prefer series data from segment response, fallback to API fetch
  const series = seriesFromSegment || seriesFromApi;

  // Format segment number
  const segmentNumber = segment.subNumber
    ? `${segment.number}.${segment.subNumber}`
    : segment.number.toString();

  // Format status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
      }
    > = {
      active: {
        label: t("segments.status.active", "series"),
        variant: "default",
      },
      pending: {
        label: t("segments.status.pending", "series"),
        variant: "secondary",
      },
      inactive: {
        label: t("segments.status.inactive", "series"),
        variant: "outline",
      },
      archived: {
        label: t("segments.status.archived", "series"),
        variant: "outline",
      },
    };
    return statusMap[status] || { label: status, variant: "outline" };
  };

  const statusInfo = getStatusBadge(segment.status);

  // Format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get series cover image
  // Handle both transformed Series (from API) and BackendSeries (from segment response)
  const coverImage = (() => {
    if (!series) return "/default-article-cover.svg";

    // If series is transformed (has coverUrl), use it directly
    if ("coverUrl" in series && typeof series.coverUrl === "string") {
      return series.coverUrl;
    }

    // If series is BackendSeries (from segment response), extract from coverImageUrls
    const backendSeries = series as {
      coverImage?: { url?: string };
      coverImageUrls?: Record<string, string>;
    };

    if (backendSeries.coverImage?.url) {
      return backendSeries.coverImage.url;
    }
    if (backendSeries.coverImageUrls) {
      // Try different sizes in order of preference
      if (backendSeries.coverImageUrls.large) {
        return backendSeries.coverImageUrls.large;
      }
      if (backendSeries.coverImageUrls.medium) {
        return backendSeries.coverImageUrls.medium;
      }
      if (backendSeries.coverImageUrls.extraLarge) {
        return backendSeries.coverImageUrls.extraLarge;
      }
      // If there's any URL in the object, use the first one
      const firstUrl = Object.values(backendSeries.coverImageUrls).find(
        (url) => typeof url === "string" && url.startsWith("http"),
      );
      if (firstUrl) {
        return firstUrl;
      }
    }

    return "/default-article-cover.svg";
  })();

  // Get series title
  // Handle both transformed Series (from API) and BackendSeries (from segment response)
  const seriesTitle = (() => {
    if (!series) return "Unknown Series";

    // If series is transformed (has title as string), use it directly
    if ("title" in series && typeof series.title === "string") {
      return series.title;
    }

    // If series is BackendSeries (from segment response), extract from title object
    const backendSeries = series as {
      title?: {
        userPreferred?: string;
        romaji?: string;
        english?: string;
        native?: string;
      };
    };

    if (backendSeries.title) {
      return (
        backendSeries.title.userPreferred ||
        backendSeries.title.romaji ||
        backendSeries.title.english ||
        backendSeries.title.native ||
        "Unknown Series"
      );
    }

    return "Unknown Series";
  })();

  if (layout === "grid") {
    return (
      <Card
        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden cursor-pointer flex flex-col sm:flex-row sm:items-stretch p-0"
        onClick={() => onSegmentClick(segment.id)}
      >
        {/* Cover Image - Left side */}
        <div className="relative w-full sm:w-2/5 h-48 sm:h-full overflow-hidden flex-shrink-0 bg-muted m-0 p-0">
          <div className="relative w-full h-full m-0 p-0 leading-none">
            <Image
              src={coverImage}
              alt={seriesTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 40vw"
            />
            {/* Status Badge Overlay */}
            <div className="absolute top-3 left-3">
              <Badge variant={statusInfo.variant} className="text-xs">
                {statusInfo.label}
              </Badge>
            </div>
            {segment.isNsfw && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  NSFW
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Right side */}
        <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-6 min-w-0">
          {/* Series Title */}
          <Link
            href={`/series/${segment.seriesId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {seriesTitle}
          </Link>

          {/* Segment Title */}
          <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {segment.title
              ? `${t("chapters.title", "series")} ${segmentNumber}: ${segment.title}`
              : `${t("chapters.title", "series")} ${segmentNumber}`}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(segment.createdAt)}
            </span>
            {segment.type && (
              <Badge variant="outline" className="text-xs">
                {segment.type}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (layout === "list") {
    return (
      <Card
        className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden cursor-pointer"
        onClick={() => onSegmentClick(segment.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Cover Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={coverImage}
                alt={seriesTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="96px"
              />
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              {/* Series Title */}
              <Link
                href={`/series/${segment.seriesId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {seriesTitle}
              </Link>

              {/* Segment Title */}
              <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {segment.title
                  ? `${t("chapters.title", "series")} ${segmentNumber}: ${segment.title}`
                  : `${t("chapters.title", "series")} ${segmentNumber}`}
              </h3>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant={statusInfo.variant} className="text-xs">
                  {statusInfo.label}
                </Badge>
                {segment.isNsfw && (
                  <Badge variant="destructive" className="text-xs">
                    <EyeOff className="h-3 w-3 mr-1" />
                    NSFW
                  </Badge>
                )}
                {segment.type && (
                  <Badge variant="outline" className="text-xs">
                    {segment.type}
                  </Badge>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(segment.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Card layout
  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card via-card to-card/80 overflow-hidden cursor-pointer flex flex-col sm:flex-row sm:items-stretch p-0"
      onClick={() => onSegmentClick(segment.id)}
    >
      {/* Cover Image - Left side */}
      <div className="relative w-full sm:w-2/5 h-56 sm:h-full overflow-hidden flex-shrink-0 bg-muted m-0 p-0">
        <div className="relative w-full h-full m-0 p-0 leading-none">
          <Image
            src={coverImage}
            alt={seriesTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 40vw"
          />
          {/* Status Badges Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge variant={statusInfo.variant} className="text-sm">
              {statusInfo.label}
            </Badge>
            {segment.isNsfw && (
              <Badge variant="destructive" className="text-sm">
                <EyeOff className="h-3 w-3 mr-1" />
                NSFW
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Right side */}
      <div className="flex flex-1 flex-col space-y-4 p-6 min-w-0">
        {/* Series Title */}
        <Link
          href={`/series/${segment.seriesId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
        >
          {seriesTitle}
        </Link>

        {/* Segment Title */}
        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {segment.title
            ? `${t("chapters.title", "series")} ${segmentNumber}: ${segment.title}`
            : `${t("chapters.title", "series")} ${segmentNumber}`}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(segment.createdAt)}
          </span>
          {segment.type && (
            <Badge variant="outline" className="text-sm">
              {segment.type}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
