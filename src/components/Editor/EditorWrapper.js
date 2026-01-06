import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import Editor from "./Editor";

function EditorWrapper({
  onEditorReady,
  initialJSONState,
  initialHtmlContent,
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Load content into the editor if provided
  useEffect(() => {
    if (editor) {
      if (initialJSONState) {
        const jsonState = JSON.parse(initialJSONState);
        editor.setEditorState(editor.parseEditorState(jsonState));
        return;
      }

      if (initialHtmlContent) {
        editor.update(() => {
          // Clear existing content and set new content from HTML
          $getRoot()
            .getChildren()
            .forEach((n) => n.remove());
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtmlContent, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          console.log(dom, nodes);
          const paragraphNode = $createParagraphNode();
          nodes.forEach((n) => paragraphNode.append(n));
          $getRoot().append(paragraphNode);
        });
      }
    }
  }, [editor, initialJSONState, initialHtmlContent]);

  return <Editor />;
}

export default EditorWrapper;
