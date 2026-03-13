import { z } from "zod";

const envSchema = z.object({
  APP_NAME: z.string().default("TariffLookup API"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(8000),
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
