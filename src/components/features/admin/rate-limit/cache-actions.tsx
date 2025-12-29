"use client";

import { RefreshCw, RotateCcw } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Input } from "@/components/ui/core/input";
import { useCacheMutations } from "@/hooks/admin/useRateLimit";

export function CacheActions() {
  const { t } = useI18n();
  const { invalidateCache, resetRateLimit } = useCacheMutations();
  const [resetKey, setResetKey] = useState("");

  const handleInvalidateCache = async () => {
    if (confirm(t("rateLimit.cache.invalidateConfirm", "admin"))) {
      await invalidateCache.mutateAsync();
    }
  };

  const handleResetRateLimit = async () => {
    if (!resetKey.trim()) {
      return;
    }
    if (
      confirm(t("rateLimit.cache.resetConfirm", "admin", { key: resetKey }))
    ) {
      await resetRateLimit.mutateAsync(resetKey);
      setResetKey("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("rateLimit.cache.actions.title", "admin")}</CardTitle>
        <CardDescription>
          {t("rateLimit.cache.actions.description", "admin")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInvalidateCache}
            disabled={invalidateCache.isPending}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${invalidateCache.isPending ? "animate-spin" : ""}`}
            />
            {t("rateLimit.cache.invalidate", "admin")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder={t("rateLimit.cache.resetKeyPlaceholder", "admin")}
            value={resetKey}
            onChange={(e) => setResetKey(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleResetRateLimit}
            disabled={resetRateLimit.isPending || !resetKey.trim()}
            variant="outline"
          >
            <RotateCcw
              className={`mr-2 h-4 w-4 ${resetRateLimit.isPending ? "animate-spin" : ""}`}
            />
            {t("rateLimit.cache.reset", "admin")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
