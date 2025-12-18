import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Enhanced theme hook with validation and persistence
 * Provides better theme management than the basic next-themes hook
 */
export function useTheme() {
  const { theme, setTheme, themes, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  // Validate theme before setting
  const setValidTheme = (newTheme: string) => {
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.warn(`Invalid theme: ${newTheme}. Using system theme instead.`);
      setTheme("system");
    }
  };

  // Get current theme with fallback
  const currentTheme = mounted ? theme : "system";
  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";
  const isSystem = theme === "system";

  return {
    theme: currentTheme,
    setTheme: setValidTheme,
    themes,
    resolvedTheme,
    mounted,
    isDark,
    isLight,
    isSystem,
    // Convenience methods
    toggleTheme: () => setValidTheme(isDark ? "light" : "dark"),
    setDarkTheme: () => setValidTheme("dark"),
    setLightTheme: () => setValidTheme("light"),
    setSystemTheme: () => setValidTheme("system"),
  };
}
