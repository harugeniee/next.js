"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import type {
  CreateIpWhitelistDto,
  IpWhitelist,
  UpdateIpWhitelistDto,
} from "@/lib/interface/rate-limit.interface";
import { IpWhitelistActions } from "./ip-whitelist-actions";
import { IpWhitelistFormDialog } from "./ip-whitelist-form-dialog";

interface IpWhitelistListProps {
  data?: IpWhitelist[];
  isLoading: boolean;
  onCreate: (data: CreateIpWhitelistDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateIpWhitelistDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function IpWhitelistList({
  data,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
}: IpWhitelistListProps) {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreate = async (
    data: CreateIpWhitelistDto | UpdateIpWhitelistDto,
  ): Promise<void> => {
    // When creating, data must be CreateIpWhitelistDto (with ip)
    if ("ip" in data && typeof data.ip === "string" && data.ip.length > 0) {
      const createData: CreateIpWhitelistDto = {
        ip: data.ip,
        description: data.description,
        reason: data.reason,
      };
      await onCreate(createData);
    }
  };

  return (
    <AnimatedSection loading={isLoading} data={data} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("rateLimit.ipWhitelist.title", "admin")}</CardTitle>
              <CardDescription>
                {t("rateLimit.ipWhitelist.description", "admin")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("rateLimit.ipWhitelist.create", "admin")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Skeletonize loading={isLoading}>
            {(() => {
              if (isLoading) {
                return (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 w-full rounded bg-muted" />
                    ))}
                  </div>
                );
              }

              if (data && data.length > 0) {
                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("rateLimit.ipWhitelist.ip", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.ipWhitelist.descriptionLabel", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.ipWhitelist.reason", "admin")}
                        </TableHead>
                        <TableHead>
                          {t("rateLimit.ipWhitelist.statusLabel", "admin")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("common.actions", "common")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-mono">
                            {entry.ip}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {entry.description || "-"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {entry.reason || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={entry.active ? "default" : "secondary"}
                            >
                              {entry.active
                                ? t(
                                    "rateLimit.ipWhitelist.status.active",
                                    "admin",
                                  )
                                : t(
                                    "rateLimit.ipWhitelist.status.inactive",
                                    "admin",
                                  )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <IpWhitelistActions
                              entry={entry}
                              onUpdate={onUpdate}
                              onDelete={onDelete}
                              isUpdating={isUpdating}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              }

              return (
                <div className="py-8 text-center text-muted-foreground">
                  {t("rateLimit.ipWhitelist.empty", "admin")}
                </div>
              );
            })()}
          </Skeletonize>
        </CardContent>
      </Card>

      <IpWhitelistFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </AnimatedSection>
  );
}
