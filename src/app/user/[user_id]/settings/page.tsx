"use client";

import { useAtom } from "jotai";
import {
  Bell,
  Lock,
  Palette,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AppearanceSettings,
  ProfileSettingsForm,
} from "@/components/features/settings";
import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { currentUserAtom } from "@/lib/auth";

/**
 * Settings Page Component
 * Main settings page with navigation sidebar and content area
 * Supports multiple settings sections: Profile, Account, Appearance, Notifications, Privacy
 */
export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [currentUser] = useAtom(currentUserAtom);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const isMounted = useIsMounted();

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Handle login redirect with current path for returning back after login
  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname;
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    router.push(loginUrl);
  };

  // Redirect to login if not authenticated
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {t("loginRequired", "settings")}
            </CardTitle>
            <CardDescription>
              {t("loginRequiredDescription", "settings")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleLoginRedirect}>
              {t("goToLogin", "settings")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const settingsSections = [
    {
      id: "profile",
      title: t("sections.profile", "settings"),
      description: t("sections.profileDescription", "settings"),
      icon: User,
    },
    {
      id: "account",
      title: t("sections.account", "settings"),
      description: t("sections.accountDescription", "settings"),
      icon: Shield,
    },
    {
      id: "appearance",
      title: t("sections.appearance", "settings"),
      description: t("sections.appearanceDescription", "settings"),
      icon: Palette,
    },
    {
      id: "notifications",
      title: t("sections.notifications", "settings"),
      description: t("sections.notificationsDescription", "settings"),
      icon: Bell,
    },
    {
      id: "privacy",
      title: t("sections.privacy", "settings"),
      description: t("sections.privacyDescription", "settings"),
      icon: Lock,
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("title", "settings")}
          </h1>
        </div>
        <p className="text-muted-foreground">{t("subtitle", "settings")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("navigation", "settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={
                        activeSection === section.id ? "default" : "ghost"
                      }
                      className="w-full justify-start h-auto p-3 rounded-none"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3">
          <Skeletonize loading={false}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const section = settingsSections.find(
                      (s) => s.id === activeSection,
                    );
                    const Icon = section?.icon;
                    return (
                      <>
                        {Icon && <Icon className="h-5 w-5" />}
                        {section?.title}
                      </>
                    );
                  })()}
                </CardTitle>
                <CardDescription>
                  {
                    settingsSections.find((s) => s.id === activeSection)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsContent section={activeSection} />
              </CardContent>
            </Card>
          </Skeletonize>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Content Component
 * Renders different content based on active section
 */
function SettingsContent({ section }: { section: string }) {
  const { t } = useI18n();

  switch (section) {
    case "profile":
      return <ProfileSettings />;
    case "account":
      return <AccountSettings />;
    case "appearance":
      return <AppearanceSettingsComponent />;
    case "notifications":
      return <NotificationSettings />;
    case "privacy":
      return <PrivacySettings />;
    default:
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {t("sectionNotFound", "settings")}
          </p>
        </div>
      );
  }
}

/**
 * Profile Settings Component
 * Handles user profile information editing
 */
function ProfileSettings() {
  return <ProfileSettingsForm />;
}

/**
 * Account Settings Component
 * Handles account security and authentication settings
 */
function AccountSettings() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {t("sections.accountComingSoon", "settings")}
        </p>
      </div>
    </div>
  );
}

/**
 * Appearance Settings Component
 * Handles theme and display preferences
 */
function AppearanceSettingsComponent() {
  return <AppearanceSettings />;
}

/**
 * Notification Settings Component
 * Handles notification preferences
 */
function NotificationSettings() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {t("sections.notificationsComingSoon", "settings")}
        </p>
      </div>
    </div>
  );
}

/**
 * Privacy Settings Component
 * Handles privacy and data settings
 */
function PrivacySettings() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {t("sections.privacyComingSoon", "settings")}
        </p>
      </div>
    </div>
  );
}
