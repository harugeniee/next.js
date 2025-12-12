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
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          // If collapsed and this is the first item, render it normally
          if (shouldCollapse && index === 0) {
            return (
              <React.Fragment key={`${item.href || item.label}-${index}`}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {/* Render ellipsis dropdown after first item */}
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
              </React.Fragment>
            );
          }

          // If collapsed and this item is in the collapsed range, skip it (already in dropdown)
          if (
            shouldCollapse &&
            index > 0 &&
            index < items.length - (maxItems - 1)
          ) {
            return null;
          }

          // Render normal breadcrumb item
          return (
            <React.Fragment key={`${item.href || item.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
