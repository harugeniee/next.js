import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";
import { Button } from "./button";
import { ImageCropDialog } from "./image-crop-dialog";

interface ImageUploadProps {
  readonly value?: File | null;
  readonly onChange: (file: File | null) => void;
  // Optional callback for batch upload - can be used for future multi-file upload feature
  readonly onUploadBatch?: (uploaded: { id: string; url: string }[]) => void;
  readonly className?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly maxSizeInMB?: number;
  readonly acceptedTypes?: string[];
  readonly enableCrop?: boolean;
  readonly aspectRatio?: number;
}

/**
 * Image Upload Component
 * Handles file upload with validation for image types and size limits
 * Supports drag and drop functionality
 */
export function ImageUpload({
  value,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUploadBatch: _onUploadBatch, // Prefix with underscore to indicate intentionally unused
  className,
  placeholder = "Click to upload or drag and drop",
  disabled = false,
  maxSizeInMB = 10,
  acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  enableCrop = false,
  aspectRatio = 16 / 9,
}: ImageUploadProps) {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [tempFile, setTempFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Only ${acceptedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} files are allowed`;
    }

    // Check file size (convert MB to bytes)
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (enableCrop) {
      setTempFile(file);
      setIsEditorOpen(true);
    } else {
      onChange(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(event.dataTransfer.files).slice(0, 3);
    if (files.length === 0) return;
    // For cover image, use the first file; batch upload callback if provided
    const first = files[0];
    handleFileSelect(first);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected file
  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle crop save
  const handleCropSave = (croppedFile: File) => {
    onChange(croppedFile);
    setTempFile(null);
    setIsEditorOpen(false);
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setTempFile(null);
    setIsEditorOpen(false);
  };

  // Get file preview URL
  const previewUrl = value ? URL.createObjectURL(value) : null;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer w-full",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10",
          error && "border-destructive bg-destructive/5",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-disabled={disabled}
        aria-label="Upload image file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []).slice(0, 3);
            if (files.length > 0) {
              // For cover, take the first file to edit/crop
              handleFileSelect(files[0]);
            }
          }}
          className="hidden"
          disabled={disabled}
        />

        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Preview"
              width={400}
              height={200}
              className="max-h-48 w-full object-cover rounded-md"
              unoptimized
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {enableCrop && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Prevent parent container click from firing on mobile
                    // which could blur or reopen input instead of dialog
                    event?.stopPropagation?.();
                    if (value) {
                      setTempFile(value);
                      setIsEditorOpen(true);
                    }
                  }}
                >
                  {t("form.coverImageEdit", "write")}
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                {t("form.coverImageRemove", "write")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-muted-foreground">
              <svg
                className="mx-auto h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              {acceptedTypes
                .map((type) => type.split("/")[1].toUpperCase())
                .join(", ")}{" "}
              up to {maxSizeInMB}MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Image Editor Dialog */}
      <ImageCropDialog
        isOpen={isEditorOpen}
        onClose={handleCropCancel}
        onSave={handleCropSave}
        imageFile={tempFile}
        aspectRatio={aspectRatio}
      />
    </div>
  );
}
