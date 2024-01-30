import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { User } from "lucide-react";
import BioEditor from "./page.client";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@repo/db";

async function Settings() {
  const session = await auth();
  if (!session) redirect(`/api/auth/register`);
  const { user } = session;
  const _user = await prisma.user.findFirst({
    where: { id: user!.id },
    select: { bio: true },
  });
  return (
    <div className="container">
      <div className="flex flex-col gap-8 py-8 md:flex-row">
        <div className="flex flex-col gap-4">
          <Avatar className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64">
            <AvatarImage src={`/github-avatar/${user?.username}`} />
            <AvatarFallback>{user?.username.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
            <div className="flex gap-0 flex-col">
              <div className="text-[2rem] font-bold [&amp;>small]:text-[0.7em] [&amp;>small]:dark:text-slate-400 [&amp;>small]:text-slate-600 font-default h-fit">
                {user?.name}
              </div>
              <span className="text-lg text-muted-foreground">
                @{user?.username}
              </span>
            </div>
            <div className="flex gap-4 md:w-full md:flex-col">
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
                })}
                href={`/@${user?.username}`}
              >
                <User />
                Back to profile
              </Link>
            </div>
          </div>
        </div>
        <BioEditor defaultBio={_user?.bio || ""} />
      </div>
    </div>
  );
}

export default Settings;
