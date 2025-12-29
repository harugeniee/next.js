"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import { testPolicyMatchSchema, type TestPolicyMatchFormData } from "@/lib/validators/rate-limit.validator";
import { useTestPolicyMatch } from "@/hooks/admin/useRateLimit";
import { Badge } from "@/components/ui/core/badge";

interface PolicyTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyId: string;
}

export function PolicyTestDialog({
  open,
  onOpenChange,
  policyId,
}: PolicyTestDialogProps) {
  const { t } = useI18n();
  const testMutation = useTestPolicyMatch();

  const form = useForm<TestPolicyMatchFormData>({
    resolver: zodResolver(testPolicyMatchSchema),
    defaultValues: {
      userId: "",
      orgId: "",
      ip: "",
      routeKey: "",
      apiKey: "",
    },
  });

  const handleSubmit = async (data: TestPolicyMatchFormData) => {
    const result = await testMutation.mutateAsync({
      id: policyId,
      context: data,
    });
    // Result is handled by the mutation's onSuccess/onError
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("rateLimit.policies.test.title", "admin")}
          </DialogTitle>
          <DialogDescription>
            {t("rateLimit.policies.test.description", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.test.userId", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="user_123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orgId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.test.orgId", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="org_456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.test.ip", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routeKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.test.routeKey", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="POST:/api/v1/messages" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("rateLimit.policies.test.apiKey", "admin")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ak_1234567890abcdef" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {testMutation.data && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {t("rateLimit.policies.test.result", "admin")}:
                  </span>
                  <Badge
                    variant={testMutation.data.matches ? "default" : "secondary"}
                  >
                    {testMutation.data.matches
                      ? t("rateLimit.policies.test.matches", "admin")
                      : t("rateLimit.policies.test.noMatch", "admin")}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.close", "common")}
              </Button>
              <Button type="submit" disabled={testMutation.isPending}>
                {testMutation.isPending
                  ? t("common.testing", "common")
                  : t("rateLimit.policies.test.test", "admin")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

