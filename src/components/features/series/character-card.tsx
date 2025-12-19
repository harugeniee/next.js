"use client";

import { Calendar, Droplet, Mic, User, Users } from "lucide-react";
import Image from "next/image";
import React, { memo, useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { Card, CardContent } from "@/components/ui/core/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/layout/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/ui/useSimpleHooks";
import type { Character } from "@/lib/interface/character.interface";
import { cn } from "@/lib/utils";

/**
 * Character Card Component
 * Displays character information with voice actors
 * Reusable component that can be used in multiple places
 */
interface CharacterCardProps {
  character: Character;
  variant?: "compact" | "detail" | "list";
  className?: string;
}

// Helper component for icon-based metadata badges
function MetadataBadge({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className={cn("gap-1.5", className)}>
          <Icon className="h-3 w-3" />
          <span>{value}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export const CharacterCard = memo(function CharacterCard({
  character,
  variant = "detail",
  className,
}: CharacterCardProps) {
  const { t } = useI18n();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isVoiceActorsDialogOpen, setIsVoiceActorsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Use Sheet for mobile (< 768px), Dialog for desktop (≥ 768px)
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Track mount state to prevent hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get character display name
  const displayName =
    character.name?.full || character.name?.userPreferred || "Unknown";
  const nativeName = character.name?.native;

  // Group voice actors by language and sort by isPrimary (memoized)
  const sortedVoiceActors = useMemo(() => {
    const voiceActors = character.voiceActors || [];
    return [...voiceActors].sort((a, b) => {
      // Primary voice actors first
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      // Then by sortOrder
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
  }, [character.voiceActors]);

  // Render based on variant
  if (variant === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden border-border bg-card transition-all hover:shadow-md",
          className,
        )}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            {/* Character Image - Left */}
            {character.image?.url ? (
              <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted group">
                <Image
                  src={character.image.url}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* Character Info - Right */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 break-words">
                  {displayName}
                </h3>
                {nativeName && nativeName !== displayName && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    {nativeName}
                  </p>
                )}
              </div>

              {/* Metadata Badges */}
              {(character.gender || character.age || character.bloodType) && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {character.gender && (
                    <MetadataBadge
                      icon={Users}
                      value={character.gender}
                      label={`${t("characters.metadata.gender", "series")}: ${character.gender}`}
                      className="text-[10px] sm:text-xs"
                    />
                  )}
                  {character.age && (
                    <MetadataBadge
                      icon={Calendar}
                      value={character.age}
                      label={`${t("characters.metadata.age", "series")}: ${character.age}`}
                      className="text-[10px] sm:text-xs"
                    />
                  )}
                  {character.bloodType && (
                    <MetadataBadge
                      icon={Droplet}
                      value={character.bloodType}
                      label={`${t("characters.metadata.bloodType", "series")}: ${character.bloodType}`}
                      className="text-[10px] sm:text-xs"
                    />
                  )}
                </div>
              )}

              {/* Description */}
              {character.description && (
                <p
                  className={cn(
                    "text-xs sm:text-sm text-muted-foreground leading-relaxed break-words mb-2",
                    !isDescriptionExpanded && "line-clamp-2",
                  )}
                >
                  {character.description}
                </p>
              )}

              {/* Voice Actors Button */}
              {sortedVoiceActors.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVoiceActorsDialogOpen(true)}
                  className={cn(
                    "h-auto p-1.5 text-xs text-muted-foreground hover:text-foreground",
                    isMobile && "min-h-[44px]",
                  )}
                  aria-label={
                    t("characters.voiceActors.viewAll", "series", {
                      count: sortedVoiceActors.length,
                    }) || `View ${sortedVoiceActors.length} voice actors`
                  }
                >
                  <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-xs">{sortedVoiceActors.length}</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "overflow-hidden border-border bg-card transition-all hover:shadow-md",
          className,
        )}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col">
            {/* Character Image */}
            {character.image?.url ? (
              <div className="relative w-full max-w-[180px] mx-auto mb-3 aspect-[2/3] rounded-lg overflow-hidden bg-muted group">
                <Image
                  src={character.image.url}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 180px, 200px"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[180px] mx-auto mb-3 aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            {/* Character Name */}
            <div className="mb-2 text-center">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 break-words">
                {displayName}
              </h3>
              {nativeName && nativeName !== displayName && (
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {nativeName}
                </p>
              )}
            </div>

            {/* Metadata Badges */}
            {(character.gender || character.age || character.bloodType) && (
              <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
                {character.gender && (
                  <MetadataBadge
                    icon={Users}
                    value={character.gender}
                    label={`${t("characters.metadata.gender", "series")}: ${character.gender}`}
                    className="text-[10px] sm:text-xs"
                  />
                )}
                {character.age && (
                  <MetadataBadge
                    icon={Calendar}
                    value={character.age}
                    label={`${t("characters.metadata.age", "series")}: ${character.age}`}
                    className="text-[10px] sm:text-xs"
                  />
                )}
                {character.bloodType && (
                  <MetadataBadge
                    icon={Droplet}
                    value={character.bloodType}
                    label={`${t("characters.metadata.bloodType", "series")}: ${character.bloodType}`}
                    className="text-[10px] sm:text-xs"
                  />
                )}
              </div>
            )}

            {/* Description */}
            {character.description && (
              <div className="space-y-1 mb-3">
                <p
                  className={cn(
                    "text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words text-center",
                    !isDescriptionExpanded && "line-clamp-2",
                  )}
                >
                  {character.description}
                </p>
                {character.description.length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="h-auto p-0 text-[10px] sm:text-xs text-primary hover:text-primary/80 hover:underline mx-auto"
                  >
                    {isDescriptionExpanded
                      ? t("characters.description.readLess", "series") ||
                        "Read Less"
                      : t("characters.description.readMore", "series") ||
                        "Read More"}
                  </Button>
                )}
              </div>
            )}

            {/* Voice Actors */}
            {sortedVoiceActors.length > 0 && (
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                    {t("characters.voiceActors.title", "series") ||
                      "Voice Actors"}
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      ({sortedVoiceActors.length})
                    </span>
                  </h4>
                </div>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => setIsVoiceActorsDialogOpen(true)}
                  className={cn(
                    "w-full",
                    isMobile
                      ? "min-h-[44px]" // Touch-friendly for mobile
                      : "",
                  )}
                >
                  {t("characters.voiceActors.viewAll", "series", {
                    count: sortedVoiceActors.length,
                  }) || `View ${sortedVoiceActors.length} voice actors`}
                </Button>
              </div>
            )}

            {/* Voice Actors Modal - Sheet for mobile, Dialog for desktop */}
            {isMounted &&
              (isMobile ? (
                <Sheet
                  open={isVoiceActorsDialogOpen}
                  onOpenChange={setIsVoiceActorsDialogOpen}
                >
                  <SheetContent
                    side="bottom"
                    className="max-h-[85vh] overflow-hidden flex flex-col p-0"
                  >
                    <SheetHeader className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
                      <SheetTitle className="text-base">
                        {t("characters.voiceActors.title", "series") ||
                          "Voice Actors"}
                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                          ({sortedVoiceActors.length})
                        </span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                      {sortedVoiceActors.map((voiceActor) => {
                        const staff = voiceActor.staff;
                        if (!staff) return null;

                        const staffName =
                          staff.name?.full ||
                          staff.name?.userPreferred ||
                          "Unknown";
                        const staffImageUrl =
                          staff.imageUrls?.medium || staff.imageUrls?.large;

                        return (
                          <div
                            key={voiceActor.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border active:bg-muted transition-colors touch-manipulation"
                          >
                            {staffImageUrl ? (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={staffImageUrl}
                                  alt={staffName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-medium text-foreground break-words">
                                  {staffName}
                                </p>
                                {voiceActor.isPrimary && (
                                  <Badge
                                    variant="default"
                                    className="text-[10px] flex-shrink-0"
                                  >
                                    {t(
                                      "characters.voiceActors.primary",
                                      "series",
                                    ) || "Main"}
                                  </Badge>
                                )}
                              </div>
                              {voiceActor.language && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {voiceActor.language}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Dialog
                  open={isVoiceActorsDialogOpen}
                  onOpenChange={setIsVoiceActorsDialogOpen}
                >
                  <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>
                        {t("characters.voiceActors.title", "series") ||
                          "Voice Actors"}
                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                          ({sortedVoiceActors.length})
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                      {sortedVoiceActors.map((voiceActor) => {
                        const staff = voiceActor.staff;
                        if (!staff) return null;

                        const staffName =
                          staff.name?.full ||
                          staff.name?.userPreferred ||
                          "Unknown";
                        const staffImageUrl =
                          staff.imageUrls?.medium || staff.imageUrls?.large;

                        return (
                          <div
                            key={voiceActor.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                          >
                            {staffImageUrl ? (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={staffImageUrl}
                                  alt={staffName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-medium text-foreground break-words">
                                  {staffName}
                                </p>
                                {voiceActor.isPrimary && (
                                  <Badge
                                    variant="default"
                                    className="text-[10px] flex-shrink-0"
                                  >
                                    {t(
                                      "characters.voiceActors.primary",
                                      "series",
                                    ) || "Main"}
                                  </Badge>
                                )}
                              </div>
                              {voiceActor.language && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {voiceActor.language}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detail variant (default)
  return (
    <Card
      className={cn(
        "overflow-hidden border-border bg-card transition-all hover:shadow-md",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row max-h-[600px] sm:max-h-[650px] md:max-h-[700px]">
          {/* Left Side - Character Info */}
          <div className="flex flex-col lg:w-1/2 p-4 sm:p-5 md:p-6 overflow-y-auto scrollbar-hide sm:scrollbar-thin">
            {/* Character Image */}
            {character.image?.url ? (
              <div className="relative w-full max-w-[240px] mx-auto lg:mx-0 mb-4 aspect-[2/3] rounded-lg overflow-hidden bg-muted group">
                <Image
                  src={character.image.url}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 240px"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[240px] mx-auto lg:mx-0 mb-4 aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {/* Character Name */}
            <div className="mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 break-words">
                {displayName}
              </h3>
              {nativeName && nativeName !== displayName && (
                <p className="text-sm text-muted-foreground break-words">
                  {nativeName}
                </p>
              )}
            </div>

            {/* Metadata Badges */}
            {(character.gender || character.age || character.bloodType) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {character.gender && (
                  <MetadataBadge
                    icon={Users}
                    value={character.gender}
                    label={`${t("characters.metadata.gender", "series")}: ${character.gender}`}
                    className="text-xs"
                  />
                )}
                {character.age && (
                  <MetadataBadge
                    icon={Calendar}
                    value={character.age}
                    label={`${t("characters.metadata.age", "series")}: ${character.age}`}
                    className="text-xs"
                  />
                )}
                {character.bloodType && (
                  <MetadataBadge
                    icon={Droplet}
                    value={character.bloodType}
                    label={`${t("characters.metadata.bloodType", "series")}: ${character.bloodType}`}
                    className="text-xs"
                  />
                )}
              </div>
            )}

            {/* Description */}
            {character.description && (
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words",
                    !isDescriptionExpanded && "line-clamp-3",
                  )}
                >
                  {character.description}
                </p>
                {character.description.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:underline"
                  >
                    {isDescriptionExpanded
                      ? t("characters.description.readLess", "series") ||
                        "Read Less"
                      : t("characters.description.readMore", "series") ||
                        "Read More"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Voice Actors */}
          <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-border p-4 sm:p-5 md:p-6 bg-muted/30 flex flex-col overflow-hidden">
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 flex-shrink-0">
              {t("characters.voiceActors.title", "series") || "Voice Actors"}
              {sortedVoiceActors.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  ({sortedVoiceActors.length})
                </span>
              )}
            </h4>
            {sortedVoiceActors.length > 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setIsVoiceActorsDialogOpen(true)}
                  className={cn(
                    "w-full",
                    isMobile
                      ? "min-h-[44px]" // Touch-friendly for mobile
                      : "",
                  )}
                >
                  {t("characters.voiceActors.viewAll", "series", {
                    count: sortedVoiceActors.length,
                  }) || `View ${sortedVoiceActors.length} voice actors`}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("characters.voiceActors.none", "series") ||
                  "No voice actors available"}
              </p>
            )}

            {/* Voice Actors Modal - Sheet for mobile, Dialog for desktop */}
            {isMounted &&
              (isMobile ? (
                <Sheet
                  open={isVoiceActorsDialogOpen}
                  onOpenChange={setIsVoiceActorsDialogOpen}
                >
                  <SheetContent
                    side="bottom"
                    className="max-h-[85vh] overflow-hidden flex flex-col p-0"
                  >
                    <SheetHeader className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
                      <SheetTitle className="text-base">
                        {t("characters.voiceActors.title", "series") ||
                          "Voice Actors"}
                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                          ({sortedVoiceActors.length})
                        </span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                      {sortedVoiceActors.map((voiceActor) => {
                        const staff = voiceActor.staff;
                        if (!staff) return null;

                        const staffName =
                          staff.name?.full ||
                          staff.name?.userPreferred ||
                          "Unknown";
                        const staffImageUrl =
                          staff.imageUrls?.medium || staff.imageUrls?.large;

                        return (
                          <div
                            key={voiceActor.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border active:bg-muted transition-colors touch-manipulation"
                          >
                            {staffImageUrl ? (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={staffImageUrl}
                                  alt={staffName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-medium text-foreground break-words">
                                  {staffName}
                                </p>
                                {voiceActor.isPrimary && (
                                  <Badge
                                    variant="default"
                                    className="text-[10px] flex-shrink-0"
                                  >
                                    {t(
                                      "characters.voiceActors.primary",
                                      "series",
                                    ) || "Main"}
                                  </Badge>
                                )}
                              </div>
                              {voiceActor.language && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {voiceActor.language}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Dialog
                  open={isVoiceActorsDialogOpen}
                  onOpenChange={setIsVoiceActorsDialogOpen}
                >
                  <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>
                        {t("characters.voiceActors.title", "series") ||
                          "Voice Actors"}
                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                          ({sortedVoiceActors.length})
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                      {sortedVoiceActors.map((voiceActor) => {
                        const staff = voiceActor.staff;
                        if (!staff) return null;

                        const staffName =
                          staff.name?.full ||
                          staff.name?.userPreferred ||
                          "Unknown";
                        const staffImageUrl =
                          staff.imageUrls?.medium || staff.imageUrls?.large;

                        return (
                          <div
                            key={voiceActor.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                          >
                            {staffImageUrl ? (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={staffImageUrl}
                                  alt={staffName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <p className="text-sm font-medium text-foreground break-words">
                                  {staffName}
                                </p>
                                {voiceActor.isPrimary && (
                                  <Badge
                                    variant="default"
                                    className="text-[10px] flex-shrink-0"
                                  >
                                    {t(
                                      "characters.voiceActors.primary",
                                      "series",
                                    ) || "Main"}
                                  </Badge>
                                )}
                              </div>
                              {voiceActor.language && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {voiceActor.language}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
