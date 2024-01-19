import { create } from "zustand";

interface EditorState {
  activeFile?: { type: "file"; name: string; path: string; editable?: boolean };
  setActiveFile: (file: {
    type: "file";
    name: string;
    path: string;
    editable?: boolean;
  }) => void;
}

export const useEditorFileState = create<EditorState>((set) => ({
  activeFile: undefined,
  setActiveFile(file) {
    set({ activeFile: file });
  },
}));
