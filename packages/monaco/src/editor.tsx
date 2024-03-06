"use client";

import { Editor, EditorProps, Monaco,  } from "@monaco-editor/react";
import { setupTypeAcquisition } from "@typescript/ata";
import { useCallback } from "react";
import ts from "typescript";

export default function MonacoEditor({
  activeFile,
  ...props
}: {
  activeFile: string;
} & EditorProps) {
  const reactTypes = useCallback(
    (intial: string, monaco: Monaco) =>
      setupTypeAcquisition({
        projectName: "Frameground",
        logger: console,
        typescript: ts,
        delegate: {
          receivedFile: (code: string, _path: string) => {
            const path = `file://${_path}`;
            const uri = monaco.Uri.parse(path);
            const model = monaco.editor.getModel(uri);
            if (!model) {
              monaco.languages.typescript.javascriptDefaults.addExtraLib(
                code,
                path
              );
              monaco.editor.createModel(code, "javascript", uri);
            }
          },
        },
      })(intial),
    []
  );
  return (
    <Editor
      key={activeFile}
      {...props}
      onMount={(_, monaco) => {
          // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          //     target:monaco.languages.typescript.ScriptTarget.ES2020,
          //     allowNonTsExtension:true,
          //     useDefineForClassFields:true,
          //     moduleResolution:monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          //     allowSyntheticDefaultImports:true,
          //     module:monaco.languages.typescript.ModuleKind.ESNext,
          // })
        reactTypes(`import react from "react"`, monaco);
      }}
    />
  );
}

export { useMonaco } from "@monaco-editor/react";
