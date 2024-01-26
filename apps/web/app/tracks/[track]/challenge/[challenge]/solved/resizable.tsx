"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { ReactNode } from "react";
import SolvedPageTabs from "./page.client";
import { Solves } from "@repo/db/types";
import JestOutputRenderer from "./_components/output";
import { cn } from "@repo/utils";

function Resizable({
  solves,
  solveToShow,
  CommentsSection,
}: {
  solves: Pick<Solves, "id" | "type" | "createdAt" | "output">[];
  solveToShow?: Pick<Solves, "id" | "type" | "createdAt" | "output"> | null;
  CommentsSection: ReactNode;
}) {
  return (
    <div className="p-4 h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="bg-border rounded-md">
          <SolvedPageTabs solves={solves} CommentsSection={CommentsSection} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-border rounded-md pt-1 h-screen overflow-x-scroll">
          <h1
            className={cn(
              "text-2xl font-semibold p-2 py-1 border-b-2 px-3 border-zinc-300 dark:border-zinc-700 line-clamp-1",
              {
                "text-red-500": solveToShow?.type === "failed",
                "text-green-500": solveToShow?.type === "accepted",
              }
            )}
          >
            {solveToShow?.type === "failed"
              ? "Whoops! Your solution failed to pass all the tests."
              : "Congratulations! You solved the challenge!"}
          </h1>
          {solveToShow ? (
            <JestOutputRenderer
              key={solveToShow.id}
              output={solveToShow.output!}
            />
          ) : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Resizable;
