"use client";
import { usePathname, useRouter } from "next/navigation";
import { SolvedChallenge } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeDescription from "@/components/challenge/description";

function SolvedPageTabs({
  challenge,
  currentTab,
  params,
}: {
  challenge: SolvedChallenge;
  currentTab: string;
  params: { track: string; challenge: string };
}) {
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <Tabs defaultValue={currentTab || "description"} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger
          value="description"
          className="w-full"
          onClick={() =>
            replace(`${pathname}?tab=description`, { scroll: false })
          }
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="w-full"
          onClick={() =>
            replace(`${pathname}?tab=solutions`, { scroll: false })
          }
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="w-full"
          onClick={() => replace(`${pathname}?tab=comments`, { scroll: false })}
        >
          Comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        {/*         
    @ts-expect-error*/}
        <ChallengeDescription challenge={challenge.challenge} params={params} />
      </TabsContent>
      <TabsContent value="solutions">Change your password here.</TabsContent>
      <TabsContent value="comments">Change your password here.</TabsContent>
    </Tabs>
  );
}

export default SolvedPageTabs;
