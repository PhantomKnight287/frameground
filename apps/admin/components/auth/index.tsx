import { auth } from "@/app/api/auth/[...nextauth]/route";
import { assertAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";

async function VerifyUser() {
  const session = await auth();
  if (assertAdmin(session)) return null;
  else {
    redirect("/no-access");
  }
}

export default VerifyUser;
