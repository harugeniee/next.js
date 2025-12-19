"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/core/button";
import { cn } from "@/lib/utils";

/**
 * Carousel component for displaying items in a horizontal scrollable container
 * Supports navigation arrows and indicators
 */
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showArrows?: boolean;
  showIndicators?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  orientation?: "horizontal" | "vertical";
}

export function Carousel({
  children,
  showArrows = true,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  orientation = "horizontal",
  className,
  ...props
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || totalItems <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, totalItems]);

  // Scroll to current index
  React.useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    if (orientation === "vertical") {
      const scrollHeight = container.scrollHeight;
      const itemHeight = scrollHeight / totalItems;
      container.scrollTo({
        top: currentIndex * itemHeight,
        behavior: "smooth",
      });
    } else {
      const scrollWidth = container.scrollWidth;
      const itemWidth = scrollWidth / totalItems;
      container.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, totalItems, orientation]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={cn("relative w-full", className)} {...props}>
      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          orientation === "vertical"
            ? "flex-col overflow-y-hidden h-full"
            : "overflow-x-hidden",
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0",
              orientation === "vertical" ? "min-h-full w-full" : "min-w-full",
            )}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handlePrevious}
            aria-label="Previous item"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleNext}
            aria-label="Next item"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalItems > 1 && (
        <>
          {/* Dot indicators - center bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground/75",
                )}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
          {/* Slide number - bottom right (MangaDex style) */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              NO. {currentIndex + 1}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
