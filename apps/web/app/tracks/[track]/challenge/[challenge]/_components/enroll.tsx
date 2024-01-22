"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface EnrollInTrackProps {
  trackName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}

function EnrollInTrack(props: EnrollInTrackProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {props.trackName} track?</DialogTitle>
          <DialogDescription>
            Submitting this challenge will enroll you in the {props.trackName}{" "}
            track. You will be able to submit solutions to other challenges in
            this track.
          </DialogDescription>
          <div className="flex flex-row items-center justify-start gap-4 mt-2">
            <Button
              onClick={() => {
                props.onConfirm();
                props.setOpen(false);
              }}
            >
              Enroll
            </Button>
            <Button variant="secondary" onClick={() => props.setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EnrollInTrack;
