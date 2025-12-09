"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, ClockIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/core";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  readonly value?: Date | null;
  readonly onChange?: (date: Date | null) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly label?: string;
  readonly minDate?: Date;
  readonly maxDate?: Date;
}

/**
 * Date and Time Picker Component
 * Combines calendar date selection with time input
 * Supports Vietnamese locale and validation
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  className,
  label,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState("");

  // Initialize time value from the date
  React.useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0");
      const minutes = value.getMinutes().toString().padStart(2, "0");
      setTimeValue(`${hours}:${minutes}`);
    } else {
      setTimeValue("");
    }
  }, [value]);

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange?.(null);
      return;
    }

    // If we have a time value, combine it with the selected date
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      onChange?.(newDate);
    } else {
      // If no time selected, use current time
      const now = new Date();
      const newDate = new Date(selectedDate);
      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      onChange?.(newDate);
    }
  };

  // Handle time change
  const handleTimeChange = (time: string) => {
    setTimeValue(time);

    if (value && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes, 0, 0);
      onChange?.(newDate);
    }
  };

  // Format display value
  const formatDisplayValue = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
  };

  // Get minimum date (today or provided minDate)
  const getMinDate = () => {
    if (minDate) return minDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Date Picker */}
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? formatDisplayValue(value) : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const min = getMinDate();
                  const max = maxDate || new Date(2030, 11, 31);
                  return date < min || date > max;
                }}
                captionLayout="dropdown"
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="w-full sm:w-36">
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={disabled}
              className="bg-background pl-9"
              step="60" // 1 minute steps
              placeholder="HH:mm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
