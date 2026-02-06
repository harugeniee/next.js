"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Separator } from "@/components/ui/layout/separator";
import { LanguageSwitcher } from "@/components/ui/navigation/language-switcher";
import { ThemeSelector } from "@/components/ui/theme/theme-selector";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";

/**
 * Appearance Settings Component
 * Handles theme, language, and display preferences
 */
export function AppearanceSettings() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.theme", "settings")}</CardTitle>
          <CardDescription>
            {t("appearance.themeDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t("appearance.colorScheme", "settings")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("appearance.colorSchemeDescription", "settings")}
              </p>
            </div>
            <ThemeToggle />
          </div>

          <Separator />

          {/* Theme Color Selection */}
          <div>
            <h4 className="font-medium mb-3">
              {t("appearance.themeColor", "settings")}
            </h4>
            <ThemeSelector />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.language", "settings")}</CardTitle>
          <CardDescription>
            {t("appearance.languageDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {t("appearance.languageSelect", "settings")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("appearance.languageSelectDescription", "settings")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Editor Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.editor", "settings")}</CardTitle>
          <CardDescription>
            {t("appearance.editorDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("appearance.editorComingSoon", "settings")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.display", "settings")}</CardTitle>
          <CardDescription>
            {t("appearance.displayDescription", "settings")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("appearance.displayComingSoon", "settings")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
