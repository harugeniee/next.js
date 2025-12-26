"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/core/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { DashboardOverviewResponse } from "@/lib/api/analytics";

interface EventTypesChartProps {
  data?: DashboardOverviewResponse;
  isLoading: boolean;
}

/**
 * Event Types Chart Component
 * Displays distribution of event types
 */
export function EventTypesChart({
  data,
  isLoading,
}: EventTypesChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    if (!data?.eventTypes) return [];
    const total = Object.values(data.eventTypes).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(data.eventTypes)
      .map(([eventType, count], index) => ({
        eventType,
        count,
        fill: `var(--chart-${(index % 5) + 1})`,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data?.eventTypes]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.eventType] = {
        label: item.eventType,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [chartData]);

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.charts.eventTypes", "admin")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.eventTypesDesc", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && chartData.length > 0 ? (
              <div className="space-y-4">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="eventType"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2">
                  {chartData.map((item) => (
                    <div
                      key={item.eventType}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="truncate">{item.eventType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.count}</span>
                        <span className="text-muted-foreground">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Placeholder for skeleton
              <div className="space-y-4">
                <div className="mx-auto aspect-square max-h-[300px]">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                    >
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

