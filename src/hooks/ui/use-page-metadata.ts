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
    // Update document title
    if (title) {
      const appName = "MangaSBS";
      document.title = `${title} | ${appName}`;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (
      name: string,
      content: string,
      attribute: string = "name",
    ) => {
      if (!content) return;

      let element = document.querySelector(
        `meta[${attribute}="${name}"]`,
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
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

      // Update canonical link
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

    if (type) {
      updateMetaTag("og:type", type, "property");
    }

    if (keywords && keywords.length > 0) {
      updateMetaTag("keywords", keywords.join(", "));
    }

    if (author) {
      updateMetaTag("author", author);
    }

    // Cleanup function to restore default title when component unmounts
    return () => {
      if (title) {
        document.title = "MangaSBS";
      }
    };
  }, [title, description, image, url, keywords, author, type]);
}
