"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { cn } from "@/lib/utils";

interface JsonDiffViewerProps {
  oldJson: Record<string, unknown>;
  newJson: Record<string, unknown>;
  className?: string;
}

/**
 * Helper function to normalize values for comparison
 */
function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    // Normalize dates to ISO string for comparison
    return value.toISOString().split("T")[0]; // YYYY-MM-DD format
  }
  if (Array.isArray(value)) {
    // Sort arrays for consistent comparison
    return [...value].sort();
  }
  if (typeof value === "object") {
    // Sort object keys for consistent comparison
    return Object.keys(value)
      .sort()
      .reduce(
        (acc, k) => {
          acc[k] = normalizeValue((value as Record<string, unknown>)[k]);
          return acc;
        },
        {} as Record<string, unknown>,
      );
  }
  return value;
}

/**
 * Simple JSON diff viewer component
 * Shows side-by-side comparison of old and new JSON data
 * Only displays fields that have changed in the proposed data
 */
export function JsonDiffViewer({
  oldJson,
  newJson,
  className,
}: JsonDiffViewerProps) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // Only get keys from newJson (proposedData) - these are the fields being changed
  const proposedKeys = Object.keys(newJson);

  // Find which fields have actually changed
  // A field is considered changed if:
  // 1. It exists in newJson but not in oldJson (new field)
  // 2. It exists in both but values are different (modified field)
  const changedKeys = proposedKeys.filter((key) => {
    const oldValue = oldJson[key];
    const newValue = newJson[key];

    // If field doesn't exist in oldJson, it's a new field
    if (!(key in oldJson)) {
      return true;
    }

    // Normalize values for comparison
    const normalizedOld = normalizeValue(oldValue);
    const normalizedNew = normalizeValue(newValue);

    // Compare normalized values
    return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew);
  });

  // If no changes, show message
  if (changedKeys.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <p className="text-sm">No changes detected in proposed data</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Values - Only show fields that changed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {changedKeys.map((key) => {
                const oldValue = oldJson[key];

                return (
                  <div key={key} className="p-2 rounded border bg-muted/50">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      {key}
                    </div>
                    <pre className="text-xs overflow-auto max-h-32 bg-background p-2 rounded">
                      {formatValue(oldValue)}
                    </pre>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Proposed Values - Only show fields that changed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Proposed Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {changedKeys.map((key) => {
                const newValue = newJson[key];

                return (
                  <div
                    key={key}
                    className="p-2 rounded border bg-primary/10 border-primary"
                  >
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      {key}
                    </div>
                    <pre className="text-xs overflow-auto max-h-32 bg-background p-2 rounded">
                      {formatValue(newValue)}
                    </pre>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
