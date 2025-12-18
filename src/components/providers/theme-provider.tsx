"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Theme types - shadcn/ui color themes
export type Theme =
  | "neutral"
  | "red"
  | "rose"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "violet"
  | "stone"
  | "zinc"
  | "gray"
  | "slate"
  | "dracula";
export type ColorScheme = "light" | "dark" | "system";

// Theme context
interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  themes: { value: Theme; label: string; description: string }[];
  colorSchemes: { value: ColorScheme; label: string; icon: React.ReactNode }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme data - shadcn/ui color themes with improved organization
const themes: {
  value: Theme;
  label: string;
  description: string;
  category: string;
}[] = [
  // Primary Color Themes
  {
    value: "neutral",
    label: "Neutral",
    description: "Clean and minimal",
    category: "primary",
  },
  {
    value: "red",
    label: "Red",
    description: "Bold and energetic",
    category: "primary",
  },
  {
    value: "rose",
    label: "Rose",
    description: "Warm and romantic",
    category: "primary",
  },
  {
    value: "orange",
    label: "Orange",
    description: "Vibrant and creative",
    category: "primary",
  },
  {
    value: "green",
    label: "Green",
    description: "Fresh and natural",
    category: "primary",
  },
  {
    value: "blue",
    label: "Blue",
    description: "Trustworthy and calm",
    category: "primary",
  },
  {
    value: "yellow",
    label: "Yellow",
    description: "Bright and optimistic",
    category: "primary",
  },
  {
    value: "violet",
    label: "Violet",
    description: "Creative and mysterious",
    category: "primary",
  },

  // Neutral Themes
  {
    value: "stone",
    label: "Stone",
    description: "Warm and earthy",
    category: "neutral",
  },
  {
    value: "zinc",
    label: "Zinc",
    description: "Cool and modern",
    category: "neutral",
  },
  {
    value: "gray",
    label: "Gray",
    description: "Professional and balanced",
    category: "neutral",
  },
  {
    value: "slate",
    label: "Slate",
    description: "Sophisticated and elegant",
    category: "neutral",
  },

  // Special Themes
  {
    value: "dracula",
    label: "Dracula",
    description: "Dark and vibrant",
    category: "special",
  },
];

const colorSchemes: {
  value: ColorScheme;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "light",
    label: "Light",
    icon: "☀️",
    description: "Light mode for all themes",
  },
  {
    value: "dark",
    label: "Dark",
    icon: "🌙",
    description: "Dark mode for all themes",
  },
  {
    value: "system",
    label: "System",
    icon: "💻",
    description: "Follow system preference",
  },
];

/**
 * Enhanced Theme Provider component that wraps next-themes
 * Provides comprehensive theming functionality with:
 * - Multiple base color themes (Neutral, Stone, Zinc, Gray, Slate, Dracula)
 * - Light/Dark/System color schemes
 * - Theme persistence in localStorage
 * - Smooth transitions
 * - System theme detection
 * - Theme validation
 * - CSS variables management
 */
export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  const [theme, setThemeState] = useState<Theme>("neutral");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setMounted(true);
    });

    // Load saved theme and color scheme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;

    if (savedTheme && themes.some((t) => t.value === savedTheme)) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setThemeState(savedTheme);
      });
    }

    if (
      savedColorScheme &&
      colorSchemes.some((cs) => cs.value === savedColorScheme)
    ) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setColorSchemeState(savedColorScheme);
      });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply theme
    root.setAttribute("data-theme", theme);

    // Apply color scheme
    if (colorScheme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (colorScheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save to localStorage with validation
    if (themes.some((t) => t.value === theme)) {
      localStorage.setItem("theme", theme);
    }
    if (colorSchemes.some((cs) => cs.value === colorScheme)) {
      localStorage.setItem("colorScheme", colorScheme);
    }
  }, [theme, colorScheme, mounted]);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme,
      colorScheme,
      setTheme: (newTheme: Theme) => setThemeState(newTheme),
      setColorScheme: (newColorScheme: ColorScheme) =>
        setColorSchemeState(newColorScheme),
      themes,
      colorSchemes,
    }),
    [theme, colorScheme],
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      enableColorScheme={true}
      storageKey="app-theme"
      themes={["light", "dark", "system"]}
      {...props}
    >
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

/**
 * Hook to use theme context
 * Provides access to theme state and controls
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook to get current theme without context
 * Useful for components that need theme info but can't use context
 */
export function useCurrentTheme() {
  const [theme, setTheme] = useState<Theme>("neutral");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setMounted(true);
    });

    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;

    if (savedTheme && themes.some((t) => t.value === savedTheme)) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setTheme(savedTheme);
      });
    }

    if (
      savedColorScheme &&
      colorSchemes.some((cs) => cs.value === savedColorScheme)
    ) {
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setColorScheme(savedColorScheme);
      });
    }
  }, []);

  return { theme, colorScheme, mounted };
}
