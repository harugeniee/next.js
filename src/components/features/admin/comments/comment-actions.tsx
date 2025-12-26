"use client";

import { Edit, Eye, MoreHorizontal, Pin, PinOff, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import type { Comment } from "@/lib/api/comments";
import { CommentDetailDialog } from "./comment-detail-dialog";
import { CommentFormDialog } from "./comment-form-dialog";
import type { UpdateCommentFormData } from "@/lib/validators/comments";

interface CommentActionsProps {
  comment: Comment;
  onDelete: (comment: Comment) => void;
  onUpdate: (id: string, data: UpdateCommentFormData) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  isUpdating?: boolean;
  isPinning?: boolean;
}

export function CommentActions({
  comment,
  onDelete,
  onUpdate,
  onPin,
  isUpdating,
  isPinning,
}: CommentActionsProps) {
  const { t } = useI18n();
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleView = () => {
    setShowDetailDialog(true);
  };

  const handlePin = async () => {
    await onPin(comment.id, !comment.pinned);
  };

  const handleSubmit = async (data: UpdateCommentFormData) => {
    await onUpdate(comment.id, data);
    setShowEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("common.actions", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            {t("comments.actions.viewDetails", "admin")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t("comments.actions.edit", "admin")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePin} disabled={isPinning}>
            {comment.pinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" />
                {t("comments.actions.unpin", "admin")}
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" />
                {t("comments.actions.pin", "admin")}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(comment)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("comments.actions.delete", "admin")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommentDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        comment={comment}
      />

      <CommentFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        comment={comment}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </>
  );
}
