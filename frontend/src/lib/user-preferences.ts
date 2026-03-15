import { activeDestinationMarkets } from "./markets";

export const userPreferencesStorageKey = "tarifflookup.user.preferences";

export type UserPreferences = {
  defaultDestination: string;
  rememberLastDestination: boolean;
  lastDestination: string | null;
};

export const defaultUserPreferences: UserPreferences = {
  defaultDestination: "Japan",
  rememberLastDestination: true,
  lastDestination: null,
};

function isValidDestination(value: string | null | undefined) {
  return Boolean(value && activeDestinationMarkets.includes(value as (typeof activeDestinationMarkets)[number]));
}

export function loadUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return defaultUserPreferences;
  }

  const rawValue = window.localStorage.getItem(userPreferencesStorageKey);

  if (!rawValue) {
    return defaultUserPreferences;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<UserPreferences>;

    return {
      defaultDestination: isValidDestination(parsed.defaultDestination)
        ? parsed.defaultDestination!
        : defaultUserPreferences.defaultDestination,
      rememberLastDestination:
        typeof parsed.rememberLastDestination === "boolean"
          ? parsed.rememberLastDestination
          : defaultUserPreferences.rememberLastDestination,
      lastDestination: isValidDestination(parsed.lastDestination)
        ? parsed.lastDestination!
        : null,
    };
  } catch {
    window.localStorage.removeItem(userPreferencesStorageKey);
    return defaultUserPreferences;
  }
}

export function saveUserPreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    userPreferencesStorageKey,
    JSON.stringify(preferences),
  );
}

export function resolvePreferredDestination(preferences: UserPreferences) {
  if (
    preferences.rememberLastDestination &&
    isValidDestination(preferences.lastDestination)
  ) {
    return preferences.lastDestination!;
  }

  if (isValidDestination(preferences.defaultDestination)) {
    return preferences.defaultDestination;
  }

  return defaultUserPreferences.defaultDestination;
}

export function clearUserPreferences() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(userPreferencesStorageKey);
}
