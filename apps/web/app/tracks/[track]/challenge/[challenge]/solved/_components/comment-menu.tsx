"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteComment } from "../actions";
import { toast } from "sonner";

function CommentsMenu({
  canDelete = false,
  commentId,
}: {
  canDelete?: boolean;
  commentId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Report</DropdownMenuItem>
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
  );
}

export default CommentsMenu;
