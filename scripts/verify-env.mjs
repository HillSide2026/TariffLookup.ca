import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootEnvPath = resolve(process.cwd(), ".env");

if (existsSync(rootEnvPath)) {
  process.loadEnvFile(rootEnvPath);
}

const profiles = {
  backend: [
    "FRONTEND_URL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ],
  frontend: [
    "VITE_API_BASE_URL",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ],
  staging: [
    "STAGING_FRONTEND_URL",
    "STAGING_API_BASE_URL",
    "STAGING_SUPABASE_URL",
    "STAGING_SUPABASE_ANON_KEY",
    "STAGING_TEST_EMAIL",
    "STAGING_TEST_PASSWORD",
  ],
};

const selectedProfile = process.argv[2];

if (!selectedProfile || !(selectedProfile in profiles)) {
  console.error(
    `Usage: node scripts/verify-env.mjs <${Object.keys(profiles).join("|")}>`,
  );
  process.exit(1);
}

const missingKeys = profiles[selectedProfile].filter((key) => {
  const value = process.env[key];
  return !value || !value.trim();
});

if (missingKeys.length > 0) {
  console.error(
    `Missing ${selectedProfile} environment variables: ${missingKeys.join(", ")}`,
  );
  process.exit(1);
}

console.log(
  `Environment check passed for ${selectedProfile}: ${profiles[selectedProfile].join(", ")}`,
);
