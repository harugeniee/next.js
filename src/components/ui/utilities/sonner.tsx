"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={isMobile ? "top-center" : "bottom-left"}
      offset={isMobile ? "1rem" : "1.5rem"}
      toastOptions={{
        className: "toast-mobile-optimized",
        closeButton: true,
        classNames: {
          closeButton:
            "absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0",
        },
        style: {
          maxWidth: isMobile ? "calc(100vw - 2rem)" : "420px",
          width: isMobile ? "calc(100vw - 2rem)" : "auto",
          fontSize: isMobile ? "0.875rem" : "0.9375rem",
          padding: isMobile ? "0.75rem 1rem" : "1rem 1.25rem",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
