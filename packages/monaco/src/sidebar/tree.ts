import { ChallengeFilesStructure } from "@repo/challenges/src";
import { cn } from "../utils";

/**
 * A tree entry paired with its index in the array it came from. Paths are built
 * out of those indices (`"3.1"` is the second child of the fourth entry), so the
 * index has to survive sorting - it is how every other part of the editor
 * identifies a file.
 */
export type TreeEntry = ChallengeFilesStructure & { index: number };

/** Pinned entries first, then folders, then files, each group alphabetically. */
export function sortEntries(items: ChallengeFilesStructure[]): TreeEntry[] {
  return items
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.pinned && b.pinned) return a.index - b.index;
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

/** How much each level of nesting indents a row's content. */
export const INDENT = 12;

/**
 * Shared row styling for files and folders.
 *
 * The indent is padding on a full width row rather than a margin, so the active
 * highlight always spans the whole sidebar - however deeply the file is nested.
 */
export const rowClassName = cn(
  "group relative flex h-7 w-full items-center gap-1.5 pr-2 text-left",
  "text-muted-foreground transition-colors",
  "hover:bg-foreground/5 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
  "data-[active=true]:bg-foreground/10 data-[active=true]:text-foreground",
  "data-[active=true]:before:absolute data-[active=true]:before:inset-y-0",
  "data-[active=true]:before:left-0 data-[active=true]:before:w-0.5",
  "data-[active=true]:before:bg-primary"
);

export const indentStyle = (depth: number) => ({
  paddingLeft: `${depth * INDENT + 8}px`,
});
