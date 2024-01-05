"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateTrack } from "./actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Track, TrackStatus } from "@repo/db/types";
import { Button } from "@/components/ui/button";
function UpdateTrack({ track }: { track: Track }) {
  const [state, formAction] = useFormState(updateTrack, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" defaultValue={track.id} />
      <Label>Name</Label>
      <Input
        className="my-2"
        name="name"
        defaultValue={track.name}
        required
        aria-required="true"
      />
      <Label>Description</Label>
      <Input
        className="my-2"
        name="description"
        defaultValue={track.description || ""}
        required
        aria-required="true"
      />
      <Label>Slug</Label>
      <Input
        className="my-2"
        name="slug"
        defaultValue={track.slug}
        required
        aria-required="true"
      />
      <Label>Logo</Label>
      <Input
        className="my-2"
        name="logo"
        defaultValue={track.logo || ""}
        required
        aria-required="true"
      />
      <Label>Status</Label>
      <Select
        name="status"
        defaultValue={track.status}
        required
        aria-required="true"
      >
        <SelectTrigger>
          <SelectValue placeholder="Track Status" defaultValue={track.status} />
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
  );
}

export default UpdateTrack;

export function SubmitButton({ label }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="mt-4"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Submitting..." : label || "Submit"}
    </Button>
  );
}
