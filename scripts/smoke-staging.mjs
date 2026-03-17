import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootEnvPath = resolve(process.cwd(), ".env");

if (existsSync(rootEnvPath)) {
  process.loadEnvFile(rootEnvPath);
}

const requiredKeys = [
  "STAGING_FRONTEND_URL",
  "STAGING_API_BASE_URL",
  "STAGING_SUPABASE_URL",
  "STAGING_SUPABASE_ANON_KEY",
  "STAGING_TEST_EMAIL",
  "STAGING_TEST_PASSWORD",
];

const missingKeys = requiredKeys.filter((key) => {
  const value = process.env[key];
  return !value || !value.trim();
});

if (missingKeys.length > 0) {
  console.error(
    `Missing staging smoke-test variables: ${missingKeys.join(", ")}`,
  );
  process.exit(1);
}

const stagingFrontendUrl = process.env.STAGING_FRONTEND_URL.replace(/\/$/, "");
const stagingApiBaseUrl = process.env.STAGING_API_BASE_URL.replace(/\/$/, "");
const stagingSupabaseUrl = process.env.STAGING_SUPABASE_URL.replace(/\/$/, "");
const stagingSupabaseAnonKey = process.env.STAGING_SUPABASE_ANON_KEY.trim();
const stagingEmail = process.env.STAGING_TEST_EMAIL.trim();
const stagingPassword = process.env.STAGING_TEST_PASSWORD;

async function expectOk(response, label) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${label} failed with ${response.status}: ${body.slice(0, 400)}`,
    );
  }
}

async function run() {
  const frontendHomeResponse = await fetch(stagingFrontendUrl);
  await expectOk(frontendHomeResponse, "Frontend home page");

  const frontendDashboardResponse = await fetch(`${stagingFrontendUrl}/dashboard`);
  await expectOk(frontendDashboardResponse, "Frontend dashboard route");

  const healthResponse = await fetch(`${stagingApiBaseUrl}/health`);
  await expectOk(healthResponse, "Backend health check");
  const healthPayload = await healthResponse.json();

  if (!["ok", "degraded"].includes(healthPayload.status)) {
    throw new Error(`Unexpected health status: ${healthPayload.status}`);
  }

  const signInResponse = await fetch(
    `${stagingSupabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: stagingSupabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: stagingEmail,
        password: stagingPassword,
      }),
    },
  );
  await expectOk(signInResponse, "Supabase sign-in");
  const signInPayload = await signInResponse.json();

  if (!signInPayload.access_token) {
    throw new Error("Supabase sign-in did not return an access token.");
  }

  const accessToken = signInPayload.access_token;
  const lookupResponse = await fetch(`${stagingApiBaseUrl}/api/lookups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      productDescription: "porcelain dinner plate set",
      destinationCountry: "European Union",
    }),
  });
  await expectOk(lookupResponse, "Signed-in lookup");
  const lookupPayload = await lookupResponse.json();

  if (lookupPayload.meta?.historyStatus !== "saved") {
    throw new Error(
      `Lookup completed but historyStatus was ${lookupPayload.meta?.historyStatus ?? "missing"}`,
    );
  }

  const historyResponse = await fetch(`${stagingApiBaseUrl}/api/account/lookups`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  await expectOk(historyResponse, "Account lookup history");
  const historyPayload = await historyResponse.json();

  const savedLookup = Array.isArray(historyPayload.lookups)
    ? historyPayload.lookups.find(
        (entry) =>
          entry.productDescription === "porcelain dinner plate set" &&
          entry.destinationCountry === "European Union",
      )
    : null;

  if (!savedLookup) {
    throw new Error("Staging smoke test did not find the saved lookup history row.");
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        frontendUrl: stagingFrontendUrl,
        apiBaseUrl: stagingApiBaseUrl,
        healthStatus: healthPayload.status,
        savedLookupId: savedLookup.id,
        resolvedHsCode: lookupPayload.query?.hsCode,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
