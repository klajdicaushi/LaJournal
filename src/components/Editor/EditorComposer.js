import { useMemo } from "react";

import { defineExtension } from "lexical";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { TableContext } from "./plugins/TablePlugin";
import { ToolbarContext } from "./context/ToolbarContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { FlashMessageContext } from "./context/FlashMessageContext";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { buildHTMLConfig } from "./buildHTMLConfig";
import EditorWrapper from "./EditorWrapper";

import "./index.css";

function EditorComposer({ onEditorReady, initialJSONState, initialHtmlContent }) {
  const app = useMemo(
    () =>
      defineExtension({
        $initialEditorState: undefined,
        html: buildHTMLConfig(),
        name: "@lexical/playground",
        namespace: "Playground",
        nodes: PlaygroundNodes,
        theme: PlaygroundEditorTheme,
      }),
    []
  );

  return (
      <FlashMessageContext>
        <LexicalExtensionComposer extension={app} contentEditable={null}>
          <SharedHistoryContext>
            <TableContext>
              <ToolbarContext>
                <EditorWrapper
                  onEditorReady={onEditorReady}
                  initialJSONState={initialJSONState}
                  initialHtmlContent={initialHtmlContent}
                />
              </ToolbarContext>
            </TableContext>
          </SharedHistoryContext>
        </LexicalExtensionComposer>
      </FlashMessageContext>
  );
}

export default EditorComposer;
