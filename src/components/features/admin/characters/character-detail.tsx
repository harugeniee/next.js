"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

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
import { Separator } from "@/components/ui/layout/separator";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { Character } from "@/lib/interface/character.interface";
import type { UpdateCharacterFormData } from "@/lib/validators/characters";
import { CharacterDisplay } from "./character-display";
import { CharacterFormDialog } from "./character-form-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";

interface CharacterDetailProps {
  character?: Character;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateCharacterFormData) => Promise<void>;
  onDelete: (character: Character) => void;
  isUpdating?: boolean;
}

/**
 * Character Detail Component
 * Displays detailed character information with edit and delete functionality
 */
export function CharacterDetail({
  character,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: CharacterDetailProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  // Get character name
  const characterName =
    character?.name?.full ||
    character?.name?.userPreferred ||
    character?.name?.first ||
    character?.name?.native ||
    "Unknown Character";

  // Get series title from series object
  const getSeriesTitle = (char: Character): string => {
    if (!char.series?.title) {
      return char.seriesId || "-";
    }
    const title = char.series.title;
    return (
      title.userPreferred ||
      title.romaji ||
      title.english ||
      title.native ||
      char.seriesId ||
      "-"
    );
  };

  // Get series ID for navigation
  const getSeriesId = (char: Character): string | null => {
    return char.series?.id || char.seriesId || null;
  };

  // Truncate title to max length
  const truncateTitle = (title: string, maxLength: number = 20): string => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <AnimatedSection loading={false} data={true}>
        <Button variant="ghost" asChild>
          <Link href="/admin/characters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.actions.back", "characters")}
          </Link>
        </Button>
      </AnimatedSection>

      {/* Character Header Card */}
      <AnimatedSection loading={isLoading} data={character}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeletonize loading={isLoading}>
                  {character ? (
                    <CharacterDisplay character={character} size="lg" showName={false} />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-muted" />
                  )}
                </Skeletonize>
                <div>
                  <Skeletonize loading={isLoading}>
                    {character ? (
                      <>
                        <CardTitle className="text-2xl">{characterName}</CardTitle>
                        {character.gender && (
                          <CardDescription className="text-base">
                            {t(`genders.${character.gender.toLowerCase()}`, "characters")}
                          </CardDescription>
                        )}
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </>
                    )}
                  </Skeletonize>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("detail.actions.edit", "characters")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(character!)}
                  disabled={isLoading || !character}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("detail.actions.delete", "characters")}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </AnimatedSection>

      {/* Character Information Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <AnimatedSection loading={isLoading} data={character}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.sections.basicInfo", "characters")}</CardTitle>
              <CardDescription>
                {t("detail.sections.basicInfoDesc", "characters")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {character ? (
                  <>
                    {character.name?.first && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameFirst", "characters")}
                          </div>
                          <div className="font-medium">{character.name.first}</div>
                        </div>
                      </div>
                    )}
                    {character.name?.middle && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameMiddle", "characters")}
                          </div>
                          <div className="font-medium">{character.name.middle}</div>
                        </div>
                      </div>
                    )}
                    {character.name?.last && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameLast", "characters")}
                          </div>
                          <div className="font-medium">{character.name.last}</div>
                        </div>
                      </div>
                    )}
                    {character.name?.full && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameFull", "characters")}
                          </div>
                          <div className="font-medium">{character.name.full}</div>
                        </div>
                      </div>
                    )}
                    {character.name?.native && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameNative", "characters")}
                          </div>
                          <div className="font-medium">{character.name.native}</div>
                        </div>
                      </div>
                    )}
                    {character.name?.userPreferred && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.nameUserPreferred", "characters")}
                          </div>
                          <div className="font-medium">{character.name.userPreferred}</div>
                        </div>
                      </div>
                    )}
                    {character.description && (
                      <div className="flex items-start gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">
                            {t("fields.description", "characters")}
                          </div>
                          <div className="font-medium whitespace-pre-line break-words">
                            {character.description}
                          </div>
                        </div>
                      </div>
                    )}
                    {character.gender && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.gender", "characters")}
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {t(`genders.${character.gender.toLowerCase()}`, "characters")}
                          </Badge>
                        </div>
                      </div>
                    )}
                    {character.age && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.age", "characters")}
                          </div>
                          <div className="font-medium">{character.age}</div>
                        </div>
                      </div>
                    )}
                    {character.bloodType && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.bloodType", "characters")}
                          </div>
                          <div className="font-medium">{character.bloodType}</div>
                        </div>
                      </div>
                    )}
                    {character.dateOfBirth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.dateOfBirth", "characters")}
                          </div>
                          <div className="font-medium">
                            {formatDate(character.dateOfBirth)}
                          </div>
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

        {/* External Information */}
        <AnimatedSection loading={isLoading} data={character}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.sections.externalInfo", "characters")}</CardTitle>
              <CardDescription>
                {t("detail.sections.externalInfoDesc", "characters")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {character ? (
                  <>
                    {character.myAnimeListId && (
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.myAnimeListId", "characters")}
                          </div>
                          <div className="font-medium">{character.myAnimeListId}</div>
                        </div>
                      </div>
                    )}
                    {character.aniListId && (
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.aniListId", "characters")}
                          </div>
                          <div className="font-medium">{character.aniListId}</div>
                        </div>
                      </div>
                    )}
                    {(() => {
                      const seriesId = getSeriesId(character);
                      const seriesTitle = getSeriesTitle(character);

                      if (!seriesId) {
                        return character.seriesId ? (
                          <div className="flex items-center gap-3">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">
                                {t("fields.seriesId", "characters")}
                              </div>
                              <div className="font-medium">{character.seriesId}</div>
                            </div>
                          </div>
                        ) : null;
                      }

                      const truncatedTitle = truncateTitle(seriesTitle, 20);
                      const shouldShowTooltip = seriesTitle.length > 20;

                      return (
                        <div className="flex items-center gap-3">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground">
                              {t("fields.seriesId", "characters")}
                            </div>
                            {shouldShowTooltip ? (
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/series/${seriesId}`}
                                    className="text-primary hover:underline font-medium inline-block"
                                  >
                                    {truncatedTitle}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top" sideOffset={5}>
                                  {seriesTitle}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Link
                                href={`/series/${seriesId}`}
                                className="text-primary hover:underline font-medium"
                              >
                                {truncatedTitle}
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {character.siteUrl && (
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.siteUrl", "characters")}
                          </div>
                          <Link
                            href={character.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium break-all"
                          >
                            {character.siteUrl}
                          </Link>
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

        {/* Media Information */}
        <AnimatedSection loading={isLoading} data={character}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.sections.mediaInfo", "characters")}</CardTitle>
              <CardDescription>
                {t("detail.sections.mediaInfoDesc", "characters")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {character ? (
                  <>
                    {character.imageId && (
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("fields.imageId", "characters")}
                          </div>
                          <div className="font-mono text-xs break-all">
                            {character.imageId}
                          </div>
                        </div>
                      </div>
                    )}
                    {character.image?.url && (
                      <div className="flex items-start gap-3">
                        <ImageIcon className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-2">
                            {t("fields.imageId", "characters")} Preview
                          </div>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={character.image.url}
                              alt={characterName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {!character.imageId && !character.image?.url && (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-32" />
                  </div>
                )}
              </Skeletonize>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Metadata */}
        <AnimatedSection loading={isLoading} data={character}>
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.sections.metadata", "characters")}</CardTitle>
              <CardDescription>
                {t("detail.sections.metadataDesc", "characters")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeletonize loading={isLoading}>
                {character ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {t("detail.fields.createdAt", "characters")}
                        </div>
                        <div className="font-medium">
                          {formatDate(character.createdAt)}
                        </div>
                      </div>
                    </div>
                    {character.updatedAt && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("detail.fields.updatedAt", "characters")}
                          </div>
                          <div className="font-medium">
                            {formatDate(character.updatedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    {character.id && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground">
                            {t("detail.fields.characterId", "characters")}
                          </div>
                          <div className="font-mono text-xs break-all">
                            {character.id}
                          </div>
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

      {/* Edit Dialog */}
      {character && (
        <CharacterFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          character={character}
          onSubmit={(data) => onUpdate(character.id, data as UpdateCharacterFormData)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}

