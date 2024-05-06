"use client";
import { Terminal as XtermTerminal } from "xterm";
import { TerminalProps } from ".";
import "xterm/css/xterm.css";
import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/utils";

export type { ITerminalOptions } from "xterm";

export function useTerminal({
  className,
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
  options,
}: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [terminal, setTerminal] = useState<XtermTerminal>();

  function setupTerminal() {
    if (terminal) return;
    const _terminal = new XtermTerminal(options);
    setTerminal(_terminal);
    if (addons) {
      addons.forEach((addon) => _terminal.loadAddon(addon));
    }
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
  }
  useEffect(() => {
    setupTerminal();
    if (ref.current && terminal) terminal.open(ref.current);
  }, [ref.current, terminal]);

  const TerminalElement = () => (
    <div className={cn("terminal", className)} ref={ref} />
  );

  return [TerminalElement, terminal] as const;
}
