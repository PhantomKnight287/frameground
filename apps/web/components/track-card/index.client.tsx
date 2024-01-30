"use client";
import { Button } from "../ui/button";
import { Track } from "@repo/db/types";
import { EnrollOrLeave } from "./actions";
import { useState } from "react";

function EnrollOrLeaveButton(
  track: Track & { _count: { users: number }; users: { id: string }[] }
) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant={track.users?.length ? "destructive" : "default"}
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await EnrollOrLeave(track.slug, track.users?.length > 0);
        setLoading(false);
      }}
    >
      {track.users?.length ? "Leave" : "Enroll"}
    </Button>
  );
}

export default EnrollOrLeaveButton;
