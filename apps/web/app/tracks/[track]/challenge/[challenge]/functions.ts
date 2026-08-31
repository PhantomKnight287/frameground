import { FrameGroundChallengeExport } from "@repo/challenges/src";

export function generateFilePath(
  files: FrameGroundChallengeExport["files"],
  activeFileIndex: string
) {
  let path = "";
  const splitIndex = activeFileIndex.split(".");
  for (let i = 0; i < splitIndex.length; i++) {
    const index = splitIndex[i];
    const file = files[Number(index)];

    if (!file) {
      return "";
    }

    path += `/${file.name}`;

    if (file.type === "file" || i === splitIndex.length - 1) {
      break; // Stop if it's a file or the last segment
    }

    // Continue with the next level of the hierarchy
    files = file.content;
  }

  return path;
}

export function isFileEditable(
  files: FrameGroundChallengeExport["files"],
  activeFileIndex: string
) {
  let path = "";
  let isFileEditable = false;
  const splitIndex = activeFileIndex.split(".");
  for (let i = 0; i < splitIndex.length; i++) {
    const index = splitIndex[i];
    const file = files[Number(index)];

    if (!file) {
      return false;
    }

    path += `/${file.name}`;

    if (file.type === "file" || i === splitIndex.length - 1) {
      isFileEditable = (file as any).editable;
      break; // Stop if it's a file or the last segment
    }

    // Continue with the next level of the hierarchy
    files = file.content;
  }

  return isFileEditable;
}

/**
 * Resolves an index path (`"9.2"`) back to the entry it points at, so a file
 * restored from the url can be shown with its real name instead of its path.
 */
export function resolveFile(
  files: FrameGroundChallengeExport["files"],
  activeFileIndex: string
) {
  const splitIndex = activeFileIndex.split(".");
  let entry: FrameGroundChallengeExport["files"][number] | undefined;
  let current = files;

  for (const index of splitIndex) {
    entry = current[Number(index)];
    if (!entry) return undefined;
    if (entry.type === "folder") current = entry.content;
  }

  return entry?.type === "file" ? entry : undefined;
}
