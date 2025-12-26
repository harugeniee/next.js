"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { CharacterDetail } from "@/components/features/admin/characters";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import {
  useCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/hooks/admin/useCharacters";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Character } from "@/lib/interface/character.interface";
import type { UpdateCharacterFormData } from "@/lib/validators/characters";

/**
 * Admin Character Detail Page
 * Displays detailed character information and allows editing/deleting
 */
export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const characterId = params.character_id as string;

  const { data: character, isLoading, error } = useCharacter(characterId);
  const updateCharacterMutation = useUpdateCharacter();
  const deleteCharacterMutation = useDeleteCharacter();

  // Get character name for display
  const characterName =
    character?.name?.full ||
    character?.name?.userPreferred ||
    character?.name?.first ||
    character?.name?.native ||
    "Unknown Character";

  // Update page metadata
  usePageMetadata({
    title: character
      ? t("detail.title", "characters", { name: characterName })
      : t("detail.title", "characters"),
    description: t("detail.description", "characters"),
  });

  // Show 404 if character not found
  if (!isLoading && !error && !character) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateCharacterFormData) => {
    try {
      await updateCharacterMutation.mutateAsync({ id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (character: Character) => {
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
      // Redirect to characters list after deletion
      router.push("/admin/characters");
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
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/characters">
                {t("title", "characters")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {character ? characterName : t("detail.title", "characters")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={character}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {character
              ? t("detail.title", "characters", { name: characterName })
              : t("detail.title", "characters")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("detail.description", "characters")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("detail.error", "characters")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Character Detail Component */}
      {character && (
        <CharacterDetail
          character={character}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={
            updateCharacterMutation.isPending ||
            deleteCharacterMutation.isPending
          }
        />
      )}
    </div>
  );
}
