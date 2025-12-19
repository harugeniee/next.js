"use client";

import {
  ArrowLeft,
  ArrowRight,
  Copy,
  FileText,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Minimize2,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { ScrambledImageCanvas } from "@/components/features/media/components/scrambled-image-canvas";
import { BreadcrumbNav } from "@/components/features/navigation";
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
import { Badge } from "@/components/ui/core/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useCurrentUser } from "@/hooks/auth";
import {
  useNextSegment,
  usePreviousSegment,
  useSegment,
  useSeries,
} from "@/hooks/series";
import { useBreadcrumb } from "@/hooks/ui";
import { currentUserAtom } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";

/**
 * Segment Detail Page Component
 * Displays segment information and attachments
 * URL pattern: /segments/[segment_id]
 */
export default function SegmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const segmentId = params.segment_id as string;

  // Fetch segment data by segmentId only
  const {
    data: segment,
    isLoading: isLoadingSegment,
    error: segmentError,
  } = useSegment(segmentId);

  // Get seriesId from segment data after it's loaded
  const seriesId = segment?.seriesId;

  // Fetch series data for context (only when we have seriesId from segment)
  const { data: seriesDisplay } = useSeries(seriesId || "");

  // Fetch next and previous segments
  const { data: nextSegment } = useNextSegment(segmentId);
  const { data: previousSegment } = usePreviousSegment(segmentId);

  // Check authentication status
  // Use both query and atom to ensure reactivity on logout
  const { data: currentUser } = useCurrentUser();
  const [userFromAtom] = useAtom(currentUserAtom);
  // Prefer atom value if available (more reactive), fallback to query data
  const effectiveUser = userFromAtom ?? currentUser;
  const isAuthenticated = !!effectiveUser;

  // Image size mode state
  type ImageSizeMode = "default" | "full" | "half" | "fit";
  const [imageSizeMode, setImageSizeMode] = useState<ImageSizeMode>("default");

  // Current page URL for sharing
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Helper function - Check if media is image
  const isImage = (url: string, type?: string, mimeType?: string) => {
    const mediaType = mimeType || type;
    if (mediaType) {
      return mediaType.startsWith("image/");
    }
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  // Get all image attachments - use useMemo to ensure it's computed before useEffect
  const imageAttachments = useMemo(() => {
    if (!segment) return [];
    return (segment.attachments || segment.media || []).filter((media) =>
      isImage(media.url, media.type, media.mimeType),
    );
  }, [segment]);

  // Track which images are ready to be unscrambled (sequential processing)
  // Only unscramble images up to this index
  // Parent component controls sequential processing to avoid conflicts with child timing
  const [maxUnscrambleIndex, setMaxUnscrambleIndex] = useState<number>(-1);

  // Process images sequentially from top to bottom
  // This mechanism alone handles timing - no need for child startDelay calculation
  useEffect(() => {
    // Reset when user logs out or when not authenticated
    if (!isAuthenticated || imageAttachments.length === 0) {
      setMaxUnscrambleIndex(-1);
      return;
    }

    // Reset when authentication state changes (login) or segment changes
    setMaxUnscrambleIndex(-1);

    // Process images one by one with delay between each
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    const processNextImage = () => {
      if (currentIndex >= imageAttachments.length) {
        return;
      }

      // Mark this image as ready to unscramble
      // By the time this state updates and component renders, timing is already correct
      setMaxUnscrambleIndex(currentIndex);

      // Process next image after a delay (to avoid overwhelming the browser)
      currentIndex++;
      if (currentIndex < imageAttachments.length) {
        // Delay between each image to ensure smooth sequential processing
        timeoutId = setTimeout(processNextImage, 300);
      }
    };

    // Start processing from the first image after a short initial delay
    timeoutId = setTimeout(processNextImage, 100);

    return () => {
      // Cleanup: cancel any pending timeouts when auth state changes or component unmounts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, imageAttachments]);

  // Show 404 if segment not found
  if (!isLoadingSegment && !segmentError && !segment) {
    notFound();
  }

  // Get segment number for breadcrumb
  const getSegmentNumberForBreadcrumb = () => {
    if (!segment) return undefined;
    if (segment.subNumber) {
      return `${segment.number}.${segment.subNumber}`;
    }
    return segment.number.toString();
  };

  // Breadcrumb items
  const breadcrumbItems = useBreadcrumb(undefined, {
    series_id: seriesId,
    series_title: seriesDisplay?.title,
    segment_number: getSegmentNumberForBreadcrumb(),
  });

  // Get segment number display
  const getSegmentNumber = () => {
    if (!segment) return "";
    if (segment.subNumber) {
      return `${segment.number}.${segment.subNumber}`;
    }
    return segment.number.toString();
  };

  // Get segment type text
  const getSegmentTypeText = () => {
    if (!segment) return "";
    const typeMap: Record<string, string> = {
      chapter: t("segments.type.chapter", "series"),
      episode: t("segments.type.episode", "series"),
      trailer: t("segments.type.trailer", "series"),
    };
    return typeMap[segment.type] || segment.type;
  };

  // Get status text
  const getStatusText = () => {
    if (!segment) return "";
    const statusMap: Record<string, string> = {
      active: t("segments.status.active", "series"),
      inactive: t("segments.status.inactive", "series"),
      pending: t("segments.status.pending", "series"),
      archived: t("segments.status.archived", "series"),
    };
    return statusMap[segment.status] || segment.status;
  };

  // Get access type text
  const getAccessTypeText = () => {
    if (!segment) return "";
    const accessMap: Record<string, string> = {
      free: t("segments.accessType.free", "series"),
      paid: t("segments.accessType.paid", "series"),
      subscription: t("segments.accessType.subscription", "series"),
      membership: t("segments.accessType.membership", "series"),
    };
    return accessMap[segment.accessType] || segment.accessType;
  };

  // Get previous navigation text based on segment type
  const getPreviousNavText = () => {
    if (!segment) return t("segments.previous", "series") || "Previous";
    if (segment.type === "chapter") {
      return t("segments.previousChapter", "series") || "Previous Chapter";
    }
    if (segment.type === "episode") {
      return t("segments.previousEpisode", "series") || "Previous Episode";
    }
    return t("segments.previous", "series") || "Previous";
  };

  // Get next navigation text based on segment type
  const getNextNavText = () => {
    if (!segment) return t("segments.next", "series") || "Next";
    if (segment.type === "chapter") {
      return t("segments.nextChapter", "series") || "Next Chapter";
    }
    if (segment.type === "episode") {
      return t("segments.nextEpisode", "series") || "Next Episode";
    }
    return t("segments.next", "series") || "Next";
  };

  // Scroll to top when segment changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [segmentId]);

  // Get current URL for sharing
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [segmentId]);

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const urlToCopy = currentUrl || window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
      toast.success(
        t("segments.linkCopied", "series") || "Link copied to clipboard!",
      );
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error(
        t("segments.linkCopyError", "series") ||
          "Failed to copy link. Please try again.",
      );
    }
  };

  // Navigation Section Component
  const NavigationSection = ({ className }: { className?: string }) => (
    <div className={className}>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                if (previousSegment?.id) {
                  router.push(`/segments/${previousSegment.id}`);
                }
              }}
              disabled={!previousSegment}
              className="gap-2 w-full sm:w-auto min-w-[140px]"
            >
              <ArrowLeft className="h-5 w-5" />
              {previousSegment
                ? `${getPreviousNavText()}${previousSegment.number ? ` ${previousSegment.number}` : ""}`
                : getPreviousNavText()}
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                if (nextSegment?.id) {
                  router.push(`/segments/${nextSegment.id}`);
                }
              }}
              disabled={!nextSegment}
              className="gap-2 w-full sm:w-auto min-w-[140px]"
            >
              {nextSegment
                ? `${getNextNavText()}${nextSegment.number ? ` ${nextSegment.number}` : ""}`
                : getNextNavText()}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection
        loading={isLoadingSegment}
        data={segment}
        className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
      >
        <Skeletonize loading={isLoadingSegment}>
          {segmentError && (
            <div className="text-center max-w-md mx-auto py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Segment Not Found
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {segmentError.message ||
                  "The segment you're looking for doesn't exist."}
              </p>
              {seriesId && (
                <Link href={`/series/${seriesId}`}>
                  <Button variant="outline">Back to Series</Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="outline" className={seriesId ? "ml-2" : ""}>
                  Back to Home
                </Button>
              </Link>
            </div>
          )}

          {!segmentError && segment && (
            <>
              {/* Breadcrumb Navigation */}
              <div className="mb-4 sm:mb-6">
                <BreadcrumbNav items={breadcrumbItems} />
              </div>

              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {getSegmentTypeText()} {getSegmentNumber()}
                      {segment.title && `: ${segment.title}`}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getSegmentTypeText()}
                      </Badge>
                      <Badge
                        variant={
                          segment.status === "active"
                            ? "default"
                            : segment.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {getStatusText()}
                      </Badge>
                      {segment.isNsfw && (
                        <Badge variant="destructive" className="text-xs">
                          NSFW
                        </Badge>
                      )}
                      {segment.accessType !== "free" && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Lock className="h-3 w-3" />
                          {getAccessTypeText()}
                        </Badge>
                      )}
                    </div>
                    {/* Copy Link Section */}
                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
                      {/* Link Display */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md">
                          <span className="text-xs sm:text-sm text-muted-foreground truncate flex-1 min-w-0">
                            {currentUrl || ""}
                          </span>
                        </div>
                      </div>
                      {/* Copy Link Button */}
                      <Button
                        variant="default"
                        size="default"
                        onClick={handleCopyLink}
                        className="gap-2 shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                        {t("segments.copyLink", "series") || "Copy Link"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Navigation Section */}
              <NavigationSection className="mb-4 sm:mb-6" />

              <div className="space-y-4 sm:space-y-6">
                {/* Main Content - Manga Reader Style */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Summary */}
                  {segment.summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">
                          Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                          {segment.summary}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description */}
                  {segment.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">
                          Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                          {segment.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Manga Reader - Continuous Scroll View */}
                  {imageAttachments.length > 0 && (
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                          <div>
                            <CardTitle className="text-base sm:text-lg">
                              {getSegmentTypeText()} {getSegmentNumber()}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {imageAttachments.length} pages
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Image Size Selector */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  {imageSizeMode === "default" && (
                                    <>
                                      <Maximize2 className="h-4 w-4" />
                                      Default
                                    </>
                                  )}
                                  {imageSizeMode === "full" && (
                                    <>
                                      <Maximize2 className="h-4 w-4" />
                                      Full Width
                                    </>
                                  )}
                                  {imageSizeMode === "half" && (
                                    <>
                                      <Minimize2 className="h-4 w-4" />
                                      Half Width
                                    </>
                                  )}
                                  {imageSizeMode === "fit" && (
                                    <>
                                      <ZoomIn className="h-4 w-4" />
                                      Fit Image
                                    </>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Image Size
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("default")}
                                  className={cn(
                                    imageSizeMode === "default" && "bg-accent",
                                  )}
                                >
                                  <Maximize2 className="h-4 w-4 mr-2" />
                                  Default (max-w-5xl)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("full")}
                                  className={cn(
                                    imageSizeMode === "full" && "bg-accent",
                                  )}
                                >
                                  <Maximize2 className="h-4 w-4 mr-2" />
                                  Full Width
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("half")}
                                  className={cn(
                                    imageSizeMode === "half" && "bg-accent",
                                  )}
                                >
                                  <Minimize2 className="h-4 w-4 mr-2" />
                                  Half Width
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setImageSizeMode("fit")}
                                  className={cn(
                                    imageSizeMode === "fit" && "bg-accent",
                                  )}
                                >
                                  <ZoomIn className="h-4 w-4 mr-2" />
                                  Fit Image (Original Size)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="gap-2"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Top
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {/* Continuous Scroll Container */}
                        <div className="bg-black/5 dark:bg-black/20">
                          {/* Image List - Load sequentially from top to bottom */}
                          <div className="space-y-0">
                            {imageAttachments.map((media, index) => (
                              <div
                                key={media.id}
                                className="group relative w-full bg-background border-b border-border last:border-b-0"
                              >
                                {/* Page Number Indicator */}
                                <div className="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 border border-border">
                                  <span className="text-xs font-medium text-foreground">
                                    Page {index + 1} / {imageAttachments.length}
                                  </span>
                                </div>

                                {/* Image Container - Full width, auto height */}
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-full py-2 sm:py-4",
                                    imageSizeMode === "full" &&
                                      "px-0 -mx-4 sm:-mx-6 md:-mx-8",
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "relative",
                                      imageSizeMode === "default" &&
                                        "w-full max-w-5xl",
                                      imageSizeMode === "full" && "w-screen",
                                      imageSizeMode === "half" &&
                                        "w-full sm:w-1/2",
                                      imageSizeMode === "fit" && "w-auto",
                                    )}
                                  >
                                    <Skeletonize loading={false}>
                                      {isAuthenticated && media.id ? (
                                        // Unscramble image for authenticated users (sequential processing)
                                        index <= maxUnscrambleIndex ? (
                                          // Render ScrambledImageCanvas when it's this image's turn
                                          <div className="relative">
                                            {/* Show scrambled image as placeholder while unscrambling */}
                                            <Image
                                              src={media.url}
                                              alt={`Page ${index + 1} - ${media.name || ""} (scrambled placeholder)`}
                                              width={1200}
                                              height={1600}
                                              className={cn(
                                                "absolute inset-0 w-full h-full object-contain opacity-50",
                                                imageSizeMode === "fit"
                                                  ? "h-auto w-auto max-w-full"
                                                  : "",
                                              )}
                                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                                            />
                                            {/* Unscrambled image overlay */}
                                            <ScrambledImageCanvas
                                              mediaId={media.id}
                                              src={media.url}
                                              alt={`Page ${index + 1} - ${media.name || ""}`}
                                              className={cn(
                                                "relative z-10",
                                                imageSizeMode === "fit"
                                                  ? "h-auto w-auto max-w-full object-contain"
                                                  : "w-full h-auto object-contain",
                                              )}
                                              animate={true}
                                              animationDuration={500}
                                              // No startDelay needed - parent's maxUnscrambleIndex mechanism
                                              // already ensures sequential processing with correct timing
                                              // By the time this component renders (index <= maxUnscrambleIndex),
                                              // it's already scheduled correctly by the parent
                                            />
                                          </div>
                                        ) : (
                                          // Show loading state while waiting to unscramble
                                          <div className="relative w-full flex items-center justify-center min-h-[400px] sm:min-h-[600px] bg-muted/30 rounded-md">
                                            <div className="flex flex-col items-center gap-3 z-10">
                                              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                              <p className="text-sm text-muted-foreground">
                                                {index ===
                                                maxUnscrambleIndex + 1
                                                  ? "Unscrambling image..."
                                                  : `Waiting... (${index - maxUnscrambleIndex - 1} ahead)`}
                                              </p>
                                            </div>
                                            {/* Show scrambled image as placeholder */}
                                            <Image
                                              src={media.url}
                                              alt={`Page ${index + 1} - ${media.name || ""} (scrambled)`}
                                              width={1200}
                                              height={1600}
                                              className="absolute inset-0 w-full h-full object-contain opacity-30 blur-sm"
                                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                                            />
                                          </div>
                                        )
                                      ) : (
                                        // Show scrambled image for non-authenticated users
                                        <Image
                                          src={media.url}
                                          alt={`Page ${index + 1} - ${media.name || ""}`}
                                          width={1200}
                                          height={1600}
                                          className={cn(
                                            imageSizeMode === "fit"
                                              ? "h-auto w-auto max-w-full object-contain"
                                              : "w-full h-auto object-contain",
                                          )}
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1200px"
                                          priority={index < 3}
                                          loading={index < 3 ? "eager" : "lazy"}
                                        />
                                      )}
                                    </Skeletonize>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bottom Info Bar */}
                          <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border px-4 py-3">
                            <div className="flex items-center justify-center max-w-4xl mx-auto">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                  Total: {imageAttachments.length} pages
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                  className="gap-2"
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                  Back to Top
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* No Images */}
                  {imageAttachments.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                          No images available for this segment
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bottom Navigation Section */}
                  <NavigationSection className="mt-6 sm:mt-8" />
                </div>
              </div>
            </>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}
