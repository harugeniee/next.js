"use client";

import {
  ApiKeyList,
  CacheActions,
  CacheStatsCard,
  IpWhitelistList,
  PlanList,
  PolicyList,
} from "@/components/features/admin/rate-limit";
import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { usePageMetadata } from "@/hooks/ui/use-page-metadata";
import {
  useApiKeys,
  useCacheStats,
  useIpWhitelist,
  usePlans,
  usePolicies,
  useRateLimitMutations,
} from "@/hooks/admin/useRateLimit";

export default function RateLimitPage() {
  const { t } = useI18n();

  usePageMetadata({
    title: t("rateLimit.title", "admin"),
    description: t("rateLimit.description", "admin"),
  });

  // Fetch all data
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: apiKeys, isLoading: apiKeysLoading } = useApiKeys();
  const { data: ipWhitelist, isLoading: ipWhitelistLoading } =
    useIpWhitelist();
  const { data: policies, isLoading: policiesLoading } = usePolicies();
  const { data: cacheStats, isLoading: cacheStatsLoading } = useCacheStats();

  // Mutations
  const mutations = useRateLimitMutations();

  // Handlers
  const handleCreatePlan = async (data: Parameters<typeof mutations.createPlan.mutateAsync>[0]) => {
    await mutations.createPlan.mutateAsync(data);
  };

  const handleUpdatePlan = async (
    name: string,
    data: Parameters<typeof mutations.updatePlan.mutateAsync>[0]["data"],
  ) => {
    await mutations.updatePlan.mutateAsync({ name, data });
  };

  const handleCreateApiKey = async (
    data: Parameters<typeof mutations.createApiKey.mutateAsync>[0],
  ) => {
    await mutations.createApiKey.mutateAsync(data);
  };

  const handleUpdateApiKey = async (
    id: string,
    data: Parameters<typeof mutations.updateApiKey.mutateAsync>[0]["data"],
  ) => {
    await mutations.updateApiKey.mutateAsync({ id, data });
  };

  const handleDeleteApiKey = async (id: string) => {
    await mutations.deleteApiKey.mutateAsync(id);
  };

  const handleAddIpToWhitelist = async (
    data: Parameters<typeof mutations.addIpToWhitelist.mutateAsync>[0],
  ) => {
    await mutations.addIpToWhitelist.mutateAsync(data);
  };

  const handleUpdateIpWhitelist = async (
    id: string,
    data: Parameters<typeof mutations.updateIpWhitelist.mutateAsync>[0]["data"],
  ) => {
    await mutations.updateIpWhitelist.mutateAsync({ id, data });
  };

  const handleRemoveIpFromWhitelist = async (id: string) => {
    await mutations.removeIpFromWhitelist.mutateAsync(id);
  };

  const handleCreatePolicy = async (
    data: Parameters<typeof mutations.createPolicy.mutateAsync>[0],
  ) => {
    await mutations.createPolicy.mutateAsync(data);
  };

  const handleUpdatePolicy = async (
    id: string,
    data: Parameters<typeof mutations.updatePolicy.mutateAsync>[0]["data"],
  ) => {
    await mutations.updatePolicy.mutateAsync({ id, data });
  };

  const handleDeletePolicy = async (id: string) => {
    await mutations.deletePolicy.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <AnimatedSection loading={false} data={true}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">
                {t("admin", "common")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("rateLimit.title", "admin")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AnimatedSection>

      {/* Page Header */}
      <AnimatedSection loading={false} data={true}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("rateLimit.title", "admin")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("rateLimit.description", "admin")}
          </p>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">
            {t("rateLimit.tabs.plans", "admin")}
          </TabsTrigger>
          <TabsTrigger value="apiKeys">
            {t("rateLimit.tabs.apiKeys", "admin")}
          </TabsTrigger>
          <TabsTrigger value="ipWhitelist">
            {t("rateLimit.tabs.ipWhitelist", "admin")}
          </TabsTrigger>
          <TabsTrigger value="policies">
            {t("rateLimit.tabs.policies", "admin")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <PlanList
            data={plans}
            isLoading={plansLoading}
            onCreate={handleCreatePlan}
            onUpdate={handleUpdatePlan}
            isCreating={mutations.createPlan.isPending}
            isUpdating={mutations.updatePlan.isPending}
          />
        </TabsContent>

        <TabsContent value="apiKeys" className="mt-6">
          <ApiKeyList
            data={apiKeys}
            isLoading={apiKeysLoading}
            plans={plans?.map((p) => ({ name: p.name }))}
            onCreate={handleCreateApiKey}
            onUpdate={handleUpdateApiKey}
            onDelete={handleDeleteApiKey}
            isCreating={mutations.createApiKey.isPending}
            isUpdating={
              mutations.updateApiKey.isPending ||
              mutations.deleteApiKey.isPending
            }
          />
        </TabsContent>

        <TabsContent value="ipWhitelist" className="mt-6">
          <IpWhitelistList
            data={ipWhitelist}
            isLoading={ipWhitelistLoading}
            onCreate={handleAddIpToWhitelist}
            onUpdate={handleUpdateIpWhitelist}
            onDelete={handleRemoveIpFromWhitelist}
            isCreating={mutations.addIpToWhitelist.isPending}
            isUpdating={
              mutations.updateIpWhitelist.isPending ||
              mutations.removeIpFromWhitelist.isPending
            }
          />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <PolicyList
            data={policies}
            isLoading={policiesLoading}
            onCreate={handleCreatePolicy}
            onUpdate={handleUpdatePolicy}
            onDelete={handleDeletePolicy}
            isCreating={mutations.createPolicy.isPending}
            isUpdating={
              mutations.updatePolicy.isPending ||
              mutations.deletePolicy.isPending
            }
          />
        </TabsContent>
      </Tabs>

      {/* Cache Management */}
      <div className="space-y-4">
        <CacheStatsCard
          data={cacheStats}
          isLoading={cacheStatsLoading}
        />
        <CacheActions />
      </div>
    </div>
  );
}

