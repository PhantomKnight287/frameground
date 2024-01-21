import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Editor from "./_page.client";
import {
  ChallengeFilesStructure,
  FrameGroundChallengeExport,
} from "@repo/challenges/src";
import { FileSystemTree } from "@repo/containers";
import { inspect } from "util";

// do not remove this line
const REPO_MONACO_CLASSNAMES = ["pl-4", "pl-2"];

function getFileNameWithContent(s: ChallengeFilesStructure): any {
  if (s.type === "file") return { file: { [s.name]: { contents: s.content } } };
  return {
    [s.name]: {
      directory: {
        [s.name]: {
          contents: s.content.reduce((acc, file) => {
            const fileResult = getFileNameWithContent(file);
            if (fileResult !== null) {
              Object.assign(acc, fileResult);
            }
            return acc;
          }, {}),
        },
      },
    },
  };
  // return {
  //   directory: {
  //     [s.name]: {
  //       contents: s.content.reduce((acc, file) => {
  //         const fileResult = getFileNameWithContent(file);
  //         if (fileResult !== null) {
  //           Object.assign(acc, fileResult);
  //         }
  //         return acc;
  //       }, {}),
  //     },
  //   },
  // };
}

async function Challenge({
  params,
  searchParams,
}: {
  params: { track: string; challenge: string };
  searchParams: Record<string, string>;
}) {
  const data = await auth();
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: params.challenge,
      track: {
        slug: params.track,
      },
    },
    include: {
      authors: true,
      _count: {
        select: {
          comments: true,
          upvotes: true,
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
    {
      name: "Challenge.md",
      content: ``,
      type: "file",
      editable: false,
    },
    ...(challenge.initialFiles as unknown as FrameGroundChallengeExport["files"]),
  ];
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
    <div className="px-4 sticky h-screen top-[40px]">
      <div className="flex flex-row h-screen">
        <Editor
          //@ts-expect-error
          challenge={challenge}
          params={params}
          fileSystem={fileSystem}
          queryParams={searchParams}
          files={files as any}
        />
      </div>
    </div>
  );
}

export default Challenge;
