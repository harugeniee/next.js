"use client";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { CharacterDisplay } from "./character-display";
import type { Character } from "@/lib/interface/character.interface";

interface CharacterDetailDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly character: Character | null;
}

/**
 * Character Detail Dialog Component
 * Shows full character details including description
 */
export function CharacterDetailDialog({
  open,
  onOpenChange,
  character,
}: CharacterDetailDialogProps) {
  const { t } = useI18n();

  if (!character) return null;

  const characterName =
    character.name?.full ||
    character.name?.userPreferred ||
    character.name?.first ||
    character.name?.native ||
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{characterName}</DialogTitle>
          <DialogDescription>
            {t("list.detailDialog.description", "characters")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Character Display */}
          <div className="flex items-center gap-4">
            <CharacterDisplay character={character} size="lg" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{characterName}</h3>
              {character.gender && (
                <p className="text-sm text-muted-foreground">
                  {t(`genders.${character.gender.toLowerCase()}`, "characters")}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {character.description && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("fields.description", "characters")}
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                {character.description}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {character.age && (
              <div>
                <span className="font-medium">{t("fields.age", "characters")}: </span>
                <span className="text-muted-foreground">{character.age}</span>
              </div>
            )}
            {character.bloodType && (
              <div>
                <span className="font-medium">
                  {t("fields.bloodType", "characters")}:{" "}
                </span>
                <span className="text-muted-foreground">{character.bloodType}</span>
              </div>
            )}
            {character.dateOfBirth && (
              <div>
                <span className="font-medium">
                  {t("fields.dateOfBirth", "characters")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {new Date(character.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
                    {(() => {
                      const seriesId = getSeriesId(character);
                      const seriesTitle = getSeriesTitle(character);
                      
                      if (!seriesId) return null;

                      const truncatedTitle = truncateTitle(seriesTitle, 20);
                      const shouldShowTooltip = seriesTitle.length > 20;

                      return (
                        <div>
                          <span className="font-medium">{t("fields.seriesId", "characters")}: </span>
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
                      );
                    })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

