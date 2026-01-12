"use client";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import type {
  KeyValue,
  UpdateKeyValueDto,
} from "@/lib/interface/key-value.interface";
import { KeyValueFormDialog } from "./key-value-form-dialog";

interface KeyValueDetailProps {
  keyValue: KeyValue;
  isLoading: boolean;
  onUpdate: (id: string, data: UpdateKeyValueDto) => Promise<void>;
  onDelete: (keyValue: KeyValue) => Promise<void>;
  isUpdating: boolean;
}

export function KeyValueDetail({
  keyValue,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
}: KeyValueDetailProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleUpdate = async (dto: UpdateKeyValueDto) => {
    await onUpdate(keyValue.id, dto);
    setShowEditDialog(false);
  };

  const isExpired = (kv: KeyValue): boolean => {
    if (!kv.expiresAt) return false;
    return new Date(kv.expiresAt) < new Date();
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <AnimatedSection loading={isLoading} data={keyValue} className="w-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="pl-0 hover:pl-2 transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("actions.back", "common")}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(true)}
              disabled={isUpdating}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("actions.edit", "common")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(keyValue)}
              disabled={isUpdating}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("actions.delete", "common")}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("keyValue.detail.info", "admin")}</CardTitle>
              <CardDescription>
                {t("keyValue.detail.infoDescription", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("keyValue.list.key", "admin")}
                </span>
                <div className="font-mono text-lg font-medium">
                  {keyValue.key}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("keyValue.list.namespace", "admin")}
                </span>
                <div>{keyValue.namespace || "-"}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("keyValue.list.status", "admin")}
                  </span>
                  <div>
                    <Badge
                      variant={
                        isExpired(keyValue) || keyValue.status !== "active"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {isExpired(keyValue)
                        ? t("keyValue.status.expired", "admin")
                        : t(`keyValue.status.${keyValue.status}`, "admin")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("keyValue.list.contentType", "admin")}
                  </span>
                  <div>
                    {keyValue.contentType ? (
                      <Badge variant="outline">
                        {t(
                          `keyValue.contentType.${keyValue.contentType}`,
                          "admin"
                        )}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>{t("keyValue.detail.metadata", "admin")}</CardTitle>
              <CardDescription>
                {t("keyValue.detail.metadataDescription", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("keyValue.list.id", "admin")}
                </span>
                <div className="font-mono text-sm text-muted-foreground">
                  {keyValue.id}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("keyValue.list.expiresAt", "admin")}
                </span>
                <div>
                  {keyValue.expiresAt
                    ? new Date(keyValue.expiresAt).toLocaleString()
                    : "-"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("keyValue.list.createdAt", "admin")}
                  </span>
                  <div className="text-sm">
                    {new Date(keyValue.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("keyValue.list.updatedAt", "admin")}
                  </span>
                  <div className="text-sm">
                    {new Date(keyValue.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value Content */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("keyValue.list.value", "admin")}</CardTitle>
              <CardDescription>
                {t("keyValue.detail.valueDescription", "admin")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm max-h-[500px]">
                {formatValue(keyValue.value)}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <KeyValueFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          keyValue={keyValue}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      </div>
    </AnimatedSection>
  );
}
