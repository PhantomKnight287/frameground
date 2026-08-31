import path from "node:path";
import { defineConfig } from "prisma/config";

// Env vars are supplied by `dotenv -e .env` (see the root and package scripts).
// They are only needed for commands that talk to the database; `prisma generate`
// must keep working without them, so fall back to an empty string.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
