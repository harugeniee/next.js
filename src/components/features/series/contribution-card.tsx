"use client";

import { format } from "date-fns";
import { CheckCircle2, Edit, Plus, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/providers/i18n-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/core/avatar";
import { Badge } from "@/components/ui/core/badge";
import {
  Card,
  CardContent
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import type { Contribution } from "@/lib/types/contributions";
import { ContributionAction } from "@/lib/types/contributions";
import { cn } from "@/lib/utils";

interface ContributionCardProps {
  contribution: Contribution;
  className?: string;
}

/**
 * Extract and format changed fields from proposed data
 */
function extractChangedFields(contribution: Contribution): string[] {
  const { proposedData, originalData, action } = contribution;

  if (action === ContributionAction.CREATE) {
    // For create actions, show all fields in proposedData
    return Object.keys(proposedData).filter(
      (key) => proposedData[key] !== null && proposedData[key] !== undefined,
    );
  }

  // For update actions, compare with originalData
  if (!originalData) return [];

  const changedFields: string[] = [];
  Object.keys(proposedData).forEach((key) => {
    const oldValue = originalData[key];
    const newValue = proposedData[key];

    // Normalize for comparison
    const normalizedOld =
      oldValue === null || oldValue === undefined
        ? null
        : JSON.stringify(oldValue);
    const normalizedNew =
      newValue === null || newValue === undefined
        ? null
        : JSON.stringify(newValue);

    if (normalizedOld !== normalizedNew) {
      changedFields.push(key);
    }
  });

  return changedFields;
}

/**
 * Format field name for display
 * Converts camelCase to Title Case (e.g., "startDate" -> "Start Date")
 */
function formatFieldName(field: string): string {
  // Convert camelCase to Title Case
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Contribution Card Component
 * Displays a single approved contribution with user info and change details
 */
export function ContributionCard({
  contribution,
  className,
}: ContributionCardProps) {
  const { t } = useI18n();

  const contributor = contribution.contributor;
  const contributorName =
    contributor?.name || contributor?.username || "Unknown User";
  const contributorInitials = contributorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const changedFields = extractChangedFields(contribution);
  const isCreateAction = contribution.action === ContributionAction.CREATE;

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "MMM dd, yyyy");
    } catch {
      return "";
    }
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md border-l-2 border-l-green-500 dark:border-l-green-400",
        className,
      )}
    >
      <CardContent className="p-1 sm:p-1.5">
        {/* Desktop: Fields left (outermost), User right | Mobile: Stacked */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3">
          {/* Changed Fields Summary - Left Side (Outermost) */}
          {changedFields.length > 0 && (
            <div className="flex-1 md:min-w-0 md:order-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {isCreateAction
                      ? t("contribute.fieldsAdded", "series", {}, "Fields Added")
                      : t("contribute.fieldsUpdated", "series", {}, "Fields Updated")}
                    :
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {changedFields.slice(0, 10).map((field) => (
                    <Badge
                      key={field}
                      variant="outline"
                      className="text-xs font-normal bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      {formatFieldName(field)}
                    </Badge>
                  ))}
                  {changedFields.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{changedFields.length - 10} {t("contribute.more", "series", {}, "more")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Info - Right Side */}
          <div className="flex items-start gap-3 flex-shrink-0 md:min-w-[200px] md:order-2">
            {/* User Avatar */}
            <Link
              href={`/user/${contributor?.id || contribution.contributorId}`}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10 ring-2 ring-green-500/20 dark:ring-green-400/20">
                {contributor?.email && (
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.email}`}
                    alt={contributorName}
                  />
                )}
                <AvatarFallback className="bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold">
                  {contributorInitials}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/user/${contributor?.id || contribution.contributorId}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors hover:underline"
                >
                  {contributorName}
                </Link>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {t("contributions.status.approved", "admin")}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {isCreateAction ? (
                  <Plus className="h-3 w-3" />
                ) : (
                  <Edit className="h-3 w-3" />
                )}
                <span>
                  {t(`contributions.action.${contribution.action}`, "admin", {}, contribution.action)}
                </span>
                {contribution.reviewedAt && (
                  <>
                    <span>•</span>
                    <span>{formatDate(contribution.reviewedAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contributor Note */}
        {contribution.contributorNote && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {t("contribute.contributorNote", "series", {}, "Contributor Note")}:
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {contribution.contributorNote}
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
            <div>
              {t("contribute.submittedOn", "series", {}, "Submitted on")}{" "}
              <span className="font-medium">{formatDate(contribution.createdAt)}</span>
            </div>
            {contribution.reviewedAt && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <div>
                  {t("contribute.approvedAt", "series", {}, "Approved on")}{" "}
                  <span className="font-medium">{formatDate(contribution.reviewedAt)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
