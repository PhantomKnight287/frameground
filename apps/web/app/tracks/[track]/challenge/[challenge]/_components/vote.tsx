"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { upvoteChallenge } from "../action";
import { ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { Challenge, Upvote } from "@repo/db/types";
import { toast } from "sonner";

function UpVote({
  challenge,
  params,
}: {
  challenge: Challenge & { upvotes: Upvote[]; _count: { upvotes: number } };
  params: { track: string; challenge: string };
}) {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "gap-2 border border-transparent [&:not(:disabled)]:hover:border-emerald-600  [&:not(:disabled)]:hover:text-emerald-600 bg-gray-500",
            {
              "border-emerald-600 text-white bg-emerald-600":
                challenge.upvotes?.length > 0,
            }
          )}
          variant="secondary"
          size="xs"
          disabled={!data?.user?.id || loading}
          onClick={async () => {
            setLoading(true);
            const res = await upvoteChallenge(
              challenge.id,
              params.track,
              params.challenge
            );
            if (res?.error) {
              toast.error(res.error);
            }
            setLoading(false);
          }}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-bold">{challenge._count.upvotes}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{data?.user?.id ? "Upvote" : "Login to Upvote"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default UpVote;
