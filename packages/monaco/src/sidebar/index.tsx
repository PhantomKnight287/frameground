"use client";

import { useMemo } from "react";
import File from "./file";
import Folder from "./folder";
import { FrameGroundChallengeExport } from "@repo/challenges/src";
import { cn } from "../utils";
import { sortEntries } from "./tree";

export { sortEntries, type TreeEntry } from "./tree";

export default function Sidebar({
  data,
  onClickFile,
  onClickFolder,
  className,
}: {
  data: FrameGroundChallengeExport["files"];
  onClickFile?: (path: string) => void;
  onClickFolder?: (path: string) => void;
  className?: string;
}) {
  const entries = useMemo(() => sortEntries(data), [data]);

  return (
    <div
      role="tree"
      aria-label="Challenge files"
      className={cn("flex select-none flex-col py-1 text-[13px]", className)}
    >
      {entries.map((entry) =>
        entry.type === "file" ? (
          <File
            key={entry.index}
            name={entry.name}
            path={`${entry.index}`}
            depth={0}
            editable={entry.editable}
            onClickFile={onClickFile}
          />
        ) : (
          <Folder
            key={entry.index}
            folder={entry}
            name={entry.name}
            path={`${entry.index}`}
            depth={0}
            onClickFile={onClickFile}
            onClickFolder={onClickFolder}
          />
        )
      )}
    </div>
  );
}
