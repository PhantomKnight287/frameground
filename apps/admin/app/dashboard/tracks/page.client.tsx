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
import { useState } from "react";
import { useFormState } from "react-dom";
import { createTrack, deleteTrack } from "./[slug]/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrackStatus } from "@repo/db/types";
import { SubmitButton } from "./[slug]/page.client";
import { Trash2 } from "lucide-react";
import Track from "./[slug]/page";

function CreateNewRecord() {
  const [state, formAction] = useFormState(createTrack, null);

  const [opened, setOpened] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>Create a new track.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <Label>Name</Label>
          <Input className="my-2" name="name" required aria-required="true" />
          <Label>Description</Label>
          <Input
            className="my-2"
            name="description"
            required
            aria-required="true"
          />
          <Label>Slug</Label>
          <Input className="my-2" name="slug" required aria-required="true" />
          <Label>Logo</Label>
          <Input className="my-2" name="logo" required aria-required="true" />
          <Label>Status</Label>
          <Select name="status" required aria-required="true">
            <SelectTrigger>
              <SelectValue placeholder="Track Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(TrackStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(state as unknown as { message?: string })?.message ? (
            <p className="text-red-500">
              {(state as unknown as { message?: string }).message}
            </p>
          ) : null}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewRecord;

export function DeleteButton({ id }: { id: string }) {
  return (
    <Button
      variant={"ghost"}
      onClick={async () => {
        await deleteTrack(id);
      }}
    >
      <Trash2 className="text-red-500" />
    </Button>
  );
}
