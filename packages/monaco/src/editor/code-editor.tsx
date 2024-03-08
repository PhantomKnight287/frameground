'use client';

import Editor, { type EditorProps } from '@monaco-editor/react';
import { useMemo } from 'react';
import { useEditorSettingsStore } from './settings-store';


const DEFAULT_OPTIONS = {
    fixedOverflowWidgets: true,
    lineNumbers: 'on',
    tabSize: 2,
    insertSpaces: false,
    minimap: {
        enabled: false,
    },
    fontSize: 16,
} as const satisfies EditorProps['options'];

export type CodeEditorProps = Omit<EditorProps, 'theme'>;

export function CodeEditor({ onChange, onMount, options, value, ...props }: CodeEditorProps) {
    const editorTheme =  'vs-dark';
    const { settings } = useEditorSettingsStore();
    const editorOptions = useMemo(() => {
        return {
            ...DEFAULT_OPTIONS,
            ...settings,
            fontSize: parseInt(settings.fontSize),
            tabSize: parseInt(settings.tabSize),
            ...options,
        };
    }, [options, settings]);

    return (
        <Editor
            {...props}
            defaultLanguage="javascript"
            onChange={onChange}
            onMount={onMount}
            options={editorOptions}
            theme={editorTheme}
            value={value}
        />
    );
}