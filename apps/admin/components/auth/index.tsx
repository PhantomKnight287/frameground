"use client";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { assertAdmin } from "@/utils/auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

function VerifyUser() {
  const { data } = useSession();
  const { replace } = useRouter();
  if (assertAdmin(data)) return null;
  else {
    replace("/no-access");
  }
}

export default VerifyUser;
