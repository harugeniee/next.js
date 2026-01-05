"use client";

import { notFound, useParams, useRouter } from "next/navigation";

import { StaffDetail } from "@/components/features/admin/staffs/staff-detail";
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
  useStaff,
  useDeleteStaff,
  useUpdateStaff,
} from "@/hooks/admin/useStaffs";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import type { Staff } from "@/lib/interface/staff.interface";
import type { UpdateStaffFormData } from "@/lib/validators/staffs";

/**
 * Admin Staff Detail Page
 * Displays detailed staff information and allows editing/deleting
 */
export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const staffId = params.id as string;

  const { data: staff, isLoading, error } = useStaff(staffId);
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();

  // Get staff name for display
  const staffName =
    staff?.name?.full ||
    staff?.name?.userPreferred ||
    staff?.name?.first ||
    staff?.name?.native ||
    "Unknown Staff";

  // Update page metadata
  usePageMetadata({
    title: staff
      ? t("detail.title", "staff", { name: staffName })
      : t("detail.title", "staff"),
    description: t("detail.description", "staff"),
  });

  // Show 404 if staff not found
  if (!isLoading && !error && !staff) {
    notFound();
  }

  const handleUpdate = async (id: string, data: UpdateStaffFormData) => {
    try {
      await updateStaffMutation.mutateAsync({ id, data });
    } catch (error) {
      // Error handled by mutation
      throw error;
    }
  };

  const handleDelete = async (staff: Staff) => {
    const staffName =
      staff.name?.full ||
      staff.name?.userPreferred ||
      staff.name?.first ||
      "Unknown Staff";

    if (!confirm(t("list.deleteConfirm", "staff", { name: staffName }))) {
      return;
    }

    try {
      await deleteStaffMutation.mutateAsync(staff.id);
      // Redirect to staffs list after deletion
      router.push("/admin/staffs");
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/staffs">
                {t("pageTitle", "staff")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {staff ? staffName : t("detail.title", "staff")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={isLoading} data={staff}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {staff
              ? t("detail.title", "staff", { name: staffName })
              : t("detail.title", "staff")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("detail.description", "staff")}
          </p>
        </div>
      </AnimatedSection>

      {/* Error State */}
      {error && (
        <AnimatedSection loading={false} data={true}>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {t("detail.error", "staff")}: {error.message}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* Staff Detail Component */}
      {staff && (
        <StaffDetail
          staff={staff}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isUpdating={
            updateStaffMutation.isPending || deleteStaffMutation.isPending
          }
        />
      )}
    </div>
  );
}
