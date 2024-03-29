"use client";

import { User } from "lucide-react";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InteractiveHeaderComponents() {
  const { data } = useSession();
  if (!data || !data?.user)
    return (
      <>
        <Button onClick={() => signIn("github")} variant={"ghost"}>
          <User />
        </Button>
      </>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={data.user.image!} />
          <AvatarFallback>{data.user.image!}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-red-500 focus:text-white focus:bg-red-500"
          onClick={() => signOut()}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
