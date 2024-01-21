"use client";
import { Button } from "../ui/button";
import { Track } from "@repo/db/types";
import { EnrollOrLeave } from "./actions";

function EnrollOrLeaveButton(
  track: Track & { _count: { users: number }; users: { id: string }[] }
) {
  return (
    <Button
      variant={track.users?.length ? "destructive" : "default"}
      className="w-full"
      onClick={async () => {
        await EnrollOrLeave(track.slug, track.users?.length > 0);
      }}
    >
      {track.users?.length ? "Leave" : "Enroll"}
    </Button>
  );
}

export default EnrollOrLeaveButton;
