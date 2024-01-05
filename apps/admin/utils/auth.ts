import { Session } from "next-auth/types";

export function assertAdmin(session: Session | null) {
  if (!session) return null;
  return session?.user?.roles?.includes("admin");
}
