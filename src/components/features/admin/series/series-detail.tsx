"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  Shield,
  BookOpen,
  Star,
  TrendingUp,
  Heart,
  Flag,
  Lock,
  FileText,
  Info,
  X,
  List,
  Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { BackendSeries } from "@/lib/interface/series.interface";
import type { UpdateSeriesFormData } from "@/lib/validators/series";
import { useSeriesSegments } from "@/hooks/admin/useSegments";
import { useSeriesCharacters } from "@/hooks/admin/useCharacters";
import { SeriesForm } from "./series-form";
import { SeriesSegmentList } from "./series-segment-list";
import { SeriesCharacterList } from "./series-character-list";

interface SeriesDetailProps {
  series?: BackendSeries;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateSeriesFormData) => Promise<void>;
  onDelete: (series: BackendSeries) => void;
  isUpdating?: boolean;
}

/**
 * Series Detail Component
 * Displays detailed series information with edit and delete functionality
 */
export function SeriesDetail({
  series,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: SeriesDetailProps) {
  const { t } = useI18n();
  const [isEditMode, setIsEditMode] = useState(false);
  const [segmentPage, setSegmentPage] = useState(1);
  const [characterPage, setCharacterPage] = useState(1);
  const limit = 10;

  // Fetch segments and characters
  const { data: segmentsData, isLoading: segmentsLoading } = useSeriesSegments(
    series?.id || "",
    {
      page: segmentPage,
      limit,
      sortBy: "number",
      order: "ASC",
    },
  );

  const { data: charactersData, isLoading: charactersLoading } =
    useSeriesCharacters(series?.id || "", {
      page: characterPage,
      limit,
    });

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  // Get series title
  const seriesTitle =
    series?.title?.userPreferred ||
    series?.title?.romaji ||
    series?.title?.english ||
    series?.title?.native ||
    "Unknown Series";

  // Get cover image URL
  const getCoverImageUrl = (): string | null => {
    if (series?.coverImage?.url) return series.coverImage.url;
    if (series?.coverImageUrls?.large) return series.coverImageUrls.large;
    if (series?.coverImageUrls?.medium) return series.coverImageUrls.medium;
    return null;
  };

  // Get banner image URL
  const getBannerImageUrl = (): string | null => {
    if (series?.bannerImage?.url) return series.bannerImage.url;
    if (series?.bannerImageUrl) return series.bannerImageUrl;
    return null;
  };

  const isAnime = series?.type === SERIES_CONSTANTS.TYPE.ANIME;
  const coverUrl = getCoverImageUrl();
  const bannerUrl = getBannerImageUrl();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <AnimatedSection loading={false} data={true}>
        <Button variant="ghost" asChild>
          <Link href="/admin/series">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.actions.back", "series")}
          </Link>
        </Button>
      </AnimatedSection>

      {/* Series Header Card */}
      <AnimatedSection loading={isLoading} data={series}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeletonize loading={isLoading}>
                  {series && coverUrl ? (
                    <div className="relative h-32 w-24 flex-shrink-0 rounded overflow-hidden border">
                      <Image
                        src={coverUrl}
                        alt={seriesTitle}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-24 flex-shrink-0 rounded bg-muted border" />
                  )}
                </Skeletonize>
                <div>
                  <Skeletonize loading={isLoading}>
                    {series ? (
                      <>
                        <CardTitle className="text-2xl">
                          {seriesTitle}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          {series.type && (
                            <Badge variant="outline">
                              {t(`type.${series.type}`, "series")}
                            </Badge>
                          )}
                          {series.format && (
                            <Badge variant="secondary">
                              {t(`format.${series.format}`, "series")}
                            </Badge>
                          )}
                          {series.status && (
                            <Badge variant="outline">
                              {t(`status.${series.status}`, "series")}
                            </Badge>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-6 w-32" />
                      </>
                    )}
                  </Skeletonize>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditMode ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMode(true)}
                      disabled={isLoading}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t("detail.actions.edit", "series")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(series!)}
                      disabled={isLoading || !series}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("detail.actions.delete", "series")}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                    disabled={isLoading || isUpdating}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t("detail.actions.cancel", "series")}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </AnimatedSection>

      {/* Banner Image */}
      {series && bannerUrl && (
        <AnimatedSection loading={false} data={true}>
          <div className="relative h-48 w-full rounded-lg overflow-hidden border">
            <Image
              src={bannerUrl}
              alt={`${seriesTitle} banner`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </AnimatedSection>
      )}

      {/* Series Information - Tabs or Edit Form */}
      {isEditMode && series ? (
        <AnimatedSection loading={false} data={true}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.actions.edit", "series")}</CardTitle>
              <CardDescription>
                {t("detail.editDescription", "series")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeriesForm
                series={series}
                onSubmit={async (data) => {
                  await onUpdate(series.id, data as UpdateSeriesFormData);
                  setIsEditMode(false);
                }}
                onCancel={() => setIsEditMode(false)}
                isLoading={isUpdating}
              />
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : (
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detail">
              <Info className="mr-2 h-4 w-4" />
              {t("detail.tabs.detail", "series")}
            </TabsTrigger>
            <TabsTrigger value="segment">
              <List className="mr-2 h-4 w-4" />
              {t("detail.tabs.segment", "series")}
            </TabsTrigger>
            <TabsTrigger value="character">
              <Users className="mr-2 h-4 w-4" />
              {t("detail.tabs.character", "series")}
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab - All series information merged */}
          <TabsContent value="detail" className="mt-6">
            <div className="space-y-6">
              {/* Basic Information, Release Information, Content Information */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Basic Information */}
                <AnimatedSection loading={isLoading} data={series}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("detail.sections.basicInfo", "series")}
                      </CardTitle>
                      <CardDescription>
                        {t("detail.sections.basicInfoDesc", "series")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeletonize loading={isLoading}>
                        {series ? (
                          <>
                            {series.title?.romaji && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.titleRomaji", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.title.romaji}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.title?.english && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.titleEnglish", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.title.english}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.title?.native && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.titleNative", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.title.native}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.title?.userPreferred && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.titleUserPreferred", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.title.userPreferred}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.description && (
                              <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {t("create.description", "series")}
                                  </div>
                                  <div className="font-medium whitespace-pre-line break-words">
                                    {series.description}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.type && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.type", "series")}
                                  </div>
                                  <Badge variant="outline" className="mt-1">
                                    {t(`type.${series.type}`, "series")}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {series.format && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.format", "series")}
                                  </div>
                                  <Badge variant="secondary" className="mt-1">
                                    {t(`format.${series.format}`, "series")}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {series.status && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.status", "series")}
                                  </div>
                                  <Badge variant="outline" className="mt-1">
                                    {t(`status.${series.status}`, "series")}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {series.source && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.source", "series")}
                                  </div>
                                  <Badge variant="outline" className="mt-1">
                                    {t(
                                      `create.source.${series.source}`,
                                      "series",
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        )}
                      </Skeletonize>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Release Information */}
                <AnimatedSection loading={isLoading} data={series}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("detail.sections.releaseInfo", "series")}
                      </CardTitle>
                      <CardDescription>
                        {t("detail.sections.releaseInfoDesc", "series")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeletonize loading={isLoading}>
                        {series ? (
                          <>
                            {series.startDate && (
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.startDate", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {formatDate(series.startDate)}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.endDate && (
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.endDate", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {formatDate(series.endDate)}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.season && (
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.season", "series")}
                                  </div>
                                  <Badge variant="outline" className="mt-1">
                                    {t(
                                      `create.season.${series.season}`,
                                      "series",
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {series.seasonYear && (
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.seasonYear", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.seasonYear}
                                  </div>
                                </div>
                              </div>
                            )}
                            {series.countryOfOrigin && (
                              <div className="flex items-center gap-3">
                                <Flag className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.countryOfOrigin", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.countryOfOrigin}
                                  </div>
                                </div>
                              </div>
                            )}
                            {!series.startDate &&
                              !series.endDate &&
                              !series.season &&
                              !series.seasonYear &&
                              !series.countryOfOrigin && (
                                <div className="text-sm text-muted-foreground">
                                  -
                                </div>
                              )}
                          </>
                        ) : (
                          <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        )}
                      </Skeletonize>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Content Information */}
                <AnimatedSection loading={isLoading} data={series}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("detail.sections.contentInfo", "series")}
                      </CardTitle>
                      <CardDescription>
                        {t("detail.sections.contentInfoDesc", "series")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeletonize loading={isLoading}>
                        {series ? (
                          <>
                            {isAnime && series.episodes !== undefined && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.episodes", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.episodes}
                                  </div>
                                </div>
                              </div>
                            )}
                            {isAnime && series.duration !== undefined && (
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.duration", "series")} (minutes)
                                  </div>
                                  <div className="font-medium">
                                    {series.duration}
                                  </div>
                                </div>
                              </div>
                            )}
                            {!isAnime && series.chapters !== undefined && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.chapters", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.chapters}
                                  </div>
                                </div>
                              </div>
                            )}
                            {!isAnime && series.volumes !== undefined && (
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.volumes", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.volumes}
                                  </div>
                                </div>
                              </div>
                            )}
                            {((isAnime &&
                              series.episodes === undefined &&
                              series.duration === undefined) ||
                              (!isAnime &&
                                series.chapters === undefined &&
                                series.volumes === undefined)) && (
                              <div className="text-sm text-muted-foreground">
                                -
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        )}
                      </Skeletonize>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>

              {/* Media Information */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.mediaInfo", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.mediaInfoDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          {coverUrl && (
                            <div className="flex items-start gap-3">
                              <ImageIcon className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                  {t("create.coverImage", "series")}
                                </div>
                                <div className="relative w-32 h-48 rounded-lg overflow-hidden border">
                                  <Image
                                    src={coverUrl}
                                    alt={seriesTitle}
                                    width={128}
                                    height={192}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {bannerUrl && (
                            <div className="flex items-start gap-3">
                              <ImageIcon className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                  {t("create.bannerImage", "series")}
                                </div>
                                <div className="relative w-full h-24 rounded-lg overflow-hidden border">
                                  <Image
                                    src={bannerUrl}
                                    alt={`${seriesTitle} banner`}
                                    width={400}
                                    height={96}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {series.coverImageId && (
                            <div className="flex items-center gap-3">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.coverImageId", "series")}
                                </div>
                                <div className="font-mono text-xs break-all">
                                  {series.coverImageId}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.bannerImageId && (
                            <div className="flex items-center gap-3">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.bannerImageId", "series")}
                                </div>
                                <div className="font-mono text-xs break-all">
                                  {series.bannerImageId}
                                </div>
                              </div>
                            </div>
                          )}
                          {!coverUrl &&
                            !bannerUrl &&
                            !series.coverImageId &&
                            !series.bannerImageId && (
                              <div className="text-sm text-muted-foreground">
                                -
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-48 w-32" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
              {/* External Information */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.externalInfo", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.externalInfoDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          {series.myAnimeListId && (
                            <div className="flex items-center gap-3">
                              <LinkIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.myAnimeListId", "series")}
                                </div>
                                <div className="font-medium">
                                  {series.myAnimeListId}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.aniListId && (
                            <div className="flex items-center gap-3">
                              <LinkIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.aniListId", "series")}
                                </div>
                                <div className="font-medium">
                                  {series.aniListId}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.externalLinks &&
                            Object.keys(series.externalLinks).length > 0 && (
                              <div className="flex items-start gap-3">
                                <LinkIcon className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {t("create.externalLinks", "series")}
                                  </div>
                                  <div className="space-y-1">
                                    {Object.entries(series.externalLinks).map(
                                      ([key, value]) => (
                                        <div key={key} className="text-sm">
                                          <span className="font-medium">
                                            {key}:
                                          </span>{" "}
                                          <Link
                                            href={value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline break-all"
                                          >
                                            {value}
                                          </Link>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          {series.streamingEpisodes &&
                            Object.keys(series.streamingEpisodes).length >
                              0 && (
                              <div className="flex items-start gap-3">
                                <LinkIcon className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {t("create.streamingEpisodes", "series")}
                                  </div>
                                  <div className="space-y-1">
                                    {Object.entries(
                                      series.streamingEpisodes,
                                    ).map(([key, value]) => (
                                      <div key={key} className="text-sm">
                                        <span className="font-medium">
                                          {key}:
                                        </span>{" "}
                                        <Link
                                          href={value}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline break-all"
                                        >
                                          {value}
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          {!series.myAnimeListId &&
                            !series.aniListId &&
                            (!series.externalLinks ||
                              Object.keys(series.externalLinks).length === 0) &&
                            (!series.streamingEpisodes ||
                              Object.keys(series.streamingEpisodes).length ===
                                0) && (
                              <div className="text-sm text-muted-foreground">
                                -
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
              {/* Genres & Tags */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.genresTags", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.genresTagsDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          {series.genres && series.genres.length > 0 && (
                            <div className="flex items-start gap-3">
                              <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                  {t("create.genres", "series")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {series.genres.map((genreItem) => {
                                    const genre = genreItem.genre || genreItem;
                                    const genreName =
                                      typeof genre === "object" &&
                                      "name" in genre
                                        ? genre.name
                                        : typeof genre === "string"
                                          ? genre
                                          : "Unknown";
                                    return (
                                      <Badge
                                        key={genreItem.id || genreName}
                                        variant="outline"
                                      >
                                        {genreName}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.tags && series.tags.length > 0 && (
                            <div className="flex items-start gap-3">
                              <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                  {t("create.tags", "series")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {series.tags.map((tag) => {
                                    const tagName =
                                      typeof tag === "object" ? tag.name : tag;
                                    return (
                                      <Badge
                                        key={
                                          typeof tag === "object" ? tag.id : tag
                                        }
                                        variant="secondary"
                                      >
                                        {tagName}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.synonyms && series.synonyms.length > 0 && (
                            <div className="flex items-start gap-3">
                              <BookOpen className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                  {t("create.synonyms", "series")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {series.synonyms.map((synonym, index) => (
                                    <Badge key={index} variant="outline">
                                      {synonym}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {(!series.genres || series.genres.length === 0) &&
                            (!series.tags || series.tags.length === 0) &&
                            (!series.synonyms ||
                              series.synonyms.length === 0) && (
                              <div className="text-sm text-muted-foreground">
                                -
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
              {/* Scores & Metrics */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.scoresMetrics", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.scoresMetricsDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          {series.averageScore !== undefined &&
                            series.averageScore !== null && (
                              <div className="flex items-center gap-3">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.averageScore", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.averageScore.toFixed(1)}
                                  </div>
                                </div>
                              </div>
                            )}
                          {series.meanScore !== undefined &&
                            series.meanScore !== null && (
                              <div className="flex items-center gap-3">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground">
                                    {t("create.meanScore", "series")}
                                  </div>
                                  <div className="font-medium">
                                    {series.meanScore.toFixed(1)}
                                  </div>
                                </div>
                              </div>
                            )}
                          {series.popularity !== undefined && (
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.popularity", "series")}
                                </div>
                                <div className="font-medium">
                                  {series.popularity}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.trending !== undefined && (
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.trending", "series")}
                                </div>
                                <div className="font-medium">
                                  {series.trending}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.favoriteCount !== undefined && (
                            <div className="flex items-center gap-3">
                              <Heart className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.favoriteCount", "series")}
                                </div>
                                <div className="font-medium">
                                  {series.favoriteCount}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.averageScore === undefined &&
                            series.meanScore === undefined &&
                            series.popularity === undefined &&
                            series.trending === undefined &&
                            series.favoriteCount === undefined && (
                              <div className="text-sm text-muted-foreground">
                                -
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
              {/* Flags & Settings */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.flagsSettings", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.flagsSettingsDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          <div className="flex items-center gap-3">
                            <Flag className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t("create.isNsfw", "series")}
                              </div>
                              <Badge
                                variant={
                                  series.isNsfw ? "destructive" : "outline"
                                }
                                className="mt-1"
                              >
                                {series.isNsfw ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                          {series.isLicensed !== undefined && (
                            <div className="flex items-center gap-3">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.isLicensed", "series")}
                                </div>
                                <Badge
                                  variant={
                                    series.isLicensed ? "default" : "outline"
                                  }
                                  className="mt-1"
                                >
                                  {series.isLicensed ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {series.isLocked !== undefined && (
                            <div className="flex items-center gap-3">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.isLocked", "series")}
                                </div>
                                <Badge
                                  variant={
                                    series.isLocked ? "destructive" : "outline"
                                  }
                                  className="mt-1"
                                >
                                  {series.isLocked ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {series.isRecommendationBlocked !== undefined && (
                            <div className="flex items-center gap-3">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t(
                                    "create.isRecommendationBlocked",
                                    "series",
                                  )}
                                </div>
                                <Badge
                                  variant={
                                    series.isRecommendationBlocked
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="mt-1"
                                >
                                  {series.isRecommendationBlocked
                                    ? "Yes"
                                    : "No"}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {series.isReviewBlocked !== undefined && (
                            <div className="flex items-center gap-3">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.isReviewBlocked", "series")}
                                </div>
                                <Badge
                                  variant={
                                    series.isReviewBlocked
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="mt-1"
                                >
                                  {series.isReviewBlocked ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          )}
                          {series.autoCreateForumThread !== undefined && (
                            <div className="flex items-center gap-3">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("create.autoCreateForumThread", "series")}
                                </div>
                                <Badge
                                  variant={
                                    series.autoCreateForumThread
                                      ? "default"
                                      : "outline"
                                  }
                                  className="mt-1"
                                >
                                  {series.autoCreateForumThread ? "Yes" : "No"}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
              {/* Metadata */}
              <AnimatedSection loading={isLoading} data={series}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("detail.sections.metadata", "series")}
                    </CardTitle>
                    <CardDescription>
                      {t("detail.sections.metadataDesc", "series")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeletonize loading={isLoading}>
                      {series ? (
                        <>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t("detail.fields.createdAt", "series")}
                              </div>
                              <div className="font-medium">
                                {formatDate(series.createdAt)}
                              </div>
                            </div>
                          </div>
                          {series.updatedAt && (
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("detail.fields.updatedAt", "series")}
                                </div>
                                <div className="font-medium">
                                  {formatDate(series.updatedAt)}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.id && (
                            <div className="flex items-center gap-3">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                  {t("detail.fields.seriesId", "series")}
                                </div>
                                <div className="font-mono text-xs break-all">
                                  {series.id}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.notes && (
                            <div className="flex items-start gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-1">
                                  {t("create.notes", "series")}
                                </div>
                                <div className="font-medium whitespace-pre-line break-words">
                                  {series.notes}
                                </div>
                              </div>
                            </div>
                          )}
                          {series.metadata &&
                            Object.keys(series.metadata).length > 0 && (
                              <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {t("create.metadata", "series")}
                                  </div>
                                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                    {JSON.stringify(series.metadata, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      )}
                    </Skeletonize>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </TabsContent>

          {/* Segment Tab */}
          <TabsContent value="segment" className="mt-6">
            <SeriesSegmentList
              data={segmentsData}
              isLoading={segmentsLoading}
              page={segmentPage}
              limit={limit}
              onPageChange={setSegmentPage}
            />
          </TabsContent>

          {/* Character Tab */}
          <TabsContent value="character" className="mt-6">
            <SeriesCharacterList
              data={charactersData}
              isLoading={charactersLoading}
              page={characterPage}
              limit={limit}
              onPageChange={setCharacterPage}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
