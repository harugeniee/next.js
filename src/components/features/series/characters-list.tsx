"use client";

import { Grid3X3, List, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CharacterCard } from "@/components/features/series/character-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent } from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { useCharactersInfinite } from "@/hooks/characters";
import type { Character } from "@/lib/interface/character.interface";
import type { PaginationCursor } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Characters List Component with Infinite Scroll
 * Loads characters using cursor-based pagination
 */
interface CharactersListProps {
  seriesId: string;
  enabled: boolean;
  className?: string;
}

export function CharactersList({
  seriesId,
  enabled,
  className,
}: CharactersListProps) {
  const { t } = useI18n();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch characters with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useCharactersInfinite(seriesId, enabled);

  // Flatten all pages into a single array
  const allCharacters = useMemo(
    () =>
      data?.pages.flatMap(
        (page) => (page as PaginationCursor<Character>).result,
      ) ?? [],
    [data],
  );

  // Filter characters by search query
  const characters = useMemo(() => {
    if (!searchQuery.trim()) return allCharacters;
    const query = searchQuery.toLowerCase().trim();
    return allCharacters.filter((char) => {
      const fullName = char.name?.full?.toLowerCase() || "";
      const userPreferred = char.name?.userPreferred?.toLowerCase() || "";
      const native = char.name?.native?.toLowerCase() || "";
      const alternative = char.name?.alternative?.join(" ").toLowerCase() || "";
      return (
        fullName.includes(query) ||
        userPreferred.includes(query) ||
        native.includes(query) ||
        alternative.includes(query)
      );
    });
  }, [allCharacters, searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before reaching the bottom
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
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Header with Search and Layout Switcher
  const header = (
    <div className="mb-3 sm:mb-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
          {t("characters.title", "series") || "Characters"}
        </h2>

        {/* Layout Switcher */}
        <div className="flex items-center gap-3">
          <Tabs
            value={layout}
            onValueChange={(value) => setLayout(value as "grid" | "list")}
            className="w-auto"
          >
            <TabsList className="w-auto">
              <TabsTrigger value="grid">
                <Grid3X3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t("characters.layout.grid", "series") || "Grid"}</span>
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t("characters.layout.list", "series") || "List"}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={
            t("characters.search.placeholder", "series") ||
            "Search characters..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 sm:h-10"
        />
      </div>
    </div>
  );

  // Loading state (initial load)
  if (isLoading && allCharacters.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {header}
        <Skeletonize loading={true}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 sm:h-72 rounded-lg border border-border"
              />
            ))}
          </div>
        </Skeletonize>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        {header}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {t("characters.error", "series") || "Failed to load characters"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                // Retry by refetching
                window.location.reload();
              }}
            >
              {t("actions.retry", "common") || "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!isLoading && allCharacters.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {header}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("characters.noCharacters", "series") ||
                "No characters available"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No search results
  if (searchQuery && characters.length === 0 && allCharacters.length > 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {header}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("characters.search.noResults", "series", {
                query: searchQuery,
              }) || `No characters found matching "${searchQuery}"`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {header}

      {/* Characters Grid/List */}
      <div
        className={cn(
          layout === "grid" &&
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6",
          layout === "list" && "space-y-4",
        )}
      >
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            variant={layout === "grid" ? "compact" : "list"}
          />
        ))}

        {/* Load More Trigger (Intersection Observer target) */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="col-span-full flex justify-center py-4"
          >
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {t("characters.loading", "series") || "Loading characters..."}
                </span>
              </div>
            )}
          </div>
        )}

        {/* End of list indicator */}
        {!hasNextPage && characters.length > 0 && (
          <div className="col-span-full text-center py-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("characters.endOfList", "series") || "No more characters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
