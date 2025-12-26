"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { CreateUserDto, User } from "@/lib/interface/user.interface";
import type { ApiResponseOffset } from "@/lib/types";
import { UserActions } from "./user-actions";
import { UserFormDialog } from "./user-form-dialog";

interface UserListProps {
  data?: ApiResponseOffset<User>;
  isLoading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onCreate: (data: CreateUserDto) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (user: User) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function UserList({
  data,
  isLoading,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: UserListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("users.list.title", "admin")}</CardTitle>
              <CardDescription>
                {t("users.list.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("users.list.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && data.result && data.result.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("users.fields.user", "admin")}</TableHead>
                      <TableHead>{t("users.fields.role", "admin")}</TableHead>
                      <TableHead>{t("users.fields.status", "admin")}</TableHead>
                      <TableHead>
                        {t("users.fields.verified", "admin")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.result.map((user) => (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`users.roles.${user.role}`, "admin")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                          >
                            {t(`users.status.${user.status}`, "admin")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.isEmailVerified && (
                              <Badge variant="outline" className="text-xs">
                                Email
                              </Badge>
                            )}
                            {user.isPhoneVerified && (
                              <Badge variant="outline" className="text-xs">
                                Phone
                              </Badge>
                            )}
                            {!user.isEmailVerified && !user.isPhoneVerified && (
                              <span className="text-muted-foreground text-xs">
                                -
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            // Stop propagation to prevent row click when clicking actions
                            e.stopPropagation();
                          }}
                        >
                          <UserActions
                            user={user}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
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

          {data && data.metaData.totalPages && data.metaData.totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) {
                          onPageChange(page - 1);
                        }
                      }}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: data.metaData.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      pageNum === 1 ||
                      pageNum === data.metaData.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                          }}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data.metaData.totalPages || 1)) {
                          onPageChange(page + 1);
                        }
                      }}
                      className={
                        page >= (data.metaData.totalPages || 1)
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={onCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}
