"use client";

import { ArrowLeft, Edit, Info, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Skeleton } from "@/components/ui/core/skeleton";
import { useUserRoleMutations } from "@/hooks/admin/usePermissions";
import type {
  Role,
  UpdateRoleDto,
  UserRole,
} from "@/lib/interface/permission.interface";
import type { AssignRoleFormData } from "@/lib/validators/permissions";
import { RoleDetailsTab } from "./role-details-tab";
import { RoleFormDialog } from "./role-form-dialog";
import { RoleUsersTab } from "./role-users-tab";

interface RoleDetailProps {
  role?: Role;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateRoleDto) => Promise<void>;
  onDelete: (role: Role) => void;
  isUpdating?: boolean;
}

export function RoleDetail({
  role,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: RoleDetailProps) {
  const { t } = useI18n();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { assignRole, removeRole } = useUserRoleMutations();

  const handleAssignRole = async (data: AssignRoleFormData) => {
    if (!role) return;
    await assignRole.mutateAsync({
      ...data,
      roleId: role.id,
    });
  };

  const handleRemoveRole = async (userRole: UserRole) => {
    if (
      confirm(
        t("assignRole.removeConfirm", "permissions", {
          userId: userRole.userId,
        }),
      )
    ) {
      await removeRole.mutateAsync({
        userId: userRole.userId,
        roleId: userRole.roleId,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <AnimatedSection loading={false} data={true}>
        <Button variant="ghost" asChild>
          <Link href="/admin/permissions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.actions.back", "permissions")}
          </Link>
        </Button>
      </AnimatedSection>

      {/* Role Header Card */}
      <AnimatedSection loading={isLoading} data={role}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeletonize loading={isLoading}>
                  {role ? (
                    <div className="flex items-center gap-3">
                      {role.color && (
                        <div
                          className="h-16 w-16 rounded-lg"
                          style={{ backgroundColor: role.color }}
                        />
                      )}
                      {role.unicodeEmoji && (
                        <span className="text-4xl">{role.unicodeEmoji}</span>
                      )}
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {role.name}
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
                        </CardTitle>
                        {role.description && (
                          <CardDescription className="text-base mt-1">
                            {role.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-lg bg-muted" />
                      <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                  )}
                </Skeletonize>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("detail.actions.edit", "permissions")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(role!)}
                  disabled={isLoading || !role}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("detail.actions.delete", "permissions")}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">
            <Info className="mr-2 h-4 w-4" />
            {t("detail.tabs.details", "permissions")}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            {t("detail.tabs.users", "permissions")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <RoleDetailsTab role={role} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <RoleUsersTab
            role={role}
            isLoading={isLoading}
            onAssignRole={handleAssignRole}
            onRemoveRole={handleRemoveRole}
            isAssigning={assignRole.isPending}
            isRemoving={removeRole.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {role && (
        <RoleFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          role={role}
          onSubmit={(data) => onUpdate(role.id, data)}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
