export type ChallengeFilesStructure = {
  name: string;
  /**
   * Display hint for the file tree: pinned entries are kept at the top, in the
   * order they were given, instead of being sorted with the rest.
   */
  pinned?: boolean;
} & (
  | { type: "file"; content: string; editable?: boolean }
  | { type: "folder"; content: ChallengeFilesStructure[] }
);

export interface FrameGroundChallengeExport {
  files: ChallengeFilesStructure[];
}
