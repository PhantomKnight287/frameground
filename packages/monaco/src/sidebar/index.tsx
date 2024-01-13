"use client";
import { Fragment } from "react";
import File from "./file";
import Folder from "./folder";
import { FrameGroundChallengeExport } from "@repo/challenges/src";

export default function Sidebar({
  data,
  onClickFile,
  onClickFolder,
  fileClassName,
  folderClassName,
  className,
  folderOpenIcon,
  folderCloseIcon,
  fileContainerClassName,
}: {
  data: FrameGroundChallengeExport["files"];
  onClickFile?: (path: string) => void;
  onClickFolder?: (path: string) => void;
  fileClassName?: string;
  folderClassName?: string;
  className?: string;
  folderOpenIcon?: React.ReactNode;
  folderCloseIcon?: React.ReactNode;
  fileContainerClassName?: string;
}) {
  return (
    <div className={(className)}>
      {data.map((item, index) => (
        <Fragment key={index}>
          {item.type === "file" ? (
            <File
              name={item.name}
              path={`${index}`} // Generate the file's path
              onClickFile={onClickFile}
              className={fileClassName}
              key={`${index}`}
            />
          ) : (
            <Folder
              folder={item}
              path={`${index}`}
              onClickFile={onClickFile}
              name={item.name}
              onClickFolder={onClickFolder}
              className={folderClassName}
              fileClassName={fileClassName}
              folderOpenIcon={folderOpenIcon}
              folderCloseIcon={folderCloseIcon}
              filesContainerClassName={fileContainerClassName}
              key={`${index}`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
