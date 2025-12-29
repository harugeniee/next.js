"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { CharacterDisplay } from "@/components/features/admin/characters/character-display";

interface SeriesCharacterListProps {
  readonly data?: CharacterListResponse;
  readonly isLoading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
  readonly onCreate?: () => void;
}

/**
 * Series Character List Component
 * Displays characters of a series in a table view
 */
export function SeriesCharacterList({
  data,
  isLoading,
  page,
  onPageChange,
  onCreate,
}: SeriesCharacterListProps) {
  const { t } = useI18n();
  const router = useRouter();

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

  // Get total pages
  const totalPages = data?.metaData?.totalPages ?? 1;
  const currentPage = page;

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("detail.characters.title", "series")}</CardTitle>
              <CardDescription>
                {t("detail.characters.description", "series")}
              </CardDescription>
            </div>
            {onCreate && (
              <Button size="sm" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                {t("detail.characters.create", "series")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data?.result && data.result.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("detail.characters.table.character", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.characters.table.gender", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.characters.table.ageBloodType", "series")}
                        </TableHead>
                        <TableHead>
                          {t("detail.characters.table.createdAt", "series")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.result.map((character) => {
                        const characterName = getCharacterName(character);
                        const ageBloodType =
                          [character.age, character.bloodType]
                            .filter(Boolean)
                            .join(" / ") || "-";

                        return (
                          <TableRow
                            key={character.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() =>
                              router.push(`/admin/characters/${character.id}`)
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <CharacterDisplay
                                  character={character}
                                  size="sm"
                                  showName={false}
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="font-medium truncate">
                                    {characterName}
                                  </span>
                                  {character.description && (
                                    <span className="text-xs text-muted-foreground truncate max-w-md">
                                      {character.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {character.gender ? (
                                <Badge variant="outline">
                                  {t(
                                    `detail.characters.gender.${character.gender}`,
                                    "series",
                                    undefined,
                                    character.gender,
                                  )}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{ageBloodType}</TableCell>
                            <TableCell>
                              {formatDate(character.createdAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              onPageChange(currentPage - 1);
                            }
                          }}
                          className={
                            currentPage <= 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onPageChange(pageNum);
                            }}
                            isActive={pageNum === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {totalPages >
                        getPageNumbers()[getPageNumbers().length - 1] && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              onPageChange(currentPage + 1);
                            }
                          }}
                          className={
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t("detail.characters.empty", "series")}
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
