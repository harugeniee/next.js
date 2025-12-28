"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { Skeleton } from "@/components/ui/core/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
import {
  useUsersWithRole,
} from "@/hooks/admin/usePermissions";
import { useUsersByIds } from "@/hooks/admin/useUsers";
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
 * Displays and manages users assigned to the role with rich user information
 * Similar to UserList component with avatars, names, emails, and search
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
  const router = useRouter();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: usersWithRole, isLoading: isLoadingUsers } =
    useUsersWithRole(role?.id || "");

  // Extract user IDs from UserRole array
  const userIds = useMemo(
    () => usersWithRole?.map((ur) => ur.userId) || [],
    [usersWithRole],
  );

  // Fetch user data for all userIds
  const { data: usersMap, isLoading: isLoadingUserData } = useUsersByIds(userIds);

  // Combine UserRole with User data and filter by search
  const enrichedUserRoles = useMemo(() => {
    if (!usersWithRole || !usersMap) return [];

    return usersWithRole
      .map((userRole) => ({
        userRole,
        user: usersMap[userRole.userId],
      }))
      .filter(({ user, userRole }) => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase().trim();
        const userName = (user?.name || "").toLowerCase();
        const username = (user?.username || "").toLowerCase();
        const email = (user?.email || "").toLowerCase();
        const userId = userRole.userId.toLowerCase();
        const reason = (userRole.reason || "").toLowerCase();

        return (
          userName.includes(query) ||
          username.includes(query) ||
          email.includes(query) ||
          userId.includes(query) ||
          reason.includes(query)
        );
      });
  }, [usersWithRole, usersMap, searchQuery]);

  const isLoading = isLoadingUsers || isLoadingUserData;

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "PPP");
    } catch {
      return "-";
    }
  };

  const formatRelativeDate = (date?: Date | string) => {
    if (!date) return null;
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return null;
    }
  };

  const handleAssignRole = async (data: AssignRoleFormData) => {
    await onAssignRole(data);
  };

  const handleRowClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      <AnimatedSection loading={isLoading} data={usersWithRole}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("assignRole.button", "permissions")}
                </Button>
              )}
            </div>
            {/* Search Input */}
            {usersWithRole && usersWithRole.length > 0 && (
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("detail.searchPlaceholder", "permissions")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Skeletonize loading={isLoading}>
              {enrichedUserRoles && enrichedUserRoles.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("users.fields.user", "admin")}</TableHead>
                        <TableHead>{t("detail.assignment", "permissions")}</TableHead>
                        <TableHead>{t("users.fields.status", "admin")}</TableHead>
                        <TableHead className="text-right">
                          {t("actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrichedUserRoles.map(({ userRole, user }) => (
                        <TableRow
                          key={userRole.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => user && handleRowClick(user.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {user ? (
                                <>
                                  <Avatar>
                                    <AvatarImage
                                      src={user.avatar?.url || user.photoUrl}
                                      alt={user.username}
                                    />
                                    <AvatarFallback>
                                      {user.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {user.name || user.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.email}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Skeleton className="h-10 w-10 rounded-full" />
                                  <div className="flex flex-col gap-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-1">
                              {userRole.reason && (
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                      {userRole.reason}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{userRole.reason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {userRole.createdAt && (
                                <div className="text-xs text-muted-foreground">
                                  {t("detail.assigned", "permissions")}: {formatDate(userRole.createdAt)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-1">
                              {userRole.isTemporary && (
                                <Badge variant="outline" className="w-fit">
                                  {t("detail.temporary", "permissions")}
                                </Badge>
                              )}
                              {userRole.expiresAt && (
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <div className="text-xs text-muted-foreground">
                                      {t("detail.expires", "permissions")}: {formatRelativeDate(userRole.expiresAt) || formatDate(userRole.expiresAt)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{formatDate(userRole.expiresAt)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {!userRole.isTemporary && !userRole.expiresAt && (
                                <Badge variant="secondary" className="w-fit">
                                  {t("detail.permanent", "permissions")}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-right"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveRole(userRole)}
                              disabled={isRemoving}
                              className="h-8 w-8 p-0"
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
              ) : searchQuery.trim() ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("detail.noSearchResults", "permissions")}
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

