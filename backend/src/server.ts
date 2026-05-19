import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const start = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.info(`Smart Leads API listening on port ${env.port}`);
  });
};

start().catch((error: unknown) => {
  console.error("Failed to start Smart Leads API", error);
  process.exit(1);
});
