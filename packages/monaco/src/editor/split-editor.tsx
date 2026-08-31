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

  const monacoRef = useRef<typeof import("monaco-editor") | undefined>(
    undefined
  );

  useEffect(() => {
    monacoRef.current = monaco;
  }, [monaco]);

  // The TypeScript language service lives at `monaco.languages.typescript` on
  // the runtime `monaco` object, but monaco-editor only ships its *typings*
  // under the top-level `typescript` namespace, so bridge the two here.
  const tsLanguages = () =>
    monacoRef.current?.languages.typescript as unknown as
      | typeof import("monaco-editor").typescript
      | undefined;

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
            tsLanguages()?.javascriptDefaults.addExtraLib(
              code,
              path
            );
            monacoRef.current?.editor.createModel(code, "javascript", uri);
            if (!path.includes("@types")) {
              const compilerOptions =
                tsLanguages()?.javascriptDefaults.getCompilerOptions();
              const match = _path.match(/\/node_modules\/([^/]+)/);
              if (match) {
                const result = match[1];
                tsLanguages()?.javascriptDefaults.setCompilerOptions(
                  {
                    ...compilerOptions,
                    paths: {
                      ...compilerOptions?.paths,
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
            tsLanguages()?.javascriptDefaults.setEagerModelSync(
              true
            );
            tsLanguages()?.typescriptDefaults.setEagerModelSync(
              true
            );

            tsLanguages()?.javascriptDefaults.setDiagnosticsOptions(
              {
                noSyntaxValidation: true,
              }
            );
            tsLanguages()?.javascriptDefaults.setCompilerOptions(
              {
                allowNonTsExtensions: true,
                strict: true,
                target:
                  tsLanguages()?.ScriptTarget.ESNext,
                strictNullChecks: true,
                moduleResolution:
                  tsLanguages()?.ModuleResolutionKind
                    .NodeJs,
                allowSyntheticDefaultImports: true,
                outDir: "lib", // kills the override input file error,
                paths: {},
                baseUrl: ".",
              }
            );
            tsLanguages()?.typescriptDefaults.setCompilerOptions(
              {
                allowNonTsExtensions: true,
                strict: true,
                target:
                  tsLanguages()?.ScriptTarget.ESNext,
                strictNullChecks: true,
                moduleResolution:
                  tsLanguages()?.ModuleResolutionKind
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
