import { useRouter } from "next/navigation";
import { useCreateContribution } from "@/hooks/admin/useContributions";
import type { CreateContributionDto } from "@/lib/types/contributions";
import type { CreateSeriesDto } from "@/lib/api/series";
import { ContributionEntityType, ContributionAction } from "@/lib/types/contributions";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Fields that should NOT be included in contribution submissions
 * These are admin-only or system-managed fields
 */
const EXCLUDED_FIELDS = [
  "meanScore",
  "isLocked",
  "trending",
  "autoCreateForumThread",
  "isRecommendationBlocked",
  "isReviewBlocked",
  "notes",
] as const;

/**
 * Filter out excluded fields from proposed data
 */
function filterExcludedFields(
  data: Partial<CreateSeriesDto>,
): Partial<CreateSeriesDto> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => !EXCLUDED_FIELDS.includes(key as typeof EXCLUDED_FIELDS[number]),
    ),
  ) as Partial<CreateSeriesDto>;
}

/**
 * Hook for submitting series contribution
 */
export function useSubmitContribution() {
  const router = useRouter();
  const { t } = useI18n();
  const createContribution = useCreateContribution();

  const submitContribution = async (
    seriesId: string,
    proposedData: Partial<CreateSeriesDto>,
    contributorNote?: string,
  ) => {
    // Filter out excluded fields before submission
    const filteredData = filterExcludedFields(proposedData);

    const contributionDto: CreateContributionDto = {
      entityType: ContributionEntityType.SERIES,
      entityId: seriesId,
      action: ContributionAction.UPDATE,
      proposedData: filteredData as Record<string, unknown>,
      contributorNote,
    };

    try {
      const contribution = await createContribution.mutateAsync(contributionDto);
      
      // Show success message with link to contribution
      // Redirect back to series page
      router.push(`/series/${seriesId}`);
      
      return contribution;
    } catch (error) {
      // Error is already handled by useCreateContribution hook
      throw error;
    }
  };

  return {
    submitContribution,
    isSubmitting: createContribution.isPending,
  };
}
