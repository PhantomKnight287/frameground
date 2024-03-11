'use client';

import type * as monaco from 'monaco-editor';
import React from 'react';

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

export function CodePanel(_props: CodePanelProps) {
    return null;
}