import { type FileSystemTree } from "@webcontainer/api";
type ChallengeFilesStructure = FileSystemTree;

export interface FrameGroundChallengeExport {
  files: ChallengeFilesStructure;
}
