"use client";
import { SubmitButton } from "@/components/submit";
import { useFormState } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";
import { UpdateBio } from "./actions";
import { useEffect } from "react";
import { toast } from "sonner";

function BioEditor({ defaultBio }: { defaultBio?: string }) {
  const [state, action] = useFormState(UpdateBio, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      toast.success(state?.message);
    }
  }, [state?.error, state?.message]);
  return (
    <div className="bg-card text-card-foreground rounded-3xl border shadow-sm col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)] w-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Settings
        </h3>
      </div>
      <div className="p-6">
        <form action={action} className="flex flex-col space-y-4">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="bio"
          >
            Bio
          </label>
          <TextareaAutosize
            className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            name="bio"
            placeholder="Bio(supports markdown)"
            defaultValue={defaultBio}
          />
          <SubmitButton label="Update Profile" className="w-fit" />
        </form>
      </div>
    </div>
  );
}

export default BioEditor;
