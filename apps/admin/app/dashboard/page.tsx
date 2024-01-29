import { auth } from "@/auth";
import { assertAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";

async function Dashboard() {
  const session = await auth();
  const isAdmin = assertAdmin(session);
  if (!isAdmin) redirect("/no-access");
  return (
    <div className="container">
      <div className="flex items-center justify-center">
        <p className="text-lg font-medium">Choose an option from the sidebar</p>
      </div>
    </div>
  );
}

export default Dashboard;
