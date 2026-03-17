import type { FastifyInstance } from "fastify";
import {
  getHealthSnapshot,
  getMonitoringSnapshot,
} from "../services/monitoring-service.js";

export async function registerHealthRoute(app: FastifyInstance) {
  app.get("/health", async () => {
    const health = getHealthSnapshot();

    return {
      ...health,
      service: "tarifflookup-backend",
      timestamp: new Date().toISOString(),
    };
  });

  app.get("/api/ops/metrics", async () => {
    return getMonitoringSnapshot();
  });
}
