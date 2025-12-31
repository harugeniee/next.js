"use client";

import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { StickerPacksList, StickersList } from "@/components/features/admin";
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
import { useStickerPacks } from "@/hooks/admin/useStickerPacks";
import { useStickers } from "@/hooks/admin/useStickers";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Sticker, StickerPack } from "@/lib/interface/sticker.interface";

/**
 * Stickers Management Page
 * Displays sticker and sticker pack management interface with tabs
 */
export default function AdminStickersPage() {
  const { t } = useI18n();

  // State for filters
  const [stickersFilters, setStickersFilters] = useState({
    page: 1,
    limit: 20,
    query: "",
  });

  const [packsFilters, setPacksFilters] = useState({
    page: 1,
    limit: 20,
    query: "",
  });

  usePageMetadata({
    title: t("stickers.pageTitle", "admin"),
    description: t("stickers.pageDescription", "admin"),
  });

  // Fetch stickers data
  const { listQuery: stickersQuery } = useStickers(stickersFilters);
  const stickersData = stickersQuery.data;
  const stickersLoading = stickersQuery.isLoading;

  // Fetch sticker packs data
  const { listQuery: packsQuery } = useStickerPacks(packsFilters);
  const packsData = packsQuery.data;
  const packsLoading = packsQuery.isLoading;

  // Mutations
  const {
    create: createSticker,
    update: updateSticker,
    remove: removeSticker,
  } = useStickers(stickersFilters);
  const {
    create: createPack,
    update: updatePack,
    remove: removePack,
  } = useStickerPacks(packsFilters);

  // Filter handlers (for future use)
  // const handleStickersFiltersChange = (newFilters: typeof stickersFilters) => {
  //   setStickersFilters({
  //     ...newFilters,
  //     page: 1, // Reset to page 1 when filters change
  //   });
  // };

  // const handlePacksFiltersChange = (newFilters: typeof packsFilters) => {
  //   setPacksFilters({
  //     ...newFilters,
  //     page: 1, // Reset to page 1 when filters change
  //   });
  // };

  // Pagination handlers
  const handleStickersPageChange = (page: number) => {
    setStickersFilters((prev) => ({ ...prev, page }));
  };

  const handlePacksPageChange = (page: number) => {
    setPacksFilters((prev) => ({ ...prev, page }));
  };

  // CRUD handlers
  const handleCreateSticker = async (
    data: Parameters<typeof createSticker.mutateAsync>[0],
  ) => {
    await createSticker.mutateAsync(data);
  };

  const handleUpdateSticker = async (
    id: string,
    data: Parameters<typeof updateSticker.mutateAsync>[0]["dto"],
  ) => {
    await updateSticker.mutateAsync({ id, dto: data });
  };

  const handleDeleteSticker = async (sticker: Sticker) => {
    if (
      confirm(t("stickers.list.deleteConfirm", "admin", { name: sticker.name }))
    ) {
      await removeSticker.mutateAsync(sticker.id);
    }
  };

  const handleCreatePack = async (
    data: Parameters<typeof createPack.mutateAsync>[0],
  ) => {
    await createPack.mutateAsync(data);
  };

  const handleUpdatePack = async (
    id: string,
    data: Parameters<typeof updatePack.mutateAsync>[0]["dto"],
  ) => {
    await updatePack.mutateAsync({ id, dto: data });
  };

  const handleDeletePack = async (pack: StickerPack) => {
    if (
      confirm(
        t("stickers.list.deletePackConfirm", "admin", { name: pack.name }),
      )
    ) {
      await removePack.mutateAsync(pack.id);
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
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("stickers.pageTitle", "admin")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("stickers.pageTitle", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("stickers.pageDescription", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs defaultValue="stickers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stickers">
            {t("stickers.tabs.stickers", "admin")}
          </TabsTrigger>
          <TabsTrigger value="stickerPacks">
            {t("stickers.tabs.stickerPacks", "admin")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stickers" className="mt-6 space-y-6">
          {/* Stickers Filters - Future enhancement */}
          {/* <AnimatedSection loading={false} data={true}>
            <StickersFilters
              filters={stickersFilters}
              onFiltersChange={handleStickersFiltersChange}
            />
          </AnimatedSection> */}

          {/* Stickers List */}
          <StickersList
            data={stickersData}
            isLoading={stickersLoading}
            page={stickersFilters.page}
            limit={stickersFilters.limit}
            onPageChange={handleStickersPageChange}
            onCreate={handleCreateSticker}
            onUpdate={handleUpdateSticker}
            onDelete={handleDeleteSticker}
            isCreating={createSticker.isPending}
            isUpdating={updateSticker.isPending || removeSticker.isPending}
          />
        </TabsContent>

        <TabsContent value="stickerPacks" className="mt-6 space-y-6">
          {/* Sticker Packs Filters - Future enhancement */}
          {/* <AnimatedSection loading={false} data={true}>
            <StickerPacksFilters
              filters={packsFilters}
              onFiltersChange={handlePacksFiltersChange}
            />
          </AnimatedSection> */}

          {/* Sticker Packs List */}
          <StickerPacksList
            data={packsData}
            isLoading={packsLoading}
            page={packsFilters.page}
            limit={packsFilters.limit}
            onPageChange={handlePacksPageChange}
            onCreate={handleCreatePack}
            onUpdate={handleUpdatePack}
            onDelete={handleDeletePack}
            isCreating={createPack.isPending}
            isUpdating={updatePack.isPending || removePack.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
