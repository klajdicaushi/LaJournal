/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import {
  $getTableAndElementByKey,
  $getTableColumnIndexFromTableCellNode,
  $getTableRowIndexFromTableCellNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableNode,
  getTableElement,
  TableNode,
} from "@lexical/table";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $getNearestNodeFromDOMNode, isHTMLElement } from "lexical";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getThemeSelector } from "../../utils/getThemeSelector";

const BUTTON_WIDTH_PX = 20;

function debounce(func, wait, options = {}) {
  let timeout;
  let maxTimeout;
  let lastCallTime;
  let lastInvokeTime = 0;
  let lastArgs;
  let lastThis;
  let result;

  const { maxWait } = options;
  const maxing = maxWait !== undefined;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    clearTimeout(id);
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = startTimer(timerExpired, wait);
    return invokeFunc(time);
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = startTimer(timerExpired, remainingWait(time));
    if (maxing) {
      cancelTimer(maxTimeout);
      maxTimeout = startTimer(timerExpired, maxWait);
    }
  }

  function trailingEdge(time) {
    timeout = undefined;
    if (maxing) {
      cancelTimer(maxTimeout);
      maxTimeout = undefined;
    }

    if (lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timeout !== undefined) {
      cancelTimer(timeout);
    }
    if (maxTimeout !== undefined) {
      cancelTimer(maxTimeout);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeout = maxTimeout = undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timeout = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === undefined) {
      timeout = startTimer(timerExpired, wait);
    }
    if (maxing && maxTimeout === undefined) {
      maxTimeout = startTimer(timerExpired, maxWait);
    }
    return result;
  }

  debounced.cancel = cancel;
  return debounced;
}

function useDebounce(fn, ms, maxWait) {
  const funcRef = useRef(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounce(
        (...args) => {
          if (funcRef.current) {
            funcRef.current(...args);
          }
        },
        ms,
        { maxWait }
      ),
    [ms, maxWait]
  );
}

