"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteComment, reportComment } from "../actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@repo/utils";
import { SubmitButton } from "@/components/submit";

function CommentsMenu({
  canDelete = false,
  commentId,
}: {
  canDelete?: boolean;
  commentId: string;
}) {
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [state, action] = useFormState(reportComment, null);
  useEffect(() => {
    if (state?.id) {
      setReportModalOpened(false);
      toast.success(
        "Your report has been submitted. We will review it shortly."
      );
    }
  }, [state]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setReportModalOpened(true)}>
            Report
          </DropdownMenuItem>
          {canDelete ? (
            <DropdownMenuItem
              className="text-red-500 focus:text-white focus:bg-red-500"
              onClick={async () => {
                const res = await deleteComment(commentId);
                if (res.error) {
                  toast.error(res.error);
                } else {
                  toast.success("Comment deleted");
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={reportModalOpened} onOpenChange={setReportModalOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
          </DialogHeader>
          <form action={action} className="flex flex-col gap-2 w-full">
            <input type="hidden" name="commentId" value={commentId} />
            <Label htmlFor="reason" className="flex flex-col gap-1 w-full">
              Reason
            </Label>
            <Input
              name="reason"
              placeholder="Enter your reason here..."
              className={cn("w-full", {
                "border-2 border-red-500": state?.error,
              })}
            />
            {state?.error ? (
              <p className="text-red-500 text-sm" role="alert">
                {state?.error}
              </p>
            ) : null}
            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommentsMenu;
