"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { ReactNode, useEffect, useState } from "react";
import { Challenge, Upvote, User } from "@repo/db/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ChallengeDescription from "@/components/challenge/description";
import { buttonVariants } from "@/components/ui/button";
import FilterButton from "./solved/_components/filter-buttons";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ChallengeTabs({
  challenge,
  params,
  queryParams,
  CommentsSection,
  SolutionsSection,
}: {
  queryParams?: { tab?: string };
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
  };
  params: Record<"track" | "challenge", string>;
  CommentsSection: ReactNode;
  SolutionsSection: ReactNode;
}) {
  const { replace } = useRouter();
  const pathName = usePathname();
  const search = useSearchParams();
  const [isFAQModalOpened, setIsFAQModalOpened] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem("faq_modal_shown");
    if (!value || value === "false") {
      setIsFAQModalOpened(true);
    }
  }, []);

  return (
    <Tabs defaultValue={queryParams?.tab || "description"}>
      <TabsList className="w-full">
        <TabsTrigger
          value="description"
          className="flex-grow"
          onClick={() => {
            const searchParams = new URLSearchParams(search);
            searchParams.set("tab", "description");
            replace(`${pathName}?${searchParams.toString()}`, {
              scroll: false,
            });
          }}
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="flex-grow"
          onClick={() => {
            const searchParams = new URLSearchParams(search);
            searchParams.set("tab", "comments");
            replace(`${pathName}?${searchParams.toString()}`, {
              scroll: false,
            });
          }}
        >
          Comments
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="flex-grow"
          onClick={() => {
            const searchParams = new URLSearchParams(search);
            searchParams.set("tab", "solutions");
            replace(`${pathName}?${searchParams.toString()}`, {
              scroll: false,
            });
          }}
        >
          Solutions
        </TabsTrigger>
      </TabsList>
      <TabsContent value={"description"}>
        <ChallengeDescription challenge={challenge} params={params} />
        <Dialog
          open={isFAQModalOpened}
          onOpenChange={(d) => {
            localStorage.setItem("faq_modal_shown", String(!d));
            setIsFAQModalOpened(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gray-400">
                Read This Before You Begin
              </DialogTitle>
              <p className="text-base text-white tracking-tight">
                If you are first time visitor, running webcontainers require
                extra browser config. Please read{" "}
                <a
                  href={`${process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://docs.frameground.tech"}/faq#playground-isnt-working-in-my-browser`}
                  className="text-blue-500"
                  target="_blank"
                >
                  FAQ
                </a>{" "}
                before you begin or if you are not getting any output in
                terminal.
              </p>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TabsContent>
      <TabsContent value="comments" className="mt-0 h-screen">
        <div className="flex flex-row items-start justify-start gap-4 p-2 mt-2  px-0 bg-border h-screen">
          {CommentsSection}
        </div>
      </TabsContent>
      <TabsContent value="solutions" className="mt-0 h-screen bg-border">
        <div className="flex flex-row items-start justify-start gap-4 p-2 mt-2 px-0">
          <div className="flex flex-row w-full items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-700 pb-2 px-2">
            <FilterButton searchParamName="sort_solutions" />
            <Link
              href={`/tracks/${params.track}/challenge/${params.challenge}/solutions/create`}
              className={buttonVariants({
                variant: "default",
                size: "pill",
              })}
            >
              Create Solution
            </Link>
          </div>
        </div>
        {SolutionsSection}
      </TabsContent>
    </Tabs>
  );
}

export default ChallengeTabs;
