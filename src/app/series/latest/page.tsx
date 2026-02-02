"use client";

import { useEffect, useRef } from "react";

import { SeriesCard } from "@/components/features/series/series-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useLatestSeriesInfinite } from "@/hooks/series/useSeriesQuery";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Series } from "@/lib/interface/series.interface";

/**
 * Latest Series Page
 * Displays series sorted by most recently updated, with infinite scroll.
 * Uses GET /series/cursor with sortBy=updatedAt, order=DESC.
 */
export default function SeriesLatestPage() {
  const { t } = useI18n();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  usePageMetadata({
    title: t("latestUpdates", "series"),
    description:
      t("latestPageDescription", "series") ||
      t("viewLastUpdatedTitles", "series"),
  });

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLatestSeriesInfinite();

  const series: Series[] =
    data?.pages.flatMap((page) => page.result) ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

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

    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 lg:py-8 space-y-6">
        {/* Breadcrumb */}
        <AnimatedSection loading={false} data={true}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  {t("nav.breadcrumb.home", "common")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("latestUpdatesNav", "series")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedSection>

        {/* Page Header */}
        <AnimatedSection loading={false} data={true}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("latestUpdates", "series")}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {t("viewLastUpdatedTitles", "series")}
            </p>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection loading={isLoading} data={series} className="w-full">
          <Skeletonize loading={isLoading}>
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-32 rounded-lg border border-border"
                  />
                ))}
              </div>
            )}
            {!isLoading && series.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {series.map((item, index) => (
                    <SeriesCard
                      key={item.id}
                      series={item}
                      variant="anichart"
                      startDate={item.startDate}
                      totalEpisodes={item.episodes}
                      genres={
                        item.genres && item.genres.length > 0
                          ? item.genres
                          : item.tags
                      }
                      rank={index + 1}
                      studio={undefined}
                    />
                  ))}
                </div>
                {/* Sentinel for infinite scroll */}
                <div
                  ref={loadMoreRef}
                  className="min-h-[1px] w-full"
                  aria-hidden
                />
                {isFetchingNextPage && (
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("common.loading", "common")}
                    </p>
                  </div>
                )}
              </>
            )}
            {!isLoading && series.length === 0 && (
              <div className="rounded-lg border border-border border-dashed bg-card py-12 px-4 text-center">
                <p className="text-muted-foreground">
                  {t("noResults", "series")}
                </p>
              </div>
            )}
          </Skeletonize>
        </AnimatedSection>
      </div>
    </div>
  );
}
