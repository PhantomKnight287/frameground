'use client';

import {createTwoslashInlayProvider} from './twoslash';

import {EditorProps, useMonaco,} from '@monaco-editor/react';
import {setupTypeAcquisition} from '@typescript/ata';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import type * as monacoType from 'monaco-editor';
import {useEffect, useRef, useState} from 'react';
import ts from 'typescript';
import {CodeEditor} from './code-editor';
import {PrettierFormatProvider} from './prettier';

export const TESTS_PATH = 'file:///tests.ts';
export const USER_CODE_PATH = 'file:///user.ts';

export interface SplitEditorProps extends EditorProps {
    activeFile: string
}

export const hasImports = (code: string) => {
    const x = code.split('\n').filter((line) => line.trim().startsWith('import'));
    return x.length > 0;
};

const getActualCode = (code: string) =>
    code
        .split('\n')
        .filter((c) => !c.trim().startsWith('import'))
        .join('\n');

// million-ignore
export default function SplitEditor({className, onChange, onMount, onValidate, ...props}: SplitEditorProps) {
    const monaco = useMonaco()
    const wrapper = useRef<HTMLDivElement>(null);
    const monacoRef = useRef<typeof import('monaco-editor')>();
    const inlayHintsProviderDisposableRef = useRef<monacoType.IDisposable>();


    useEffect(() => {
        monacoRef.current = monaco;
    }, [monaco]);

    const [ata] = useState(() =>
        setupTypeAcquisition({
            projectName: 'Frameground Playground',
            typescript: ts,
            logger: console,
            delegate: {
                receivedFile: (code: string, _path: string) => {
                    if (!monacoRef.current) {
                        return;
                    }
                    const path = `file://${_path}`;
                    const uri = monacoRef.current.Uri.parse(path);
                    const model = monacoRef.current.editor.getModel(uri);
                    if (!model) {
                        monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(code, path);
                        monacoRef.current.editor.createModel(code, 'javascript', uri);
                        if (!path.includes("@types")) {
                            const compilerOptions = monacoRef.current.languages.typescript.javascriptDefaults.getCompilerOptions()
                            const match = _path.match(/\/node_modules\/([^/]+)/)
                            if (match) {
                                const result = match[1]
                                monacoRef.current.languages.typescript.javascriptDefaults.setCompilerOptions({
                                    ...compilerOptions,
                                    paths: {
                                        ...compilerOptions.paths,
                                        [result]: [
                                            _path.replace("/", "")
                                        ]
                                    }
                                })
                            }
                        }
                    }

                    const userCode =
                        monacoRef.current.editor
                            .getModel(monacoRef.current.Uri.parse(USER_CODE_PATH))
                            ?.getValue() ?? '';

                    const testCode =
                        monacoRef.current.editor
                            .getModel(monacoRef.current.Uri.parse(TESTS_PATH))
                            ?.getValue() ?? '';

                    if (hasImports(userCode)) {
                        monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(
                            getActualCode(userCode),
                            'file:///node_modules/@types/user.d.ts',
                        );
                        monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
                            getActualCode(userCode),
                            'file:///node_modules/@types/user.d.ts',
                        );
                    }

                    if (hasImports(testCode)) {
                        monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(
                            getActualCode(userCode),
                            'file:///node_modules/@types/user.d.ts',
                        );

                        monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
                            getActualCode(userCode),
                            'file:///node_modules/@types/user.d.ts',
                        );
                    }
                },
                errorMessage: (message, error) => {
                    console.log(message)
                    console.log(error)
                }
            },
        }),
    );

    const debouncedUserCodeAta = useRef(debounce((code: string) => ata(code), 1000)).current;
    return (
        <div className={clsx('flex h-[calc(100%-_90px)] flex-col', className)} ref={wrapper}>
            <section
                id="code-editor"
                tabIndex={-1}
                className="h-full overflow-hidden focus:border focus:border-blue-500"
            >
                <CodeEditor
                    className="overflow-hidden"
                    {...props}
                    onMount={async (_editor, monaco) => {
                        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
                        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

                        const model = monaco.editor.getModel(monaco.Uri.parse(USER_CODE_PATH))!;
                        const code = model.getValue();
                        debouncedUserCodeAta(code);

                        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                            allowNonTsExtensions: true,
                            strict: true,
                            target: monaco.languages.typescript.ScriptTarget.ESNext,
                            strictNullChecks: true,
                            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
                            allowSyntheticDefaultImports: true,
                            outDir: 'lib', // kills the override input file error,
                            paths: {}
                        });
                        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                            allowNonTsExtensions: true,
                            strict: true,
                            target: monaco.languages.typescript.ScriptTarget.ESNext,
                            strictNullChecks: true,
                            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
                            allowSyntheticDefaultImports: true,
                            outDir: 'lib', // kills the override input file error,
                            paths: {}
                        });

                        monaco.languages.registerDocumentFormattingEditProvider(
                            'javascript',
                            PrettierFormatProvider,
                        );
                        const getJsWorker = await monaco.languages.typescript.getJavaScriptWorker();
                        const getTsWorker = await monaco.languages.typescript.getTypeScriptWorker();

                        const tsWorker = await getTsWorker(model.uri);
                        const jsWorker = await getJsWorker(model.uri)
                        inlayHintsProviderDisposableRef.current = monaco.languages.registerInlayHintsProvider(
                            'javascript',
                            createTwoslashInlayProvider(monaco, jsWorker),
                        );
                        inlayHintsProviderDisposableRef.current = monaco.languages.registerInlayHintsProvider(
                            'typescript',
                            createTwoslashInlayProvider(monaco, tsWorker),
                        );

                        if (hasImports(code)) {
                            const actualCode = code
                                .split('\n')
                                .filter((c) => !c.trim().startsWith('import'))
                                .join('\n');
                            if (actualCode) {
                                monaco.languages.typescript.javascriptDefaults.setExtraLibs([
                                    {
                                        content: actualCode,
                                        filePath: 'file:///node_modules/@types/user.d.ts',
                                    },
                                ]);
                                monaco.languages.typescript.typescriptDefaults.setExtraLibs([
                                    {
                                        content: actualCode,
                                        filePath: 'file:///node_modules/@types/user.d.ts',
                                    },
                                ]);
                            }
                        }
                        onMount(_editor, monaco)
                    }}
                    defaultValue={""}
                    onChange={async (value, _changeEvent) => {
                        const code = value ?? '';
                        debouncedUserCodeAta(code);
                        if (hasImports(code)) {
                            const actualCode = code
                                .split('\n')
                                .filter((c) => !c.trim().startsWith('import'))
                                .join('\n');
                            if (actualCode) {
                                monaco?.languages.typescript.javascriptDefaults.setExtraLibs([
                                    {
                                        content: actualCode,
                                        filePath: 'file:///node_modules/@types/user.d.ts',
                                    },
                                ]);
                                monaco?.languages.typescript.typescriptDefaults.setExtraLibs([
                                    {
                                        content: actualCode,
                                        filePath: 'file:///node_modules/@types/user.d.ts',
                                    },
                                ]);
                            }
                        } else {
                            monaco?.languages.typescript.javascriptDefaults.addExtraLib(
                                '',
                                'file:///node_modules/@types/user.d.ts',
                            );
                            monaco?.languages.typescript.typescriptDefaults.addExtraLib(
                                '',
                                'file:///node_modules/@types/user.d.ts',
                            );
                        }
                        onChange(value, _changeEvent)
                    }}
                />
            </section>
        </div>
    );
}
