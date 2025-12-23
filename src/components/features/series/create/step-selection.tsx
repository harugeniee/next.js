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
import { cn } from "@/lib/utils";
import { PenTool, Sparkles } from "lucide-react";

export interface StepSelectionProps {
  onManualClick: () => void;
  className?: string;
}

/**
 * Step 0: Selection Component
 * Choose between automated or manual series creation
 */
export function StepSelection({
  onManualClick,
  className,
}: StepSelectionProps) {
  const { t } = useI18n();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Automated Option - Disabled */}
        <Card className="relative opacity-60 cursor-not-allowed">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {t("create.steps.automated", "series")}
              </CardTitle>
            </div>
            <CardDescription>
              {t("create.steps.automatedDescription", "series")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled={true}>
              {t("create.steps.automatedButton", "series")}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t("create.steps.automatedComingSoon", "series")}
            </p>
          </CardContent>
        </Card>

        {/* Manual Option - Enabled */}
        <Card className="border-primary/50 hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <PenTool className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                {t("create.steps.manual", "series")}
              </CardTitle>
            </div>
            <CardDescription>
              {t("create.steps.manualDescription", "series")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onManualClick} className="w-full">
              {t("create.steps.manualButton", "series")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
