import { Fragment, useState } from "react";
import {
  ChallengeFilesStructure,
  FrameGroundChallengeExport,
} from "@repo/challenges/src";
import { cn } from "../utils";
import File from "./file";
import { useEditorFileState } from "../state";

export default function Folder({
  folder,
  path,
  name,
  className,
  onClickFile,
  onClickFolder,
  fileClassName,
  folderCloseIcon,
  folderOpenIcon,
  filesContainerClassName,
}: {
  path: string;
  folder: FrameGroundChallengeExport["files"][0];
  name: string;
  className?: string;
  onClickFile?: (path: string) => void;
  onClickFolder?: (path: string) => void;
  fileClassName?: string;
  folderOpenIcon?: React.ReactNode;
  folderCloseIcon?: React.ReactNode;
  filesContainerClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeFile } = useEditorFileState();
  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <button
        className={cn("cursor-pointer", className)}
        onClick={toggleFolder}
      >
        {isOpen ? folderOpenIcon : folderCloseIcon}
        {name}
      </button>
      {isOpen && (
        <div>
          {(folder.content as ChallengeFilesStructure[]).map((item, index) => (
            <Fragment key={index}>
              {item.type === "file" ? (
                <div
                  data-active={activeFile?.path === `${path}.${index}`}
                  className={filesContainerClassName}
                >
                  <File
                    name={item.name}
                    path={`${path}.${index}`} // Generate the file's path
                    onClickFile={onClickFile}
                    className={fileClassName}
                    editable={item.editable}
                  />
                </div>
              ) : (
                <div className={filesContainerClassName}>
                  <Folder
                    folder={item}
                    path={`${path}.${index}`} // Generate the folder's path
                    onClickFile={onClickFile}
                    name={item.name}
                    className={className}
                    onClickFolder={onClickFolder}
                    fileClassName={fileClassName}
                    folderOpenIcon={folderOpenIcon}
                    folderCloseIcon={folderCloseIcon}
                    filesContainerClassName={filesContainerClassName}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
