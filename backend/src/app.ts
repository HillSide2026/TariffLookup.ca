import Fastify from "fastify";
import { env } from "./config/env.js";
import { registerAccountRoutes } from "./routes/account.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerLookupRoutes } from "./routes/lookups.js";

export function buildServer() {
  const app = Fastify({
    logger:
      env.APP_ENV === "test"
        ? false
        : {
            level: env.LOG_LEVEL,
          },
  });
  const allowedOrigins = [
    env.FRONTEND_URL,
    ...(env.ALLOWED_ORIGINS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) || []),
  ];

  app.addHook("onRequest", async (request, reply) => {
    const requestOrigin =
      typeof request.headers.origin === "string" ? request.headers.origin : null;
    const resolvedOrigin = requestOrigin
      ? allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : null
      : allowedOrigins[0];

    if (requestOrigin && !resolvedOrigin) {
      return reply.code(403).send({
        error: "Origin not allowed",
      });
    }

    if (resolvedOrigin) {
      reply.header("Access-Control-Allow-Origin", resolvedOrigin);
      reply.header("Vary", "Origin");
    }

    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    reply.header("Access-Control-Expose-Headers", "x-request-id");
    reply.header("x-request-id", request.id);

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  void registerAccountRoutes(app);
  void registerHealthRoute(app);
  void registerLookupRoutes(app);

  return app;
}
