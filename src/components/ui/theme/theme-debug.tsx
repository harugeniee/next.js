"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useEffect, useState } from "react";

/**
 * Theme Debug Component
 * Shows current theme state and CSS variables for debugging
 */
export function ThemeDebug() {
  const { theme, colorScheme, setTheme, themes } = useTheme();
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const vars = {
      "--background": computedStyle.getPropertyValue("--background"),
      "--foreground": computedStyle.getPropertyValue("--foreground"),
      "--primary": computedStyle.getPropertyValue("--primary"),
      "--secondary": computedStyle.getPropertyValue("--secondary"),
      "--accent": computedStyle.getPropertyValue("--accent"),
      "--muted": computedStyle.getPropertyValue("--muted"),
      "--destructive": computedStyle.getPropertyValue("--destructive"),
      "--card": computedStyle.getPropertyValue("--card"),
      "--popover": computedStyle.getPropertyValue("--popover"),
      "--border": computedStyle.getPropertyValue("--border"),
      "--input": computedStyle.getPropertyValue("--input"),
      "--ring": computedStyle.getPropertyValue("--ring"),
    };

    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setCssVars(vars);
    });
  }, [theme, colorScheme]);

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-semibold text-foreground mb-2">Theme Debug</h3>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-muted-foreground">Theme:</span>
          <span className="ml-2 text-foreground font-mono">{theme}</span>
        </div>

        <div>
          <span className="text-muted-foreground">Color Scheme:</span>
          <span className="ml-2 text-foreground font-mono">{colorScheme}</span>
        </div>

        <div>
          <span className="text-muted-foreground">Data Theme:</span>
          <span className="ml-2 text-foreground font-mono">
            {typeof window !== "undefined"
              ? document.documentElement.getAttribute("data-theme")
              : "N/A"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">Dark Class:</span>
          <span className="ml-2 text-foreground font-mono">
            {typeof window !== "undefined"
              ? document.documentElement.classList.contains("dark")
                ? "Yes"
                : "No"
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-xs text-muted-foreground">CSS Variables:</div>
        {Object.entries(cssVars).map(([key, value]) => (
          <div key={key} className="text-xs font-mono">
            <span className="text-muted-foreground">{key}:</span>
            <span className="ml-1 text-foreground">{value || "undefined"}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {themes.slice(0, 4).map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`px-2 py-1 text-xs rounded ${
              theme === themeOption.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {themeOption.label}
          </button>
        ))}
      </div>
    </div>
  );
}
