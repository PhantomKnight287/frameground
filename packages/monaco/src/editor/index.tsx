'use client';

import type * as monaco from 'monaco-editor';
import React from 'react';

export interface CodePanelProps {
    challenge: {
        id: number;
        code: string;
        slug: string;
        tests: string;
        tsconfig?: monaco.typescript.CompilerOptions;
    };
    saveSubmission: (code: string, isSuccessful: boolean) => Promise<void>;
    submissionDisabled: boolean;
    settingsElement: React.ReactNode;
    updatePlaygroundTestsLocalStorage?: (code: string) => void;
    updatePlaygroundCodeLocalStorage?: (code: string) => void;
}

export type TsErrors = [
    SemanticDiagnostics: monaco.typescript.Diagnostic[],
    SyntacticDiagnostics: monaco.typescript.Diagnostic[],
    CompilerOptionsDiagnostics: monaco.typescript.Diagnostic[],
];

export function CodePanel(_props: CodePanelProps) {
    return null;
}