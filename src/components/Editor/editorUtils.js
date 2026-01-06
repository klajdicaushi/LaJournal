import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot } from "lexical";

/**
 * Extracts content from a Lexical editor instance
 * @param {LexicalEditor} editor - The Lexical editor instance
 * @returns {Object} Object containing jsonState, htmlContent, and plainText
 */
export const extractEditorContent = (editor) => {
  let jsonState = null;
  let htmlContent = null;

  if (!editor) {
    return { jsonState, htmlContent };
  }

  editor.getEditorState().read(() => {
    const root = $getRoot();

    // Get HTML
    htmlContent = $generateHtmlFromNodes(editor, null);

    // Get JSON state
    jsonState = JSON.stringify(editor.getEditorState().toJSON());
  });

  return { jsonState, htmlContent };
};
