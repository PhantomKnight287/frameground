export type ChallengeFilesStructure = { name: string } & (
  | { type: "file"; content: string; editable?: boolean }
  | { type: "folder"; content: ChallengeFilesStructure[] }
);

export interface FrameGroundChallengeExport {
  files: ChallengeFilesStructure[];
}
