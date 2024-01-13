import { create } from "zustand";

interface EditorState {
  activeFile?: { type: "file"; name: string; path: string };
  setActiveFile: (file: { type: "file"; name: string; path: string }) => void;
}

export const useEditorFileState = create<EditorState>((set) => ({
  activeFile: undefined,
  setActiveFile(file) {
    set({ activeFile: file });
  },
}));
