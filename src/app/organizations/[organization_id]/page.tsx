"use client";

import { BreadcrumbNav } from "@/components/features/navigation";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useOrganization } from "@/hooks/organizations";
import { useBreadcrumb, usePageMetadata } from "@/hooks/ui";
import { currentUserAtom } from "@/lib/auth";
import { format } from "date-fns";
import { useAtom } from "jotai";
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Settings,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

/**
 * Organization Detail Page Component
 * MangaDex-style layout with logo, metadata, stats, and content
 * URL pattern: /organizations/[organization_id]
 */
export default function OrganizationDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const organizationId = params.organization_id as string;
  const [currentUser] = useAtom(currentUserAtom);

  // Fetch organization data
  const {
    data: organization,
    isLoading,
    error,
  } = useOrganization(organizationId);

  // Update page metadata
  usePageMetadata({
    title: organization?.name,
    description: organization?.description
      ? organization.description.substring(0, 160)
      : undefined,
    image: organization?.logoUrl,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    keywords: [organization?.name, "organization"].filter((k): k is string =>
      Boolean(k),
    ),
    type: "website",
  });

  // Generate breadcrumb items (must be called unconditionally at top level)
  const breadcrumbItems = useBreadcrumb(undefined, {
    organization_id: organizationId,
    organization_name: organization?.name,
  });

  // Show 404 if organization not found
  if (!isLoading && !error && !organization) {
    notFound();
  }

  // Check if current user is owner
  const isOwner = currentUser?.id === organization?.ownerId;

  // Format date helper
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  // Get visibility badge
  const getVisibilityBadge = (visibility: string | undefined) => {
    if (visibility === "private") {
      return (
        <Badge variant="secondary" className="text-xs">
          {t("detail.private", "organizations") || "Private"}
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="text-xs">
        {t("detail.public", "organizations") || "Public"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection
        loading={isLoading}
        data={organization}
        className="w-full"
      >
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="text-center max-w-md mx-auto">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-foreground mb-2">
                  {t("detail.error.title", "organizations") || "Error"}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {error.message ||
                    t("detail.error.message", "organizations") ||
                    "Failed to load organization"}
                </p>
                <Link href="/">
                  <Button>
                    {t("detail.error.backToHome", "organizations") ||
                      "Back to Home"}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!error && organization && (
            <>
              {/* Main Content Container */}
              <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
                {/* Breadcrumb Navigation */}
                <div className="mb-4 sm:mb-6">
                  <BreadcrumbNav items={breadcrumbItems} />
                </div>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {/* Left Column - Logo and Metadata */}
                  <aside className="w-full md:w-56 lg:w-64 xl:w-80 flex-shrink-0">
                    {/* Logo */}
                    <div className="relative w-full max-w-[200px] mx-auto md:max-w-none md:w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-lg mb-3 sm:mb-4 md:mb-6 bg-muted">
                      {organization.logoUrl ? (
                        <Image
                          src={organization.logoUrl}
                          alt={organization.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 200px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mb-3 sm:mb-4 md:mb-6">
                      {isOwner && (
                        <>
                          <Link
                            href={`/organizations/${organizationId}/settings`}
                          >
                            <Button
                              variant="default"
                              className="w-full"
                              size="sm"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              {t("detail.edit", "organizations") ||
                                "Edit Organization"}
                            </Button>
                          </Link>
                        </>
                      )}
                      {!isOwner && (
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          disabled
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {t("detail.join", "organizations") ||
                            "Join Organization"}
                        </Button>
                      )}
                    </div>

                    {/* Metadata Card */}
                    <Card className="mb-3 sm:mb-4 md:mb-6">
                      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {/* Visibility */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {t("detail.visibility", "organizations") ||
                              "Visibility"}
                          </span>
                          {getVisibilityBadge(organization.visibility)}
                        </div>

                        {/* Member Count */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {t("detail.members", "organizations") || "Members"}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {organization.memberCount || 0}
                          </span>
                        </div>

                        {/* Article Count */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {t("detail.articles", "organizations") ||
                              "Articles"}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {organization.articleCount || 0}
                          </span>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {t("detail.created", "organizations") || "Created"}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {formatDate(organization.createdAt)}
                          </span>
                        </div>

                        {/* Website URL */}
                        {organization.websiteUrl && (
                          <div className="pt-2 border-t border-border">
                            <Link
                              href={organization.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {t("detail.website", "organizations") ||
                                "Website"}
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Owner Card */}
                    {organization.owner && (
                      <Card>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {organization.owner.avatar?.url ? (
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={organization.owner.avatar.url}
                                  alt={organization.owner.username}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {t("detail.owner", "organizations") || "Owner"}
                              </p>
                              <Link
                                href={`/user/${organization.owner.id}`}
                                className="text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors truncate block"
                              >
                                {organization.owner.username}
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </aside>

                  {/* Right Column - Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex-1">
                          {organization.name}
                        </h1>
                      </div>

                      {/* Description */}
                      {organization.description && (
                        <div className="mt-3 sm:mt-4">
                          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                            {organization.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Articles Section - Placeholder for future implementation */}
                      {organization.articleCount > 0 && (
                        <Card>
                          <CardContent className="p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                              {t("detail.articles", "organizations") ||
                                "Articles"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {t(
                                "detail.articlesComingSoon",
                                "organizations",
                              ) || "Articles section coming soon..."}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Members Section - Placeholder for future implementation */}
                      {organization.memberCount > 0 && (
                        <Card>
                          <CardContent className="p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                              {t("detail.members", "organizations") ||
                                "Members"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {t("detail.membersComingSoon", "organizations") ||
                                "Members section coming soon..."}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}
