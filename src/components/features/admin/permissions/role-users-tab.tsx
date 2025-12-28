"use client";

import { format } from "date-fns";
import { Plus, Users, X } from "lucide-react";
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
import {
  useUsersWithRole,
} from "@/hooks/admin/usePermissions";
import type {
  Role,
  UserRole,
} from "@/lib/interface/permission.interface";
import type { AssignRoleFormData } from "@/lib/validators/permissions";
import { AssignRoleDialog } from "./assign-role-dialog";

interface RoleUsersTabProps {
  role?: Role;
  isLoading: boolean;
  onAssignRole: (data: AssignRoleFormData) => Promise<void>;
  onRemoveRole: (userRole: UserRole) => Promise<void>;
  isAssigning?: boolean;
  isRemoving?: boolean;
}

/**
 * RoleUsersTab Component
 * Displays and manages users assigned to the role
 */
export function RoleUsersTab({
  role,
  isLoading: _isLoading,
  onAssignRole,
  onRemoveRole,
  isAssigning,
  isRemoving,
}: RoleUsersTabProps) {
  const { t } = useI18n();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const { data: usersWithRole, isLoading: isLoadingUsers } =
    useUsersWithRole(role?.id || "");

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  const handleAssignRole = async (data: AssignRoleFormData) => {
    await onAssignRole(data);
  };

  return (
    <div className="space-y-6">
      <AnimatedSection loading={isLoadingUsers} data={usersWithRole}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {t("detail.sections.users", "permissions")}
                </CardTitle>
                <CardDescription>
                  {t("detail.sections.usersDesc", "permissions")}
                </CardDescription>
              </div>
              {role && (
                <Button
                  size="sm"
                  onClick={() => setShowAssignDialog(true)}
                  disabled={isLoadingUsers}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("assignRole.button", "permissions")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Skeletonize loading={isLoadingUsers}>
              {usersWithRole && usersWithRole.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("users.fields.user", "admin")}</TableHead>
                        <TableHead>{t("users.fields.status", "admin")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithRole.map((userRole: UserRole) => (
                        <TableRow key={userRole.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {t("detail.fields.userId", "permissions")}:{" "}
                                  {userRole.userId}
                                </div>
                                {userRole.reason && (
                                  <div className="text-xs text-muted-foreground">
                                    {userRole.reason}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {userRole.isTemporary && (
                                <Badge variant="outline">
                                  {t("detail.temporary", "permissions")}
                                </Badge>
                              )}
                              {userRole.expiresAt && (
                                <div className="text-xs text-muted-foreground">
                                  {t("detail.expires", "permissions")}:{" "}
                                  {formatDate(userRole.expiresAt)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveRole(userRole)}
                              disabled={isRemoving}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">
                                {t("assignRole.remove", "permissions")}
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t("detail.noUsers", "permissions")}
                </div>
              )}
            </Skeletonize>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Assign Role Dialog */}
      {role && (
        <AssignRoleDialog
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          role={role}
          onSubmit={handleAssignRole}
          isLoading={isAssigning}
        />
      )}
    </div>
  );
}

