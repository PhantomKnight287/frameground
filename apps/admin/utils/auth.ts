import { Session } from "next-auth";

export function assertAdmin(session: Session | null) {
  if (!session) return null;
  return session?.user?.roles?.includes("admin");
}
