/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./index.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
} from "lexical";
import * as React from "react";
import { useEffect } from "react";

function PageBreakComponent({ nodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          const pbElem = editor.getElementByKey(nodeKey);

          if (event.target === pbElem) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, setSelected]);

  useEffect(() => {
    const pbElem = editor.getElementByKey(nodeKey);
    if (pbElem !== null) {
      pbElem.className = isSelected ? "selected" : "";
    }
  }, [editor, isSelected, nodeKey]);

  return null;
}

export class PageBreakNode extends DecoratorNode {
  static getType() {
    return "page-break";
  }

  static clone(node) {
    return new PageBreakNode(node.__key);
  }

  static importJSON(serializedNode) {
    return $createPageBreakNode().updateFromJSON(serializedNode);
  }

  static importDOM() {
    return {
      figure: (domNode) => {
        const tp = domNode.getAttribute("type");
        if (tp !== this.getType()) {
          return null;
        }

        return {
          conversion: $convertPageBreakElement,
          priority: COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  createDOM() {
    const el = document.createElement("figure");
    el.style.pageBreakAfter = "always";
    el.setAttribute("type", this.getType());
    return el;
  }

  getTextContent() {
    return "\n";
  }

  isInline() {
    return false;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <PageBreakComponent nodeKey={this.__key} />;
  }
}

function $convertPageBreakElement() {
  return { node: $createPageBreakNode() };
}

export function $createPageBreakNode() {
  return new PageBreakNode();
}

export function $isPageBreakNode(node) {
  return node instanceof PageBreakNode;
}
