import { redirect } from "next/navigation";
import { auth } from "./api/auth/[...nextauth]/route";
export default async function Home() {
  const session = await auth();
  if (!session?.user?.roles?.includes("admin")) redirect("/no-access");
  redirect("/dashboard");
  return <span></span>;
}
