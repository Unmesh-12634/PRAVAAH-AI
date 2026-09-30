"use client";

import React, { useState } from "react";

interface ActionModalsProps {
  sitRepOpen: boolean;
  onCloseSitRep: () => void;
  broadcastOpen: boolean;
  onCloseBroadcast: () => void;
  convoyOpen: boolean;
  onCloseConvoy: () => void;
  toastMessage: string | null;
}

export default function ActionModals({
  sitRepOpen,
  onCloseSitRep,
  broadcastOpen,
  onCloseBroadcast,
  convoyOpen,
  onCloseConvoy,
  toastMessage,
}: ActionModalsProps) {
  const [cellMessageSent, setCellMessageSent] = useState(false);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-[#0A2540] text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            check_circle
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* SitRep PDF Modal */}
      {sitRepOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">
                  picture_as_pdf
                </span>
                <span className="font-heading font-bold text-sm">
                  Official Situation Report (SitRep #18)
                </span>
              </div>
              <button
                onClick={onCloseSitRep}
                className="text-slate-300 hover:text-white transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-code">
                <div className="flex justify-between text-slate-500">
                  <span>DOCUMENT ID:</span>
                  <span className="font-bold text-slate-800">APSDMA-MICHAUNG-SR18</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CLASSIFICATION:</span>
                  <span className="font-bold text-rose-600">RESTRICTED - EOC DISPATCH</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>TIMESTAMP:</span>
                  <span className="font-bold text-slate-800">04 DEC 2023 | 06:30 IST</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-sm text-[#0A2540]">Executive Brief</h5>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Severe Cyclonic Storm &ldquo;MICHAUNG&rdquo; located over West-Central Bay of Bengal, 14.8°N, 80.6°E. Projected landfall in Bapatla sector within T-12 hours with sustained speeds of 90-100 kmph gusting to 110 kmph. Coastal storm surge inundation of 1.2m–1.5m anticipated during peak high tide.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-red-50 rounded border border-red-200">
                  <span className="text-[10px] font-bold text-red-700 uppercase font-code">
                    Evacuation Progress
                  </span>
                  <p className="text-sm font-extrabold text-red-800 mt-0.5">
                    42,000 / 62,000
                  </p>
                  <span className="text-[10px] text-slate-500">67.7% target met</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase font-code">
                    Shelters Operational
                  </span>
                  <p className="text-sm font-extrabold text-emerald-800 mt-0.5">
                    48 Multi-Purpose
                  </p>
                  <span className="text-[10px] text-slate-500">Stocked for 72 hrs</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={onCloseSitRep}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Simulated PDF Download: APSDMA-MICHAUNG-SR18.pdf initiated");
                  onCloseSitRep();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white shadow-xs transition"
              >
                Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Cell Alert Modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            <div className="bg-red-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-pulse">campaign</span>
                <span className="font-heading font-bold text-sm">
                  Common Alerting Protocol (CAP) — Cell Broadcast
                </span>
              </div>
              <button
                onClick={onCloseBroadcast}
                className="text-white/80 hover:text-white transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-800 font-code">
                    TARGET: 4 COASTAL DISTRICTS
                  </span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    EMERGENCY FLASH
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Broadcast will transmit via all cell towers in Bapatla, Prakasam, Nellore, and Krishna across Jio, Airtel, and BSNL networks with high-priority audio override.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Multilingual Alert Script (Telugu &amp; English):
                </label>
                <div className="p-3 bg-slate-50 border border-slate-300 rounded font-code text-[11px] leading-relaxed text-slate-800">
                  <p className="text-blue-900 font-semibold mb-1">
                    [తెలుగు] తుఫాను మిచాంగ్ హెచ్చరిక: బాపట్ల, ప్రకాశం, నెల్లూరు తీర ప్రాంత ప్రజలు వెంటనే సురక్షిత తుఫాను పునరావాస కేంద్రాలకు తరలివెళ్లవలసిందిగా కోరడమైనది.
                  </p>
                  <p className="text-slate-600">
                    [ENGLISH] Severe Cyclone Michaung Warning: Immediate evacuation advised for coastal zones of Bapatla &amp; Prakasam. Seek authorized cyclone shelter. Toll Free 1070.
                  </p>
                </div>
              </div>

              {cellMessageSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">
                    check_circle
                  </span>
                  <span>Cell Broadcast Dispatched across 48 Telecom Base Stations!</span>
                </div>
              ) : null}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={onCloseBroadcast}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCellMessageSent(true);
                  setTimeout(() => {
                    onCloseBroadcast();
                    setCellMessageSent(false);
                  }, 1800);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs transition active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                Authorize &amp; Transmit Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Convoy Modal */}
      {convoyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">
                  local_shipping
                </span>
                <span className="font-heading font-bold text-sm">
                  APCPDCL Mobile DG Convoy Telemetry
                </span>
              </div>
              <button
                onClick={onCloseConvoy}
                className="text-slate-300 hover:text-white transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between font-code">
                <div>
                  <span className="text-amber-800 font-bold block">CONVOY ID: DG-AP-09</span>
                  <span className="text-[11px] text-slate-600">3x 150 kVA Cummins Heavy Gensets</span>
                </div>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">
                  ETA: 38 MIN
                </span>
              </div>

              <div className="space-y-2 border-l-2 border-blue-500 pl-3 ml-2 font-code">
                <div>
                  <span className="text-slate-400 text-[10px]">06:12 IST</span>
                  <p className="font-semibold text-slate-800">Departed Guntur Power Depot</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">06:24 IST</span>
                  <p className="font-semibold text-slate-800">Passed Chilakaluripet Tollway (KM-312)</p>
                </div>
                <div>
                  <span className="text-blue-600 font-bold text-[10px]">06:30 IST (CURRENT)</span>
                  <p className="font-bold text-blue-900">En route to Ongole RIMS &amp; Bapatla Area Hospital</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={onCloseConvoy}
                className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-xs font-bold text-white transition"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
