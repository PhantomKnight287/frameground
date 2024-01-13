import { readFileSync, readdirSync, statSync } from "fs";
import { prisma } from "..";
import { type FileSystemTree } from "@webcontainer/api";
type ChallengeFilesStructure = FileSystemTree;
import { transpileModule } from "typescript";
import { Difficulty } from "@prisma/client";

export interface FrameGroundChallengeExport {
  files: ChallengeFilesStructure;
}

export type ChallengeJson = {
  author: Array<string>;
  description: string;
  difficulty: Difficulty;
  id: string;
  label: string;
  playground_needed: boolean;
  prerequisites: Array<string>;
  track_slug: string;
  created_at: string;
};

export async function saveChallengesToDb() {
  const tracks = await prisma.track.findMany({
    where: { status: { not: "coming_soon" } },
  });
  for (const track of tracks) {
    const challenges = readdirSync(
      `${process.cwd()}/../../challenges/${track.slug}`,
      {
        withFileTypes: true,
      }
    )
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    for (const challenge of challenges) {
      const challengeExists = await prisma.challenge.findFirst({
        where: { slug: challenge },
      });
      const challengeData: ChallengeJson = JSON.parse(
        readFileSync(
          `${process.cwd()}/../../challenges/${
            track.slug
          }/${challenge}/challenge.json`,
          "utf-8"
        )
      );
      const tests = readFileSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/index.spec.ts`,
        "utf-8"
      );
      const description = readFileSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.md`,
        "utf-8"
      );
      const challengeConfig = readFileSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.ts`,
        "utf-8"
      );
      const result = transpileModule(challengeConfig, {
        compilerOptions: {
          module: 1,
          target: 1,
        },
      });
      const challengeConfigObject: FrameGroundChallengeExport = eval(
        result.outputText
      );
      const challengeJsonStats = statSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/challenge.json`
      ).mtimeMs;

      const challengeTsStats = statSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.ts`
      ).mtimeMs;

      const challengeMdStats = statSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.md`
      ).mtimeMs;

      const challengeSpecStats = statSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/index.spec.ts`
      ).mtimeMs;

      const largest = Math.max(
        challengeJsonStats,
        challengeTsStats,
        challengeMdStats,
        challengeSpecStats
      );
      const needsUpdate =
        !challengeExists || largest > challengeExists.updatedAt.getTime();
      if (needsUpdate) {
        console.log(`Updating ${challenge}`);
        const _challenge = await prisma.challenge.update({
          where: {
            id: challengeExists.id,
          },
          data: {
            description: challengeData.description,
            difficulty: challengeData.difficulty,
            label: challengeData.label,
            playgroundNeeded: challengeData.playground_needed,
            prerequisites: challengeData.prerequisites,
            slug: challenge,
            track: { connect: { slug: track.slug } },
            info: description,
            tests,
            authors: {
              connect: challengeData.author.map((author) => ({
                username: author,
              })),
            },
            initialFiles: Object.keys(challengeConfigObject.files).map(
              (file) => ({
                name: file,
                info: JSON.stringify(challengeConfigObject.files[file]),
              })
            ),
          },
        });
      } else if (!challengeExists) {
        console.log(`Creating ${challenge}`);
        const _challenge = await prisma.challenge.create({
          data: {
            description: challengeData.description,
            difficulty: challengeData.difficulty,
            label: challengeData.label,
            playgroundNeeded: challengeData.playground_needed,
            prerequisites: challengeData.prerequisites,
            slug: challenge,
            track: { connect: { slug: track.slug } },
            info: description,
            tests,
            authors: {
              connect: challengeData.author.map((author) => ({
                username: author,
              })),
            },
            initialFiles: Object.keys(challengeConfigObject.files).map(
              (file) => ({
                name: file,
                info: JSON.stringify(challengeConfigObject.files[file]),
              })
            ),
          },
        });
      } else {
        console.log(`Skipping ${challenge}`);
      }
    }
  }
}

saveChallengesToDb();
