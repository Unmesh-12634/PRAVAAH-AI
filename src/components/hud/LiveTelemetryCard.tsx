import React from 'react';
import { X, Wind, Gauge, Droplets, Compass, Navigation, Radio, MapPin, Loader2 } from 'lucide-react';
import { LivePointTelemetry } from '../../simulation/liveCycloneService';

interface LiveTelemetryCardProps {
  telemetry: LivePointTelemetry | null;
  onClose: () => void;
  onFlyTo?: (lat: number, lon: number) => void;
}

export const LiveTelemetryCard: React.FC<LiveTelemetryCardProps> = ({
  telemetry,
  onClose,
  onFlyTo,
}) => {
  if (!telemetry) return null;

  return (
    <div className="absolute top-24 left-6 z-40 w-80 bg-[#0c1322]/95 backdrop-blur-md border border-[#1f2e4d] rounded-2xl p-4 shadow-hud flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#1f2e4d]/70 pb-2.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              LIVE SATELLITE TELEMETRY
            </span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-tactical-cyan" />
            <span>{telemetry.title}</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">
            SOURCE: {telemetry.source}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
          title="Close telemetry card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {telemetry.isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 font-mono text-xs">
          <Loader2 className="w-6 h-6 text-tactical-cyan animate-spin" />
          <span>QUERYING REAL-TIME METEOROLOGY...</span>
        </div>
      ) : (
        <>
          {/* Coordinates & Timestamp */}
          <div className="flex items-center justify-between text-[11px] font-mono bg-[#141e34]/70 px-2.5 py-1.5 rounded-lg border border-[#1f2e4d]">
            <span className="text-slate-300 font-semibold">
              LAT {telemetry.lat.toFixed(3)}° • LON {telemetry.lon.toFixed(3)}°
            </span>
            <span className="text-slate-400 text-[10px]">
              {new Date(telemetry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
            </span>
          </div>

          {/* Core Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Wind Speed */}
            <div className="bg-[#141e34]/50 p-2.5 rounded-xl border border-[#1f2e4d]/80 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-tactical-cyan" />
                SURFACE WIND
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-tactical-cyan">
                  {telemetry.windSpeedKmph}
                </span>
                <span className="text-[10px] text-slate-400">km/h</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({telemetry.windSpeedKts} kts)
                </span>
              </div>
              <span className="text-[9px] text-slate-500">
                Gusts: {telemetry.windGustsKmph} km/h
              </span>
            </div>

            {/* Pressure */}
            <div className="bg-[#141e34]/50 p-2.5 rounded-xl border border-[#1f2e4d]/80 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-tactical-amber" />
                PRESSURE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-tactical-amber">
                  {telemetry.pressureHpa}
                </span>
                <span className="text-[10px] text-slate-400">hPa</span>
              </div>
              <span className="text-[9px] text-slate-500">
                Temp: {telemetry.temperatureC}°C
              </span>
            </div>

            {/* Precipitation */}
            <div className="bg-[#141e34]/50 p-2.5 rounded-xl border border-[#1f2e4d]/80 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-tactical-teal" />
                PRECIPITATION
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-tactical-teal">
                  {telemetry.precipitationMm}
                </span>
                <span className="text-[10px] text-slate-400">mm/h</span>
              </div>
              <span className="text-[9px] text-slate-500">
                {telemetry.precipitationMm > 15 ? 'Heavy Storm' : telemetry.precipitationMm > 2 ? 'Moderate Rain' : 'Trace / Clear'}
              </span>
            </div>

            {/* Proximity to Eye */}
            <div className="bg-[#141e34]/50 p-2.5 rounded-xl border border-[#1f2e4d]/80 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-rose-400" />
                CYCLONE EYE
              </span>
              {telemetry.distanceToEyeKm !== undefined ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-rose-400">
                      {telemetry.distanceToEyeKm}
                    </span>
                    <span className="text-[10px] text-slate-400">km</span>
                  </div>
                  <span className="text-[9px] text-slate-500">
                    Bearing: {telemetry.bearingToEyeDeg}°
                  </span>
                </>
              ) : (
                <span className="text-[10px] text-slate-400 py-1">Eye Center</span>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          {onFlyTo && (
            <button
              onClick={() => onFlyTo(telemetry.lat, telemetry.lon)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-tactical-cyan/15 hover:bg-tactical-cyan/25 border border-tactical-cyan/60 text-tactical-cyan hover:text-white font-mono text-xs font-semibold transition active:scale-95 shadow-glow-cyan"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>FLY CAMERA TO LOCATION</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};
