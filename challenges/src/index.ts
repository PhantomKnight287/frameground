export type ChallengeFilesStructure = { name: string } & (
  | { type: "file"; content: string; editable?: boolean; name: string }
  | { type: "folder"; content: ChallengeFilesStructure[]; name: string }
);

export interface FrameGroundChallengeExport {
  files: ChallengeFilesStructure[];
}
