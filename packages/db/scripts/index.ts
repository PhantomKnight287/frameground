import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { prisma } from "..";
import { type FileSystemTree } from "@webcontainer/api";
type ChallengeFilesStructure = FileSystemTree;
import { transpileModule } from "typescript";
import { Difficulty, TestRunner } from "@prisma/client";

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
  setup_commands: Array<string>;
  test_runner: TestRunner;
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
      const jestConfigPath = `${process.cwd()}/../../challenges/${
        track.slug
      }/${challenge}/jest.config.ts`;

      const challengeTestFilePath_ts = `${process.cwd()}/../../challenges/${
        track.slug
      }/${challenge}/index.spec.ts`;
      const challengeTestFilePath_tsx = `${process.cwd()}/../../challenges/${
        track.slug
      }/${challenge}/index.spec.tsx`;

      const challengeData: ChallengeJson = JSON.parse(
        readFileSync(
          `${process.cwd()}/../../challenges/${
            track.slug
          }/${challenge}/challenge.json`,
          "utf-8"
        )
      );
      const tests = existsSync(challengeTestFilePath_ts)
        ? readFileSync(challengeTestFilePath_ts, "utf-8")
        : readFileSync(challengeTestFilePath_tsx, "utf-8");
      const description = readFileSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.md`,
        "utf-8"
      );
      const challengeConfig = readFileSync(
        `${process.cwd()}/../../challenges/${track.slug}/${challenge}/index.ts`,
        "utf-8"
      );
      const terminalConfig = readFileSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/terminal.ts`,
        "utf-8"
      );
      const jestConfig = existsSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/jest.config.ts`
      )
        ? readFileSync(jestConfigPath, "utf-8")
        : undefined;

      const terminalConfigResult = transpileModule(terminalConfig, {
        compilerOptions: {
          module: 1,
          target: 1,
        },
      });
      const result = transpileModule(challengeConfig, {
        compilerOptions: {
          module: 1,
          target: 1,
        },
      });
      const jestResult = jestConfig
        ? transpileModule(jestConfig, {
            compilerOptions: {
              module: 1,
              target: 1,
            },
          })
        : undefined;
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

      const challengeSpecStats = existsSync(challengeTestFilePath_ts)
        ? statSync(challengeTestFilePath_ts).mtimeMs
        : statSync(challengeTestFilePath_tsx).mtimeMs;

      const challengeTerminalStats = statSync(
        `${process.cwd()}/../../challenges/${
          track.slug
        }/${challenge}/terminal.ts`
      ).mtimeMs;

      const challengeJestStats = existsSync(jestConfigPath)
        ? statSync(jestConfigPath).mtimeMs
        : undefined;
      const largest = Math.max(
        ...[
          challengeJsonStats,
          challengeTsStats,
          challengeMdStats,
          challengeSpecStats,
          challengeTerminalStats,
          challengeJestStats,
        ].filter((v) => v !== undefined)
      );

      const needsUpdate =
        !challengeExists ||
        largest >
          (challengeExists.updatedAt || challengeExists.createdAt).getTime();

      if (needsUpdate && challengeExists) {
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
            terminalConfig: eval(terminalConfigResult.outputText),
            tests,
            jestConfig: jestConfig ? eval(jestResult.outputText) : undefined,
            commands: challengeData.setup_commands,
            authors: {
              set: challengeData.author,
            },
            initialFiles: challengeConfigObject.files as any,
            testRunner: challengeData.test_runner,
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
            jestConfig: jestConfig ? eval(jestResult.outputText) : undefined,
            terminalConfig: eval(terminalConfigResult.outputText),
            authors: {
              set: challengeData.author,
            },
            initialFiles: challengeConfigObject.files as any,
            testRunner: challengeData.test_runner,
            commands: challengeData.setup_commands,
          },
        });
      } else {
        console.log(`Skipping ${challenge}`);
      }
    }
  }
}

export async function saveTracksToDb() {
  const tracks = readdirSync(`${process.cwd()}/../../challenges`, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .filter(
      (dir) =>
        ["dist", ".turbo", "node_modules", "src"].includes(
          dir.name.toLowerCase()
        ) === false
    )
    .map((dirent) => dirent.name);
  for (const track of tracks) {
    const trackConfig = JSON.parse(
      readFileSync(
        `${process.cwd()}/../../challenges/${track}/track.json`,
        "utf-8"
      )
    );
    const trackExists = await prisma.track.findFirst({
      where: { slug: track },
    });
    delete trackConfig["$schema"];
    if (trackExists) {
      console.log(`Updating ${track}`);
      await prisma.track.update({
        where: { id: trackExists.id },
        data: { ...trackConfig },
      });
    } else {
      console.log(`Creating ${track}`);
      await prisma.track.create({ data: { slug: track, ...trackConfig } });
    }
  }
}
saveTracksToDb().then(() => {
  saveChallengesToDb().then(() => {});
});
