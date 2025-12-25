import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

import { defineExtension } from "lexical";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { TableContext } from "./plugins/TablePlugin";
import { ToolbarContext } from "./context/ToolbarContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { FlashMessageContext } from "./context/FlashMessageContext";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import Editor from "./Editor";
import { buildHTMLConfig } from "./buildHTMLConfig";

import "./index.css";

function EditorComposer() {
  const theme = useTheme();
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
    <div className={`editor-theme-${theme.palette.mode}`}>
      <FlashMessageContext>
        <LexicalExtensionComposer extension={app} contentEditable={null}>
          <SharedHistoryContext>
            <TableContext>
              <ToolbarContext>
                <Editor />
              </ToolbarContext>
            </TableContext>
          </SharedHistoryContext>
        </LexicalExtensionComposer>
      </FlashMessageContext>
    </div>
  );
}

export default EditorComposer;
