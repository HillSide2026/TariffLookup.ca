import { env } from "../config/env.js";
import type {
  LookupCoverageStatus,
  LookupHistoryStatus,
  LookupSourceTier,
} from "../contracts/lookup.js";

type LookupOutcome =
  | "success"
  | "needs-more-detail"
  | "lookup-not-found"
  | "validation-error"
  | "server-error";

type TimedRecord = {
  timestamp: number;
};

type LookupRecord = TimedRecord & {
  durationMs: number;
  outcome: LookupOutcome;
  sourceTier?: LookupSourceTier;
  coverageStatus?: LookupCoverageStatus;
};

type ApiResponseRecord = TimedRecord & {
  route: string;
  statusCode: number;
};

type AuthVerificationRecord = TimedRecord & {
  success: boolean;
  reason: string | null;
};

type HistoryPersistenceRecord = TimedRecord & {
  status: LookupHistoryStatus;
};

type AccountHistoryRecord = TimedRecord & {
  success: boolean;
  statusCode: number;
};

type MonitoringState = {
  startedAt: number;
  lookupRecords: LookupRecord[];
  apiResponses: ApiResponseRecord[];
  authVerifications: AuthVerificationRecord[];
  historyPersistence: HistoryPersistenceRecord[];
  accountHistoryRequests: AccountHistoryRecord[];
};

function createMonitoringState(): MonitoringState {
  return {
    startedAt: Date.now(),
    lookupRecords: [],
    apiResponses: [],
    authVerifications: [],
    historyPersistence: [],
    accountHistoryRequests: [],
  };
}

let monitoringState = createMonitoringState();

function getWindowCutoff() {
  return Date.now() - env.MONITORING_WINDOW_MINUTES * 60_000;
}

function pruneRecentRecords<T extends TimedRecord>(records: T[]) {
  const cutoff = getWindowCutoff();

  while (records.length > 0 && records[0].timestamp < cutoff) {
    records.shift();
  }
}

function pruneAllRecords() {
  pruneRecentRecords(monitoringState.lookupRecords);
  pruneRecentRecords(monitoringState.apiResponses);
  pruneRecentRecords(monitoringState.authVerifications);
  pruneRecentRecords(monitoringState.historyPersistence);
  pruneRecentRecords(monitoringState.accountHistoryRequests);
}

function toRate(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Number((numerator / denominator).toFixed(4));
}

function getPercentile(values: number[], percentile: number) {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sortedValues.length - 1,
    Math.max(0, Math.ceil(percentile * sortedValues.length) - 1),
  );

  return Number(sortedValues[index].toFixed(2));
}

function countByKey<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function getRecentConsecutive5xxCount() {
  const recentResponses = [...monitoringState.apiResponses].sort(
    (left, right) => left.timestamp - right.timestamp,
  );
  let count = 0;

  for (let index = recentResponses.length - 1; index >= 0; index -= 1) {
    if (recentResponses[index].statusCode >= 500) {
      count += 1;
      continue;
    }

    break;
  }

  return count;
}

export function resetMonitoringState() {
  monitoringState = createMonitoringState();
}

export function recordLookupOutcome(record: Omit<LookupRecord, "timestamp">) {
  monitoringState.lookupRecords.push({
    ...record,
    timestamp: Date.now(),
  });
  pruneRecentRecords(monitoringState.lookupRecords);
}

export function recordApiResponse(record: Omit<ApiResponseRecord, "timestamp">) {
  monitoringState.apiResponses.push({
    ...record,
    timestamp: Date.now(),
  });
  pruneRecentRecords(monitoringState.apiResponses);
}

export function recordAuthVerification(
  record: Omit<AuthVerificationRecord, "timestamp">,
) {
  monitoringState.authVerifications.push({
    ...record,
    timestamp: Date.now(),
  });
  pruneRecentRecords(monitoringState.authVerifications);
}

export function recordHistoryPersistence(
  record: Omit<HistoryPersistenceRecord, "timestamp">,
) {
  monitoringState.historyPersistence.push({
    ...record,
    timestamp: Date.now(),
  });
  pruneRecentRecords(monitoringState.historyPersistence);
}

export function recordAccountHistoryRequest(
  record: Omit<AccountHistoryRecord, "timestamp">,
) {
  monitoringState.accountHistoryRequests.push({
    ...record,
    timestamp: Date.now(),
  });
  pruneRecentRecords(monitoringState.accountHistoryRequests);
}

