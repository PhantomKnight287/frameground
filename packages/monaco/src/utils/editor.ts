import { FrameGroundChallengeExport } from "@repo/challenges/src";

export function getNestedPath(oldData: any, path: string) {
  return oldData[path];
}

export function getActiveFileContent(
  files: FrameGroundChallengeExport["files"],
  path: string
) {
  if (path.includes(".")) {
    const splittedPath = path.split(".");
    let data = undefined;
    for (const path of splittedPath) {
      if (data) {
        data = getNestedPath(data, path).content;
      } else {
        data = getNestedPath(files, path).content;
      }
    }
    return data;
  } else {
    return files[path].content;
  }
}
