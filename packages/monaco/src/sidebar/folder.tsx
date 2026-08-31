import { Fragment, useEffect, useMemo, useState } from "react";
import { ChallengeFilesStructure } from "@repo/challenges/src";
import { cn } from "../utils";
import File from "./file";
import { useEditorFileState } from "../state";
import { Chevron, FolderIcon } from "./icons";
import { indentStyle, rowClassName, sortEntries } from "./tree";

export default function Folder({
  folder,
  path,
  name,
  depth = 0,
  className,
  onClickFile,
  onClickFolder,
}: {
  path: string;
  folder: ChallengeFilesStructure;
  name: string;
  depth?: number;
  className?: string;
  onClickFile?: (path: string) => void;
  onClickFolder?: (path: string) => void;
}) {
  const { activeFile } = useEditorFileState();
  // paths are dot separated indices, so a descendant's path starts with ours
  const holdsActiveFile = activeFile?.path?.startsWith(`${path}.`) ?? false;
  const [isOpen, setIsOpen] = useState(holdsActiveFile);

  // the active file can be restored from the url after the tree has mounted
  useEffect(() => {
    if (holdsActiveFile) setIsOpen(true);
  }, [holdsActiveFile]);

  const entries = useMemo(
    () => sortEntries(folder.content as ChallengeFilesStructure[]),
    [folder.content]
  );

  const toggleFolder = () => {
    setIsOpen((open) => !open);
    onClickFolder?.(path);
  };

  return (
    <div>
      <button
        type="button"
        role="treeitem"
        aria-expanded={isOpen}
        aria-level={depth + 1}
        title={name}
        onClick={toggleFolder}
        style={indentStyle(depth)}
        className={cn(rowClassName, className)}
      >
        <Chevron open={isOpen} />
        <FolderIcon open={isOpen} />
        <span className="truncate">{name}</span>
      </button>
      {isOpen ? (
        <div role="group">
          {entries.map((item) => (
            <Fragment key={item.index}>
              {item.type === "file" ? (
                <File
                  name={item.name}
                  path={`${path}.${item.index}`}
                  depth={depth + 1}
                  onClickFile={onClickFile}
                  editable={item.editable}
                />
              ) : (
                <Folder
                  folder={item}
                  path={`${path}.${item.index}`}
                  name={item.name}
                  depth={depth + 1}
                  onClickFile={onClickFile}
                  onClickFolder={onClickFolder}
                  className={className}
                />
              )}
            </Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}
