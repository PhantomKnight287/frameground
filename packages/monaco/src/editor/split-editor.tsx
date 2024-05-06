"use client";

import { EditorProps, useMonaco } from "@monaco-editor/react";
import { setupTypeAcquisition } from "@typescript/ata";
import clsx from "clsx";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import ts from "typescript";
import { CodeEditor } from "./code-editor";

export interface SplitEditorProps extends EditorProps {
  activeFile: string;
  activeFilePath: string;
  initialPackages: string[];
}

export const hasImports = (code: string) => {
  const x = code.split("\n").filter((line) => line.trim().startsWith("import"));
  return x.length > 0;
};

export default function SplitEditor({
  className,
  onChange,
  onMount,
  onValidate,
  activeFile,
  activeFilePath,
  initialPackages,
  ...props
}: SplitEditorProps) {
  const monaco = useMonaco() as any;

  const monacoRef = useRef<typeof import("monaco-editor")>();

  useEffect(() => {
    monacoRef.current = monaco;
  }, [monaco]);

  const [ata] = useState(() =>
    setupTypeAcquisition({
      projectName: "Frameground",
      typescript: ts,
      logger: console,
      delegate: {
        receivedFile: (code, _path) => {
          if (!monacoRef.current) return;
          const path = `file://${_path}`;
          const uri = monacoRef.current?.Uri.parse(path);
          const model = monacoRef.current?.editor.getModel(uri);
          if (!model) {
            monacoRef.current?.languages.typescript.javascriptDefaults.addExtraLib(
              code,
              path
            );
            monacoRef.current?.editor.createModel(code, "javascript", uri);
            if (!path.includes("@types")) {
              const compilerOptions =
                monacoRef.current?.languages.typescript.javascriptDefaults.getCompilerOptions();
              const match = _path.match(/\/node_modules\/([^/]+)/);
              if (match) {
                const result = match[1];
                monacoRef.current?.languages.typescript.javascriptDefaults.setCompilerOptions(
                  {
                    ...compilerOptions,
                    paths: {
                      ...compilerOptions.paths,
                      [result]: [_path.replace("/", "")],
                    },
                  }
                );
              }
            }
          }
        },
        errorMessage: (message, error) => {
          console.error(message);
          console.error(error);
        },
      },
    })
  );

  const debouncedUserCodeAta = useRef(
    debounce((code: string) => ata(code), 1000)
  ).current;

  return (
    <div className={clsx("flex h-[calc(100%-_90px)] flex-col", className)}>
      <section
        id="code-editor"
        tabIndex={-1}
        className="h-full overflow-hidden focus:border focus:border-blue-500"
      >
        <CodeEditor
          {...props}
          onMount={async (_editor, monaco) => {
            monacoRef.current?.languages.typescript.javascriptDefaults.setEagerModelSync(
              true
            );
            monacoRef.current?.languages.typescript.typescriptDefaults.setEagerModelSync(
              true
            );

            monacoRef.current?.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSyntaxValidation: true,
              }
            );
            monacoRef.current?.languages.typescript.javascriptDefaults.setCompilerOptions(
              {
                allowNonTsExtensions: true,
                strict: true,
                target:
                  monacoRef.current?.languages.typescript.ScriptTarget.ESNext,
                strictNullChecks: true,
                moduleResolution:
                  monacoRef.current?.languages.typescript.ModuleResolutionKind
                    .NodeJs,
                allowSyntheticDefaultImports: true,
                outDir: "lib", // kills the override input file error,
                paths: {},
                baseUrl: ".",
              }
            );
            monacoRef.current?.languages.typescript.typescriptDefaults.setCompilerOptions(
              {
                allowNonTsExtensions: true,
                strict: true,
                target:
                  monacoRef.current?.languages.typescript.ScriptTarget.ESNext,
                strictNullChecks: true,
                moduleResolution:
                  monacoRef.current?.languages.typescript.ModuleResolutionKind
                    .NodeJs,
                allowSyntheticDefaultImports: true,
                outDir: "lib", // kills the override input file error,
                paths: {},
                baseUrl: ".",
              }
            );

            onMount?.(_editor, monaco);
          }}
          defaultValue={""}
          onChange={async (value, _changeEvent) => {
            const code = value ?? "";
            debouncedUserCodeAta(code);
            onChange?.(value, _changeEvent);
          }}
        />
      </section>
    </div>
  );
}
