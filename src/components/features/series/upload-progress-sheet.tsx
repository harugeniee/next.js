"use client";

import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/layout/sheet";
import { cn } from "@/lib/utils";

/**
 * Upload Progress Sheet Component
 * Displays detailed upload progress for media files and segment creation
 * Uses bottom sheet on mobile, dialog-like on desktop
 */
interface UploadProgressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaFiles: File[];
  uploadProgress: Record<string, number>;
  uploadStatus: Record<string, "pending" | "uploading" | "success" | "error">;
  isUploading: boolean;
  isCreatingSegment: boolean;
  currentStep: "uploading" | "creating" | "complete";
  error?: string | null;
}

export function UploadProgressSheet({
  open,
  onOpenChange,
  mediaFiles,
  uploadProgress,
  uploadStatus,
  isUploading,
  isCreatingSegment,
  currentStep,
  error,
}: UploadProgressSheetProps) {
  const { t } = useI18n();

  // Ref to files list container for auto-follow behavior
  const filesListRef = useRef<HTMLDivElement | null>(null);

  // Calculate overall progress
  const totalFiles = mediaFiles.length;
  const completedFiles = Object.values(uploadStatus).filter(
    (status) => status === "success",
  ).length;
  // Overall progress is based on number of completed files (0–100%),
  // optionally combined with a small boost while creating the segment.
  // Clamp to 0–100 to avoid going over 100%.
  const baseProgress =
    totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;
  const extraStepProgress =
    currentStep === "creating" && baseProgress < 100 ? 10 : 0;
  const overallProgressRaw = baseProgress + extraStepProgress;
  const overallProgress =
    currentStep === "creating" && totalFiles === 0
      ? 50
      : Math.min(100, Math.max(0, overallProgressRaw));

  // Auto-scroll to the file that is currently uploading
  useEffect(() => {
    if (!filesListRef.current || mediaFiles.length === 0) return;

    // Find index of the file that is currently uploading
    const uploadingIndex = mediaFiles.findIndex((file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      return uploadStatus[fileKey] === "uploading";
    });

    if (uploadingIndex === -1) return;

    const listElement = filesListRef.current;
    const itemElement = listElement.children[
      uploadingIndex
    ] as HTMLElement | null;

    if (itemElement) {
      itemElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [mediaFiles, uploadStatus]);

  // Get current step text
  const getStepText = () => {
    if (currentStep === "complete") {
      return (
        t("segments.toast.created", "series") || "Segment created successfully!"
      );
    }
    if (currentStep === "creating") {
      return (
        t("segments.form.creatingSegment", "series") || "Creating segment..."
      );
    }
    return t("segments.form.uploadingFiles", "series") || "Uploading files...";
  };

  // Get status icon
  const getStatusIcon = (
    status: "pending" | "uploading" | "success" | "error",
  ) => {
    switch (status) {
      case "success":
        return (
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
        );
      case "error":
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "uploading":
        return (
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-spin" />
        );
      default:
        return (
          <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-muted-foreground/30" />
        );
    }
  };

  // Get status text
  const getStatusText = (
    status: "pending" | "uploading" | "success" | "error",
    progress?: number,
  ) => {
    switch (status) {
      case "success":
        return "Uploaded";
      case "error":
        return "Failed";
      case "uploading":
        return `Uploading... ${progress || 0}%`;
      default:
        return "Waiting...";
    }
  };

  // Prevent closing when uploading or creating (unless complete or error)
  const canClose = currentStep === "complete" || !!error;

  return (
    <Sheet
      open={open}
      onOpenChange={(newOpen) => {
        // Only allow closing if upload is complete or there's an error
        if (canClose || !newOpen) {
          onOpenChange(newOpen);
        }
      }}
    >
      <SheetContent
        side="bottom"
        className={cn(
          "max-h-[80vh] overflow-y-auto sm:max-h-[70vh]",
          !canClose && "[&>button]:hidden", // Hide default close button when can't close
        )}
        onInteractOutside={(e) => {
          // Prevent closing when uploading or creating
          if (!canClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing when uploading or creating
          if (!canClose) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 px-3 sm:px-4 text-base sm:text-lg">
            {currentStep === "complete" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            )}
            {getStepText()}
          </SheetTitle>
          <SheetDescription className="px-3 sm:px-4 text-xs sm:text-sm">
            {currentStep === "uploading" &&
              `${completedFiles}/${totalFiles} files uploaded`}
            {currentStep === "creating" && "Finalizing segment creation..."}
            {currentStep === "complete" && "Your segment is ready!"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-6 pb-3 sm:pb-4">
          {/* Overall Progress Bar */}
          {(isUploading || isCreatingSegment) && (
            <div className="space-y-2 px-3 sm:px-4">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">
                  {overallProgress}%
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-3 sm:mx-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Files List */}
          {mediaFiles.length > 0 && (
            <div className="space-y-2 sm:space-y-3 px-3 sm:px-4">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                Files ({completedFiles}/{totalFiles} completed)
              </h3>
              <div
                ref={filesListRef}
                className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto"
              >
                {mediaFiles.map((file) => {
                  const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
                  const status = uploadStatus[fileKey] || "pending";
                  const progress = uploadProgress[fileKey] || 0;
                  const isImage = file.type.startsWith("image/");
                  const previewUrl = isImage ? URL.createObjectURL(file) : null;

                  return (
                    <div
                      key={fileKey}
                      className={cn(
                        "flex items-start gap-3 p-2.5 sm:p-3 rounded-lg border transition-colors",
                        status === "success" &&
                          "bg-green-500/10 border-green-500/20",
                        status === "error" && "bg-red-500/10 border-red-500/20",
                        status === "uploading" &&
                          "bg-primary/5 border-primary/20",
                        status === "pending" && "bg-muted/50 border-border",
                      )}
                    >
                      {/* File Icon/Preview */}
                      <div className="flex-shrink-0">
                        {isImage && previewUrl ? (
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border border-border bg-muted">
                            <Image
                              src={previewUrl}
                              alt={file.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-muted border border-border">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                              {file.type && ` • ${file.type.split("/")[0]}`}
                            </p>
                          </div>
                          {getStatusIcon(status)}
                        </div>

                        {/* Progress Bar */}
                        {status === "uploading" && (
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {getStatusText(status, progress)}
                            </p>
                          </div>
                        )}

                        {/* Status Text */}
                        {status !== "uploading" && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {getStatusText(status)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Creating Segment Step */}
          {currentStep === "creating" && (
            <div className="mx-3 sm:mx-4 flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-primary/20 bg-primary/5">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {t("segments.form.creatingSegment", "series") ||
                    "Creating segment..."}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  Please wait while we process your segment
                </p>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <div className="mx-3 sm:mx-4 flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-green-500/20 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {t("segments.toast.created", "series") ||
                    "Segment created successfully!"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  Redirecting to segment page...
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
