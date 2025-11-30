import { readFileSync } from "node:fs";
import { Client } from "pg";

const run = async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  await c.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
  const sql = readFileSync("./db/schema.sql", "utf8");
  await c.query(sql);
  await c.end();
  console.log("DB migrated");
};

run();
