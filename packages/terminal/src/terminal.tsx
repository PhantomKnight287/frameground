"use client";
import { Terminal as XtermTerminal } from "@xterm/xterm";
import { TerminalProps } from ".";
import "@xterm/xterm/css/xterm.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@repo/utils";

export type { ITerminalOptions } from "@xterm/xterm";

export function useTerminal(props: TerminalProps) {
  const { className } = props;

  // The terminal is built once, from whatever the props were at that moment.
  // Reading them through a ref keeps a re-render with new inline options or
  // handlers from being able to disturb a live session.
  const latest = useRef(props);
  latest.current = props;

  const instance = useRef<XtermTerminal>(undefined);
  const [terminal, setTerminal] = useState<XtermTerminal>();

  /**
   * A ref callback rather than an effect, because the element is what this has
   * to react to. `useEffect(..., [ref.current])` cannot do that: assigning to a
   * ref does not schedule a render, so the effect only ever sees the node by
   * luck of some other state update happening afterwards.
   */
  const attach = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    let _terminal = instance.current;

    if (!_terminal) {
      const {
        options,
        addons,
        customKeyEventHandler,
        onBinary,
        onCursorMove,
        onData,
        onKey,
        onLineFeed,
        onRender,
        onResize,
        onScroll,
        onSelectionChange,
        onTitleChange,
      } = latest.current;

      _terminal = new XtermTerminal(options);
      addons?.forEach((addon) => _terminal!.loadAddon(addon));

      if (onBinary) _terminal.onBinary(onBinary);
      if (onCursorMove) _terminal.onCursorMove(onCursorMove);
      if (onData) _terminal.onData(onData);
      if (onKey) _terminal.onKey(onKey);
      if (onLineFeed) _terminal.onLineFeed(onLineFeed);
      if (onRender) _terminal.onRender(onRender);
      if (onResize) _terminal.onResize(onResize);
      if (onScroll) _terminal.onScroll(onScroll);
      if (onSelectionChange) _terminal.onSelectionChange(onSelectionChange);
      if (onTitleChange) _terminal.onTitleChange(onTitleChange);
      if (customKeyEventHandler)
        _terminal.attachCustomKeyEventHandler(customKeyEventHandler);

      instance.current = _terminal;
      _terminal.open(node);
    } else if (_terminal.element && _terminal.element.parentElement !== node) {
      // `open()` is a no-op once a terminal has been opened - it returns early
      // instead of moving to the new parent - so a terminal whose container was
      // replaced would render into a detached node and go black, taking its
      // input with it. Re-parent the element it already built instead.
      node.appendChild(_terminal.element);
    }

    // Only ever the same instance, so React bails out after the first call.
    setTerminal(_terminal);
  }, []);

  /**
   * Defining this inline in the hook body would give it a new identity on every
   * render, and React unmounts a subtree whose component type changed. That
   * would destroy the container the terminal is attached to - hence the memo.
   */
  const TerminalElement = useMemo(
    () =>
      function TerminalElement() {
        return <div className={cn("terminal", className)} ref={attach} />;
      },
    [attach, className]
  );

  return [TerminalElement, terminal] as const;
}
