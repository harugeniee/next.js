"use client";

import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import { Card } from "@/components/ui/core/card";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { Download, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Custom Image Node Component using Next.js Image
 * Provides better performance and optimization compared to regular img tags
 */
const CustomImageComponent = ({ node, deleteNode }: ReactNodeViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { src, alt, title, width, height } = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
  };

  // Reset loading/error when image source changes
  useEffect(() => {
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setIsLoading(true);
    });
    // Defer state update to avoid cascading renders
    queueMicrotask(() => {
      setHasError(false);
    });
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDelete = () => {
    deleteNode();
  };

  const handleDownload = () => {
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.download = alt || "image";
      link.click();
    }
  };

  return (
    <NodeViewWrapper className="custom-image-node">
      <div className="relative group my-4 inline-block max-w-full">
        <Card className="p-2 border border-border/50 bg-card/50">
          <div className="relative">
            {hasError ? (
              <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-2">
                    Failed to load image
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Skeletonize loading={isLoading}>
                  <Image
                    src={src}
                    alt={alt || ""}
                    title={title || ""}
                    width={width || 800}
                    height={height || 600}
                    className="rounded-lg max-w-full h-auto"
                    onLoadingComplete={handleImageLoad}
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority={false}
                  />
                </Skeletonize>

                {/* Image controls overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleDownload}
                      title="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleDelete}
                      title="Delete image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image info */}
          {(alt || title) && (
            <div className="mt-2 text-xs text-muted-foreground">
              {alt && <div>Alt: {alt}</div>}
              {title && <div>Title: {title}</div>}
            </div>
          )}
        </Card>
      </div>
    </NodeViewWrapper>
  );
};

/**
 * Custom Image Node for TipTap Editor
 * Extends the default Image node to use Next.js Image component
 */
export const CustomImageNode = Node.create({
  name: "customImage",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.alt) {
            return {};
          }
          return {
            alt: attributes.alt,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent);
  },
});
