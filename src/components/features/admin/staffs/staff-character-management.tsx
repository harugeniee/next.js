"use client";

import { Edit, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import {
  useLinkCharacters,
  useRemoveCharacterRole,
  useUpdateCharacterRole,
} from "@/hooks/admin/useStaffs";
import type { CharacterStaff, Staff } from "@/lib/interface/staff.interface";
import type { LinkCharactersDto } from "@/lib/types/staffs";
import type { UpdateCharacterRoleFormData } from "@/lib/validators/staffs";
import { CharacterRoleFormDialog } from "./character-role-form-dialog";
import { LinkCharactersForm } from "./link-characters-form";

interface StaffCharacterManagementProps {
  staff?: Staff;
  isLoading: boolean;
}

/**
 * Staff Character Management Component
 * Full CRUD operations for managing character roles
 */
export function StaffCharacterManagement({
  staff,
  isLoading,
}: StaffCharacterManagementProps) {
  const { t } = useI18n();
  const [editingRole, setEditingRole] = useState<CharacterStaff | undefined>();
  const [deletingRole, setDeletingRole] = useState<CharacterStaff | undefined>();
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const linkCharactersMutation = useLinkCharacters();
  const updateRoleMutation = useUpdateCharacterRole();
  const removeRoleMutation = useRemoveCharacterRole();

  const handleLinkCharacters = async (data: LinkCharactersDto) => {
    if (!staff?.id) return;
    await linkCharactersMutation.mutateAsync({ staffId: staff.id, data });
    setShowLinkDialog(false);
  };

  const handleUpdateRole = async (data: UpdateCharacterRoleFormData) => {
    if (!staff?.id || !editingRole?.id) return;
    await updateRoleMutation.mutateAsync({
      staffId: staff.id,
      characterStaffId: editingRole.id,
      data,
    });
    setEditingRole(undefined);
  };

  const handleDeleteRole = async () => {
    if (!staff?.id || !deletingRole?.id) return;
    await removeRoleMutation.mutateAsync({
      staffId: staff.id,
      characterStaffId: deletingRole.id,
    });
    setDeletingRole(undefined);
  };

  const characterRoles = staff?.characterRoles || [];
  const hasCharacters = characterRoles.length > 0;

  return (
    <>
      <AnimatedSection loading={isLoading} data={staff}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("detail.characterManagement", "staff")}</CardTitle>
                <CardDescription>
                  {t("detail.characterRolesDescription", "staff")}
                </CardDescription>
              </div>
              <Button onClick={() => setShowLinkDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("detail.addCharacters", "staff")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Skeletonize loading={isLoading}>
              {hasCharacters ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("characterRole.character", "staff")}</TableHead>
                        <TableHead>{t("characterRole.language", "staff")}</TableHead>
                        <TableHead>{t("characterRole.isPrimary", "staff")}</TableHead>
                        <TableHead>{t("characterRole.sortOrder", "staff")}</TableHead>
                        <TableHead>{t("characterRole.notes", "staff")}</TableHead>
                        <TableHead className="text-right">
                          {t("common.actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {characterRoles.map((role) => {
                        const characterName =
                          role.character?.name?.full ||
                          role.character?.name?.userPreferred ||
                          "Unknown Character";

                        return (
                          <TableRow key={role.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {role.character?.image?.large ? (
                                  <Image
                                    src={role.character.image.large}
                                    alt={characterName}
                                    width={40}
                                    height={40}
                                    className="size-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                                    <User className="size-5 text-muted-foreground" />
                                  </div>
                                )}
                                <span className="font-medium">{characterName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{role.language || "-"}</TableCell>
                            <TableCell>
                              {role.isPrimary && (
                                <Badge variant="default">
                                  {t("detail.primaryRole", "staff")}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{role.sortOrder}</TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate" title={role.notes}>
                                {role.notes || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingRole(role)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingRole(role)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("detail.noCharacterRoles", "staff")}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowLinkDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("detail.addCharacters", "staff")}
                  </Button>
                </div>
              )}
            </Skeletonize>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Edit Character Role Dialog */}
      <CharacterRoleFormDialog
        open={!!editingRole}
        onOpenChange={(open) => !open && setEditingRole(undefined)}
        characterRole={editingRole}
        onSubmit={handleUpdateRole}
        isLoading={updateRoleMutation.isPending}
      />

      {/* Link Characters Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("detail.addCharacters", "staff")}</DialogTitle>
            <DialogDescription>
              Add one or more characters to this staff member
            </DialogDescription>
          </DialogHeader>
          <LinkCharactersForm
            onSubmit={handleLinkCharacters}
            isLoading={linkCharactersMutation.isPending}
            onCancel={() => setShowLinkDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("detail.removeCharacterRole", "staff")}</DialogTitle>
            <DialogDescription>
              {t("detail.removeCharacterConfirm", "staff")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingRole(undefined)}
            >
              {t("common.cancel", "common")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRole}
              disabled={removeRoleMutation.isPending}
            >
              {removeRoleMutation.isPending
                ? t("deleting", "common")
                : t("actions.delete", "common")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

