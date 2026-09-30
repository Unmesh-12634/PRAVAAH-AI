import React from 'react';
import {
  Globe2,
  Wind,
  ShieldAlert,
  AlertTriangle,
  Play,
  Activity,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface DashboardMockProps {
  onOpenSimulation: () => void;
}

export const DashboardMock: React.FC<DashboardMockProps> = ({ onOpenSimulation }) => {
  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Operations Navbar */}
      <header className="h-16 border-b border-[#1f2e4d] bg-[#0c1322]/90 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-tactical-cyan/15 border border-tactical-cyan/40 flex items-center justify-center text-tactical-cyan">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-2">
              VAYU-SHIELD <span className="text-xs px-2 py-0.5 rounded bg-tactical-red/20 border border-tactical-red/40 text-tactical-red font-mono">INCIDENT COMMAND</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">National Disaster Management & Prediction Operations</p>
          </div>
        </div>

        {/* Primary CTA: Launch 3D Simulation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#141e34] px-3 py-1.5 rounded-lg border border-[#1f2e4d]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GEO-RADAR SYNCHRONIZED</span>
          </div>

          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-tactical-cyan to-tactical-teal text-slate-950 font-mono font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-95 transition-all group"
          >
            <Globe2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>LAUNCH 3D DISASTER SIMULATION</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Urgent Alert Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 to-slate-900/80 border border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-900/50 border border-red-500/60 text-red-300">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono text-red-400 font-semibold uppercase tracking-wider block">
                CYCLONE ALERT: CATEGORY 4 IMPACT ENVELOPE DETECTED
              </span>
              <p className="text-sm text-slate-200">
                Deep Depression intensified into a Very Severe Cyclonic Storm approaching Andhra Pradesh / Bay of Bengal coast. Estimated landfall in 9 hours.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSimulation}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition shadow-glow-red flex items-center gap-2 shrink-0 ml-4"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            OPEN 3D VIEWPORT
          </button>
        </div>

        {/* Operational Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1f2e4d] flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>CYCLONE TRACK TARGET</span>
              <MapPin className="w-4 h-4 text-tactical-cyan" />
            </div>
            <span className="text-xl font-bold text-white font-mono">16.85°N, 82.24°E</span>
            <span className="text-xs text-slate-400 font-mono">East Godavari / Kakinada Coast</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1f2e4d] flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>PEAK WIND SPEED</span>
              <Wind className="w-4 h-4 text-tactical-orange" />
            </div>
            <span className="text-xl font-bold text-tactical-cyan font-mono">145 - 150 km/h</span>
            <span className="text-xs text-tactical-amber font-mono">Destructive Eyewall Gusts</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1f2e4d] flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>POPULATION IN RISK ZONE</span>
              <Activity className="w-4 h-4 text-tactical-red" />
            </div>
            <span className="text-xl font-bold text-white font-mono">1.48 Million</span>
            <span className="text-xs text-rose-400 font-mono">22 High-Tide Coastal Panchayats</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0c1322] border border-[#1f2e4d] flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>SHELTERS OPERATIONAL</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-emerald-400 font-mono">48 Centers</span>
            <span className="text-xs text-slate-400 font-mono">Capacity: 120,000 Persons</span>
          </div>
        </div>

        {/* 3D Visualizer Launcher Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-[#1f2e4d] bg-[#0c1322] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-hud">
          <div className="absolute inset-0 bg-gradient-to-r from-tactical-cyan/10 via-transparent to-tactical-teal/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-tactical-cyan tracking-widest uppercase">
              3D Geospatial Digital Twin
            </span>
            <h2 className="text-2xl font-bold text-white">
              Full-Screen Photorealistic Disaster Simulation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step inside the full-screen command center powered by Google Photorealistic 3D Tiles and CesiumJS. Simulate wind radii, rainfall envelopes, storm surge, floodplains, and live critical infrastructure proximity risk across a dynamic timeline.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenSimulation}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-tactical-cyan hover:bg-tactical-cyan/90 text-slate-950 font-mono font-bold text-sm shadow-glow-cyan transition active:scale-95 cursor-pointer"
            >
              <Globe2 className="w-5 h-5" />
              <span>ENTER 3D COMMAND VIEWPORT</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
