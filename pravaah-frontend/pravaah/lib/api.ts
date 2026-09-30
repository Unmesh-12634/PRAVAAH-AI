/**
 * PRAVAAH AI - Resilient Backend Connection Client
 * Connects to the local/remote disaster telemetry backend with auto-fallback to simulation data.
 */

export interface BackendStatus {
  online: boolean;
  url: string;
  latencyMs?: number;
  lastChecked: Date;
}

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 2500;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check if the backend server is reachable
 */
export async function checkBackendHealth(): Promise<BackendStatus> {
  const startTime = Date.now();
  try {
    // Try both standard /api/health and /health
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).catch(() =>
      fetchWithTimeout(`${BACKEND_URL}/health`, {
        method: "GET",
        headers: { Accept: "application/json" },
      })
    );

    if (res && (res.ok || res.status === 200)) {
      return {
        online: true,
        url: BACKEND_URL,
        latencyMs: Date.now() - startTime,
        lastChecked: new Date(),
      };
    }
  } catch {
    // Backend unreachable, silent fallback
  }

  return {
    online: false,
    url: BACKEND_URL,
    lastChecked: new Date(),
  };
}

/**
 * Fetch live cyclone Michaung telemetry from backend or return fallback
 */
export async function getLiveTelemetry(fallbackData: any): Promise<{ data: any; isLive: boolean }> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/telemetry`);
    if (res.ok) {
      const json = await res.json();
      return { data: json, isLive: true };
    }
  } catch {
    // Fall back to local simulation data
  }
  return { data: fallbackData, isLive: false };
}

/**
 * Fetch district readiness matrix from backend or return fallback
 */
export async function getDistrictReadiness(fallbackData: any): Promise<{ data: any; isLive: boolean }> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/districts`);
    if (res.ok) {
      const json = await res.json();
      return { data: json, isLive: true };
    }
  } catch {
    // Fall back to local simulation data
  }
  return { data: fallbackData, isLive: false };
}
