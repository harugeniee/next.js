"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

// Font types - available font families
export type FontFamily =
  | "geist-sans" // Default - Geist Sans
  | "geist-mono" // Geist Mono
  | "inter" // Inter
  | "roboto" // Roboto
  | "open-sans" // Open Sans
  | "lato" // Lato
  | "montserrat" // Montserrat
  | "poppins" // Poppins
  | "raleway" // Raleway
  | "source-sans-pro" // Source Sans Pro
  | "comic-neue" // Comic Neue
  | "pixelify-sans" // Pixelify Sans
  | "comic-relief" // Comic Relief
  | "system"; // System font stack

// Font data - available fonts with metadata
const fonts: {
  value: FontFamily;
  label: string;
  description: string;
  category: string;
  cssVariable: string;
  fontFamily: string;
}[] = [
  {
    value: "geist-sans",
    label: "Geist Sans",
    description: "Modern and clean (default)",
    category: "sans-serif",
    cssVariable: "--font-geist-sans",
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "geist-mono",
    label: "Geist Mono",
    description: "Monospace for code",
    category: "monospace",
    cssVariable: "--font-geist-mono",
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  },
  {
    value: "inter",
    label: "Inter",
    description: "Optimized for screens",
    category: "sans-serif",
    cssVariable: "--font-inter",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "roboto",
    label: "Roboto",
    description: "Google's signature font",
    category: "sans-serif",
    cssVariable: "--font-roboto",
    fontFamily: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "open-sans",
    label: "Open Sans",
    description: "Humanist and friendly",
    category: "sans-serif",
    cssVariable: "--font-open-sans",
    fontFamily: "var(--font-open-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "lato",
    label: "Lato",
    description: "Warm and stable",
    category: "sans-serif",
    cssVariable: "--font-lato",
    fontFamily: "var(--font-lato), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "montserrat",
    label: "Montserrat",
    description: "Geometric and elegant",
    category: "sans-serif",
    cssVariable: "--font-montserrat",
    fontFamily: "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "poppins",
    label: "Poppins",
    description: "Geometric and friendly",
    category: "sans-serif",
    cssVariable: "--font-poppins",
    fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "raleway",
    label: "Raleway",
    description: "Elegant and versatile",
    category: "sans-serif",
    cssVariable: "--font-raleway",
    fontFamily: "var(--font-raleway), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "source-sans-pro",
    label: "Source Sans Pro",
    description: "Adobe's open source font",
    category: "sans-serif",
    cssVariable: "--font-source-sans-pro",
    fontFamily:
      "var(--font-source-sans-pro), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "comic-neue",
    label: "Comic Neue",
    description: "Casual and friendly",
    category: "sans-serif",
    cssVariable: "--font-comic-neue",
    fontFamily: "var(--font-comic-neue), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "pixelify-sans",
    label: "Pixelify Sans",
    description: "Retro pixel-style display font",
    category: "display",
    cssVariable: "--font-pixelify-sans",
    fontFamily:
      "var(--font-pixelify-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "comic-relief",
    label: "Comic Relief",
    description: "Playful and expressive comic font",
    category: "display",
    cssVariable: "--font-comic-relief",
    fontFamily:
      "var(--font-comic-relief), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "system",
    label: "System",
    description: "Use system default font",
    category: "system",
    cssVariable: "--font-system",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
];

// Font context
interface FontContextType {
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fonts: typeof fonts;
  currentFont: (typeof fonts)[0] | undefined;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

/**
 * Font Provider component
 * Provides comprehensive font management functionality with:
 * - Multiple font families (Geist Sans, Inter, Roboto, etc.)
 * - Font persistence in localStorage
 * - Smooth transitions
 * - CSS variables management
 * - Font validation
 */
export function FontProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fontFamily, setFontFamilyState] = useState<FontFamily>("geist-sans");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load saved font from localStorage
    const savedFont = localStorage.getItem("fontFamily") as FontFamily;

    if (savedFont && fonts.some((f) => f.value === savedFont)) {
      setFontFamilyState(savedFont);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;
    const currentFontData = fonts.find((f) => f.value === fontFamily);

    if (currentFontData) {
      // Apply font family via CSS variable
      root.style.setProperty("--font-family", currentFontData.fontFamily);

      // Also apply directly to body element to ensure it takes effect
      if (body) {
        body.style.fontFamily = currentFontData.fontFamily;
      }

      // Save to localStorage with validation
      if (fonts.some((f) => f.value === fontFamily)) {
        localStorage.setItem("fontFamily", fontFamily);
      }
    }
  }, [fontFamily, mounted]);

  const currentFont = useMemo(
    () => fonts.find((f) => f.value === fontFamily),
    [fontFamily],
  );

  const contextValue: FontContextType = useMemo(
    () => ({
      fontFamily,
      setFontFamily: (newFont: FontFamily) => setFontFamilyState(newFont),
      fonts,
      currentFont,
    }),
    [fontFamily, currentFont],
  );

  return (
    <FontContext.Provider value={contextValue}>{children}</FontContext.Provider>
  );
}

/**
 * Hook to use font context
 * Provides access to font state and controls
 */
export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}

/**
 * Hook to get current font without context
 * Useful for components that need font info but can't use context
 */
export function useCurrentFont() {
  const [fontFamily, setFontFamily] = useState<FontFamily>("geist-sans");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedFont = localStorage.getItem("fontFamily") as FontFamily;

    if (savedFont && fonts.some((f) => f.value === savedFont)) {
      setFontFamily(savedFont);
    }
  }, []);

  const currentFont = fonts.find((f) => f.value === fontFamily);

  return { fontFamily, currentFont, mounted };
}
