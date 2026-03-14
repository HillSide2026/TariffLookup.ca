import Fastify from "fastify";
import { env } from "./config/env.js";
import { registerAccountRoutes } from "./routes/account.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerLookupRoutes } from "./routes/lookups.js";

export function buildServer() {
  const app = Fastify({
    logger: env.APP_ENV !== "test",
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", env.FRONTEND_URL);
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  void registerAccountRoutes(app);
  void registerHealthRoute(app);
  void registerLookupRoutes(app);

  return app;
}
