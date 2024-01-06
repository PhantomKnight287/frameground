import { readFileSync, readdirSync } from "fs";
import { FrameGroundChallengeExport } from ".";
export async function getChallenge(
  trackSlug: string,
  challengeSlug: string,
  loadMetadata = false
) {
  const basePath = `${import.meta.url
    .replace("file:///", "")
    .replace("src/challenge.ts", "")}challenges/${trackSlug}/${challengeSlug}`;
  const challengeJsonPath = `${basePath}/challenge.json`;
  const configPath = `${basePath}/index.ts`;
  const descriptionPath = `${basePath}/index.md`;
  const testsPath = `${basePath}/index.spec.ts`;
  if (loadMetadata) {
    const metadata = JSON.parse(readFileSync(challengeJsonPath, "utf-8"));
    return metadata;
  }
  const config: FrameGroundChallengeExport = await import(configPath);
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
      const challenge = await getChallenge(trackSlug, challengeSlug, true);
      return { challenge, slug: challengeSlug };
    })
  );
  return challenges;
}