export function getMonitoringSnapshot() {
  pruneAllRecords();

  const lookupLatencies = monitoringState.lookupRecords.map(
    (record) => record.durationMs,
  );
  const lookupOutcomes = countByKey(
    monitoringState.lookupRecords.map((record) => record.outcome),
  );
  const successfulLookupRecords = monitoringState.lookupRecords.filter(
    (record) => record.outcome === "success",
  );
  const sourceTierCounts = countByKey(
    successfulLookupRecords
      .map((record) => record.sourceTier)
      .filter((value): value is LookupSourceTier => Boolean(value)),
  );
  const coverageStatusCounts = countByKey(
    successfulLookupRecords
      .map((record) => record.coverageStatus)
      .filter((value): value is LookupCoverageStatus => Boolean(value)),
  );
  const lookupNeedsMoreDetailCount = lookupOutcomes["needs-more-detail"] || 0;
  const lookupErrorCount =
    (lookupOutcomes["lookup-not-found"] || 0) +
    (lookupOutcomes["server-error"] || 0);
  const lookupOperationalErrorCount = lookupOutcomes["server-error"] || 0;
  const authFailureCount = monitoringState.authVerifications.filter(
    (record) => !record.success,
  ).length;
  const authFailureReasons = countByKey(
    monitoringState.authVerifications
      .map((record) => record.reason)
      .filter((value): value is string => Boolean(value)),
  );
  const historyPersistenceStatusCounts = countByKey(
    monitoringState.historyPersistence.map((record) => record.status),
  );
  const accountHistoryFailureCount = monitoringState.accountHistoryRequests.filter(
    (record) => !record.success,
  ).length;
  const accountHistoryOperationalFailureCount =
    monitoringState.accountHistoryRequests.filter(
      (record) => !record.success && record.statusCode >= 500,
    ).length;

  return {
    service: "tarifflookup-backend",
    startedAt: new Date(monitoringState.startedAt).toISOString(),
    timestamp: new Date().toISOString(),
    monitoringWindowMinutes: env.MONITORING_WINDOW_MINUTES,
    thresholds: {
      lookupErrorRate: env.MONITORING_LOOKUP_ERROR_RATE_THRESHOLD,
      authFailureRate: env.MONITORING_AUTH_FAILURE_RATE_THRESHOLD,
      accountHistoryFailureRate:
        env.MONITORING_HISTORY_API_FAILURE_RATE_THRESHOLD,
      consecutive5xx: env.MONITORING_CONSECUTIVE_5XX_THRESHOLD,
    },
    lookup: {
      totalRequests: monitoringState.lookupRecords.length,
      successCount: lookupOutcomes.success || 0,
      needsMoreDetailCount: lookupNeedsMoreDetailCount,
      errorCount: lookupErrorCount,
      operationalErrorCount: lookupOperationalErrorCount,
      validationErrorCount: lookupOutcomes["validation-error"] || 0,
      lookupErrorRate: toRate(
        lookupErrorCount,
        monitoringState.lookupRecords.length,
      ),
      lookupOperationalErrorRate: toRate(
        lookupOperationalErrorCount,
        monitoringState.lookupRecords.length,
      ),
      averageLatencyMs:
        lookupLatencies.length === 0
          ? 0
          : Number(
              (
                lookupLatencies.reduce((sum, value) => sum + value, 0) /
                lookupLatencies.length
              ).toFixed(2),
            ),
      p95LatencyMs: getPercentile(lookupLatencies, 0.95),
      outcomeCounts: lookupOutcomes,
      sourceTierCounts,
      coverageStatusCounts,
      productSignals: {
        localNormalizedData: sourceTierCounts["local-normalized-data"] || 0,
        seedDemoData: sourceTierCounts["seed-demo-data"] || 0,
        needsMoreDetail: lookupNeedsMoreDetailCount,
      },
    },
    auth: {
      totalVerifications: monitoringState.authVerifications.length,
      failureCount: authFailureCount,
      failureRate: toRate(
        authFailureCount,
        monitoringState.authVerifications.length,
      ),
      failureReasons: authFailureReasons,
    },
    historyPersistence: {
      totalAttempts: monitoringState.historyPersistence.length,
      statusCounts: historyPersistenceStatusCounts,
    },
    accountHistoryApi: {
      totalRequests: monitoringState.accountHistoryRequests.length,
      failureCount: accountHistoryFailureCount,
      failureRate: toRate(
        accountHistoryFailureCount,
        monitoringState.accountHistoryRequests.length,
      ),
      operationalFailureCount: accountHistoryOperationalFailureCount,
      operationalFailureRate: toRate(
        accountHistoryOperationalFailureCount,
        monitoringState.accountHistoryRequests.length,
      ),
    },
    api: {
      totalResponses: monitoringState.apiResponses.length,
      recentConsecutive5xx: getRecentConsecutive5xxCount(),
    },
  };
}

export function getHealthSnapshot() {
  const snapshot = getMonitoringSnapshot();
  const reasons: string[] = [];

  if (
    snapshot.lookup.totalRequests >= 5 &&
    snapshot.lookup.lookupErrorRate >
      snapshot.thresholds.lookupErrorRate
  ) {
    reasons.push(
      `lookup error rate ${snapshot.lookup.lookupErrorRate} is above threshold ${snapshot.thresholds.lookupErrorRate}`,
    );
  }

  if (
    snapshot.auth.totalVerifications >= 5 &&
    snapshot.auth.failureRate > snapshot.thresholds.authFailureRate
  ) {
    reasons.push(
      `auth failure rate ${snapshot.auth.failureRate} is above threshold ${snapshot.thresholds.authFailureRate}`,
    );
  }

  if (
    snapshot.accountHistoryApi.totalRequests >= 5 &&
    snapshot.accountHistoryApi.operationalFailureRate >
      snapshot.thresholds.accountHistoryFailureRate
  ) {
    reasons.push(
      `account history operational failure rate ${snapshot.accountHistoryApi.operationalFailureRate} is above threshold ${snapshot.thresholds.accountHistoryFailureRate}`,
    );
  }

  if (
    snapshot.api.recentConsecutive5xx >=
    snapshot.thresholds.consecutive5xx
  ) {
    reasons.push(
      `${snapshot.api.recentConsecutive5xx} consecutive 5xx responses were recorded`,
    );
  }

  return {
    status: reasons.length > 0 ? "degraded" : "ok",
    reasons,
    summary: snapshot,
  };
}
