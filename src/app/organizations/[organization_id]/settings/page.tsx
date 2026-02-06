"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { BreadcrumbNav } from "@/components/features/navigation/breadcrumb-nav";
import { OrganizationForm } from "@/components/features/organizations/organization-form";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  useOrganization,
  useUpdateOrganization,
} from "@/hooks/organizations/useOrganizationQuery";
import { currentUserAtom } from "@/lib/auth";
import type { CreateOrganizationFormData } from "@/lib/validators/organizations";
import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";

/**
 * Organization settings page - Owner only
 * Allows organization owners to edit their organization details
 */
export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params.organization_id as string;
  const { t } = useI18n();
  const [currentUser] = useAtom(currentUserAtom);

  const { data: organization, isLoading } = useOrganization(organizationId);
  const { mutateAsync: updateOrganization, isPending } =
    useUpdateOrganization();

  // Permission check: Only owner can access settings
  const isOwner = currentUser?.id === organization?.ownerId;

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      await updateOrganization({ id: organizationId, data });
      toast.success(t("organizations.settings.success"));
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast.error(t("organizations.settings.error"));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container max-w-3xl mx-auto py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Organization not found
  if (!organization) {
    return (
      <ProtectedRoute>
        <div className="container max-w-2xl mx-auto py-16">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Organization Not Found</h2>
                  <p className="text-muted-foreground">
                    The organization you're looking for doesn't exist or has
                    been removed.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/organizations">Back to Organizations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Unauthorized - Not owner
  if (!isOwner) {
    return (
      <ProtectedRoute>
        <div className="container max-w-2xl mx-auto py-16">
          <Card className="border-yellow-500">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">
                    {t("organizations.settings.unauthorized")}
                  </h2>
                  <p className="text-muted-foreground">
                    Only the organization owner can access and modify settings.
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/organizations/${organizationId}`}>
                    {t("organizations.settings.backToOrganization")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Authorized - Show form
  return (
    <ProtectedRoute>
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: t("home", "common"), href: "/" },
            {
              label: t("organizations.title", "common"),
              href: "/organizations",
            },
            {
              label: organization.name,
              href: `/organizations/${organizationId}`,
            },
            {
              label: t("organizations.settings.title"),
              href: `/organizations/${organizationId}/settings`,
            },
          ]}
        />

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("organizations.settings.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("organizations.settings.description")}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{organization.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationForm
              mode="edit"
              defaultValues={{
                name: organization.name,
                slug: organization.slug || "",
                description: organization.description || "",
                websiteUrl: organization.websiteUrl || "",
                logoUrl: organization.logoUrl || "",
                logoId: organization.logoId || "",
                visibility: organization.visibility,
              }}
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
