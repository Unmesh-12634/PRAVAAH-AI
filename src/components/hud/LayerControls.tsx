import React from 'react';
import {
  Layers,
  Wind,
  CloudRain,
  Waves,
  Building2,
  Navigation,
  Globe2,
  Compass,
  Route,
  Zap,
  X,
} from 'lucide-react';
import { LayerVisibility, CameraState } from '../../simulation/types';

interface LayerControlsProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerVisibility;
  cameraState: CameraState;
  onToggleLayer: (layerKey: keyof LayerVisibility) => void;
  onToggleCameraFollow: () => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  isOpen,
  onClose,
  layers,
  cameraState,
  onToggleLayer,
  onToggleCameraFollow,
}) => {
  if (!isOpen) return null;

  const items: {
    key: keyof LayerVisibility;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'cycloneTrack',
      label: 'Cyclone Forecast Track',
      icon: <Route className="w-4 h-4" />,
      color: 'text-tactical-cyan',
    },
    {
      key: 'uncertaintyCone',
      label: 'Forecast Uncertainty Cone',
      icon: <Layers className="w-4 h-4" />,
      color: 'text-cyan-400',
    },
    {
      key: 'windRadius',
      label: 'Wind Radius (34/50/64kt)',
      icon: <Wind className="w-4 h-4" />,
      color: 'text-tactical-orange',
    },
    {
      key: 'rainfall',
      label: 'Precipitation Heatmap',
      icon: <CloudRain className="w-4 h-4" />,
      color: 'text-tactical-teal',
    },
    {
      key: 'stormSurge',
      label: 'Storm Surge Inundation',
      icon: <Waves className="w-4 h-4" />,
      color: 'text-rose-400',
    },
    {
      key: 'floodRisk',
      label: 'River Basin Flood Zones',
      icon: <Waves className="w-4 h-4" />,
      color: 'text-blue-400',
    },
    {
      key: 'infrastructure',
      label: 'Critical Infrastructure',
      icon: <Building2 className="w-4 h-4" />,
      color: 'text-amber-400',
    },
    {
      key: 'evacuationRoutes',
      label: 'Evacuation Corridors',
      icon: <Navigation className="w-4 h-4" />,
      color: 'text-emerald-400',
    },
    {
      key: 'windStreamlines',
      label: 'Wind Flow Streamlines',
      icon: <Wind className="w-4 h-4" />,
      color: 'text-cyan-300',
    },
    {
      key: 'lightningEffects',
      label: 'Convective Eyewall Lightning',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-amber-300',
    },
    {
      key: 'photorealistic3D',
      label: 'Google 3D Elevation / Tiles',
      icon: <Globe2 className="w-4 h-4" />,
      color: 'text-tactical-cyan',
    },
  ];

  return (
    <div className="absolute top-20 right-6 z-40 w-72 bg-[#0c1322]/95 backdrop-blur-md border border-[#1f2e4d] rounded-2xl p-4 shadow-hud flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-[#1f2e4d]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-tactical-cyan" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Hazard & Geospatial Layers
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[#141e34] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle List */}
      <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
        {items.map((item) => {
          const active = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition border ${
                active
                  ? 'bg-[#141e34]/90 border-[#1f2e4d] text-slate-200'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={item.color}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              <span
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition ${
                  active
                    ? 'bg-tactical-cyan border-tactical-cyan'
                    : 'border-slate-600 bg-slate-900'
                }`}
              >
                {active && (
                  <span className="block w-1.5 h-1.5 bg-slate-950 rounded-sm" />
                )}
              </span>
            </button>
          );
        })}

        {/* Camera Follow Toggle */}
        <button
          onClick={onToggleCameraFollow}
          className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition border mt-1 pt-2 border-t border-[#1f2e4d] ${
            cameraState.followCyclone
              ? 'bg-[#141e34]/90 border-[#1f2e4d] text-slate-200'
              : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-tactical-cyan" />
            <span>Camera Follow Eye</span>
          </div>
          <span
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition ${
              cameraState.followCyclone
                ? 'bg-tactical-cyan border-tactical-cyan'
                : 'border-slate-600 bg-slate-900'
            }`}
          >
            {cameraState.followCyclone && (
              <span className="block w-1.5 h-1.5 bg-slate-950 rounded-sm" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
