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
import { Pagination } from "@/components/ui/pagination";
import type { Staff } from "@/lib/interface/staff.interface";
import type {
  CreateStaffFormData,
  StaffListResponse,
  UpdateStaffFormData,
} from "@/lib/types/staffs";
import { StaffActions } from "./staff-actions";
import { StaffDisplay } from "./staff-display";

interface StaffListProps {
  data?: StaffListResponse;
  isLoading: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onCreate: () => void;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
  isUpdating?: boolean;
}

export function StaffList({
  data,
  isLoading,
  page = 1,
  limit: _limit = 20,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
  isUpdating,
}: StaffListProps) {
  const { t } = useI18n();
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const staffs = data?.result ?? [];
  const metaData = data?.metaData;

  return (
    <AnimatedSection loading={isLoading} data={staffs} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
            <CardTitle>{t("list.title", "staff")}</CardTitle>
            <CardDescription>
              {t("list.description", "staff")}
            </CardDescription>
            </div>
            <Button size="sm" onClick={onCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("list.create", "staff")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {staffs && staffs.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>{t("list.name", "staff")}</TableHead>
                    <TableHead>{t("list.language", "staff")}</TableHead>
                    <TableHead>{t("list.gender", "staff")}</TableHead>
                    <TableHead>
                      {t("list.occupation", "staff")}
                    </TableHead>
                    <TableHead>{t("list.status", "staff")}</TableHead>
                      <TableHead className="text-right">
                        {t("common.actions", "common")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffs.map((staff) => (
                      <TableRow
                        key={staff.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/admin/staffs/${staff.id}`)}
                      >
                        <TableCell>
                          <StaffDisplay staff={staff} size="sm" />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {staff.language || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground capitalize">
                            {staff.gender || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {staff.primaryOccupations &&
                          staff.primaryOccupations.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {staff.primaryOccupations.slice(0, 2).map((occ, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {occ}
                                </Badge>
                              ))}
                              {staff.primaryOccupations.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{staff.primaryOccupations.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              staff.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {staff.status
                              ? t(
                                  `form.statusOptions.${staff.status}`,
                                  "staff",
                                  {},
                                  staff.status,
                                )
                              : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-end">
                            <StaffActions
                              staff={staff}
                              onEdit={onEdit}
                              onDelete={onDelete}
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
              // Placeholder for skeleton
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded border" />
                ))}
              </div>
            )}
          </Skeletonize>

          {/* Pagination */}
          {metaData && metaData.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={metaData.page || page}
                totalPages={metaData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

