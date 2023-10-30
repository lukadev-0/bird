import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { join } from "path";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

migrate(db, { migrationsFolder: join(__dirname, "..", "drizzle") })
  .then(() => console.log("Migrations complete"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
