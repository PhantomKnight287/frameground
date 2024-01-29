import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.roles?.includes("admin")) redirect("/no-access");
  redirect("/dashboard");
  return <span></span>;
}
