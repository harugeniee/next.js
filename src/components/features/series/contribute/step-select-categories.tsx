"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/core/label";
import { ContributionCategory } from "@/lib/validators/contribution-series";
import { cn } from "@/lib/utils";
import { FileImage, Info, Link2, Calendar, Settings } from "lucide-react";

export interface StepSelectCategoriesProps {
  selectedCategories: ContributionCategory[];
  onToggleCategory: (category: ContributionCategory) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  className?: string;
}

const CATEGORY_INFO = {
  [ContributionCategory.BASIC_INFO]: {
    icon: Info,
    fields: ["Title", "Type", "Format", "Status"],
  },
  [ContributionCategory.MEDIA]: {
    icon: FileImage,
    fields: ["Cover Image", "Banner Image"],
  },
  [ContributionCategory.CONTENT]: {
    icon: FileImage,
    fields: ["Description", "Tags", "Genres"],
  },
  [ContributionCategory.RELEASE_INFO]: {
    icon: Calendar,
    fields: ["Start Date", "End Date", "Episodes", "Chapters", "Volumes"],
  },
  [ContributionCategory.ADVANCED]: {
    icon: Settings,
    fields: ["External Links", "Metadata", "Scores", "NSFW Status"],
  },
} as const;

export function StepSelectCategories({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  className,
}: StepSelectCategoriesProps) {
  const { t } = useI18n();

  const allSelected =
    selectedCategories.length === Object.keys(ContributionCategory).length;

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {t("contribute.steps.selectCategories", "series")}
        </h2>
        <p className="text-muted-foreground">
          {t("contribute.selectCategories.description", "series")}
        </p>
      </div>

      {/* Select All / Deselect All */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={allSelected ? onDeselectAll : onSelectAll}
        >
          {allSelected
            ? t(
                "contribute.selectCategories.deselectAll",
                "series",
                {},
                "Deselect All",
              )
            : t(
                "contribute.selectCategories.selectAll",
                "series",
                {},
                "Select All",
              )}
        </Button>
      </div>

      {/* Category Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(ContributionCategory).map((category) => {
          const isSelected = selectedCategories.includes(category);
          const categoryInfo = CATEGORY_INFO[category];
          const Icon = categoryInfo.icon;

          return (
            <Card
              key={category}
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                isSelected && "border-primary bg-primary/5",
              )}
              onClick={() => onToggleCategory(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleCategory(category)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">
                    {t(
                      `contribute.categories.${category}`,
                      "series",
                      {},
                      category,
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {categoryInfo.fields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategories.length === 0 && (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t(
              "contribute.selectCategories.noSelection",
              "series",
              {},
              "Please select at least one category to update",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
