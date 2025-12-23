"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Label } from "@/components/ui/core";
import { Input } from "@/components/ui/core/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
import { cn } from "@/lib/utils";
import type { CompressionOptions } from "@/lib/utils/image-compression";
import { Info } from "lucide-react";

/**
 * Image compression settings component props
 */
export interface ImageCompressionSettingsProps {
  /**
   * Whether compression is enabled
   */
  enabled: boolean;

  /**
   * Callback when enabled state changes
   */
  onEnabledChange: (enabled: boolean) => void;

  /**
   * Current compression options
   */
  options: CompressionOptions;

  /**
   * Callback when options change
   */
  onOptionsChange: (options: CompressionOptions) => void;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Whether to show advanced settings
   */
  showAdvanced?: boolean;

  /**
   * Whether to disable the enable/disable toggle
   * When true, compression is always enabled and user cannot toggle it
   */
  disableToggle?: boolean;
}

/**
 * Image Compression Settings Component
 * Allows users to configure image compression settings before upload
 */
export function ImageCompressionSettings({
  enabled,
  onEnabledChange,
  options,
  onOptionsChange,
  className,
  showAdvanced = false,
  disableToggle = false,
}: ImageCompressionSettingsProps) {
  const { t } = useI18n();

  // Quality as percentage (0-100) for display
  const qualityPercent = Math.round((options.quality ?? 0.8) * 100);

  // Available quality options
  const qualityOptions = [90, 80, 70];

  // Get the closest quality value from available options
  // If current quality is not exactly one of the options, use the closest one
  const getClosestQuality = (current: number): number => {
    return qualityOptions.reduce((prev, curr) =>
      Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev,
    );
  };

  // Current quality value for select (must be one of the available options)
  const currentQualityValue = qualityOptions.includes(qualityPercent)
    ? qualityPercent.toString()
    : getClosestQuality(qualityPercent).toString();

  /**
   * Handle quality change from select
   */
  const handleQualityChange = (value: string) => {
    const qualityValue = parseInt(value, 10);
    if (!isNaN(qualityValue) && qualityValue >= 0 && qualityValue <= 100) {
      onOptionsChange({
        ...options,
        quality: qualityValue / 100,
      });
    }
  };

  /**
   * Handle format change
   */
  const handleFormatChange = (format: "jpeg" | "png" | "webp") => {
    onOptionsChange({
      ...options,
      outputFormat: format,
    });
  };

  /**
   * Handle max width change
   */
  const handleMaxWidthChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onOptionsChange({
        ...options,
        maxWidth: numValue,
      });
    }
  };

  /**
   * Handle max height change
   */
  const handleMaxHeightChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onOptionsChange({
        ...options,
        maxHeight: numValue,
      });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Label
            htmlFor="compression-enabled"
            className={`text-sm font-medium ${
              disableToggle ? "cursor-default" : "cursor-pointer"
            }`}
          >
            {t("compression.enable", "series") || "Enable compression"}
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("compression.enableDescription", "series") ||
              "Reduce image file size before upload"}
          </p>
        </div>
        {disableToggle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <input
                  id="compression-enabled"
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onEnabledChange(e.target.checked)}
                  disabled={disableToggle}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t("compression.proFeatureTooltip", "series") ||
                  "This feature is available for Pro users only"}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <input
            id="compression-enabled"
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            disabled={disableToggle}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          />
        )}
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-border">
          {/* Quality Select */}
          <div className="space-y-2">
            <Label
              htmlFor="compression-quality"
              className="text-sm font-medium"
            >
              {t("compression.quality", "series") || "Quality"}
            </Label>
            <Select
              value={currentQualityValue}
              onValueChange={handleQualityChange}
              disabled={disableToggle}
            >
              <SelectTrigger id="compression-quality" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="80">80%</SelectItem>
                <SelectItem value="70">70%</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>
                {t("compression.qualityHint", "series") ||
                  "Higher quality = larger file size"}
              </span>
            </div>
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <Label htmlFor="compression-format" className="text-sm font-medium">
              {t("compression.format", "series") || "Output format"}
            </Label>
            <Select
              value={options.outputFormat || "jpeg"}
              onValueChange={(value) =>
                handleFormatChange(value as "jpeg" | "png" | "webp")
              }
              disabled={disableToggle}
            >
              <SelectTrigger id="compression-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground">
                {t("compression.advanced", "series") || "Advanced Settings"}
              </p>

              {/* Max Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="compression-max-width"
                    className="text-xs font-medium"
                  >
                    {t("compression.maxWidth", "series") || "Max Width (px)"}
                  </Label>
                  <Input
                    id="compression-max-width"
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    value={options.maxWidth || 1920}
                    onChange={(e) => handleMaxWidthChange(e.target.value)}
                    disabled={disableToggle}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="compression-max-height"
                    className="text-xs font-medium"
                  >
                    {t("compression.maxHeight", "series") || "Max Height (px)"}
                  </Label>
                  <Input
                    id="compression-max-height"
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    value={options.maxHeight || 1920}
                    onChange={(e) => handleMaxHeightChange(e.target.value)}
                    disabled={disableToggle}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
