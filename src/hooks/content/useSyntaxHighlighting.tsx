"use client";

import {
  initializeMermaid,
  processCodeBlocks,
} from "@/lib/utils/content-processor";
import DOMPurify from "dompurify";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Component to highlight HTML content with syntax highlighting and Mermaid diagrams
 */
export function SyntaxHighlightedContent({ html }: { readonly html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mermaidInitialized, setMermaidInitialized] = useState(false);

  // Initialize Mermaid
  useEffect(() => {
    if (!mermaidInitialized) {
      initializeMermaid();
      // Defer state update to avoid cascading renders
      queueMicrotask(() => {
        setMermaidInitialized(true);
      });
    }
  }, [mermaidInitialized]);

  // Main effect to process code blocks
  useEffect(() => {
    if (!ref.current || !html || !mermaidInitialized) return;

    processCodeBlocks(ref.current, {
      enableSyntaxHighlighting: true,
      enableMermaidDiagrams: true,
    });
  }, [html, mermaidInitialized]);

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "code",
        "pre",
        "blockquote",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "div",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "svg",
        "g",
        "path",
        "rect",
        "circle",
        "ellipse",
        "line",
        "polyline",
        "polygon",
        "text",
        "tspan",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "src",
        "alt",
        "width",
        "height",
        "class",
        "id",
        "viewBox",
        "x",
        "y",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "d",
        "fill",
        "stroke",
        "stroke-width",
        "stroke-dasharray",
        "stroke-linecap",
        "stroke-linejoin",
        "transform",
        "opacity",
        "font-family",
        "font-size",
        "font-weight",
        "text-anchor",
        "dominant-baseline",
      ],
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

/**
 * Hook to highlight HTML content with syntax highlighting and render Mermaid diagrams
 * @param htmlContent - Raw HTML content
 * @returns JSX element with highlighted content and rendered Mermaid diagrams
 */
export function useSyntaxHighlighting(htmlContent: string): React.ReactElement {
  // Memoize the component to prevent unnecessary re-renders
  return useMemo(
    () => <SyntaxHighlightedContent html={htmlContent} />,
    [htmlContent],
  );
}
