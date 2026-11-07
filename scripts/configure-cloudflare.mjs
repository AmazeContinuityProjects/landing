import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../wrangler.json", import.meta.url);
const config = JSON.parse(readFileSync(file, "utf8"));
const binding = config.d1_databases.find((db) => db.binding === "DB");
const id = process.env.CLOUDFLARE_D1_DATABASE_ID || binding.database_id;
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    id === "00000000-0000-0000-0000-000000000000") {
  console.error("Set CLOUDFLARE_D1_DATABASE_ID to your acp-recruitment D1 database ID, or update wrangler.json before deploying.");
  process.exit(1);
}
binding.database_id = id;
writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
console.log("Cloudflare D1 binding configured.");
