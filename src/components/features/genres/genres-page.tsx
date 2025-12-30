"use client";

import { useI18n } from "@/components/providers/i18n-provider";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  useGenres,
  useCreateGenre,
  useUpdateGenre,
  useDeleteGenre,
} from "@/hooks/genres/useGenres";
import type {
  BackendGenre,
  CreateGenreDto,
  QueryGenreDto,
  UpdateGenreDto,
} from "@/lib/interface/genres.interface";
import { GenreFormDialog } from "./genre-form-dialog";

/**
 * Genres Management Component
 * Displays interface for managing genres in the admin panel
 */
export function GenresPage() {
  const { t } = useI18n();
  const [genreFilters, setGenreFilters] = useState<QueryGenreDto>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "DESC",
  });
  const [genreFormOpen, setGenreFormOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<BackendGenre | undefined>(
    undefined,
  );

  const { data: genresData, isLoading: genresLoading } =
    useGenres(genreFilters);
  const createGenreMutation = useCreateGenre();
  const updateGenreMutation = useUpdateGenre();
  const deleteGenreMutation = useDeleteGenre();

  const handleCreateGenre = () => {
    setSelectedGenre(undefined);
    setGenreFormOpen(true);
  };

  const handleEditGenre = (genre: BackendGenre) => {
    setSelectedGenre(genre);
    setGenreFormOpen(true);
  };

  const handleSubmitGenre = async (data: UpdateGenreDto) => {
    try {
      if (selectedGenre) {
        await updateGenreMutation.mutateAsync({ id: selectedGenre.id, data });
      } else {
        // When creating, we need to cast to CreateGenreDto since the form ensures required fields
        await createGenreMutation.mutateAsync(data as CreateGenreDto);
      }
      setGenreFormOpen(false);
      setSelectedGenre(undefined);
    } catch (error) {
      console.error("Failed to save genre:", error);
    }
  };

  const handleDeleteGenre = async (genre: BackendGenre) => {
    if (confirm(t("genres.deleteConfirm", "admin", { name: genre.name }))) {
      await deleteGenreMutation.mutateAsync(genre.id);
    }
  };

  const handlePageChange = (page: number) => {
    setGenreFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">
          {t("genres.welcomeMessage", "admin")}
        </p>
        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">
              {t("genres.management.title", "admin")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("genres.management.description", "admin")}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <Input
                placeholder={t("genres.filters.searchPlaceholder", "admin")}
                className="max-w-sm"
                onChange={(e) =>
                  setGenreFilters((prev) => ({
                    ...prev,
                    name: e.target.value,
                    page: 1,
                  }))
                }
              />
              <Button onClick={handleCreateGenre}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("genres.list.create", "admin")}
              </Button>
            </div>
            <div className="mt-4">
              {genresLoading ? (
                <div className="text-center py-8">Loading genres...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("genres.list.table.name", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("genres.list.table.slug", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("genres.list.table.description", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("genres.list.table.isNsfw", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("genres.list.table.sortOrder", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("genres.list.table.createdAt", "admin")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("genres.list.table.actions", "admin")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {genresData?.result?.length ? (
                        genresData.result.map((genre) => (
                          <TableRow key={genre.id}>
                            <TableCell className="font-medium">
                              {genre.name}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {genre.slug}
                            </TableCell>
                            <TableCell
                              className="max-w-xs truncate"
                              title={genre.description}
                            >
                              {genre.description || "-"}
                            </TableCell>
                            <TableCell>
                              {genre.isNsfw
                                ? t("genres.status.yes", "admin")
                                : t("genres.status.no", "admin")}
                            </TableCell>
                            <TableCell>{genre.sortOrder || 0}</TableCell>
                            <TableCell>
                              {new Date(genre.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditGenre(genre)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGenre(genre)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            {t("genres.list.noRecords", "admin")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {genresData?.metaData && genresData.result?.length > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={genresData.metaData.currentPage || 1}
                        totalPages={genresData.metaData.totalPages || 1}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <GenreFormDialog
        open={genreFormOpen}
        onOpenChange={setGenreFormOpen}
        genre={selectedGenre}
        onSubmit={handleSubmitGenre}
        isLoading={
          createGenreMutation.isPending || updateGenreMutation.isPending
        }
      />
    </div>
  );
}
