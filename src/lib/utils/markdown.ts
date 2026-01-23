import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

/**
 * Convert markdown string to HTML using TipTap
 * Uses TipTap's markdown extension (already in dependencies)
 * No need for additional markdown libraries
 *
 * @param markdown - Markdown string to convert
 * @returns HTML string ready for ContentRenderer
 *
 * @example
 * ```typescript
 * const html = markdownToHtml('# Hello World\n\nThis is **bold** text.');
 * // Returns: '<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>'
 * ```
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  // Create a temporary TipTap editor instance to parse markdown
  // This uses the same markdown extension already configured in the project
  const editor = new Editor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true,
        breaks: true,
      }),
    ],
    content: markdown,
    editable: false, // Not editable, just for parsing
  });

  // Get HTML output from the editor
  const html = editor.getHTML();

  // Destroy the editor instance to free memory
  editor.destroy();

  return html;
}
