"use client";

import { useState } from "react";

import {
  StaffFilters,
  StaffFormDialog,
  StaffList,
} from "@/components/features/admin/staffs";
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
import {
  useStaffs,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "@/hooks/admin/useStaffs";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Staff } from "@/lib/interface/staff.interface";
import type { GetStaffDto } from "@/lib/types/staffs";
import type {
  CreateStaffFormData,
  UpdateStaffFormData,
} from "@/lib/validators/staffs";

/**
 * Staffs Management Page
 * Displays staff management interface
 */
export default function AdminStaffsPage() {
  const { t } = useI18n();
  const [staffFilters, setStaffFilters] = useState<GetStaffDto>({
    page: 1,
    limit: 20,
  });

  // Dialog state
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();

  const { data: staffsData, isLoading: staffsLoading } =
    useStaffs(staffFilters);

  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();

  usePageMetadata({
    title: t("pageTitle", "staff"),
    description: t("pageDescription", "staff"),
  });

  const handleStaffFiltersChange = (newFilters: GetStaffDto) => {
    // Reset to page 1 when filters change
    setStaffFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setStaffFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateStaff = () => {
    setSelectedStaff(undefined);
    setStaffFormOpen(true);
  };

  const handleStaffEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setStaffFormOpen(true);
  };

  const handleStaffSubmit = async (
    data: CreateStaffFormData | UpdateStaffFormData,
  ) => {
    try {
      if (selectedStaff) {
        await updateStaffMutation.mutateAsync({
          id: selectedStaff.id,
          data: data as UpdateStaffFormData,
        });
      } else {
        await createStaffMutation.mutateAsync(data as CreateStaffFormData);
      }
      setStaffFormOpen(false);
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleStaffDelete = async (staff: Staff) => {
    const staffName =
      staff.name?.full ||
      staff.name?.userPreferred ||
      `${staff.name?.first || ""} ${staff.name?.last || ""}`.trim() ||
      "Unknown Staff";

    if (
      !confirm(t("list.deleteConfirm", "staff", { name: staffName }))
    ) {
      return;
    }

    try {
      await deleteStaffMutation.mutateAsync(staff.id);
    } catch {
      // Error handled by mutation
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
                  <BreadcrumbPage>{t("pageTitle", "staff")}</BreadcrumbPage>
                </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("pageTitle", "staff")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("pageDescription", "staff")}
          </p>
        </div>
      </AnimatedSection>

      {/* Staff Filters */}
      <AnimatedSection loading={false} data={true}>
        <StaffFilters
          filters={staffFilters}
          onFiltersChange={handleStaffFiltersChange}
        />
      </AnimatedSection>

      {/* Staffs List */}
      <StaffList
        data={staffsData}
        isLoading={staffsLoading}
        page={staffFilters.page || 1}
        limit={staffFilters.limit || 20}
        onPageChange={handlePageChange}
        onCreate={handleCreateStaff}
        onEdit={handleStaffEdit}
        onDelete={handleStaffDelete}
        isUpdating={updateStaffMutation.isPending || deleteStaffMutation.isPending}
      />

      {/* Staff Form Dialog */}
      <StaffFormDialog
        open={staffFormOpen}
        onOpenChange={setStaffFormOpen}
        staff={selectedStaff}
        onSubmit={handleStaffSubmit}
        isLoading={
          createStaffMutation.isPending || updateStaffMutation.isPending
        }
      />
    </div>
  );
}

