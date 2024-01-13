import { Fragment, useState } from "react";
import {
  ChallengeFilesStructure,
  FrameGroundChallengeExport,
} from "@repo/challenges/src";
import { cn } from "../utils";
import File from "./file";

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

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <button
        className={cn("cursor-pointer", className)}
        onClick={toggleFolder}
        data-active={isOpen}
      >
        {isOpen ? folderOpenIcon : folderCloseIcon}
        {name}
      </button>
      <div className={filesContainerClassName}>
        {isOpen && (
          <div data-active="true">
            {(folder.content as ChallengeFilesStructure[]).map(
              (item, index) => (
                <Fragment key={index}>
                  {item.type === "file" ? (
                    <File
                      name={item.name}
                      path={`${path}.${index}`} // Generate the file's path
                      onClickFile={onClickFile}
                      className={fileClassName}
                    />
                  ) : (
                    <Folder
                      folder={item}
                      path={`${path}.${index}`} // Generate the folder's path
                      onClickFile={onClickFile}
                      name={item.name}
                      className={className}
                      onClickFolder={onClickFolder}
                    />
                  )}
                </Fragment>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
