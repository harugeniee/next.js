"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/core/skeleton";
import type { DashboardOverviewResponse } from "@/lib/api/analytics";
import { format } from "date-fns";

interface TimeSeriesChartProps {
  data?: DashboardOverviewResponse;
  isLoading: boolean;
  granularity?: "hour" | "day" | "week" | "month";
}

/**
 * Format date based on granularity
 */
function formatDate(dateString: string, granularity: string): string {
  try {
    const date = new Date(dateString);
    switch (granularity) {
      case "hour":
        return format(date, "HH:mm");
      case "day":
        return format(date, "MMM dd");
      case "week":
        return format(date, "MMM dd");
      case "month":
        return format(date, "MMM yyyy");
      default:
        return format(date, "MMM dd");
    }
  } catch {
    return dateString;
  }
}

/**
 * Time Series Chart Component
 * Displays analytics trends over time
 */
export function TimeSeriesChart({
  data,
  isLoading,
  granularity = "day",
}: TimeSeriesChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    if (!data?.timeSeries) return [];
    return data.timeSeries.map((item) => ({
      date: formatDate(item.date, granularity),
      count: item.count,
    }));
  }, [data.timeSeries, granularity]);

  const chartConfig = {
    count: {
      label: t("dashboard.charts.events", "admin"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.charts.timeSeries", "admin")}</CardTitle>
          <CardDescription>
            {t("dashboard.charts.timeSeriesDesc", "admin")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {data && chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      if (value >= 1_000_000)
                        return `${(value / 1_000_000).toFixed(1)}M`;
                      if (value >= 1_000)
                        return `${(value / 1_000).toFixed(1)}K`;
                      return value.toString();
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="count"
                    type="natural"
                    fill="var(--color-count)"
                    fillOpacity={0.4}
                    stroke="var(--color-count)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              // Placeholder for skeleton
              <div className="h-[300px] w-full">
                <Skeleton className="h-full w-full" />
              </div>
            )}
          </Skeletonize>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
