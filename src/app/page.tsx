"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import { LatestUpdatesList, SearchBar } from "@/components/features/series";
import { SeriesCard } from "@/components/features/series/series-card";
import {
  SeriesHeroCarousel,
  type FeaturedSeries,
} from "@/components/features/series/series-hero-carousel";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui/core/button";
import {
  useFeaturedSeries,
  useLatestUpdates,
  usePopularSeries,
  useRecentlyAddedSeries,
  useRecommendedSeries,
  useSeasonalSeries,
  useSelfPublishedSeries,
} from "@/hooks/series";
import type { PopularSeries } from "@/lib/interface/series.interface";

/**
 * MangaDex-style Homepage
 * Main landing page with all series sections
 */
export default function HomePage() {
  const { t } = useI18n();

  // Fetch all series data sequentially from top to bottom
  // Each section loads only after the previous one completes successfully
  // Use isFetched to ensure previous query has actually completed, not just succeeded
  const {
    data: popularSeries,
    isLoading: isLoadingPopular,
    isFetched: isPopularFetched,
  } = usePopularSeries(true); // First section - always enabled

  // Only enable when previous query has been fetched (completed)
  const {
    data: latestUpdates,
    isLoading: isLoadingUpdates,
    isFetched: isLatestUpdatesFetched,
  } = useLatestUpdates(isPopularFetched && !isLoadingPopular); // Enabled after popular series completes

  const {
    data: recommended,
    isLoading: isLoadingRecommended,
    isFetched: isRecommendedFetched,
  } = useRecommendedSeries(isLatestUpdatesFetched && !isLoadingUpdates); // Enabled after latest updates completes

  const {
    data: selfPublished,
    isLoading: isLoadingSelfPublished,
    isFetched: isSelfPublishedFetched,
  } = useSelfPublishedSeries(isRecommendedFetched && !isLoadingRecommended); // Enabled after recommended completes

  const {
    data: featured,
    isLoading: isLoadingFeatured,
    isFetched: isFeaturedFetched,
  } = useFeaturedSeries(isSelfPublishedFetched && !isLoadingSelfPublished); // Enabled after self-published completes

  const {
    data: seasonal,
    isLoading: isLoadingSeasonal,
    isFetched: isSeasonalFetched,
  } = useSeasonalSeries(isFeaturedFetched && !isLoadingFeatured); // Enabled after featured completes

  const { data: recentlyAdded, isLoading: isLoadingRecentlyAdded } =
    useRecentlyAddedSeries(isSeasonalFetched && !isLoadingSeasonal); // Enabled after seasonal completes

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Bar - Only visible on mobile */}
      <section className="border-b border-border bg-background md:hidden">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <SearchBar className="w-full" showKeyboardShortcut={false} />
        </div>
      </section>

      {/* Popular New Titles Hero Carousel - Full width with navigation overlay */}
      <section className="relative -mt-20 pt-20 pb-0 border-b border-border">
        <Skeletonize loading={isLoadingPopular}>
          {popularSeries && popularSeries.length > 0 ? (
            <SeriesHeroCarousel
              items={popularSeries.map(
                (series: PopularSeries): FeaturedSeries => ({
                  id: series.id,
                  title: series.title,
                  description: series.description || "",
                  tags: series.tags || [],
                  coverUrl: series.coverUrl,
                }),
              )}
              className="h-[20vh] min-h-[180px] sm:h-[25vh] sm:min-h-[220px] md:h-[30vh] md:min-h-[280px] lg:h-[40vh] lg:min-h-[400px] xl:h-[45vh] xl:max-h-[700px]"
            />
          ) : (
            <div className="h-[20vh] min-h-[180px] sm:h-[25vh] sm:min-h-[220px] md:h-[30vh] md:min-h-[280px] lg:h-[40vh] lg:min-h-[400px] xl:h-[45vh] xl:max-h-[700px] w-full rounded" />
          )}
        </Skeletonize>
      </section>

      {/* Banner Ad */}
      {/* <section className="border-b border-border py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/advertise"
            className="block w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 p-8 text-center transition-all hover:from-primary/30 hover:to-primary/20"
          >
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              {t("advertise", "series")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("advertise", "series")} - {t("advertiseNav", "series")}
            </p>
          </Link>
        </div>
      </section> */}

      {/* Latest Updates */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingUpdates}>
            {latestUpdates && latestUpdates.length > 0 ? (
              <LatestUpdatesList items={latestUpdates} />
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recommended - AniChart Style */}
      <section className="border-b border-border py-3 sm:py-4 md:py-5 lg:py-6 xl:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          <Skeletonize loading={isLoadingRecommended}>
            {recommended && recommended.length > 0 ? (
              <>
                <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {t("recommended", "series")}
                    </h2>
                    {/* Arrow icon - visible on mobile only, inline with heading */}
                    <Link
                      href="/series/recommended"
                      className="sm:hidden flex items-center justify-center"
                      aria-label={t("viewRecommendedList", "series")}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                  {/* Button with text - visible on desktop only */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm hidden sm:flex"
                  >
                    <Link
                      href="/series/recommended"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <span>{t("viewRecommendedList", "series")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
                {/* AniChart-style horizontal cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {recommended.slice(0, 6).map((series, index) => (
                    <SeriesCard
                      key={series.id}
                      series={series}
                      variant="anichart"
                      startDate={series.startDate}
                      totalEpisodes={series.episodes}
                      genres={
                        series.genres && series.genres.length > 0
                          ? series.genres
                          : series.tags
                      }
                      rank={index + 1}
                      studio={undefined}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Self-Published - AniChart Style */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingSelfPublished}>
            {selfPublished && selfPublished.length > 0 ? (
              <>
                <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {t("selfPublished", "series")}
                    </h2>
                    {/* Arrow icon - visible on mobile only, inline with heading */}
                    <Link
                      href="/series/self-published"
                      className="sm:hidden flex items-center justify-center"
                      aria-label={t("viewSelfPublishedList", "series")}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                  {/* Button with text - visible on desktop only */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm hidden sm:flex"
                  >
                    <Link
                      href="/series/self-published"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <span>{t("viewSelfPublishedList", "series")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
                {/* AniChart-style horizontal cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {selfPublished.slice(0, 6).map((series, index) => (
                    <SeriesCard
                      key={series.id}
                      series={series}
                      variant="anichart"
                      startDate={series.startDate}
                      totalEpisodes={series.episodes}
                      genres={
                        series.genres && series.genres.length > 0
                          ? series.genres
                          : series.tags
                      }
                      rank={index + 1}
                      studio={undefined}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Featured - AniChart Style */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingFeatured}>
            {featured && featured.length > 0 ? (
              <>
                <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {t("featured", "series")}
                    </h2>
                    {/* Arrow icon - visible on mobile only, inline with heading */}
                    <Link
                      href="/series/featured"
                      className="sm:hidden flex items-center justify-center"
                      aria-label={t("viewFeaturedList", "series")}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                  {/* Button with text - visible on desktop only */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm hidden sm:flex"
                  >
                    <Link
                      href="/series/featured"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <span>{t("viewFeaturedList", "series")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
                {/* AniChart-style horizontal cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {featured.slice(0, 6).map((series, index) => (
                    <SeriesCard
                      key={series.id}
                      series={series}
                      variant="anichart"
                      startDate={series.startDate}
                      totalEpisodes={series.episodes}
                      genres={
                        series.genres && series.genres.length > 0
                          ? series.genres
                          : series.tags
                      }
                      rank={index + 1}
                      studio={undefined}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Seasonal: Fall 2025 - AniChart Style */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingSeasonal}>
            {seasonal && seasonal.length > 0 ? (
              <>
                <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {t("seasonalFall2025", "series")}
                    </h2>
                    {/* Arrow icon - visible on mobile only, inline with heading */}
                    <Link
                      href="/series/seasonal"
                      className="sm:hidden flex items-center justify-center"
                      aria-label={t("openListSeasonal", "series")}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                  {/* Button with text - visible on desktop only */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm hidden sm:flex"
                  >
                    <Link
                      href="/series/seasonal"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <span>{t("openListSeasonal", "series")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
                {/* AniChart-style horizontal cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {seasonal.map((series, index) => (
                    <SeriesCard
                      key={series.id}
                      series={series}
                      variant="anichart"
                      startDate={series.startDate}
                      totalEpisodes={series.episodes}
                      genres={
                        series.genres && series.genres.length > 0
                          ? series.genres
                          : series.tags
                      }
                      rank={index + 1}
                      studio={undefined}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recently Added */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingRecentlyAdded}>
            {recentlyAdded && recentlyAdded.length > 0 ? (
              <>
                <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {t("recentlyAdded", "series")}
                    </h2>
                    {/* Arrow icon - visible on mobile only, inline with heading */}
                    <Link
                      href="/series/recently-added"
                      className="sm:hidden flex items-center justify-center"
                      aria-label={t("viewRecentlyAdded", "series")}
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                  {/* Button with text - visible on desktop only */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm hidden sm:flex"
                  >
                    <Link
                      href="/series/recently-added"
                      className="flex items-center gap-1.5 sm:gap-2"
                    >
                      <span>{t("viewRecentlyAdded", "series")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                  {recentlyAdded.slice(0, 12).map((series) => (
                    <SeriesCard
                      key={series.id}
                      series={series}
                      variant="tiny"
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-8 w-48 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <div key={i} className="aspect-[2/3] rounded" />
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </div>
      </section>
    </div>
  );
}
