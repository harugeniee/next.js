"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { Badge } from "@/components/ui/core/badge";
import { Pagination } from "@/components/ui/pagination";
import type {
  CreateKeyValueDto,
  UpdateKeyValueDto,
  KeyValue,
} from "@/lib/interface/key-value.interface";
import { KeyValueFormDialog } from "./key-value-form-dialog";

interface KeyValueListProps {
  data?: {
    result: KeyValue[];
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
  onCreate: (data: CreateKeyValueDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateKeyValueDto) => Promise<void>;
  onDelete: (keyValue: KeyValue) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function KeyValueList({
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
}: KeyValueListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingKeyValue, setEditingKeyValue] = useState<
    KeyValue | undefined
  >();

  const handleCreate = async (
    formData: CreateKeyValueDto | UpdateKeyValueDto,
  ) => {
    await onCreate(formData as CreateKeyValueDto);
    setShowCreateDialog(false);
  };

  const handleEdit = (keyValue: KeyValue) => {
    setEditingKeyValue(keyValue);
  };

  const handleUpdate = async (
    formData: CreateKeyValueDto | UpdateKeyValueDto,
  ) => {
    if (editingKeyValue) {
      await onUpdate(editingKeyValue.id, formData as UpdateKeyValueDto);
      setEditingKeyValue(undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "string")
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    if (typeof value === "object") {
      const str = JSON.stringify(value);
      return str.length > 50 ? `${str.substring(0, 50)}...` : str;
    }
    return String(value);
  };

  const isExpired = (keyValue: KeyValue): boolean => {
    if (!keyValue.expiresAt) return false;
    return new Date(keyValue.expiresAt) < new Date();
  };

  const keyValues = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={keyValues} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("keyValue.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("keyValue.list.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("keyValue.list.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {keyValues && keyValues.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("keyValue.list.key", "admin")}</TableHead>
                      <TableHead>{t("keyValue.list.value", "admin")}</TableHead>
                      <TableHead>
                        {t("keyValue.list.namespace", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("keyValue.list.contentType", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("keyValue.list.status", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("keyValue.list.expiresAt", "admin")}
                      </TableHead>
                      <TableHead>
                        {t("keyValue.list.createdAt", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keyValues.map((keyValue) => (
                      <TableRow key={keyValue.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono text-sm">
                              {keyValue.key}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground font-mono max-w-[200px] truncate block">
                            {formatValue(keyValue.value)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {keyValue.namespace || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {keyValue.contentType ? (
                            <Badge variant="outline">
                              {t(
                                `keyValue.contentType.${keyValue.contentType}`,
                                "admin",
                              )}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isExpired(keyValue) ||
                              keyValue.status !== "active"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {isExpired(keyValue)
                              ? t("keyValue.status.expired", "admin")
                              : t(
                                  `keyValue.status.${keyValue.status}`,
                                  "admin",
                                )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {keyValue.expiresAt
                              ? new Date(
                                  keyValue.expiresAt,
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(keyValue.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <span>⋯</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(keyValue)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("actions.edit", "common")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDelete(keyValue)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("actions.delete", "common")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                    <div className="h-10 w-10 rounded-full bg-muted/20" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[200px] bg-muted/20 rounded" />
                      <div className="h-3 w-[150px] bg-muted/20 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-16 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {keyValues &&
            keyValues.length > 0 &&
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

      {/* Create Dialog */}
      <KeyValueFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {/* Edit Dialog */}
      <KeyValueFormDialog
        open={!!editingKeyValue}
        onOpenChange={(open) => {
          if (!open) setEditingKeyValue(undefined);
        }}
        keyValue={editingKeyValue}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </AnimatedSection>
  );
}
