"use client";

import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { toast } from "sonner";

interface ApiKeyDisplayProps {
  readonly apiKey: string;
  readonly showCopy?: boolean;
}

/**
 * Component to display API keys securely with masking
 */
export function ApiKeyDisplay({ apiKey, showCopy = true }: ApiKeyDisplayProps) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  // Mask the API key (show first 4 and last 4 characters)
  const maskKey = (key: string): string => {
    if (key.length <= 8) return "•".repeat(key.length);
    return `${key.slice(0, 4)}${"•".repeat(key.length - 8)}${key.slice(-4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success(t("rateLimit.apiKeys.copySuccess", "admin"));
    } catch {
      toast.error(t("rateLimit.apiKeys.copyError", "admin"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <code className="font-mono text-sm">
        {isVisible ? apiKey : maskKey(apiKey)}
      </code>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? "Hide API key" : "Show API key"}
      >
        {isVisible ? (
          <EyeOff className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
      </Button>
      {showCopy && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleCopy}
          aria-label="Copy API key"
        >
          <Copy className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
