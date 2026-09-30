import React from 'react';
import { Compass, Layers, LogOut, Radio } from 'lucide-react';
import { SimulationEngineState } from '../../simulation/simulationEngine';
import { getCycloneClassification } from '../../simulation/geographicUtils';

interface TopBarProps {
  engine: SimulationEngineState & {
    toggleCameraFollow: () => void;
    switchScenario: (key: string) => void;
    toggleSatelliteMode: () => void;
  };
  onToggleLayerPanel: () => void;
  isLayerPanelOpen: boolean;
  onExit: () => void;
  google3DStatus?: 'idle' | 'active' | 'satellite';
  importedKmlName?: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  engine,
  onToggleLayerPanel,
  isLayerPanelOpen,
  onExit,
  google3DStatus = 'satellite',
  importedKmlName,
}) => {
  const { cycloneState, payload, cameraState, selectedScenarioKey, layers } = engine;
  const classification = getCycloneClassification(cycloneState.wind_kmph);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-3.5 pointer-events-none flex items-start justify-between gap-4">
      {/* Top Left: Mission Title & Live Atmospheric Telemetry Card */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-tactical-red animate-ping" />
          <span className="font-mono text-xs tracking-wider text-tactical-cyan font-bold uppercase drop-shadow-sm">
            3D DISASTER SIMULATION COMMAND
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-command-700/80 border border-command-border text-slate-400">
            SEC-OPS LIVE
          </span>
        </div>

        {/* Cyclone Telemetry HUD Card */}
        <div className="bg-[#0c1322]/90 backdrop-blur-md border border-[#1f2e4d] rounded-xl p-3 shadow-hud min-w-[280px]">
          <div className="flex items-baseline justify-between mb-1.5">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-tactical-orange" />
              {payload.cyclone.name}
            </h1>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${classification.badgeColor}`}>
              {classification.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1.5 border-t border-[#1f2e4d]/60">
            <div>
              <span className="text-slate-400 text-[10px] block">WIND INTENSITY</span>
              <span className="text-tactical-cyan font-bold text-sm">
                {cycloneState.wind_kmph} <span className="text-[10px] font-normal text-slate-300">km/h</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">CENTRAL PRESSURE</span>
              <span className="text-tactical-amber font-bold text-sm">
                {cycloneState.pressure_hpa} <span className="text-[10px] font-normal text-slate-300">hPa</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">PEAK RAINFALL</span>
              <span className="text-tactical-teal font-semibold">
                {cycloneState.rainfall_mm} <span className="text-[10px] font-normal text-slate-300">mm/24h</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">STORM SURGE</span>
              <span className="text-rose-400 font-semibold">
                +{cycloneState.surge_m} <span className="text-[10px] font-normal text-slate-300">meters</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Center: Unified Status Badge & Satellite Imagery Mode Pill */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 mt-0.5">
        {/* Geospatial Engine Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1322]/90 backdrop-blur-md border border-[#1f2e4d] text-[11px] font-mono shadow-hud">
          <span
            className={`w-2 h-2 rounded-full ${
              google3DStatus === 'active'
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                : 'bg-tactical-cyan animate-pulse shadow-[0_0_8px_#00f0ff]'
            }`}
          />
          <span className="text-slate-200 font-semibold tracking-wide">
            {google3DStatus === 'active'
              ? 'GOOGLE 3D TILES'
              : 'GOOGLE EARTH 3D SATELLITE'}
          </span>
          <span className="text-slate-600 font-sans">|</span>
          <span className="text-slate-400 font-mono text-[10px]">
            LAT {cycloneState.lat.toFixed(2)}°N • LON {cycloneState.lon.toFixed(2)}°E
          </span>
          {importedKmlName && (
            <>
              <span className="text-slate-600 font-sans">|</span>
              <span className="text-tactical-teal font-mono text-[10px]">
                KML: {importedKmlName}
              </span>
            </>
          )}
        </div>

        {/* Satellite Imagery View Switcher */}
        <div className="flex items-center bg-[#0c1322]/90 backdrop-blur-md border border-[#1f2e4d] rounded-lg p-0.5 shadow-hud text-[11px] font-mono">
          <button
            onClick={() => {
              if (layers.satelliteMode !== 'natural') {
                engine.toggleSatelliteMode();
              }
            }}
            className={`px-2.5 py-1 rounded transition ${
              layers.satelliteMode === 'natural'
                ? 'bg-tactical-cyan text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛰️ NASA VISIBLE
          </button>
          <button
            onClick={() => {
              if (layers.satelliteMode !== 'infrared') {
                engine.toggleSatelliteMode();
              }
            }}
            className={`px-2.5 py-1 rounded transition ${
              layers.satelliteMode === 'infrared'
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-slate-950 font-bold shadow-glow-red'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌡️ DVORAK IR
          </button>
        </div>
      </div>

      {/* Top Right: Tactical HUD Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Scenario Switcher Dropdown */}
        <div className="relative">
          <select
            value={selectedScenarioKey}
            onChange={(e) => engine.switchScenario(e.target.value)}
            className="bg-[#0c1322]/90 backdrop-blur-md border border-[#1f2e4d] text-slate-200 text-xs font-mono rounded-lg px-2.5 py-2 outline-none hover:border-tactical-cyan transition cursor-pointer"
          >
            <option value="demo">Scenario: Demo Cyclone (Mock)</option>
            <option value="super">Scenario: Cat-5 VAJRA (Landfall)</option>
          </select>
        </div>

        {/* Camera Follow Toggle */}
        <button
          onClick={engine.toggleCameraFollow}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-medium transition backdrop-blur-md ${
            cameraState.followCyclone
              ? 'bg-tactical-cyan/15 border-tactical-cyan text-tactical-cyan shadow-glow-cyan'
              : 'bg-[#0c1322]/90 border-[#1f2e4d] text-slate-400 hover:text-white'
          }`}
          title="Toggle smooth camera tracking of the cyclone eye"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{cameraState.followCyclone ? 'CAM: FOLLOW' : 'CAM: FREE'}</span>
        </button>

        {/* Layers Drawer Toggle Button */}
        <button
          onClick={onToggleLayerPanel}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-medium transition backdrop-blur-md ${
            isLayerPanelOpen
              ? 'bg-tactical-cyan/20 border-tactical-cyan text-tactical-cyan'
              : 'bg-[#0c1322]/90 border-[#1f2e4d] text-slate-300 hover:text-white hover:border-slate-500'
          }`}
          title="Toggle Simulation Layer Controls"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LAYERS</span>
        </button>

        {/* Exit Command Center -> Returns to Dashboard */}
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900/90 border border-red-500/60 text-red-200 hover:text-white text-xs font-mono font-semibold transition backdrop-blur-md shadow-sm active:scale-95"
          title="Return to primary disaster dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>EXIT</span>
        </button>
      </div>
    </header>
  );
};
