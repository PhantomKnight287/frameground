"use client";
import { Button } from "../ui/button";
import { Track } from "@repo/db/types";
import { EnrollOrLeave } from "./actions";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function EnrollOrLeaveButton(
  track: Track & { _count: { users: number }; users: { id: string }[] }
) {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  return (
    <Button
      variant={track.users?.length ? "destructive" : "default"}
      className="w-full"
      disabled={loading}
      onClick={async () => {
        if (!session?.data?.user?.id)
          return toast.error("You must be logged in to enroll in a track");
        setLoading(true);
        const res = await EnrollOrLeave(track.slug, track.users?.length > 0);
        if (res?.error) {
          toast.error(res.error);
        }
        setLoading(false);
      }}
    >
      {track.users?.length ? "Leave" : "Enroll"}
    </Button>
  );
}

export default EnrollOrLeaveButton;
