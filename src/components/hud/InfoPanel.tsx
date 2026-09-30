import React from 'react';
import {
  Building2,
  AlertTriangle,
  ShieldAlert,
  Wind,
  CloudRain,
  Mountain,
  X,
  Radio,
} from 'lucide-react';
import { EvaluatedInfrastructure } from '../../simulation/riskAnimation';

interface InfoPanelProps {
  infrastructure: EvaluatedInfrastructure | null;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ infrastructure, onClose }) => {
  if (!infrastructure) return null;

  const riskBadge = {
    safe: { label: 'SECURE', bg: 'bg-emerald-950/80', border: 'border-emerald-500', text: 'text-emerald-300' },
    advisory: { label: 'ADVISORY', bg: 'bg-yellow-950/80', border: 'border-yellow-500', text: 'text-yellow-300' },
    warning: { label: 'WARNING', bg: 'bg-amber-950/80', border: 'border-amber-500', text: 'text-amber-300' },
    danger: { label: 'CRITICAL / EYEPATH', bg: 'bg-rose-950/80', border: 'border-rose-500', text: 'text-rose-300' },
  }[infrastructure.currentRisk];

  return (
    <div className="absolute top-20 left-6 z-40 w-80 bg-[#0c1322]/95 backdrop-blur-md border border-[#1f2e4d] rounded-2xl p-4 shadow-hud flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-2 border-b border-[#1f2e4d]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-command-700/80 border border-command-border text-tactical-cyan">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              INFRASTRUCTURE TELEMETRY
            </span>
            <h2 className="text-sm font-bold text-white leading-tight">
              {infrastructure.name}
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[#141e34] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Threat Status Ribbon */}
      <div className={`flex items-center justify-between p-2 rounded-lg border ${riskBadge.bg} ${riskBadge.border}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${riskBadge.text}`} />
          <span className={`text-xs font-mono font-bold ${riskBadge.text}`}>
            {riskBadge.label}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-300">
          {infrastructure.distanceToEyeKm} km from eye
        </span>
      </div>

      {/* Threat Context */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#141e34]/60 p-2.5 rounded-lg border border-[#1f2e4d]/70">
        {infrastructure.threatDescription}
      </p>

      {/* Vital Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#141e34]/70 p-2 rounded-lg border border-[#1f2e4d]/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-0.5">
            <Wind className="w-3 h-3 text-tactical-orange" />
            <span>WIND IMPACT</span>
          </div>
          <span className="text-sm font-bold text-white">
            {infrastructure.windExposureKmph} <span className="text-[10px] font-normal text-slate-400">km/h</span>
          </span>
        </div>

        <div className="bg-[#141e34]/70 p-2 rounded-lg border border-[#1f2e4d]/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-0.5">
            <CloudRain className="w-3 h-3 text-tactical-teal" />
            <span>PRECIPITATION</span>
          </div>
          <span className="text-sm font-bold text-white">
            {infrastructure.rainfallExposureMm} <span className="text-[10px] font-normal text-slate-400">mm/24h</span>
          </span>
        </div>

        <div className="bg-[#141e34]/70 p-2 rounded-lg border border-[#1f2e4d]/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-0.5">
            <Mountain className="w-3 h-3 text-tactical-cyan" />
            <span>ELEVATION</span>
          </div>
          <span className="text-sm font-bold text-white">
            +{infrastructure.elevation_m} <span className="text-[10px] font-normal text-slate-400">m MSL</span>
          </span>
        </div>

        <div className="bg-[#141e34]/70 p-2 rounded-lg border border-[#1f2e4d]/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-0.5">
            <ShieldAlert className="w-3 h-3 text-tactical-amber" />
            <span>FACILITY STATUS</span>
          </div>
          <span className="text-xs font-bold uppercase text-tactical-amber truncate block">
            {infrastructure.status}
          </span>
        </div>
      </div>

      {infrastructure.capacity && (
        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-[#1f2e4d]">
          <span>CAPACITY SPEC:</span>
          <span className="text-slate-200">{infrastructure.capacity}</span>
        </div>
      )}
    </div>
  );
};
