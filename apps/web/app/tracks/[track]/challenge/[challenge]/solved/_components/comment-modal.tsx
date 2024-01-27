"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createComment } from "../actions";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@repo/utils";
import { SubmitButton } from "@/components/submit";
import { useEffect, useState } from "react";

function CreateComment({
  challengeId,
  trackId,
}: {
  challengeId: string;
  trackId: string;
}) {
  const [state, action] = useFormState(createComment, null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (state?.id) {
      setIsDialogOpen(false);
    }
  }, [state]);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="pill">Create Comment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Comment</DialogTitle>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-2 w-full">
          <input type="hidden" name="challengeId" value={challengeId} />
          <input type="hidden" name="trackId" value={trackId} />
          <Label htmlFor="content" className="flex flex-col gap-1 w-full">
            Comment
          </Label>
          <Input
            name="content"
            placeholder="Enter your comment here..."
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
  );
}

export default CreateComment;
