"use client";

import { useAtom } from "jotai";
import {
  Award,
  BarChart3,
  BookMarked,
  Building2,
  Database,
  FileImage,
  FileText,
  GalleryVerticalEnd,
  Gauge,
  Key,
  MessageSquare,
  Tag,
  UserCircle,
  Users,
} from "lucide-react";
import * as React from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeleton } from "@/components/ui/core/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/auth";
import { currentUserAtom } from "@/lib/auth";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSettings } from "./sidebar-settings";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useI18n();
  const [user] = useAtom(currentUserAtom);
  const { isLoading } = useCurrentUser();

  // Sample data for teams and navigation (can be replaced with real data later)
  // Translated using i18n keys from admin namespace
  const sampleData = React.useMemo(
    () => ({
      teams: [
        {
          name: t("teams.acmeInc", "admin"),
          logo: GalleryVerticalEnd,
          plan: t("plans.enterprise", "admin"),
        },
      ],
      navMain: [
        {
          title: t("nav.analytics.title", "admin"),
          url: "/admin/analytics",
          icon: BarChart3,
          isActive: true,
        },
        {
          title: t("nav.badges.title", "admin"),
          url: "/admin/badges",
          icon: Award,
        },
        {
          title: t("nav.users.title", "admin"),
          url: "/admin/users",
          icon: Users,
        },
        {
          title: t("nav.organizations.title", "admin"),
          url: "/admin/organizations",
          icon: Building2,
        },
        {
          title: t("nav.title", "permissions"),
          url: "/admin/permissions",
          icon: Key,
        },
        {
          title: t("nav.rateLimit.title", "admin"),
          url: "/admin/rate-limit",
          icon: Gauge,
        },
        {
          title: t("nav.keyValue.title", "admin"),
          url: "/admin/key-value",
          icon: Database,
        },
        {
          title: t("nav.characters.title", "admin"),
          url: "/admin/characters",
          icon: UserCircle,
        },
        {
          title: t("nav.comments.title", "admin"),
          url: "/admin/comments",
          icon: MessageSquare,
        },
        {
          title: t("nav.media.title", "admin"),
          url: "/admin/media",
          icon: FileImage,
        },
        {
          title: t("stickers.list.title", "admin"),
          url: "/admin/stickers",
          icon: FileImage,
        },
        {
          title: t("nav.series.title", "admin"),
          url: "/admin/series",
          icon: BookMarked,
        },
        {
          title: t("nav.genres.title", "admin"),
          url: "/admin/genres",
          icon: Tag,
        },
        {
          title: t("nav.tags.title", "admin"),
          url: "/admin/tags",
          icon: Tag,
        },
        {
          title: t("nav.staffs.title", "admin"),
          url: "/admin/staffs",
          icon: Users,
        },
        {
          title: t("nav.studios.title", "admin"),
          url: "/admin/studios",
          icon: Building2,
        },
        {
          title: t("nav.contributions.title", "admin"),
          url: "/admin/contributions",
          icon: FileText,
        },
      ],
      // projects: [
      //   {
      //     name: t("projects.designEngineering", "admin"),
      //     url: "#",
      //     icon: Frame,
      //   },
      //   {
      //     name: t("projects.salesMarketing", "admin"),
      //     url: "#",
      //     icon: PieChart,
      //   },
      //   {
      //     name: t("projects.travel", "admin"),
      //     url: "#",
      //     icon: Map,
      //   },
      // ],
    }),
    [t],
  );

  const renderUserSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 p-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      );
    }

    if (user?.id) {
      return <NavUser user={user} />;
    }

    return null;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sampleData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sampleData.navMain} />
        {/* <NavProjects projects={sampleData.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSettings />
        <SidebarSeparator />
        {renderUserSection()}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
