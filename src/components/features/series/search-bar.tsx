"use client";

import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/shadcn-io/popover";
import { useSeriesSearch } from "@/hooks/series/useSeriesQuery";
import { useDebounce } from "@/hooks/ui/useSimpleHooks";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Compact search result card component
 * Displays small thumbnail and title with highlighted search query
 */
interface SearchResultCardProps {
  series: Series;
  searchQuery: string;
  onClick: () => void;
}

function SearchResultCard({
  series,
  searchQuery,
  onClick,
}: SearchResultCardProps) {
  // Highlight search query in title
  const highlightedTitle = useMemo(() => {
    if (!searchQuery.trim()) return series.title;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = series.title.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return (
          <span key={index} className="text-red-500 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  }, [series.title, searchQuery]);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-accent"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Thumbnail - Small square image */}
      <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-muted">
        <Image
          src={series.coverUrl || "/default-article-cover.jpg"}
          alt={series.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base text-foreground line-clamp-1 font-medium">
          {highlightedTitle}
        </h3>
      </div>
    </div>
  );
}

/**
 * Search bar component with keyboard shortcut support and live search results
 * Displays search results in a popover dropdown when user types
 */
interface SearchBarProps {
  placeholder?: string;
  showKeyboardShortcut?: boolean;
  onSearch?: (query: string) => void;
  onResultClick?: () => void; // Callback when a search result is clicked
  className?: string;
}

export function SearchBar({
  placeholder,
  showKeyboardShortcut = true,
  onSearch,
  onResultClick,
  className,
}: SearchBarProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  // Search series using TanStack Query
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSeriesSearch(debouncedQuery, debouncedQuery.trim().length > 0);

  // Detect Mac for keyboard shortcut display
  useEffect(() => {
    // More reliable Mac detection
    const platform = navigator.platform.toUpperCase();
    const userAgent = navigator.userAgent.toUpperCase();
    setIsMac(
      platform.indexOf("MAC") >= 0 ||
        platform.indexOf("IPHONE") >= 0 ||
        platform.indexOf("IPAD") >= 0 ||
        userAgent.indexOf("MAC OS X") >= 0,
    );
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  // Open popover when user types
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  // Handle series card click - navigate to series page
  const handleSeriesClick = (seriesId: string) => {
    router.push(`/series/${seriesId}`);
    setIsOpen(false);
    setQuery("");
    // Notify parent component that a result was clicked (e.g., to close dialog)
    onResultClick?.();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query.trim().length > 0 && searchResults && searchResults.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <form
        onSubmit={handleSubmit}
        className={cn("relative w-full max-w-2xl", className)}
      >
        <div className="relative">
          <PopoverAnchor asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </PopoverAnchor>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder || t("searchPlaceholder", "series")}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={cn(
              "w-full pl-10 relative z-20",
              showKeyboardShortcut ? "pr-28 sm:pr-32" : "pr-12",
            )}
          />
          {/* Search Button - Always visible */}
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 z-20"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          {/* Keyboard Shortcut Badge - Only on larger screens */}
          {showKeyboardShortcut && (
            <div className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <kbd className="hidden h-8 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium opacity-100 sm:flex">
                <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>
                <span className="text-xs">K</span>
              </kbd>
            </div>
          )}
        </div>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Search Results */}
          {debouncedQuery.trim().length > 0 && (
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && isError && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t("searchError", "series") || "Error loading search results"}
                </div>
              )}
              {!isLoading &&
                !isError &&
                searchResults &&
                searchResults.length > 0 && (
                  <div className="divide-y">
                    {searchResults.map((series) => (
                      <SearchResultCard
                        key={series.id}
                        series={series}
                        searchQuery={debouncedQuery}
                        onClick={() => handleSeriesClick(series.id)}
                      />
                    ))}
                  </div>
                )}
              {!isLoading &&
                !isError &&
                searchResults &&
                searchResults.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t("noResults", "series") || "No results found"}
                  </div>
                )}
            </div>
          )}
          {debouncedQuery.trim().length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("startTyping", "series") || "Start typing to search..."}
            </div>
          )}
        </PopoverContent>
      </form>
    </Popover>
  );
}
