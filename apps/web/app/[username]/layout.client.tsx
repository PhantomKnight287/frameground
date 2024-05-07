"use client";

import { getCacheSolvesCount, getCacheUser } from "@/cache/user";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@repo/utils";
import { ArrowLeft, AudioWaveform, BadgeCheck, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoCog } from "react-icons/io5";

function LayoutClientComponents({ username }: { username: string }) {
  const { data: session } = useSession();
  return (
    <>
      {session?.user?.username?.toLowerCase() === username.toLowerCase() ? (
        <Link
          className={buttonVariants({
            variant: "outline",
            className:
              "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
          })}
          href="/settings"
        >
          <IoCog size={24} />
          Settings
        </Link>
      ) : null}
    </>
  );
}

export default LayoutClientComponents;

export function ProfileButtons({
  user,
  username,
  solves,
}: {
  username: string;
  user: NonNullable<Awaited<ReturnType<typeof getCacheUser>>>;
  solves: NonNullable<Awaited<ReturnType<typeof getCacheSolvesCount>>>;
}) {
  const pathname = usePathname()
    .replaceAll(`/@${username}/`, "")
    .replace("/", "");
  
  return (
    <div className="md:flex grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 gap-4 md:w-full md:flex-col">
      <Link
        href={`/@${username}/challenges`}
        className={buttonVariants({
          variant: pathname === "challenges" ? "secondary" : "outline",
          className:
            "rounded-xl text-left flex flex-row items-center !justify-start gap-2 ",
        })}
      >
        <BadgeCheck className="text-green-500" />
        {solves?.[0]?.solves_count || 0}{" "}
        {solves?.[0]?.solves_count <= 1 ? "Challenge" : "Challenges"} Conquered
      </Link>
      <Link
        href={`/@${username}/tracks`}
        className={buttonVariants({
          variant: pathname === "tracks" ? "secondary" : "outline",
          className:
            "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
        })}
      >
        <AudioWaveform className="text-blue-500" />
        Enrolled in {user._count.tracks}{" "}
        {user._count.tracks <= 1 ? "Track" : "Tracks"}
      </Link>
      <Link
        href={`/@${username}/solutions`}
        className={buttonVariants({
          variant: pathname === "solutions" ? "secondary" : "outline",
          className:
            "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
        })}
      >
        <CheckCheck className="text-purple-500" />
        {user._count.solutions}{" "}
        {user._count.solutions <= 1 ? "Solution" : "Solutions"} Posted
      </Link>
      <Link
        href={`/@${username}`}
        className={buttonVariants({
          variant: "outline",
          className: cn(
            "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
            {
              hidden: pathname === `@${username}`,
            }
          ),
        })}
      >
        <ArrowLeft className="text-yellow-500" />
        Back to Profile
      </Link>
      <LayoutClientComponents username={username} />
    </div>
  );
}
