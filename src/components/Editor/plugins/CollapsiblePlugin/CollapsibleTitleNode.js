/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IS_CHROME } from "@lexical/utils";
import {
  $createParagraphNode,
  $isElementNode,
  buildImportMap,
  ElementNode,
} from "lexical";

import { $isCollapsibleContainerNode } from "./CollapsibleContainerNode";
import { $isCollapsibleContentNode } from "./CollapsibleContentNode";

export function $convertSummaryElement(domNode) {
  const node = $createCollapsibleTitleNode();
  return {
    node,
  };
}

/** @noInheritDoc */
export class CollapsibleTitleNode extends ElementNode {
  /** @internal */
  $config() {
    return this.config("collapsible-title", {
      $transform(node) {
        if (node.isEmpty()) {
          node.remove();
        }
      },
      extends: ElementNode,
      importDOM: buildImportMap({
        summary: () => ({
          conversion: $convertSummaryElement,
          priority: 1,
        }),
      }),
    });
  }

  createDOM(config, editor) {
    const dom = document.createElement("summary");
    dom.classList.add("Collapsible__title");
    if (IS_CHROME) {
      dom.addEventListener("click", () => {
        editor.update(() => {
          const collapsibleContainer = this.getLatest().getParentOrThrow();
          if (!$isCollapsibleContainerNode(collapsibleContainer)) {
            throw new Error(
              "Expected parent node to be a CollapsibleContainerNode"
            );
          }
          collapsibleContainer.toggleOpen();
        });
      });
    }
    return dom;
  }

  updateDOM(prevNode, dom) {
    return false;
  }

  insertNewAfter(_, restoreSelection = true) {
    const containerNode = this.getParentOrThrow();

    if (!$isCollapsibleContainerNode(containerNode)) {
      throw new Error(
        "CollapsibleTitleNode expects to be child of CollapsibleContainerNode"
      );
    }

    if (containerNode.getOpen()) {
      const contentNode = this.getNextSibling();
      if (!$isCollapsibleContentNode(contentNode)) {
        throw new Error(
          "CollapsibleTitleNode expects to have CollapsibleContentNode sibling"
        );
      }

      const firstChild = contentNode.getFirstChild();
      if ($isElementNode(firstChild)) {
        return firstChild;
      } else {
        const paragraph = $createParagraphNode();
        contentNode.append(paragraph);
        return paragraph;
      }
    } else {
      const paragraph = $createParagraphNode();
      containerNode.insertAfter(paragraph, restoreSelection);
      return paragraph;
    }
  }
}

export function $createCollapsibleTitleNode() {
  return new CollapsibleTitleNode();
}

export function $isCollapsibleTitleNode(node) {
  return node instanceof CollapsibleTitleNode;
}
