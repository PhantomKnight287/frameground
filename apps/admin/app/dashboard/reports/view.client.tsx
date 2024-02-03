"use client";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fromNow } from "@/utils/time";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteReportedComment, RejectReportedComment } from "./actions";

function ViewReportContent({
  comment,
  reportContent,
  reportId,
  reporter,
}: {
  reportId: string;
  reportContent: string;
  reporter: { id: string; username: string; name: string };
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; username: string; name: string };
  };
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center justify-start gap-1">
          <a
            href={`${
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/@"
                : "https://frameground.tech/@"
            }${reporter.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm"
          >
            {reporter.name} (@{reporter.username})
          </a>
          reported {fromNow(comment.createdAt)}
        </div>
        <div>Reason: {reportContent}</div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-start justify-start gap-2">
              <Avatar>
                <AvatarImage
                  src={`/github-avatar/${comment.author.username}`}
                />
                <AvatarFallback>
                  {comment.author.username!.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-start">
                <div className="flex flex-row gap-1 items-center">
                  <a
                    href={`${
                      process.env.NODE_ENV === "development"
                        ? "http://localhost:3000/@"
                        : "https://frameground.tech/@"
                    }${comment.author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium text-sm"
                  >
                    {comment.author.username}
                  </a>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {fromNow(comment.createdAt)}
                  </span>
                </div>
                <div className="text-sm text-white">{comment.content}</div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row w-full">
          <Button
            variant={"destructive"}
            className="flex-grow"
            onClick={async () => {
              setLoading(true);
              const d = await DeleteReportedComment(reportId);
              if (d?.error) {
                toast.error(d.error);
              }
              setLoading(false);
            }}
            disabled={loading}
          >
            Delete Comment
          </Button>
          <Button
            className="flex-grow"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const d = await RejectReportedComment(reportId);
              if (d?.error) {
                toast.error(d.error);
              }
              setLoading(false);
            }}
          >
            Dismiss Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportContent;
