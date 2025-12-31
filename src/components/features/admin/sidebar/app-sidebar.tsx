"use client";

import { useAtom } from "jotai";
import {
  AudioWaveform,
  Award,
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  Building2,
  Command,
  FileImage,
  Frame,
  GalleryVerticalEnd,
  Gauge,
  Key,
  Map,
  MessageSquare,
  PieChart,
  Settings2,
  SquareTerminal,
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
import { NavProjects } from "./nav-projects";
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
        {
          name: t("teams.acmeCorp", "admin"),
          logo: AudioWaveform,
          plan: t("plans.startup", "admin"),
        },
        {
          name: t("teams.evilCorp", "admin"),
          logo: Command,
          plan: t("plans.free", "admin"),
        },
      ],
      navMain: [
        {
          title: t("nav.analytics.title", "admin"),
          url: "/admin/analytics",
          icon: BarChart3,
          isActive: false,
          items: [
            {
              title: t("nav.analytics.dashboard", "admin"),
              url: "/admin/analytics",
            },
          ],
        },
        {
          title: t("nav.badges.title", "admin"),
          url: "/admin/badges",
          icon: Award,
          isActive: false,
          items: [
            {
              title: t("nav.badges.management", "admin"),
              url: "/admin/badges",
            },
          ],
        },
        {
          title: t("nav.users.title", "admin"),
          url: "/admin/users",
          icon: Users,
          isActive: false,
          items: [
            {
              title: t("nav.users.management", "admin"),
              url: "/admin/users",
            },
          ],
        },
        {
          title: t("nav.organizations.title", "admin"),
          url: "/admin/organizations",
          icon: Building2,
          isActive: false,
          items: [
            {
              title: t("nav.organizations.management", "admin"),
              url: "/admin/organizations",
            },
          ],
        },
        {
          title: t("nav.title", "permissions"),
          url: "/admin/permissions",
          icon: Key,
          isActive: false,
          items: [
            {
              title: t("nav.title", "permissions"),
              url: "/admin/permissions",
            },
          ],
        },
        {
          title: t("nav.rateLimit.title", "admin"),
          url: "/admin/rate-limit",
          icon: Gauge,
          isActive: false,
          items: [
            {
              title: t("nav.rateLimit.management", "admin"),
              url: "/admin/rate-limit",
            },
          ],
        },
        {
          title: t("nav.characters.title", "admin"),
          url: "/admin/characters",
          icon: UserCircle,
          isActive: false,
          items: [
            {
              title: t("nav.characters.management", "admin"),
              url: "/admin/characters",
            },
          ],
        },
        {
          title: t("nav.comments.title", "admin"),
          url: "/admin/comments",
          icon: MessageSquare,
          isActive: false,
          items: [
            {
              title: t("nav.comments.management", "admin"),
              url: "/admin/comments",
            },
          ],
        },
        {
          title: t("nav.media.title", "admin"),
          url: "/admin/media",
          icon: FileImage,
          isActive: false,
          items: [
            {
              title: t("nav.media.management", "admin"),
              url: "/admin/media",
            },
          ],
        },
        {
          title: t("stickers.list.title", "admin"),
          url: "/admin/stickers",
          icon: FileImage,
          isActive: false,
          items: [
            {
              title: t("stickers.list.title", "admin"),
              url: "/admin/stickers",
            },
          ],
        },
        {
          title: t("nav.series.title", "admin"),
          url: "/admin/series",
          icon: BookMarked,
          isActive: false,
          items: [
            {
              title: t("nav.series.management", "admin"),
              url: "/admin/series",
            },
          ],
        },
        {
          title: t("nav.genres.title", "admin"),
          url: "/admin/genres",
          icon: Tag,
          isActive: false,
          items: [
            {
              title: t("nav.genres.management", "admin"),
              url: "/admin/genres",
            },
          ],
        },
        {
          title: t("nav.playground.title", "admin"),
          url: "#",
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: t("nav.playground.history", "admin"),
              url: "#",
            },
            {
              title: t("nav.playground.starred", "admin"),
              url: "#",
            },
            {
              title: t("nav.playground.settings", "admin"),
              url: "#",
            },
          ],
        },
        {
          title: t("nav.models.title", "admin"),
          url: "#",
          icon: Bot,
          items: [
            {
              title: t("nav.models.genesis", "admin"),
              url: "#",
            },
            {
              title: t("nav.models.explorer", "admin"),
              url: "#",
            },
            {
              title: t("nav.models.quantum", "admin"),
              url: "#",
            },
          ],
        },
        {
          title: t("nav.documentation.title", "admin"),
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: t("nav.documentation.introduction", "admin"),
              url: "#",
            },
            {
              title: t("nav.documentation.getStarted", "admin"),
              url: "#",
            },
            {
              title: t("nav.documentation.tutorials", "admin"),
              url: "#",
            },
            {
              title: t("nav.documentation.changelog", "admin"),
              url: "#",
            },
          ],
        },
        {
          title: t("nav.settings.title", "admin"),
          url: "#",
          icon: Settings2,
          items: [
            {
              title: t("nav.settings.general", "admin"),
              url: "#",
            },
            {
              title: t("nav.settings.team", "admin"),
              url: "#",
            },
            {
              title: t("nav.settings.billing", "admin"),
              url: "#",
            },
            {
              title: t("nav.settings.limits", "admin"),
              url: "#",
            },
          ],
        },
      ],
      projects: [
        {
          name: t("projects.designEngineering", "admin"),
          url: "#",
          icon: Frame,
        },
        {
          name: t("projects.salesMarketing", "admin"),
          url: "#",
          icon: PieChart,
        },
        {
          name: t("projects.travel", "admin"),
          url: "#",
          icon: Map,
        },
      ],
    }),
    [t],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sampleData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sampleData.navMain} />
        <NavProjects projects={sampleData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSettings />
        <SidebarSeparator />
        {isLoading ? (
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : user?.id ? (
          <NavUser user={user} />
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
