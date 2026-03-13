import { buildServer } from "./app.js";
import { env } from "./config/env.js";

async function start() {
  const app = buildServer();

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
