"use client";
import { assertAdmin } from "@/utils/auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

function VerifyUser() {
  const { data } = useSession();
  const { replace } = useRouter();
  useEffect(() => {
    if (assertAdmin(data)) return void null;
    else {
      replace("/no-access");
    }
  }, [data]);
}

export default VerifyUser;
