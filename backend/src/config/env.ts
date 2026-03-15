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
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  SUPABASE_URL: z.string().trim().url().optional(),
  SUPABASE_ANON_KEY: z.string().trim().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1).optional(),
});

export const env = envSchema.parse(process.env);