function TableHoverActionsContainer({ anchorElem }) {
  const [editor, { getTheme }] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [isShownRow, setShownRow] = useState(false);
  const [isShownColumn, setShownColumn] = useState(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState(false);
  const [position, setPosition] = useState({});
  const tableSetRef = useRef(new Set());
  const tableCellDOMNodeRef = useRef(null);

  const debouncedOnMouseMove = useDebounce(
    (event) => {
      const { isOutside, tableDOMNode } = getMouseInfo(event, getTheme);

      if (isOutside) {
        setShownRow(false);
        setShownColumn(false);
        return;
      }

      if (!tableDOMNode) {
        return;
      }

      tableCellDOMNodeRef.current = tableDOMNode;

      let hoveredRowNode = null;
      let hoveredColumnNode = null;
      let tableDOMElement = null;

      editor.getEditorState().read(
        () => {
          const maybeTableCell = $getNearestNodeFromDOMNode(tableDOMNode);

          if ($isTableCellNode(maybeTableCell)) {
            const table = $findMatchingParent(maybeTableCell, (node) =>
              $isTableNode(node)
            );
            if (!$isTableNode(table)) {
              return;
            }

            tableDOMElement = getTableElement(
              table,
              editor.getElementByKey(table.getKey())
            );

            if (tableDOMElement) {
              const rowCount = table.getChildrenSize();
              const colCount = table.getChildAtIndex(0)?.getChildrenSize();

              const rowIndex =
                $getTableRowIndexFromTableCellNode(maybeTableCell);
              const colIndex =
                $getTableColumnIndexFromTableCellNode(maybeTableCell);

              if (rowIndex === rowCount - 1) {
                hoveredRowNode = maybeTableCell;
              } else if (colIndex === colCount - 1) {
                hoveredColumnNode = maybeTableCell;
              }
            }
          }
        },
        { editor }
      );

      if (tableDOMElement) {
        const {
          width: tableElemWidth,
          y: tableElemY,
          right: tableElemRight,
          left: tableElemLeft,
          bottom: tableElemBottom,
          height: tableElemHeight,
        } = tableDOMElement.getBoundingClientRect();

        // Adjust for using the scrollable table container
        const parentElement = tableDOMElement.parentElement;
        let tableHasScroll = false;
        if (
          parentElement &&
          parentElement.classList.contains(
            "PlaygroundEditorTheme__tableScrollableWrapper"
          )
        ) {
          tableHasScroll =
            parentElement.scrollWidth > parentElement.clientWidth;
        }
        const { y: editorElemY, left: editorElemLeft } =
          anchorElem.getBoundingClientRect();

        if (hoveredRowNode) {
          const isMac = /^mac/i.test(navigator.platform);

          setShownColumn(false);
          setShownRow(true);
          setPosition({
            height: BUTTON_WIDTH_PX,
            left:
              tableHasScroll && parentElement
                ? parentElement.offsetLeft
                : tableElemLeft - editorElemLeft,
            top:
              tableElemBottom -
              editorElemY +
              (tableHasScroll && !isMac ? 16 : 5),
            width:
              tableHasScroll && parentElement
                ? parentElement.offsetWidth
                : tableElemWidth,
          });
        } else if (hoveredColumnNode) {
          setShownColumn(true);
          setShownRow(false);
          setPosition({
            height: tableElemHeight,
            left: tableElemRight - editorElemLeft + 5,
            top: tableElemY - editorElemY,
            width: BUTTON_WIDTH_PX,
          });
        }
      }
    },
    50,
    250
  );

  // Hide the buttons on any table dimensions change to prevent last row cells
  // overlap behind the 'Add Row' button when text entry changes cell height
  const tableResizeObserver = useMemo(() => {
    return new ResizeObserver(() => {
      setShownRow(false);
      setShownColumn(false);
    });
  }, []);

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener("mousemove", debouncedOnMouseMove);

    return () => {
      setShownRow(false);
      setShownColumn(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener("mousemove", debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return mergeRegister(
      editor.registerMutationListener(
        TableNode,
        (mutations) => {
          editor.getEditorState().read(
            () => {
              let resetObserver = false;
              for (const [key, type] of mutations) {
                switch (type) {
                  case "created": {
                    tableSetRef.current.add(key);
                    resetObserver = true;
                    break;
                  }
                  case "destroyed": {
                    tableSetRef.current.delete(key);
                    resetObserver = true;
                    break;
                  }
                  default:
                    break;
                }
              }
              if (resetObserver) {
                // Reset resize observers
                tableResizeObserver.disconnect();
                for (const tableKey of tableSetRef.current) {
                  const { tableElement } = $getTableAndElementByKey(tableKey);
                  tableResizeObserver.observe(tableElement);
                }
                setShouldListenMouseMove(tableSetRef.current.size > 0);
              }
            },
            { editor }
          );
        },
        { skipInitialization: false }
      )
    );
  }, [editor, tableResizeObserver]);

  const insertAction = (insertRow) => {
    editor.update(() => {
      if (tableCellDOMNodeRef.current) {
        const maybeTableNode = $getNearestNodeFromDOMNode(
          tableCellDOMNodeRef.current
        );
        maybeTableNode?.selectEnd();
        if (insertRow) {
          $insertTableRowAtSelection();
          setShownRow(false);
        } else {
          $insertTableColumnAtSelection();
          setShownColumn(false);
        }
      }
    });
  };

  if (!isEditable) {
    return null;
  }

  return (
    <>
      {isShownRow && (
        <button
          className={`${getTheme()?.tableAddRows}`}
          style={{ ...position }}
          onClick={() => insertAction(true)}
        />
      )}
      {isShownColumn && (
        <button
          className={`${getTheme()?.tableAddColumns}`}
          style={{ ...position }}
          onClick={() => insertAction(false)}
        />
      )}
    </>
  );
}

function getMouseInfo(event, getTheme) {
  const target = event.target;
  const tableCellClass = getThemeSelector(getTheme, "tableCell");

  if (isHTMLElement(target)) {
    const tableDOMNode = target.closest(
      `td${tableCellClass}, th${tableCellClass}`
    );

    const isOutside = !(
      tableDOMNode ||
      target.closest(`button${getThemeSelector(getTheme, "tableAddRows")}`) ||
      target.closest(
        `button${getThemeSelector(getTheme, "tableAddColumns")}`
      ) ||
      target.closest("div.TableCellResizer__resizer")
    );

    return { isOutside, tableDOMNode };
  } else {
    return { isOutside: true, tableDOMNode: null };
  }
}

export default function TableHoverActionsPlugin({
  anchorElem = document.body,
}) {
  const isEditable = useLexicalEditable();

  return isEditable
    ? createPortal(
        <TableHoverActionsContainer anchorElem={anchorElem} />,
        anchorElem
      )
    : null;
}
