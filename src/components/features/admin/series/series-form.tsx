"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { BackendSeries } from "@/lib/interface/series.interface";
import {
  createSeriesSchema,
  updateSeriesSchema,
  type CreateSeriesFormData,
  type UpdateSeriesFormData,
} from "@/lib/validators/series";

interface SeriesFormProps {
  readonly series?: BackendSeries;
  readonly onSubmit: (
    data: CreateSeriesFormData | UpdateSeriesFormData,
  ) => Promise<void>;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

/**
 * Series Form Component
 * Handles creating and editing series with comprehensive validation
 */
export function SeriesForm({
  series,
  onSubmit,
  onCancel,
  isLoading = false,
}: SeriesFormProps) {
  const { t } = useI18n();
  const isEditMode = !!series;

  type FormData = CreateSeriesFormData | UpdateSeriesFormData;
  const form = useForm<FormData>({
    resolver: zodResolver(
      isEditMode ? updateSeriesSchema : createSeriesSchema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: {
      myAnimeListId: series?.myAnimeListId ?? "",
      aniListId: series?.aniListId ?? "",
      title: series?.title
        ? {
            romaji: series.title.romaji ?? "",
            english: series.title.english ?? "",
            native: series.title.native ?? "",
            userPreferred: series.title.userPreferred ?? "",
          }
        : {
            romaji: "",
            english: "",
            native: "",
            userPreferred: "",
          },
      type: series?.type ?? (SERIES_CONSTANTS.TYPE.ANIME as FormData["type"]),
      format: series?.format ?? "",
      status: series?.status ?? "",
      description: series?.description ?? "",
      startDate: series?.startDate
        ? typeof series.startDate === "string"
          ? series.startDate
          : new Date(series.startDate).toISOString().split("T")[0]
        : undefined,
      endDate: series?.endDate
        ? typeof series.endDate === "string"
          ? series.endDate
          : new Date(series.endDate).toISOString().split("T")[0]
        : undefined,
      season: series?.season ?? "",
      seasonYear: series?.seasonYear ?? undefined,
      seasonInt: series?.seasonInt ?? undefined,
      episodes: series?.episodes ?? undefined,
      duration: series?.duration ?? undefined,
      chapters: series?.chapters ?? undefined,
      volumes: series?.volumes ?? undefined,
      countryOfOrigin: series?.countryOfOrigin ?? "",
      isLicensed: series?.isLicensed ?? false,
      source: series?.source ?? "",
      coverImageId: series?.coverImageId ?? "",
      bannerImageId: series?.bannerImageId ?? "",
      genreIds: series?.genres?.map((g) => g.genre?.id || g.id) ?? [],
      tagIds: series?.tags?.map((t) => t.id) ?? [],
      synonyms: series?.synonyms ?? [],
      averageScore: series?.averageScore ?? undefined,
      meanScore: series?.meanScore ?? undefined,
      popularity: series?.popularity ?? undefined,
      isLocked: series?.isLocked ?? false,
      trending: series?.trending ?? undefined,
      isNsfw: series?.isNsfw ?? false,
      autoCreateForumThread: series?.autoCreateForumThread ?? false,
      isRecommendationBlocked: series?.isRecommendationBlocked ?? false,
      isReviewBlocked: series?.isReviewBlocked ?? false,
      notes: series?.notes ?? "",
      releasingStatus: series?.releasingStatus ?? "",
      externalLinks: series?.externalLinks ?? {},
      streamingEpisodes: series?.streamingEpisodes ?? {},
      metadata: series?.metadata ?? {},
    },
  });

  const seriesType = form.watch("type");

  // Update form when series changes
  useEffect(() => {
    if (series) {
      form.reset({
        myAnimeListId: series.myAnimeListId ?? "",
        aniListId: series.aniListId ?? "",
        title: series.title
          ? {
              romaji: series.title.romaji ?? "",
              english: series.title.english ?? "",
              native: series.title.native ?? "",
              userPreferred: series.title.userPreferred ?? "",
            }
          : {
              romaji: "",
              english: "",
              native: "",
              userPreferred: "",
            },
        type: series.type ?? (SERIES_CONSTANTS.TYPE.ANIME as FormData["type"]),
        format: series.format ?? "",
        status: series.status ?? "",
        description: series.description ?? "",
        startDate: series.startDate
          ? typeof series.startDate === "string"
            ? series.startDate
            : new Date(series.startDate).toISOString().split("T")[0]
          : undefined,
        endDate: series.endDate
          ? typeof series.endDate === "string"
            ? series.endDate
            : new Date(series.endDate).toISOString().split("T")[0]
          : undefined,
        season: series.season ?? "",
        seasonYear: series.seasonYear ?? undefined,
        seasonInt: series.seasonInt ?? undefined,
        episodes: series.episodes ?? undefined,
        duration: series.duration ?? undefined,
        chapters: series.chapters ?? undefined,
        volumes: series.volumes ?? undefined,
        countryOfOrigin: series.countryOfOrigin ?? "",
        isLicensed: series.isLicensed ?? false,
        source: series.source ?? "",
        coverImageId: series.coverImageId ?? "",
        bannerImageId: series.bannerImageId ?? "",
        genreIds: series.genres?.map((g) => g.genre?.id || g.id) ?? [],
        tagIds: series.tags?.map((t) => t.id) ?? [],
        synonyms: series.synonyms ?? [],
        averageScore: series.averageScore ?? undefined,
        meanScore: series.meanScore ?? undefined,
        popularity: series.popularity ?? undefined,
        isLocked: series.isLocked ?? false,
        trending: series.trending ?? undefined,
        isNsfw: series.isNsfw ?? false,
        autoCreateForumThread: series.autoCreateForumThread ?? false,
        isRecommendationBlocked: series.isRecommendationBlocked ?? false,
        isReviewBlocked: series.isReviewBlocked ?? false,
        notes: series.notes ?? "",
        releasingStatus: series.releasingStatus ?? "",
        externalLinks: series.externalLinks ?? {},
        streamingEpisodes: series.streamingEpisodes ?? {},
        metadata: series.metadata ?? {},
      });
    }
  }, [series, form]);

  const handleSubmit = async (data: UpdateSeriesFormData) => {
    // Clean up empty strings to undefined
    const cleanedData: UpdateSeriesFormData = {
      ...data,
      myAnimeListId: data.myAnimeListId || undefined,
      aniListId: data.aniListId || undefined,
      title: data.title
        ? {
            romaji: data.title.romaji || undefined,
            english: data.title.english || undefined,
            native: data.title.native || undefined,
            userPreferred: data.title.userPreferred || undefined,
          }
        : undefined,
      format: data.format || undefined,
      status: data.status || undefined,
      description: data.description || undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      season: data.season || undefined,
      seasonYear: data.seasonYear || undefined,
      seasonInt: data.seasonInt || undefined,
      episodes: data.episodes || undefined,
      duration: data.duration || undefined,
      chapters: data.chapters || undefined,
      volumes: data.volumes || undefined,
      countryOfOrigin: data.countryOfOrigin || undefined,
      source: data.source || undefined,
      coverImageId: data.coverImageId || undefined,
      bannerImageId: data.bannerImageId || undefined,
      genreIds:
        data.genreIds && data.genreIds.length > 0 ? data.genreIds : undefined,
      tagIds: data.tagIds && data.tagIds.length > 0 ? data.tagIds : undefined,
      synonyms:
        data.synonyms && data.synonyms.length > 0 ? data.synonyms : undefined,
      averageScore: data.averageScore || undefined,
      meanScore: data.meanScore || undefined,
      popularity: data.popularity || undefined,
      trending: data.trending || undefined,
      notes: data.notes || undefined,
      releasingStatus: data.releasingStatus || undefined,
      externalLinks:
        data.externalLinks && Object.keys(data.externalLinks).length > 0
          ? data.externalLinks
          : undefined,
      streamingEpisodes:
        data.streamingEpisodes && Object.keys(data.streamingEpisodes).length > 0
          ? data.streamingEpisodes
          : undefined,
      metadata:
        data.metadata && Object.keys(data.metadata).length > 0
          ? data.metadata
          : undefined,
    };
    await onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.basicInfo", "series")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.type", "series")} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.typePlaceholder", "series")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SERIES_CONSTANTS.TYPE.ANIME}>
                        {t("types.anime", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.TYPE.MANGA}>
                        {t("types.manga", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.TYPE.LIGHT_NOVEL}>
                        {t("types.lightNovel", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.TYPE.VISUAL_NOVEL}>
                        {t("types.visualNovel", "series")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.format", "series")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.formatPlaceholder", "series")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.TV}>
                        {t("formats.tv", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.MOVIE}>
                        {t("formats.movie", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.MANGA}>
                        {t("formats.manga", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.NOVEL}>
                        {t("formats.novel", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.OVA}>
                        {t("formats.ova", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.FORMAT.ONA}>
                        {t("formats.ona", "series")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.status", "series")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.statusPlaceholder", "series")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={SERIES_CONSTANTS.RELEASING_STATUS.FINISHED}
                      >
                        {t("statuses.finished", "series")}
                      </SelectItem>
                      <SelectItem
                        value={SERIES_CONSTANTS.RELEASING_STATUS.RELEASING}
                      >
                        {t("statuses.releasing", "series")}
                      </SelectItem>
                      <SelectItem
                        value={
                          SERIES_CONSTANTS.RELEASING_STATUS.NOT_YET_RELEASED
                        }
                      >
                        {t("statuses.notYetReleased", "series")}
                      </SelectItem>
                      <SelectItem
                        value={SERIES_CONSTANTS.RELEASING_STATUS.CANCELLED}
                      >
                        {t("statuses.cancelled", "series")}
                      </SelectItem>
                      <SelectItem
                        value={SERIES_CONSTANTS.RELEASING_STATUS.HIATUS}
                      >
                        {t("statuses.hiatus", "series")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.source", "series")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.sourcePlaceholder", "series")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SERIES_CONSTANTS.SOURCE.ORIGINAL}>
                        {t("sources.original", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SOURCE.MANGA}>
                        {t("sources.manga", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SOURCE.LIGHT_NOVEL}>
                        {t("sources.lightNovel", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SOURCE.ANIME}>
                        {t("sources.anime", "series")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Title Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.titleInfo", "series")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title.romaji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.titleRomaji", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titleRomajiPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title.english"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.titleEnglish", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titleEnglishPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title.native"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.titleNative", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titleNativePlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title.userPreferred"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.titleUserPreferred", "series")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.titleUserPreferredPlaceholder",
                        "series",
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.description", "series")}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder={t("form.descriptionPlaceholder", "series")}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                    value={field.value || ""}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dates and Season */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.datesSeason", "series")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.startDate", "series")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.endDate", "series")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.season", "series")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.seasonPlaceholder", "series")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SERIES_CONSTANTS.SEASON.WINTER}>
                        {t("seasons.winter", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SEASON.SPRING}>
                        {t("seasons.spring", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SEASON.SUMMER}>
                        {t("seasons.summer", "series")}
                      </SelectItem>
                      <SelectItem value={SERIES_CONSTANTS.SEASON.FALL}>
                        {t("seasons.fall", "series")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seasonYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.seasonYear", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("form.seasonYearPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined,
                        )
                      }
                      min={1900}
                      max={2100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Type-Specific Fields */}
        {seriesType === SERIES_CONSTANTS.TYPE.ANIME && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("form.animeSpecific", "series")}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="episodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.episodes", "series")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("form.episodesPlaceholder", "series")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          )
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.duration", "series")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("form.durationPlaceholder", "series")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          )
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.durationDescription", "series")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {seriesType === SERIES_CONSTANTS.TYPE.MANGA && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("form.mangaSpecific", "series")}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="chapters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.chapters", "series")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("form.chaptersPlaceholder", "series")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          )
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volumes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.volumes", "series")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("form.volumesPlaceholder", "series")}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          )
                        }
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("form.additionalInfo", "series")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="countryOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.countryOfOrigin", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "form.countryOfOriginPlaceholder",
                        "series",
                      )}
                      {...field}
                      value={field.value || ""}
                      maxLength={2}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("form.countryOfOriginDescription", "series")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.coverImageId", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.coverImageIdPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.bannerImageId", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.bannerImageIdPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="averageScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.averageScore", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("form.averageScorePlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popularity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.popularity", "series")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("form.popularityPlaceholder", "series")}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseInt(e.target.value, 10)
                            : undefined,
                        )
                      }
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("form.flags", "series")}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="isNsfw"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.isNsfw", "series")}</FormLabel>
                    <FormDescription>
                      {t("form.isNsfwDescription", "series")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isLicensed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.isLicensed", "series")}</FormLabel>
                    <FormDescription>
                      {t("form.isLicensedDescription", "series")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isLocked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.isLocked", "series")}</FormLabel>
                    <FormDescription>
                      {t("form.isLockedDescription", "series")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.notes", "series")}</FormLabel>
                <FormControl>
                  <textarea
                    placeholder={t("form.notesPlaceholder", "series")}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                    value={field.value || ""}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("form.cancel", "series")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("form.saving", "series")
              : isEditMode
                ? t("form.update", "series")
                : t("form.create", "series")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
