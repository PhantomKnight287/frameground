"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Solves } from "@repo/db/types";
import { Button } from "@/components/ui/button";
import { cn } from "@repo/utils";
import { fromNow } from "@/utils/time";
import { upperFirst } from "@/utils";
import { Calendar } from "lucide-react";
import { ReactNode } from "react";

function SolvedPageTabs({
  solves,
  CommentsSection,
}: {
  solves: Pick<Solves, "id" | "type" | "createdAt" | "output">[];
  CommentsSection: ReactNode;
}) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useSearchParams();

  return (
    <Tabs defaultValue={params.get("tab") || "attempts"} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger
          value="attempts"
          className="w-full"
          onClick={() => {
            const search = new URLSearchParams(params);
            search.set("tab", "attempts");
            replace(`${pathname}?${search.toString()}`, { scroll: false });
          }}
        >
          Attempts
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="w-full"
          onClick={() => {
            const search = new URLSearchParams(params);
            search.set("tab", "solutions");
            replace(`${pathname}?${search.toString()}`, { scroll: false });
          }}
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="w-full"
          onClick={() => {
            const search = new URLSearchParams(params);
            search.set("tab", "comments");
            replace(`${pathname}?${search.toString()}`, { scroll: false });
          }}
        >
          Comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="attempts" className="rounded-b-md h-screen mt-1 ">
        <div className="flex flex-row items-center justify-start my-1 gap-4 p-2 px-4 border-t-2 border-b-2 border-zinc-300 dark:border-zinc-700">
          <Button
            className={cn("rounded-lg px-4 py-1 duration-300", {
              "text-background bg-blue-600 dark:bg-blue-400":
                params.get("status") === "all",
              "bg-blue-600/10 text-blue-600 hover:bg-blue-600/30 dark:bg-blue-400/10 dark:text-blue-400 dark:hover:bg-blue-400/30":
                params.get("status") !== "all",
            })}
            onClick={() => {
              const search = new URLSearchParams(params);
              search.set("status", "all");
              replace(`${pathname}?${search.toString()}`, { scroll: false });
            }}
          >
            All
          </Button>
          <Button
            className={cn("rounded-lg px-4 py-1 duration-300", {
              "text-background bg-emerald-600 dark:bg-emerald-400 ":
                params.get("status") === "accepted",
              "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/30":
                params.get("status") !== "accepted",
            })}
            onClick={() => {
              const search = new URLSearchParams(params);
              search.set("status", "accepted");
              replace(`${pathname}?${search.toString()}`, { scroll: false });
            }}
          >
            Accepted
          </Button>
          <Button
            className={cn("rounded-lg px-4 py-1 duration-300", {
              "text-background bg-rose-600 dark:bg-rose-400":
                params.get("status") === "failed",
              "bg-rose-600/10 text-rose-600 hover:bg-rose-600/30 dark:bg-rose-400/10 dark:text-rose-400 dark:hover:bg-rose-400/30":
                params.get("status") !== "failed",
            })}
            onClick={() => {
              const search = new URLSearchParams(params);
              search.set("status", "failed");
              replace(`${pathname}?${search.toString()}`, { scroll: false });
            }}
          >
            Failed
          </Button>
        </div>
        <div className="flex flex-col items-center">
          {solves?.map((solve) => (
            <button
              key={solve.id}
              onClick={() => {
                const search = new URLSearchParams(params);
                search.set("attempt", solve.id);
                replace(`${pathname}?${search.toString()}`, { scroll: false });
              }}
              className={cn(
                "flex flex-row items-center justify-between w-full px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700",
                {
                  "bg-zinc-100 dark:bg-zinc-700":
                    solve.id === params.get("attempt"),
                }
              )}
            >
              <div className="flex flex-row items-center justify-start gap-2">
                <div className="flex flex-col items-start justify-start">
                  <span
                    className={cn("text-lg font-medium", {
                      "text-emerald-600 dark:text-emerald-400":
                        solve.type === "accepted",
                      "text-rose-600 dark:text-rose-400":
                        solve.type === "failed",
                    })}
                  >
                    {upperFirst(solve.type)}
                  </span>
                  <span className="text-sm flex flex-row gap-2 items-center text-gray-500 dark:text-gray-400">
                    <Calendar size={16} /> {fromNow(solve.createdAt)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="solutions">Change your password here.</TabsContent>
      <TabsContent value="comments">
        <div className="flex flex-row items-center justify-start my-1 gap-4 p-2 px-4 border-t-2 border-b-2 border-zinc-300 dark:border-zinc-700">
          {CommentsSection}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default SolvedPageTabs;
