"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import type { CacheStats } from "@/lib/interface/rate-limit.interface";

interface CacheStatsCardProps {
  data?: CacheStats;
  isLoading: boolean;
}

export function CacheStatsCard({ data, isLoading }: CacheStatsCardProps) {
  const { t } = useI18n();

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("rateLimit.cache.title", "admin")}</CardTitle>
          <CardDescription>
            {t("rateLimit.cache.description", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 w-full rounded bg-muted" />
                ))}
              </div>
            ) : data ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">{data.planCount}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("rateLimit.cache.planCount", "admin")}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">
                    {data.ipWhitelistCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("rateLimit.cache.ipWhitelistCount", "admin")}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">{data.apiKeyCount}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("rateLimit.cache.apiKeyCount", "admin")}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold">{data.policyCount}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("rateLimit.cache.policyCount", "admin")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {t("rateLimit.cache.empty", "admin")}
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
