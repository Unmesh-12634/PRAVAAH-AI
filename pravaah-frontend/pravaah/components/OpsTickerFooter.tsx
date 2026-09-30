"use client";

import React from "react";

export default function OpsTickerFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between text-xs text-slate-500 shrink-0 gap-2">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="inline-flex items-center gap-1.5 text-blue-700 font-bold font-code text-[11px] shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          OPS FEED:
        </span>
        <div className="relative overflow-hidden whitespace-nowrap">
          <p className="text-slate-700 font-medium truncate max-w-4xl text-xs">
            NDRF 10 Bn deployed in Nellore &amp; Prakasam • SDRF 4 Coys positioned at Ongole • 28 Multi-purpose cyclone shelters active • 42,000 citizens safely evacuated to relief centers • All 540 registered trawlers safely anchored at Machilipatnam Harbor • 150 kVA Mobile Generators verified en route.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-code text-slate-400 shrink-0">
        <span>NIC-DR-SRV04</span>
        <span>•</span>
        <span className="font-semibold text-slate-500">CONFIDENTIAL — EOC INTERNAL USE ONLY</span>
      </div>
    </footer>
  );
}
