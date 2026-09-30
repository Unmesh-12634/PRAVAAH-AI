"use client";

import React, { useEffect, useState } from "react";
import { checkBackendHealth, BackendStatus, BACKEND_URL } from "@/lib/api";

export default function BackendStatusIndicator() {
  const [status, setStatus] = useState<BackendStatus>({
    online: false,
    url: BACKEND_URL,
    lastChecked: new Date(),
  });
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const performCheck = async () => {
      setChecking(true);
      const res = await checkBackendHealth();
      if (mounted) {
        setStatus(res);
        setChecking(false);
      }
    };

    performCheck();
    // Poll every 15 seconds in background
    const interval = setInterval(performCheck, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-code border transition-all ${
        status.online
          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
          : "bg-slate-100 text-slate-700 border-slate-300"
      }`}
      title={
        status.online
          ? `Backend connected at ${status.url} (Latency: ${status.latencyMs}ms)`
          : `Local backend at ${status.url} is offline or not yet started. Operating in Standalone Simulation Mode.`
      }
    >
      <span
        className={`w-2 h-2 rounded-full ${
          checking
            ? "bg-amber-400 animate-spin"
            : status.online
            ? "bg-emerald-500 animate-pulse"
            : "bg-slate-400"
        }`}
      />
      <span className="font-bold">
        {status.online ? "EOC BACKEND: LIVE" : "EOC SIMULATION: AUTONOMOUS"}
      </span>
      <span className="text-slate-400 hidden lg:inline">[{status.url.replace("http://", "")}]</span>
    </div>
  );
}
