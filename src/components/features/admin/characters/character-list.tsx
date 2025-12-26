"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/core/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { Character } from "@/lib/interface/character.interface";
import type { CharacterListResponse } from "@/lib/types/characters";
import type { UpdateCharacterFormData } from "@/lib/validators/characters";
import { CharacterActions } from "./character-actions";
import { CharacterDetailDialog } from "./character-detail-dialog";
import { CharacterDisplay } from "./character-display";

interface CharacterListProps {
  readonly data?: CharacterListResponse;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onCreate?: () => void;
  readonly onEdit?: (character: Character) => void;
  readonly onDelete?: (character: Character) => void;
  readonly onUpdate?: (id: string, data: UpdateCharacterFormData) => Promise<void>;
  readonly isUpdating?: boolean;
}

/**
 * Character List Component
 * Displays characters in a table view
 */
export function CharacterList({
  data,
  isLoading,
  page,
  limit,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
  onUpdate,
  isUpdating,
}: CharacterListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 10;

  // Get character display name
  const getCharacterName = (character: Character): string => {
    return (
      character.name?.full ||
      character.name?.userPreferred ||
      character.name?.first ||
      character.name?.native ||
      "Unknown Character"
    );
  };

  // Format date for display
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "-";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // Get series title from series object
  const getSeriesTitle = (character: Character): string => {
    if (!character.series?.title) {
      return character.seriesId || "-";
    }
    const title = character.series.title;
    return (
      title.userPreferred ||
      title.romaji ||
      title.english ||
      title.native ||
      character.seriesId ||
      "-"
    );
  };

  // Truncate title to max length
  const truncateTitle = (title: string, maxLength: number = 20): string => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  // Get series ID for navigation
  const getSeriesId = (character: Character): string | null => {
    return character.series?.id || character.seriesId || null;
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("list.title", "characters")}</CardTitle>
              <CardDescription>
                {t("list.description", "characters")}
              </CardDescription>
            </div>
            {onCreate && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("list.create", "characters")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.result && data.result.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("list.table.character", "characters")}</TableHead>
                      <TableHead>{t("list.table.gender", "characters")}</TableHead>
                      <TableHead>{t("list.table.ageBloodType", "characters")}</TableHead>
                      <TableHead>{t("list.table.series", "characters")}</TableHead>
                      <TableHead>{t("list.table.createdAt", "characters")}</TableHead>
                      <TableHead className="text-right">
                        {t("list.table.actions", "characters")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((character) => {
                      const characterName = getCharacterName(character);
                      const ageBloodType = [
                        character.age,
                        character.bloodType,
                      ]
                        .filter(Boolean)
                        .join(" / ") || "-";

                      return (
                        <TableRow
                          key={character.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => router.push(`/admin/characters/${character.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <CharacterDisplay character={character} size="sm" showName={false} />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-medium truncate">{characterName}</span>
                                {character.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {character.description.length > MAX_DESCRIPTION_LENGTH ? (
                                      <span>
                                        {character.description.substring(0, MAX_DESCRIPTION_LENGTH)}
                                        {"... "}
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCharacter(character);
                                            setIsDetailDialogOpen(true);
                                          }}
                                          className="text-primary hover:underline"
                                        >
                                          {t("list.showMore", "characters")}
                                        </button>
                                      </span>
                                    ) : (
                                      <span className="line-clamp-1">
                                        {character.description}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {character.gender ? (
                              <Badge variant="outline">
                                {t(`genders.${character.gender.toLowerCase()}`, "characters")}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{ageBloodType}</span>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const seriesId = getSeriesId(character);
                              const seriesTitle = getSeriesTitle(character);
                              
                              if (!seriesId) {
                                return (
                                  <span className="text-muted-foreground text-sm">-</span>
                                );
                              }

                              const truncatedTitle = truncateTitle(seriesTitle, 20);
                              const shouldShowTooltip = seriesTitle.length > 20;

                              if (shouldShowTooltip) {
                                return (
                                  <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/series/${seriesId}`}
                                        className="text-sm text-primary hover:underline font-medium inline-block"
                                        onClick={(e) => {
                                          // Stop propagation to prevent row click
                                          e.stopPropagation();
                                        }}
                                      >
                                        {truncatedTitle}
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={5}>
                                      {seriesTitle}
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              }

                              return (
                                <Link
                                  href={`/series/${seriesId}`}
                                  className="text-sm text-primary hover:underline font-medium"
                                  onClick={(e) => {
                                    // Stop propagation to prevent row click
                                    e.stopPropagation();
                                  }}
                                >
                                  {truncatedTitle}
                                </Link>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(character.createdAt)}</span>
                          </TableCell>
                          <TableCell
                            className="text-right"
                            onClick={(e) => {
                              // Stop propagation to prevent row click when clicking actions
                              e.stopPropagation();
                            }}
                          >
                            {onUpdate && onDelete ? (
                              <CharacterActions
                                character={character}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                isUpdating={isUpdating}
                              />
                            ) : (
                              // Fallback to old handlers if onUpdate not provided
                              <div className="flex justify-end">
                                {onEdit && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(character)}
                                  >
                                    {t("list.edit", "characters")}
                                  </Button>
                                )}
                                {onDelete && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(character)}
                                  >
                                    {t("list.delete", "characters")}
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="rounded-md border">
                <div className="h-10 w-full bg-muted/10" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2 py-2 px-2 border-b last:border-b-0">
                    <div className="h-10 w-10 rounded-full bg-muted/20" />
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-4 w-24 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination Info */}
          {data && data.metaData.total > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {t("list.pagination.showing", "characters", {
                from: (page - 1) * limit + 1,
                to: Math.min(page * limit, data.metaData.total),
                total: data.metaData.total,
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {data?.metaData.totalPages && data.metaData.totalPages > 1 ? (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) {
                          onPageChange(page - 1);
                        }
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: data.metaData.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        pageNum === 1 ||
                        pageNum === data.metaData.totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1);

                      if (!showPage) {
                        // Show ellipsis
                        if (
                          pageNum === page - 2 ||
                          pageNum === page + 2
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onPageChange(pageNum);
                            }}
                            isActive={pageNum === page}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    },
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data.metaData.totalPages || 1)) {
                          onPageChange(page + 1);
                        }
                      }}
                      className={
                        page >= (data.metaData.totalPages || 1)
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Character Detail Dialog */}
      <CharacterDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        character={selectedCharacter}
      />
    </AnimatedSection>
  );
}

