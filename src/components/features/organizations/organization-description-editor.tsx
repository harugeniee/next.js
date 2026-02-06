"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";

/** Maximum allowed characters (plain text only, excluding HTML). */
const CHARACTER_LIMIT = 500;

import { useI18n } from "@/components/providers/i18n-provider";
import { NoSSR } from "@/components/providers/no-ssr";
import { Button } from "@/components/ui/core/button";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";

interface OrganizationDescriptionEditorProps {
  readonly value?: string;
  readonly onChange?: (content: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

/**
 * Simplified TipTap editor for organization descriptions
 * Features: Bold, Italic, Underline, Headings (H2/H3), Lists, Links
 * Character limit: 500 characters (text only, excluding HTML tags)
 */
export function OrganizationDescriptionEditor({
  value = "",
  onChange,
  placeholder,
  className = "",
}: OrganizationDescriptionEditorProps) {
  const { t } = useI18n();
  const placeholderText =
    placeholder ?? t("create.form.descriptionPlaceholder", "organizations");
  // Store last valid HTML so we can revert when user exceeds character limit
  const lastGoodContentRef = useRef(value);

  useEffect(() => {
    lastGoodContentRef.current = value;
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Only H2 and H3
        },
        codeBlock: false, // No code blocks
        blockquote: false, // No blockquotes
        code: false, // No inline code
      }),
      Placeholder.configure({
        placeholder: placeholderText,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Highlight.configure({
        multicolor: false, // Single color highlight only
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800 px-1 rounded",
        },
      }),
    ],
    content: value,
    editable: true,
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-3 ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > CHARACTER_LIMIT) {
        editor.commands.setContent(lastGoodContentRef.current, {
          emitUpdate: false,
        });
        return;
      }
      lastGoodContentRef.current = editor.getHTML();
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  // Formatting handlers
  const handleBold = useCallback(() => {
    if (editor) editor.chain().focus().toggleBold().run();
  }, [editor]);

  const handleItalic = useCallback(() => {
    if (editor) editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleUnderline = useCallback(() => {
    if (editor) editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const handleH2 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);

  const handleH3 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 3 }).run();
  }, [editor]);

  const handleBulletList = useCallback(() => {
    if (editor) editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const handleOrderedList = useCallback(() => {
    if (editor) editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const handleLink = useCallback(() => {
    if (editor) {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt(
        t("create.editor.linkPrompt", "organizations"),
        previousUrl,
      );

      // Cancelled
      if (url === null) {
        return;
      }

      // Empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // Update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor, t]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.getText().length;
  const characterLimit = CHARACTER_LIMIT;
  const isNearLimit = characterCount > characterLimit * 0.9;
  const isOverLimit = characterCount > characterLimit;

  return (
    <NoSSR>
      <div className="border border-border rounded-lg bg-card text-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        {/* Simple toolbar */}
        <div className="border-b border-border bg-muted/50 p-1.5">
          <div className="flex items-center gap-0.5 flex-wrap">
            {/* Text formatting */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBold}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bold") ? "bg-primary/10 text-primary" : ""
              }`}
              title={t("create.editor.toolbar.bold", "organizations")}
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleItalic}
              className={`h-8 w-8 p-0 ${
                editor.isActive("italic") ? "bg-primary/10 text-primary" : ""
              }`}
              title={t("create.editor.toolbar.italic", "organizations")}
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUnderline}
              className={`h-8 w-8 p-0 ${
                editor.isActive("underline") ? "bg-primary/10 text-primary" : ""
              }`}
              title={t("create.editor.toolbar.underline", "organizations")}
            >
              <UnderlineIcon className="h-3.5 w-3.5" />
            </Button>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Headings */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleH2}
              className={`h-8 w-8 p-0 ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title={t("create.editor.toolbar.heading2", "organizations")}
            >
              <Heading2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleH3}
              className={`h-8 w-8 p-0 ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title={t("create.editor.toolbar.heading3", "organizations")}
            >
              <Heading3 className="h-3.5 w-3.5" />
            </Button>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Lists */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBulletList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bulletList")
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title={t("create.editor.toolbar.bulletList", "organizations")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleOrderedList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("orderedList")
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title={t("create.editor.toolbar.orderedList", "organizations")}
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>

            <div className="w-px h-5 bg-border mx-0.5" />

            {/* Link */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLink}
              className={`h-8 w-8 p-0 ${
                editor.isActive("link") ? "bg-primary/10 text-primary" : ""
              }`}
              title={t("create.editor.toolbar.link", "organizations")}
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />

        {/* Character counter */}
        <div
          className={`px-3 py-2 text-xs border-t border-border ${
            isOverLimit
              ? "text-destructive bg-destructive/5"
              : isNearLimit
                ? "text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                : "text-muted-foreground"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>
              {isOverLimit
                ? t("create.editor.characterLimitExceeded", "organizations")
                : t("create.editor.formattingHint", "organizations")}
            </span>
            <span className="font-medium">
              {t("create.editor.charactersCount", "organizations", {
                count: characterCount,
                limit: characterLimit,
              })}
            </span>
          </div>
        </div>
      </div>
    </NoSSR>
  );
}
