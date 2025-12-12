"use client";

import { useEffect } from "react";

interface PageMetadataOptions {
  /**
   * Page title (will be appended to app name)
   * Example: "Series Detail" -> "Series Detail | MangaSBS"
   */
  title?: string;
  /**
   * Page description for meta tag
   */
  description?: string;
  /**
   * Open Graph image URL
   */
  image?: string;
  /**
   * Canonical URL
   */
  url?: string;
  /**
   * Keywords for SEO
   */
  keywords?: string[];
  /**
   * Author name
   */
  author?: string;
  /**
   * Type of content (article, website, etc.)
   */
  type?: string;
}

/**
 * Custom hook to update page metadata (title, meta tags) for client components
 *
 * This hook updates:
 * - document.title
 * - meta description
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URL
 *
 * @example
 * ```tsx
 * usePageMetadata({
 *   title: "Series Title",
 *   description: "Series description here",
 *   image: "https://example.com/cover.jpg",
 *   url: "https://example.com/series/123"
 * });
 * ```
 */
export function usePageMetadata({
  title,
  description,
  image,
  url,
  keywords,
  author,
  type = "website",
}: PageMetadataOptions) {
  useEffect(() => {
    // Safely update document title
    try {
      if (title) {
        const appName = "MangaSBS";
        document.title = `${title} | ${appName}`;
      }
    } catch (error) {
      // Silently ignore errors during title update
      console.warn("Failed to update document title:", error);
    }

    // Helper function to update or create meta tag
    // Wrapped in try-catch to prevent errors during React's commit phase
    const updateMetaTag = (
      name: string,
      content: string,
      attribute: string = "name",
    ) => {
      if (!content) return;

      try {
        let element = document.querySelector(
          `meta[${attribute}="${name}"]`,
        ) as HTMLMetaElement;

        if (!element) {
          // Check if document.head is still available before appending
          if (!document.head) {
            console.warn("document.head is not available");
            return;
          }

          element = document.createElement("meta");
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }

        element.setAttribute("content", content);
      } catch (error) {
        // Silently ignore errors during meta tag update
        // This prevents "removeChild" errors during navigation
        console.warn(`Failed to update meta tag ${name}:`, error);
      }
    };

    // Update description
    if (description) {
      updateMetaTag("description", description);
      updateMetaTag("og:description", description, "property");
      updateMetaTag("twitter:description", description);
    }

    // Update Open Graph tags
    if (title) {
      updateMetaTag("og:title", title, "property");
      updateMetaTag("twitter:title", title);
    }

    if (image) {
      updateMetaTag("og:image", image, "property");
      updateMetaTag("twitter:image", image);
      updateMetaTag("twitter:card", "summary_large_image");
    }

    if (url) {
      updateMetaTag("og:url", url, "property");

      // Update canonical link safely
      try {
        // Check if document.head is still available
        if (!document.head) {
          console.warn("document.head is not available for canonical link");
        } else {
          let canonicalLink = document.querySelector(
            'link[rel="canonical"]',
          ) as HTMLLinkElement;
          if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
          }
          canonicalLink.setAttribute("href", url);
        }
      } catch (error) {
        // Silently ignore errors during canonical link update
        console.warn("Failed to update canonical link:", error);
      }
    }

    if (type) {
      updateMetaTag("og:type", type, "property");
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag("keywords", keywords.join(", "));
    }

    if (author) {
      updateMetaTag("author", author);
    }

    // No cleanup needed - next page will update metadata automatically
    // Removing cleanup prevents "removeChild" errors during React's commit deletion phase
    // Meta tags will be updated by the new page component when it mounts
  }, [title, description, image, url, keywords, author, type]);
}
