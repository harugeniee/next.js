"use client";

import {
  containerVariants,
  itemVariants,
  shouldAnimateArray,
} from "@/lib/utils/animations";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface AnimatedGridProps extends HTMLMotionProps<"div"> {
  /**
   * Whether the grid is currently loading
   * Animation will only play when loading is false
   */
  loading?: boolean;
  /**
   * Array data to check for existence
   * Animation will only play when data exists and has items
   */
  data?: unknown[] | null | undefined;
  /**
   * Custom container variants
   * Defaults to containerVariants if not provided
   */
  containerVariants?: Variants;
  /**
   * Custom item variants
   * Defaults to itemVariants if not provided
   */
  itemVariants?: Variants;
  /**
   * Whether to use scroll-triggered animation (whileInView)
   * Defaults to false (uses animate prop based on loading/data)
   */
  scrollTriggered?: boolean;
  /**
   * Viewport options for scroll-triggered animations
   */
  viewport?: {
    once?: boolean;
    margin?: string;
  };
  /**
   * Grid children - each child will be wrapped with motion.div and itemVariants
   */
  children: React.ReactNode;
}

/**
 * AnimatedGrid Component
 * Wrapper for grid layouts with stagger animations
 * Automatically wraps children with motion.div and applies item variants
 * Prevents animation conflicts with Skeletonize component
 * Animation triggers after skeleton disappears
 * Handles navigation cleanup gracefully to prevent DOM errors
 *
 * @example
 * ```tsx
 * <AnimatedGrid loading={isLoading} data={items} className="grid grid-cols-3">
 *   {items.map((item) => (
 *     <Card key={item.id}>{item.name}</Card>
 *   ))}
 * </AnimatedGrid>
 * ```
 */
export function AnimatedGrid({
  loading = false,
  data,
  containerVariants: customContainerVariants = containerVariants,
  itemVariants: customItemVariants = itemVariants,
  scrollTriggered = false,
  viewport = { once: true, margin: "-50px" },
  children,
  className,
  ...props
}: AnimatedGridProps) {
  const shouldShow = shouldAnimateArray(loading, data);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isMountedRef = useRef(true);

  // Track mount state to prevent state updates after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Delay animation until skeleton is completely gone
  useEffect(() => {
    if (shouldShow && !loading) {
      // Small delay to ensure skeleton has been removed from DOM
      const timer = setTimeout(() => {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setShouldAnimate(true);
        }
      }, 50);
      return () => {
        clearTimeout(timer);
        // Prevent state updates during cleanup
        isMountedRef.current = false;
      };
    } else {
      if (isMountedRef.current) {
        // Defer state update to avoid cascading renders
        queueMicrotask(() => {
          setShouldAnimate(false);
        });
      }
    }
  }, [shouldShow, loading]);

  const animateState = shouldAnimate ? "visible" : "hidden";

  // Wrap children with motion.div if they're not already motion components
  const wrappedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // Check if child is already a motion component
      const childType = child.type as
        | { displayName?: string }
        | string
        | symbol;
      if (
        typeof childType === "object" &&
        childType !== null &&
        "displayName" in childType &&
        typeof childType.displayName === "string" &&
        childType.displayName.startsWith("motion.")
      ) {
        return child;
      }

      return (
        <motion.div key={child.key || index} variants={customItemVariants}>
          {child}
        </motion.div>
      );
    }
    return child;
  });

  if (scrollTriggered) {
    return (
      <motion.div
        variants={customContainerVariants}
        initial="hidden"
        whileInView={shouldAnimate ? "visible" : "hidden"}
        viewport={viewport}
        className={className}
        // Prevent errors during navigation by disabling layout animations
        layout={false}
        {...props}
      >
        {wrappedChildren}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={customContainerVariants}
      initial="hidden"
      animate={animateState}
      className={className}
      // Prevent errors during navigation by disabling layout animations
      layout={false}
      {...props}
    >
      {wrappedChildren}
    </motion.div>
  );
}
