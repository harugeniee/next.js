"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
} from "@/lib/interface/permission.interface";
import { RoleActions } from "./role-actions";
import { RoleFormDialog } from "./role-form-dialog";

interface RoleListProps {
  data?: Role[];
  isLoading: boolean;
  onCreate: (data: CreateRoleDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateRoleDto) => Promise<void>;
  onDelete: (role: Role) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function RoleList({
  data,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: RoleListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const handleEdit = (role: Role) => {
    setEditingRole(role);
  };

  const handleCreate = async (formData: CreateRoleDto) => {
    await onCreate(formData);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (formData: CreateRoleDto) => {
    if (editingRole) {
      await onUpdate(editingRole.id, formData);
      setEditingRole(undefined);
    }
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("list.title", "permissions")}</CardTitle>
              <CardDescription>
                {t("list.description", "permissions")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("list.create", "permissions")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && data.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("fields.name", "permissions")}</TableHead>
                      <TableHead>
                        {t("fields.description", "permissions")}
                      </TableHead>
                      <TableHead>
                        {t("fields.position", "permissions")}
                      </TableHead>
                      <TableHead>{t("fields.color", "permissions")}</TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((role) => (
                      <TableRow
                        key={role.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/admin/permissions/${role.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {role.color && (
                              <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: role.color }}
                              />
                            )}
                            {role.unicodeEmoji && (
                              <span className="text-lg">{role.unicodeEmoji}</span>
                            )}
                            <span className="font-medium">{role.name}</span>
                            {role.mentionable && (
                              <Badge variant="outline" className="text-xs">
                                @
                              </Badge>
                            )}
                            {role.managed && (
                              <Badge variant="secondary" className="text-xs">
                                {t("fields.managed", "permissions")}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {role.description || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.position}</Badge>
                        </TableCell>
                        <TableCell>
                          {role.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: role.color }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {role.color}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <RoleActions
                            role={role}
                            onEdit={handleEdit}
                            onDelete={onDelete}
                            isUpdating={isUpdating}
                          />
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
        </CardContent>
      </Card>

      <RoleFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <RoleFormDialog
        open={!!editingRole}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRole(undefined);
          }
        }}
        role={editingRole}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </AnimatedSection>
  );
}

