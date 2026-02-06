"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { BreadcrumbNav } from "@/components/features/navigation/breadcrumb-nav";
import { OrganizationForm } from "@/components/features/organizations/organization-form";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { useCreateOrganization } from "@/hooks/organizations/useOrganizationQuery";
import type { CreateOrganizationFormData } from "@/lib/validators/organizations";

/**
 * Public organization create page
 * Accessible to all authenticated users
 */
export default function CreateOrganizationPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { mutateAsync: createOrganization, isPending } =
    useCreateOrganization();

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      const result = await createOrganization(data);
      toast.success(t("create.success", "organizations"));

      // Redirect to organization detail page
      router.push(`/organizations/${result.id}`);
    } catch (error) {
      console.error("Failed to create organization:", error);
      toast.error(t("create.error", "organizations"));
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: t("breadcrumb.home", "common"), href: "/" },
            {
              label: t("breadcrumb.organizations", "common"),
              href: "/organizations",
            },
            {
              label: t("create.title", "organizations"),
              href: "/organizations/create",
            },
          ]}
        />

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("create.title", "organizations")}
          </h1>
          <p className="text-muted-foreground">
            {t("create.description", "organizations")}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("create.form.title", "organizations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationForm
              mode="create"
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
