"use client";

import { headerVariants, shouldAnimate } from "@/lib/utils/animations";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedHeaderProps extends HTMLMotionProps<"div"> {
  /**
   * Whether the header is currently loading
   * Animation will only play when loading is false
   */
  loading?: boolean;
  /**
   * Data to check for existence
   * Animation will only play when data exists
   */
  data?: unknown;
  /**
   * Custom animation variants
   * Defaults to headerVariants if not provided
   */
  variants?: Variants;
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
}

/**
 * AnimatedHeader Component
 * Wrapper for section headers with fade + slide down animation
 * Prevents animation conflicts with Skeletonize component
 * Animation triggers after skeleton disappears
 * Handles navigation cleanup gracefully to prevent DOM errors
 *
 * @example
 * ```tsx
 * <AnimatedHeader loading={isLoading} data={data}>
 *   <h2>Section Title</h2>
 * </AnimatedHeader>
 * ```
 */
export function AnimatedHeader({
  loading = false,
  data,
  variants = headerVariants,
  scrollTriggered = false,
  viewport = { once: true },
  children,
  className,
  ...props
}: AnimatedHeaderProps) {
  const shouldShow = shouldAnimate(loading, data);
  const [shouldAnimateState, setShouldAnimateState] = useState(false);
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
          setShouldAnimateState(true);
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
          setShouldAnimateState(false);
        });
      }
    }
  }, [shouldShow, loading]);

  const animateState = shouldAnimateState ? "visible" : "hidden";

  if (scrollTriggered) {
    return (
      <motion.div
        initial="hidden"
        whileInView={shouldAnimateState ? "visible" : "hidden"}
        viewport={viewport}
        variants={variants}
        className={className}
        // Prevent errors during navigation by disabling layout animations
        layout={false}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate={animateState}
      variants={variants}
      className={className}
      // Prevent errors during navigation by disabling layout animations
      layout={false}
      {...props}
    >
      {children}
    </motion.div>
  );
}
