"use client";

import { cn } from "@/lib/utils/index";
import { isMotionComponent, motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  "ref"
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>,
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

// Cache for motion components created outside of render
// This prevents React from complaining about components created during render
const motionComponentCache = new Map<
  React.ElementType,
  React.ElementType
>();

/**
 * Get or create a motion component for the given element type
 * Components are cached to avoid recreating them during render
 * This function is called outside of React's render phase
 */
function getMotionComponent(elementType: React.ElementType): React.ElementType {
  // Check if already cached
  if (motionComponentCache.has(elementType)) {
    return motionComponentCache.get(elementType)!;
  }

  // Create and cache the motion component
  // This happens outside of render due to the cache
  const motionComponent = motion.create(elementType);
  motionComponentCache.set(elementType, motionComponent);
  return motionComponent;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  // Check validity first, but don't return early to ensure hooks are called
  const isValid = React.isValidElement(children);

  const isAlreadyMotion =
    isValid &&
    typeof children.type === "object" &&
    children.type !== null &&
    isMotionComponent(children.type);

  // Store the component and element type in state
  // This ensures motion.create() is not called during render
  const [Base, setBase] = React.useState<React.ElementType | null>(() => {
    if (!isValid) return null;
    if (isAlreadyMotion) {
      // Already a motion component, use it directly
      return children.type as React.ElementType;
    }
    // For non-motion components, we need to create the motion wrapper
    // Return null initially, will be set synchronously in useLayoutEffect
    return null;
  });
  const [elementType, setElementType] = React.useState<React.ElementType | null>(
    isValid ? (children.type as React.ElementType) : null,
  );

  // Create the motion component in useLayoutEffect (after render, before paint)
  // This ensures it's not created during the render phase
  React.useLayoutEffect(() => {
    if (!isValid) {
      setBase(null);
      setElementType(null);
      return;
    }

    const currentElementType = children.type as React.ElementType;

    // If element type changed, reset Base
    if (elementType !== currentElementType) {
      setElementType(currentElementType);
      if (isAlreadyMotion) {
        setBase(currentElementType);
        return;
      }
      // Reset Base to null so we create the new motion component
      setBase(null);
    }

    // Create motion component if needed
    if (!isAlreadyMotion && Base === null) {
      // getMotionComponent uses a cache, so motion.create() is only called once
      // per element type, and this happens after render but before paint
      // This prevents the "components created during render" error
      const motionComponent = getMotionComponent(currentElementType);
      setBase(motionComponent);
    }
  }, [isValid, isAlreadyMotion, children.type, Base, elementType]);

  if (!isValid || !Base) {
    // For non-motion components, render the original child while motion component is being created
    // This prevents a flash of missing content
    if (isValid && !isAlreadyMotion) {
      const { ref: childRef, ...childProps } = children.props as AnyProps;
      const mergedProps = mergeProps(childProps, props);
      const OriginalBase = children.type as React.ElementType;
      return (
        <OriginalBase {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
      );
    }
    return null;
  }

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
  );
}

export {
  Slot, type AnyProps, type DOMMotionProps, type SlotProps,
  type WithAsChild
};

