import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

import Editor from "./_page.client";
import {
  ChallengeFilesStructure,
  FrameGroundChallengeExport,
} from "@repo/challenges/src";
import { FileSystemTree } from "@repo/containers";
import { Metadata } from "next";
import Comments from "./solved/_components/comments";
import Solutions from "./solved/_components/solutions";
import { auth } from "@/auth";
import { siteMetadataConfig } from "@repo/config";

export async function generateMetadata({
  params,
}: PageProps<"/tracks/[track]/challenge/[challenge]">): Promise<Metadata> {
  const awaited = await params
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: awaited.challenge,
      track: {
        slug: awaited.track,
      },
    },
    include: {
      track: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    title: `${challenge?.label} | ${challenge?.track!.name}`,
    description: challenge?.description,
    twitter: siteMetadataConfig.twitter,
  };
}

async function Challenge({
  params,
  searchParams,
}: PageProps<"/tracks/[track]/challenge/[challenge]">) {
  const awaited = await params
  const query = await searchParams
  const data = await auth();
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: awaited.challenge,
      track: {
        slug: awaited.track,
      },
    },
    include: {
      _count: {
        select: {
          comments: true,
          upvotes: true,
        },
      },
      track: {
        select: {
          users: data?.user?.username
            ? {
                select: { id: true },
                where: {
                  username: {
                    equals: data.user.username,
                    mode: "insensitive",
                  },
                },
              }
            : undefined,
          name: true,
          slug: true,
          id: true,
        },
      },
      ...(data?.user?.id
        ? {
            upvotes: {
              select: {
                id: true,
              },
              where: {
                authorId: data.user.id,
              },
            },
          }
        : undefined),
    },
  });
  if (!challenge) redirect(`/404`);
  const files = [
    // the tree sorts everything else, so the two entries injected here are
    // pinned to keep them above the challenge's own files
    {
      name: "Challenge.md",
      content: ``,
      type: "file",
      pinned: true,
    },
    ...(challenge.initialFiles as unknown as FrameGroundChallengeExport["files"]),
  ];
  const packages = [];
  const packageJsonContent = JSON.parse(
    (
      challenge.initialFiles.filter(
        (d: any) => d.name === "package.json"
      )[0]! as unknown as FrameGroundChallengeExport["files"][0]
    ).content as string
  );

  packages.push(
    ...Object.keys(packageJsonContent.dependencies),
    ...Object.keys(packageJsonContent.devDependencies)
  );
  if (challenge.jestConfig) {
    // add at index 1
    files.splice(1, 0, {
      name: "jest.config.json",
      content: JSON.stringify(challenge.jestConfig, null, 2),
      type: "file",
      pinned: true,
    });
  }
  const fileSystem: FileSystemTree = {};

  function parseDirectory(
    directory: ChallengeFilesStructure[],
    isFirst = false
  ) {
    const result: any = {};

    for (const file of directory) {
      if (file.type === "file") {
        if (isFirst) {
          result[file.name] = { file: { contents: file.content } };
        } else {
          result["file"] = {};
          result["file"][file.name] = { file: { contents: file.content } };
        }
      } else {
        if (isFirst) {
          result[file.name] = {
            directory: parseDirectory(file.content, true),
          };
          continue;
        }
        result["directory"] = {};
        result["directory"][file.name] = {
          directory: { contents: parseDirectory(file.content, true) },
        };
      }
    }
    return result;
  }

  files.forEach((file) => {
    if (file.type === "file") {
      fileSystem[file.name as any] = {
        file: {
          contents: file.content as string,
        },
      };
    } else {
      fileSystem[file.name] = {
        directory: parseDirectory(file.content as any, true),
      };
    }
  });
  return (
    <div className="px-4 sticky h-full top-[40px]">
      <div className="flex flex-row h-screen">
        <Editor
          //@ts-expect-error
          challenge={challenge}
          params={awaited}
          fileSystem={fileSystem}
          queryParams={query as Record<string,string>}
          files={files as any}
          packages={packages}
          CommentsSection={
            <Comments
              sortBy={query.sort_comments as "oldest" | "newest"}
              challengeId={challenge.id}
              trackId={challenge.trackId!}
              trackSlug={challenge.track!.slug}
              challengeSlug={challenge.slug}
            />
          }
          SolutionsSection={
            <Solutions
              challenge={challenge.slug}
              sort={query.sort_solutions as "oldest" | "newest"}
            />
          }
        />
      </div>
    </div>
  );
}

export default Challenge;
