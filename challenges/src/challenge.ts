import { readFileSync, readdirSync } from "fs";
import { FrameGroundChallengeExport } from ".";

export type ChallengeJson = {
  author: Array<string>;
  description: string;
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Extreme";
  id: string;
  label: string;
  playground_needed: boolean;
  prerequisites: Array<string>;
  track_slug: string;
  created_at: string;
};

export async function getChallenge(
  trackSlug: string,
  challengeSlug: string,
  loadMetadata = false
) {
  const basePath = `${import.meta.url
    .replace("file:///", "")
    .replace("file://", "")
    .replace("src/challenge.ts", "")}challenges/${trackSlug}/${challengeSlug}`;
  const challengeJsonPath = `${basePath}/challenge.json`;
  const configPath = `${basePath}/index.ts`;
  const descriptionPath = `${basePath}/index.md`;
  const testsPath = `${basePath}/index.spec.ts`;
  if (loadMetadata === true) {
    const metadata: ChallengeJson = JSON.parse(
      readFileSync(challengeJsonPath, "utf-8")
    );
    return metadata;
  }
  const configFileContent = readFileSync(configPath, "utf-8").replace(
    /(\r\n|\n|\r)/gm,
    ""
  );
  const config: FrameGroundChallengeExport = await import(
    `data:text/javascript;base64,${Buffer.from(configFileContent).toString(
      "base64"
    )}`
  );
  const challengeMarkdownDescription = readFileSync(descriptionPath, "utf-8");

  const tests = readFileSync(testsPath, "utf-8");
  return { config, description: challengeMarkdownDescription, tests };
}

export async function getChallenges(trackSlug: string) {
  const basePath = `${import.meta.url
    .replace("file:///", "")
    .replace("src/challenge.ts", "")}challenges/${trackSlug}`;

  const challenges = await Promise.all(
    readdirSync(basePath).map(async (challengeSlug) => {
      const challenge: ChallengeJson = (await getChallenge(
        trackSlug,
        challengeSlug,
        true
      )) as any;
      return { challenge, slug: challengeSlug };
    })
  );
  return challenges;
}
