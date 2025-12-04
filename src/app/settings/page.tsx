"use client";

import { Globe, Palette, Settings as SettingsIcon, Type } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useFont } from "@/components/providers/font-provider";
import {
  useTheme,
  type ColorScheme,
  type Theme,
} from "@/components/providers/theme-provider";
import { AnimatedSection } from "@/components/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeColorIndicator } from "@/components/ui/theme";

/**
 * Settings Page Component
 * Main settings page for appearance preferences
 * Includes: Language, Font, Theme settings
 */
export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { fontFamily, setFontFamily, fonts, currentFont } = useFont();
  const { theme, colorScheme, setTheme, setColorScheme, themes, colorSchemes } =
    useTheme();
  const isMounted = useIsMounted();

  // Supported languages
  const languages = [
    {
      value: "en",
      label: t("appearance.languages.en", "settings") || "English",
    },
    {
      value: "vi",
      label: t("appearance.languages.vi", "settings") || "Tiếng Việt",
    },
  ];

  const currentLanguage =
    languages.find((lang) => lang.value === locale) || languages[0];

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="h-8 w-32 animate-pulse bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection
        loading={false}
        data={true}
        className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
      >
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {t("title", "settings") || "Settings"}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("subtitle", "settings") ||
              "Manage your account settings and preferences"}
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {t("appearance.language", "settings") ||
                  t("appearance.languageDescription", "settings") ||
                  "Language Settings"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("appearance.languageDescription", "settings") ||
                  "Choose your preferred language"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {t("appearance.languageSelect", "settings") || "Language"}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("appearance.languageSelectDescription", "settings") ||
                      "Select your interface language"}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[180px]">
                  <Select value={locale} onValueChange={setLocale}>
                    <SelectTrigger className="w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            t(
                              "appearance.languageSelectPlaceholder",
                              "settings",
                            ) || "Select language"
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Font Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {t("appearance.font", "settings") ||
                  t("font.selectFont", "common") ||
                  "Font Settings"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("appearance.fontDescription", "settings") ||
                  "Choose your preferred font family"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {t("appearance.fontSelect", "settings") ||
                      t("font.selectFont", "common") ||
                      "Font Family"}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("appearance.fontSelectDescription", "settings") ||
                      "Select a font that matches your reading preference"}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
                  <Select
                    value={fontFamily}
                    onValueChange={(value) =>
                      setFontFamily(value as typeof fontFamily)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            t("appearance.fontSelectPlaceholder", "settings") ||
                            "Select font"
                          }
                          style={{ fontFamily: currentFont?.fontFamily }}
                        >
                          {currentFont?.label ||
                            t("appearance.fontSelectPlaceholder", "settings") ||
                            "Select font"}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => {
                        const isDefault = font.value === "geist-sans";
                        return (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span style={{ fontFamily: font.fontFamily }}>
                                {t(`font.${font.value}`, "common") ||
                                  font.label}
                              </span>
                              {isDefault && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (
                                  {t("appearance.default", "settings") ||
                                    "default"}
                                  )
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {t("appearance.theme", "settings") || "Theme Settings"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("appearance.themeDescription", "settings") ||
                  "Customize your app appearance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Scheme */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {t("appearance.colorScheme", "settings") || "Color Scheme"}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("appearance.colorSchemeDescription", "settings") ||
                      "Choose between light and dark mode"}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[180px]">
                  <Select
                    value={colorScheme}
                    onValueChange={(value) =>
                      setColorScheme(value as ColorScheme)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            t(
                              "appearance.colorSchemePlaceholder",
                              "settings",
                            ) || "Select color scheme"
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map((scheme) => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{scheme.icon}</span>
                            <span>
                              {t(`theme.${scheme.value}`, "common") ||
                                scheme.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-border my-2" />

              {/* Theme Color */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {t("appearance.themeColor", "settings") || "Theme Color"}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("appearance.themeColorDescription", "settings") ||
                      "Choose a color theme for your interface"}
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
                  <Select
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                  >
                    <SelectTrigger className="w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <ThemeColorIndicator
                          theme={theme}
                          size="sm"
                          className="shrink-0"
                        />
                        <SelectValue
                          placeholder={
                            t("appearance.themeColorPlaceholder", "settings") ||
                            "Select theme color"
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((themeOption) => (
                        <SelectItem
                          key={themeOption.value}
                          value={themeOption.value}
                        >
                          <div className="flex items-center gap-2">
                            <ThemeColorIndicator
                              theme={themeOption.value}
                              size="sm"
                              className="shrink-0"
                            />
                            <div className="flex flex-col">
                              <span>
                                {t(`theme.${themeOption.value}`, "common") ||
                                  themeOption.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {themeOption.description}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings - Coming Soon */}
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {t("appearance.moreSettings", "settings") || "More Settings"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("appearance.moreSettingsDescription", "settings") ||
                  "Additional customization options coming soon"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("appearance.moreSettingsComingSoon", "settings") ||
                    "More settings will be available in future updates"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  );
}
