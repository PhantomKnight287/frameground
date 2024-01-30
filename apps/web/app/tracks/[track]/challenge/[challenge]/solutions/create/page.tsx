import { notFound, redirect } from "next/navigation";
import CreateSolutionPage from "./page.client";
import { prisma } from "@repo/db";
import { ChallengeFilesStructure } from "@repo/challenges/src";
import { auth } from "@/auth";

async function CreateSolution({
  params,
}: {
  params: {
    track: string;
    challenge: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.id)
    redirect(`/track/${params.track}/challenge/${params.challenge}`);
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: params.challenge,
      track: { slug: params.track },
    },
  });
  if (!challenge) notFound();
  const editableFiles: ChallengeFilesStructure[] = [];
  const files = challenge.initialFiles;
  function parseDirectory(directory: ChallengeFilesStructure[]) {
    for (const file of directory) {
      if (file.type === "file") {
        if (file.editable) {
          editableFiles.push(file);
        }
      } else {
        parseDirectory(file.content);
      }
    }
  }
  (files as unknown as ChallengeFilesStructure[]).forEach((file) => {
    if (file.type === "file") {
      if (file.editable) {
        editableFiles.push(file);
      }
    } else {
      parseDirectory(file.content as any);
    }
  });

  return (
    <div className="container">
      <CreateSolutionPage files={editableFiles} />
    </div>
  );
}

export default CreateSolution;
