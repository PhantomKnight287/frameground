"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Challenge, Upvote, User } from "@repo/db/types";
import { usePathname, useRouter } from "next/navigation";
import ChallengeDescription from "@/components/challenge/description";

function ChallengeTabs({
  challenge,
  params,
  queryParams,
}: {
  queryParams?: { tab?: string };
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
  };
  params: Record<"track" | "challenge", string>;
}) {
  const { replace } = useRouter();
  const pathName = usePathname();
  return (
    <Tabs
      defaultValue={queryParams?.tab || "description"}
      onChange={(value) =>
        replace(`${pathName}?tab=${value}`, { scroll: false })
      }
    >
      <TabsList className="w-full">
        <TabsTrigger
          value="description"
          className="flex-grow"
          onClick={() =>
            replace(`${pathName}?tab=description`, { scroll: false })
          }
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="flex-grow"
          onClick={() => replace(`${pathName}?tab=comments`, { scroll: false })}
        >
          Comments
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="flex-grow"
          onClick={() =>
            replace(`${pathName}?tab=solutions`, { scroll: false })
          }
        >
          Solutions
        </TabsTrigger>
      </TabsList>
      <TabsContent value={"description"}>
        <ChallengeDescription challenge={challenge} params={params} />
      </TabsContent>
      <TabsContent value="comments">comments</TabsContent>
      <TabsContent value="solutions">solutions</TabsContent>
    </Tabs>
  );
}

export default ChallengeTabs;
