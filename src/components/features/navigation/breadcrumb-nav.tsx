"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { useMediaQuery } from "@/hooks/ui/useSimpleHooks";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/utils/breadcrumb";
import Link from "next/link";
import * as React from "react";

interface BreadcrumbNavProps {
  items: BreadcrumbItemType[];
  className?: string;
  maxItems?: number; // Maximum items to show before collapsing (default: 3)
}

/**
 * Responsive Breadcrumb Navigation Component
 *
 * Features:
 * - Auto-collapses when too many items
 * - Shows dropdown for collapsed items
 * - Accessible and SEO-friendly
 * - Mobile-first responsive design
 */
export function BreadcrumbNav({
  items,
  className,
  maxItems = 3,
}: BreadcrumbNavProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Don't collapse if items are within limit
  const shouldCollapse = items.length > maxItems;
  const visibleItems = shouldCollapse
    ? [items[0], ...items.slice(-(maxItems - 1))]
    : items;
  const collapsedItems = shouldCollapse ? items.slice(1, -(maxItems - 1)) : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {visibleItems.map((item, visibleIndex) => {
          // Use isActive from item if available, otherwise check if it's the last item
          const isActive = item.isActive ?? false;
          const shouldRenderAsPage = isActive || !item.href;

          // Render ellipsis dropdown after first item when collapsed
          // This should appear between the first item and the next visible item
          if (shouldCollapse && visibleIndex === 1) {
            return (
              <React.Fragment key={`ellipsis-group-${visibleIndex}`}>
                {/* Render ellipsis dropdown */}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger
                      className="flex items-center gap-1"
                      aria-label="Toggle menu"
                    >
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {collapsedItems.map((collapsedItem, collapsedIndex) => (
                        <DropdownMenuItem key={collapsedIndex} asChild>
                          {collapsedItem.href ? (
                            <Link href={collapsedItem.href}>
                              {collapsedItem.label}
                            </Link>
                          ) : (
                            <span>{collapsedItem.label}</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {/* Render the current item (which is the first item after collapsed items) */}
                <BreadcrumbItem>
                  {shouldRenderAsPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          }

          // Render normal breadcrumb item
          // Add separator before each item except the first one
          // When collapsed, the ellipsis fragment already includes separators
          const needsSeparator = visibleIndex > 0;
          
          return (
            <React.Fragment key={`${item.href || item.label}-${visibleIndex}`}>
              {needsSeparator && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {shouldRenderAsPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
