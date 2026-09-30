"use client";

import React, { useState } from "react";
import { LAYER_GROUPS, LayerState } from "@/data/riskMapData";

interface LayerControlProps {
  layers: LayerState;
  onToggleLayer: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function LayerControl({ layers, onToggleLayer, isOpen, onClose }: LayerControlProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(LAYER_GROUPS.map((g) => [g.id, true]))
  );

  const toggleGroup = (id: string) =>
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!isOpen) return null;

  const totalActive = Object.values(layers).filter(Boolean).length;

  return (
    <div
      className="absolute top-12 left-2 z-40 w-[230px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden select-none"
      style={{ maxHeight: "calc(100% - 60px)", overflowY: "auto" }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-blue-600">layers</span>
          <span className="text-xs font-bold text-[#0A2540] font-heading">Layer Control</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold font-code px-1.5 py-0.5 rounded">
            {totalActive}
          </span>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Layer Groups */}
      <div className="p-2 space-y-1">
        {LAYER_GROUPS.map((group) => (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-left hover:bg-slate-50 rounded-lg transition"
            >
              <span className="text-[10px] font-bold text-slate-500 font-code tracking-wider uppercase">
                {group.label}
              </span>
              <span className="material-symbols-outlined text-[13px] text-slate-400">
                {expandedGroups[group.id] ? "expand_less" : "expand_more"}
              </span>
            </button>

            {expandedGroups[group.id] && (
              <div className="space-y-0.5 ml-1">
                {group.layers.map((layer) => {
                  const isOn = !!layers[layer.id];
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => onToggleLayer(layer.id)}
                      className={[
                        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition",
                        isOn ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-50",
                      ].join(" ")}
                      title={layer.description}
                    >
                      <div
                        className={[
                          "w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition",
                          isOn ? "border-transparent" : "border-slate-300 bg-white",
                        ].join(" ")}
                        style={{ backgroundColor: isOn ? layer.color : undefined }}
                      >
                        {isOn && (
                          <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                        )}
                      </div>
                      <span
                        className={[
                          "text-[11px] font-medium flex-1",
                          isOn ? "text-slate-800" : "text-slate-500",
                        ].join(" ")}
                      >
                        {layer.label}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full shrink-0 opacity-60"
                        style={{ backgroundColor: layer.color }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="h-px bg-slate-100 mx-2 mt-1" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
        <button
          type="button"
          onClick={() =>
            LAYER_GROUPS.flatMap((g) => g.layers).forEach((l) => {
              if (!!layers[l.id] !== l.defaultOn) onToggleLayer(l.id);
            })
          }
          className="text-[10px] text-blue-600 font-semibold hover:text-blue-800 transition font-code"
        >
          ↺ Reset to defaults
        </button>
      </div>
    </div>
  );
}
