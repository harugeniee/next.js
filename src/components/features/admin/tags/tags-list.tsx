"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core/badge";
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
import { Pagination } from "@/components/ui/pagination";
import type { CreateTagDto, Tag, UpdateTagDto } from "@/lib/api/tags";
import { CreateTagFormDialog } from "./create-tag-form-dialog";
import { TagActions } from "./tag-actions";

interface TagsListProps {
  data?: {
    result: Tag[];
    metaData: {
      currentPage?: number;
      totalPages?: number;
      totalRecords?: number;
    };
  };
  isLoading: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onCreate: (data: CreateTagDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateTagDto) => Promise<void>;
  onDelete: (tag: Tag) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function TagsList({
  data,
  isLoading,
  page = 1,
  limit: _limit = 20, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: TagsListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (formData: CreateTagDto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const tags = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={tags} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("list.title", "tags")}</CardTitle>
              <CardDescription>{t("list.description", "tags")}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("list.create", "tags")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {tags && tags.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("list.name", "tags")}</TableHead>
                      <TableHead>{t("list.slug", "tags")}</TableHead>
                      <TableHead>{t("list.description", "tags")}</TableHead>
                      <TableHead>{t("list.usageCount", "tags")}</TableHead>
                      <TableHead>{t("list.status", "tags")}</TableHead>
                      <TableHead>{t("list.featured", "tags")}</TableHead>
                      <TableHead>{t("list.createdAt", "tags")}</TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow
                        key={tag.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          router.push(`/admin/tags/${tag.id}`);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tag.icon && (
                              <span className="text-lg">{tag.icon}</span>
                            )}
                            {tag.color && (
                              <div
                                className="h-4 w-4 rounded-full border border-border"
                                style={{ backgroundColor: tag.color }}
                              />
                            )}
                            <span className="font-medium">{tag.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground font-mono">
                            {tag.slug}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                            {tag.description || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{tag.usageCount ?? 0}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tag.isActive ? "default" : "secondary"}
                          >
                            {tag.isActive
                              ? t("status.active", "tags")
                              : t("status.inactive", "tags")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tag.isFeatured ? "default" : "outline"}
                          >
                            {tag.isFeatured
                              ? t("featured.yes", "tags")
                              : t("featured.no", "tags")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(tag.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => {
                            // Prevent navigation when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end">
                            <TagActions
                              tag={tag}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                              isUpdating={isUpdating}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Placeholder for skeleton - must match table structure
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted/10 rounded-md" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="h-10 w-[200px] bg-muted/20 rounded" />
                    <div className="h-10 w-[150px] bg-muted/20 rounded" />
                    <div className="h-10 w-[200px] bg-muted/20 rounded" />
                    <div className="h-10 w-[80px] bg-muted/20 rounded" />
                    <div className="h-8 w-[80px] bg-muted/20 rounded" />
                    <div className="h-8 w-[80px] bg-muted/20 rounded" />
                    <div className="h-10 w-[100px] bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {tags &&
            tags.length > 0 &&
            onPageChange &&
            metaData?.totalPages &&
            metaData.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={metaData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </CardContent>
      </Card>

      <CreateTagFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}

export default TagsList;
