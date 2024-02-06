"use client";

import { Editor, EditorProps } from "@monaco-editor/react";

export default function MonacoEditor({
  activeFile,
  ...props
}: {
  activeFile: string;
} & EditorProps) {
  return <Editor key={activeFile} {...props} />;
}

export { useMonaco } from "@monaco-editor/react";
