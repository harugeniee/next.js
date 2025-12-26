"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Comment } from "@/lib/api/comments";
import { COMMENT_CONSTANTS, type CommentVisibility } from "@/lib/constants/comment.constants";
import {
  updateCommentSchema,
  type UpdateCommentFormData,
} from "@/lib/validators/comments";

interface CommentFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly comment?: Comment;
  readonly onSubmit: (data: UpdateCommentFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

/**
 * Comment Form Dialog Component
 * Handles editing comments with validation
 */
export function CommentFormDialog({
  open,
  onOpenChange,
  comment,
  onSubmit,
  isLoading = false,
}: CommentFormDialogProps) {
  const { t } = useI18n();

  const form = useForm<UpdateCommentFormData>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment?.content ?? "",
      visibility: (comment?.visibility as CommentVisibility | undefined) ?? COMMENT_CONSTANTS.VISIBILITY.PUBLIC,
      flags: comment?.flags ?? [],
      pinned: comment?.pinned ?? false,
    },
  });

  // Watch flags field for React Compiler compatibility
  const watchedFlags = useWatch({
    control: form.control,
    name: "flags",
  });

  // Update form when comment changes
  useEffect(() => {
    if (comment) {
      form.reset({
        content: comment.content ?? "",
        visibility: (comment.visibility as CommentVisibility | undefined) ?? COMMENT_CONSTANTS.VISIBILITY.PUBLIC,
        flags: comment.flags ?? [],
        pinned: comment.pinned ?? false,
      });
    }
  }, [comment, form]);

  const handleSubmit = async (data: UpdateCommentFormData) => {
    // Clean up empty strings to undefined
    const cleanedData: UpdateCommentFormData = {
      content: data.content || undefined,
      visibility: data.visibility || undefined,
      flags: data.flags && data.flags.length > 0 ? data.flags : undefined,
      pinned: data.pinned,
    };
    await onSubmit(cleanedData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("comments.form.editTitle", "admin")}</DialogTitle>
          <DialogDescription>
            {t("comments.form.editDescription", "admin")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("comments.form.content", "admin")}</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder={t(
                        "comments.form.contentPlaceholder",
                        "admin",
                      )}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      maxLength={COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {(field.value || "").length} /{" "}
                    {COMMENT_CONSTANTS.CONTENT_MAX_LENGTH}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("comments.form.visibility", "admin")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || COMMENT_CONSTANTS.VISIBILITY.PUBLIC}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "comments.form.selectVisibility",
                            "admin",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(COMMENT_CONSTANTS.VISIBILITY).map(
                        (visibility) => (
                          <SelectItem key={visibility} value={visibility}>
                            {t(
                              `comments.form.visibilityTypes.${visibility}`,
                              "admin",
                            )}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pinned */}
            <FormField
              control={form.control}
              name="pinned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      {t("comments.form.pinned", "admin")}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {t("comments.form.pinnedDescription", "admin")}
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Flags */}
            <div>
              <FormLabel className="mb-2 block">
                {t("comments.form.flags", "admin")}
              </FormLabel>
              <div className="space-y-2">
                {Object.values(COMMENT_CONSTANTS.FLAGS).map((flag) => {
                  const isChecked = (watchedFlags ?? []).includes(flag);
                  return (
                    <div key={flag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`flag-${flag}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const currentFlags = form.getValues("flags") || [];
                          if (e.target.checked) {
                            form.setValue("flags", [...currentFlags, flag]);
                          } else {
                            form.setValue(
                              "flags",
                              currentFlags.filter((f) => f !== flag),
                            );
                          }
                        }}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      />
                      <label
                        htmlFor={`flag-${flag}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {t(`comments.form.flags.${flag}`, "admin")}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {t("comments.form.cancel", "admin")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("comments.form.saving", "admin")
                  : t("comments.form.update", "admin")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
