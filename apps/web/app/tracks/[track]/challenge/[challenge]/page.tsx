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
    ...(challenge.initialFiles as unknown as FrameGroundChallengeExport["files"]),
    {
      name: "test",
      type: "folder",
      content: [
        {
          name: "index.spec.ts",
          content: challenge.tests || "",
          type: "file",
          editable: false,
        },
        {
          name: "dd",
          content: [
            {
              name: "dd.txt",
              content: "hello",
              type: "file",
              editable: false,
            },
          ],
          type: "folder",
        },
      ],
    },
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
          result["directory"] = {};
          result["directory"][file.name] = { file: { contents: file.content } };
        }
      } else {
        if (isFirst) {
          result[file.name] = {
            directory: { contents: parseDirectory(file.content, true) },
          };
        } else {
          result["directory"] = {};
          result["directory"][file.name] = {
            directory: parseDirectory(file.content, false),
          };
        }
      }
    }
    return result;
  }

  const fileSystemPathCache = new Map<string, any>();

  function createFileSystemTreeCache(
    node: typeof files,
    path = "",
    olderIndex?: string,
    oldPath?: string
  ) {
    let newPath = path;
    for (let i = 0; i < node.length; i++) {
      const file = node[i];
      if (file.type === "file") {
        fileSystemPathCache.set(
          `${olderIndex}.${i}`,
          `.${newPath}/${file.name}`
        );
      } else if (file.type === "folder") {
        newPath += `/${file.name}`;
        createFileSystemTreeCache(
          file.content as any[],
          newPath,
          i.toString(),
          newPath
        );
      }
    }
  }
  createFileSystemTreeCache(files);

  files.forEach((file) => {
    //@ts-expect-error
    fileSystem[file.name as any] = {
      [file.type === "folder" ? "directory" : "file"]: {
        ...(file.type === "file"
          ? { contents: file.content }
          : parseDirectory(file.content as any, true)),
      },
    };
  });

  console.log(fileSystemPathCache.entries());
  console.log(inspect(fileSystem, false, null, true));
  return (
    <div className="px-4 sticky h-screen top-[40px]">
      <div className="flex flex-row h-screen">
        <Editor
          //@ts-expect-error
          challenge={challenge}
          params={params}
          fileSystem={fileSystem}
          queryParams={searchParams}
        />
      </div>
    </div>
  );
}

export default Challenge;
