'use client';

import lzstring from 'lz-string';
import type * as monaco from 'monaco-editor';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useResetEditor } from './editor-hooks';
import SplitEditor from './split-editor';
import { useLocalStorage } from './useLocalStorage';

export interface CodePanelProps {
    challenge: {
        id: number;
        code: string;
        slug: string;
        tests: string;
        tsconfig?: monaco.languages.typescript.CompilerOptions;
    };
    saveSubmission: (code: string, isSuccessful: boolean) => Promise<void>;
    submissionDisabled: boolean;
    settingsElement: React.ReactNode;
    updatePlaygroundTestsLocalStorage?: (code: string) => void;
    updatePlaygroundCodeLocalStorage?: (code: string) => void;
}

export type TsErrors = [
    SemanticDiagnostics: monaco.languages.typescript.Diagnostic[],
    SyntacticDiagnostics: monaco.languages.typescript.Diagnostic[],
    CompilerOptionsDiagnostics: monaco.languages.typescript.Diagnostic[],
];

export function CodePanel(props: CodePanelProps) {
    const params = useSearchParams();
    const pathname = usePathname();
    const isPlayground = pathname.includes('challenge');
    const [isTestPanelExpanded, setIsTestPanelExpanded] = useState(true);
    const [localStorageCode, setLocalStorageCode] = useLocalStorage(
        props.challenge.slug !== 'test-slug' ? `challenge-${props.challenge.slug}` : '',
        '',
    );


    const defaultCode =
        lzstring.decompressFromEncodedURIComponent(params.get('code') ?? '') ?? localStorageCode;

    const getDefaultCode = () => {
        if (!defaultCode) {
            return props.challenge.code;
        }

        return defaultCode;
    };

    const [code, setCode] = useState(() => getDefaultCode());
    useResetEditor().subscribe('resetCode', () => {
        setCode(props.challenge.code);
        setLocalStorageCode(props.challenge.code);
    });

    const [userEditorState, setUserEditorState] = useState<monaco.editor.IStandaloneCodeEditor>();
    const [monacoInstance, setMonacoInstance] = useState<typeof monaco>();
    return (
        <>
            <div className="sticky top-0 flex h-[40px] shrink-0 items-center justify-end gap-4 border-b border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
                {props.settingsElement}
            </div>
            <SplitEditor
                isTestsReadonly={!isPlayground}
                userEditorState={userEditorState}
                monaco={monacoInstance}
                expandTestPanel={isTestPanelExpanded}
                setIsTestPanelExpanded={setIsTestPanelExpanded}
                userCode={code}
                tsconfig={{}}
                onMount={{
                    user:async(editor,monaco)=>{
                        setMonacoInstance(monaco);
                        setUserEditorState(editor)
                    }
                }}

            />
        </>
    );
}