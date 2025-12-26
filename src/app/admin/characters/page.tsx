"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  CharacterFilters,
  CharacterFormDialog,
  CharacterList,
  CharacterStatisticsCards,
} from "@/components/features/admin/characters";
import {
  useCharacterStatistics,
  useCharacters,
  useCreateCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/hooks/admin/useCharacters";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Character } from "@/lib/interface/character.interface";
import type { GetCharacterDto } from "@/lib/types/characters";
import type {
  CreateCharacterFormData,
  UpdateCharacterFormData,
} from "@/lib/validators/characters";

/**
 * Characters Management Page
 * Displays character management interface with statistics, filters, and list
 */
export default function CharactersPage() {
  const { t } = useI18n();
  const [characterFilters, setCharacterFilters] = useState<GetCharacterDto>({
    page: 1,
    limit: 20,
  });

  // Dialog state
  const [characterFormOpen, setCharacterFormOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<
    Character | undefined
  >();

  const { data: charactersData, isLoading: charactersLoading } =
    useCharacters(characterFilters);
  const { data: statisticsData, isLoading: statisticsLoading } =
    useCharacterStatistics();

  const createCharacterMutation = useCreateCharacter();
  const updateCharacterMutation = useUpdateCharacter();
  const deleteCharacterMutation = useDeleteCharacter();

  usePageMetadata({
    title: t("title", "characters"),
    description: t("description", "characters"),
  });

  const handleCharacterFiltersChange = (newFilters: GetCharacterDto) => {
    // Reset to page 1 when filters change (search, gender, sort, etc.)
    // Only preserve page if it's explicitly set in newFilters
    setCharacterFilters({
      ...newFilters,
      page: 1, // Always reset to page 1 when filters change
    });
  };

  const handlePageChange = (page: number) => {
    setCharacterFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setCharacterFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleCreateCharacter = () => {
    setSelectedCharacter(undefined);
    setCharacterFormOpen(true);
  };

  const handleCharacterEdit = (character: Character) => {
    setSelectedCharacter(character);
    setCharacterFormOpen(true);
  };

  const handleCharacterSubmit = async (
    data: CreateCharacterFormData | UpdateCharacterFormData,
  ) => {
    try {
      if (selectedCharacter) {
        await updateCharacterMutation.mutateAsync({
          id: selectedCharacter.id,
          data: data as UpdateCharacterFormData,
        });
      } else {
        await createCharacterMutation.mutateAsync(
          data as CreateCharacterFormData,
        );
      }
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleCharacterDelete = async (character: Character) => {
    const characterName =
      character.name?.full ||
      character.name?.userPreferred ||
      character.name?.first ||
      "Unknown Character";

    if (
      !confirm(t("list.deleteConfirm", "characters", { name: characterName }))
    ) {
      return;
    }

    try {
      await deleteCharacterMutation.mutateAsync(character.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                {t("breadcrumb.admin", "characters")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("breadcrumb.characters", "characters")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title", "characters")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("description", "characters")}
          </p>
        </div>
      </AnimatedSection>

      {/* Statistics Cards */}
      <CharacterStatisticsCards
        data={statisticsData}
        isLoading={statisticsLoading}
      />

      {/* Character Filters */}
      <AnimatedSection loading={false} data={true}>
        <CharacterFilters
          filters={characterFilters}
          onFiltersChange={handleCharacterFiltersChange}
        />
      </AnimatedSection>

      {/* Characters List */}
      <CharacterList
        data={charactersData}
        isLoading={charactersLoading}
        page={characterFilters.page || 1}
        limit={characterFilters.limit || 20}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onCreate={handleCreateCharacter}
        onEdit={handleCharacterEdit}
        onDelete={handleCharacterDelete}
        onUpdate={async (id, data) => {
          await updateCharacterMutation.mutateAsync({ id, data });
        }}
        isUpdating={updateCharacterMutation.isPending}
      />

      {/* Character Form Dialog */}
      <CharacterFormDialog
        open={characterFormOpen}
        onOpenChange={setCharacterFormOpen}
        character={selectedCharacter}
        onSubmit={handleCharacterSubmit}
        isLoading={
          createCharacterMutation.isPending || updateCharacterMutation.isPending
        }
      />
    </div>
  );
}
