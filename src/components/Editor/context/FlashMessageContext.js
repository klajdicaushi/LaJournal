/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import FlashMessage from "../ui/FlashMessage";

const Context = createContext | (undefined > undefined);
const INITIAL_STATE = {};
const DEFAULT_DURATION = 1000;

export const FlashMessageContext = ({ children }) => {
  const [props, setProps] = useState(INITIAL_STATE);
  const showFlashMessage = useCallback(
    (message, duration) =>
      setProps(message ? { duration, message } : INITIAL_STATE),
    []
  );
  useEffect(() => {
    if (props.message) {
      const timeoutId = setTimeout(
        () => setProps(INITIAL_STATE),
        props.duration ?? DEFAULT_DURATION
      );
      return () => clearTimeout(timeoutId);
    }
  }, [props]);
  return (
    <Context.Provider value={showFlashMessage}>
      {children}
      {props.message && <FlashMessage>{props.message}</FlashMessage>}
    </Context.Provider>
  );
};

export const useFlashMessageContext = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("Missing FlashMessageContext");
  }
  return ctx;
};
