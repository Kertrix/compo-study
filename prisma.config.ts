import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("src", "prisma"),
  migrations: {
    path: path.join("src", "prisma", "migrations"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
