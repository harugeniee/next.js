"use client";

import { sectionVariants } from "@/lib/utils/animations";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  /**
   * Whether the section is currently loading
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
   * Defaults to sectionVariants if not provided
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
 * AnimatedSection Component
 * Wrapper for page sections with automatic animation based on loading state
 * Prevents animation conflicts with Skeletonize component
 * Animation triggers after skeleton disappears
 * Handles navigation cleanup gracefully to prevent DOM errors
 *
 * @example
 * ```tsx
 * <AnimatedSection loading={isLoading} data={data}>
 *   <div>Content</div>
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  loading = false,
  data,
  variants = sectionVariants,
  scrollTriggered = false,
  viewport = { once: true, margin: "-100px" },
  children,
  className,
  ...props
}: AnimatedSectionProps) {
  const shouldShow = !loading && (data !== undefined ? !!data : true);
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
        setShouldAnimate(false);
      }
    }
  }, [shouldShow, loading]);

  const animateState = shouldAnimate ? "visible" : "hidden";

  if (scrollTriggered) {
    return (
      <motion.section
        initial="hidden"
        whileInView={shouldAnimate ? "visible" : "hidden"}
        viewport={viewport}
        variants={variants}
        className={className}
        // Prevent errors during navigation by disabling layout animations
        layout={false}
        {...props}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate={animateState}
      variants={variants}
      className={className}
      // Prevent errors during navigation by disabling layout animations
      layout={false}
      {...props}
    >
      {children}
    </motion.section>
  );
}
