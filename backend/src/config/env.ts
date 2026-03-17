import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

function loadLocalEnvFile() {
  if (process.env.APP_ENV === "test") {
    return;
  }

  const candidates = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "..", ".env"),
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    process.loadEnvFile(candidate);
    return;
  }
}

loadLocalEnvFile();

const envSchema = z.object({
  APP_NAME: z.string().default("TariffLookup API"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(8000),
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  ALLOWED_ORIGINS: z.string().optional(),
  SUPABASE_URL: z.string().trim().url().optional(),
  SUPABASE_ANON_KEY: z.string().trim().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1).optional(),
  MONITORING_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  MONITORING_LOOKUP_ERROR_RATE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.3),
  MONITORING_AUTH_FAILURE_RATE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.5),
  MONITORING_HISTORY_API_FAILURE_RATE_THRESHOLD: z.coerce.number()
    .min(0)
    .max(1)
    .default(0.3),
  MONITORING_CONSECUTIVE_5XX_THRESHOLD: z.coerce.number()
    .int()
    .positive()
    .default(3),
});

export const env = envSchema.parse(process.env);
