"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /**
   * Target date/time for the countdown
   */
  readonly targetDate: Date | string;

  /**
   * Callback when countdown reaches zero
   */
  readonly onComplete?: () => void;

  /**
   * Custom className for styling
   */
  readonly className?: string;

  /**
   * Whether to show days in the countdown
   */
  readonly showDays?: boolean;

  /**
   * Whether to show hours in the countdown
   */
  readonly showHours?: boolean;

  /**
   * Whether to show minutes in the countdown
   */
  readonly showMinutes?: boolean;

  /**
   * Whether to show seconds in the countdown
   */
  readonly showSeconds?: boolean;

  /**
   * Text to display when countdown is complete
   */
  readonly completedText?: string;

  /**
   * Text to display when countdown is expired
   */
  readonly expiredText?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Countdown Timer Component
 * Displays a countdown timer for scheduled article publication
 * Supports customizable display units and styling
 */
export function CountdownTimer({
  targetDate,
  onComplete,
  className,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  completedText = "Publishing now...",
  expiredText = "Published",
}: CountdownTimerProps) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime() + 30000; // Add 30 seconds
      const difference = target - now;

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const updateTimer = () => {
      const time = calculateTimeLeft();

      if (time === null) {
        if (!isExpired) {
          setIsExpired(true);
          if (onComplete) {
            onComplete();
          }
        }
        return;
      }

      setTimeLeft(time);
      setIsExpired(false);
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, isExpired]);

  // Handle completion state
  useEffect(() => {
    if (isExpired && !isCompleted) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setIsCompleted(true);
      });
      // Auto-hide after 3 seconds
      const hideTimer = setTimeout(() => {
        setIsCompleted(false);
      }, 3000);

      return () => clearTimeout(hideTimer);
    }
  }, [isExpired, isCompleted]);

  if (isCompleted) {
    return (
      <div className={cn("text-center", className)}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 border border-green-200 text-sm font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {completedText}
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className={cn("text-center", className)}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-sm font-medium">
          {expiredText}
        </div>
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const timeUnits = [
    ...(showDays
      ? [
          {
            label: "Days",
            value: timeLeft.days,
            short: t("schedule.timeUnits.days", "article") || "d",
          },
        ]
      : []),
    ...(showHours
      ? [
          {
            label: "Hours",
            value: timeLeft.hours,
            short: t("schedule.timeUnits.hours", "article") || "h",
          },
        ]
      : []),
    ...(showMinutes
      ? [
          {
            label: "Minutes",
            value: timeLeft.minutes,
            short: t("schedule.timeUnits.minutes", "article") || "m",
          },
        ]
      : []),
    ...(showSeconds
      ? [
          {
            label: "Seconds",
            value: timeLeft.seconds,
            short: t("schedule.timeUnits.seconds", "article") || "s",
          },
        ]
      : []),
  ];

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="bg-primary/10 text-primary border border-primary/20 rounded-lg px-2 py-1 min-w-[2.5rem] text-center">
            <span className="text-lg font-bold tabular-nums">
              {unit.value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 font-medium">
            {unit.short}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact Countdown Timer Component
 * A smaller version for inline display
 */
export function CompactCountdownTimer({
  targetDate,
  onComplete,
  className,
}: Omit<
  CountdownTimerProps,
  "showDays" | "showHours" | "showMinutes" | "showSeconds"
>) {
  return (
    <CountdownTimer
      targetDate={targetDate}
      onComplete={onComplete}
      className={className}
      showDays={false}
      showHours={true}
      showMinutes={true}
      showSeconds={true}
    />
  );
}
