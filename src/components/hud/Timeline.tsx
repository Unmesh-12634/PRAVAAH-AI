import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Crosshair } from 'lucide-react';
import { SimulationEngineState } from '../../simulation/simulationEngine';

interface TimelineProps {
  engine: SimulationEngineState & {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    reset: () => void;
    seekTo: (hour: number) => void;
    setSpeed: (speed: 1 | 2 | 4) => void;
  };
  onFocusCyclone?: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ engine, onFocusCyclone }) => {
  const { currentHour, maxHour, isPlaying, speed, payload } = engine;

  // Milestone hours from forecast points
  const milestones = [
    0,
    ...payload.forecast.map((f) => f.hour).filter((h) => h > 0),
  ].sort((a, b) => a - b);

  const progressPercent = Math.min(100, (currentHour / maxHour) * 100);

  return (
    <div className="absolute bottom-4 left-6 right-6 z-30 pointer-events-none flex flex-col items-center">
      <div className="pointer-events-auto w-full max-w-3xl bg-[#0c1322]/95 backdrop-blur-md border border-[#1f2e4d] rounded-2xl p-3.5 shadow-hud flex flex-col gap-2.5">
        {/* Scrubber & Milestone Labels */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-tactical-cyan font-bold">
              <Clock className="w-3.5 h-3.5" />
              TIMELINE: T+{currentHour.toFixed(1)}h
            </span>
            <span className="text-slate-500">FORECAST HORIZON: T+{maxHour}h</span>
          </div>

          {/* Interactive Range Slider */}
          <div className="relative w-full flex items-center h-6 cursor-pointer">
            {/* Background Track */}
            <div className="absolute left-0 right-0 h-2 bg-[#141e34] rounded-full overflow-hidden border border-[#1f2e4d]">
              <div
                className="h-full bg-gradient-to-r from-tactical-cyan via-tactical-orange to-tactical-red transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Native Slider Input for Smooth Dragging */}
            <input
              type="range"
              min="0"
              max={maxHour}
              step="0.05"
              value={currentHour}
              onChange={(e) => engine.seekTo(parseFloat(e.target.value))}
              className="absolute left-0 right-0 w-full opacity-0 cursor-pointer h-6 z-10"
            />

            {/* Custom glowing thumb indicator */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-tactical-cyan rounded-full shadow-glow-cyan pointer-events-none -translate-x-1/2 transition-transform duration-75"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Milestone Ticks */}
          <div className="relative w-full flex justify-between px-0.5 mt-0.5">
            {milestones.map((h) => {
              const isActive = currentHour >= h;
              const isCurrent = Math.abs(currentHour - h) < 0.3;
              return (
                <button
                  key={h}
                  onClick={() => engine.seekTo(h)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <span
                    className={`w-1 h-2 rounded-full mb-1 transition ${
                      isCurrent
                        ? 'bg-tactical-cyan h-3 w-1.5 shadow-glow-cyan'
                        : isActive
                        ? 'bg-slate-400'
                        : 'bg-slate-700'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono tracking-tight transition ${
                      isCurrent
                        ? 'text-tactical-cyan font-bold'
                        : isActive
                        ? 'text-slate-300'
                        : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  >
                    T+{h}h
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f2e4d]/70">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={engine.togglePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition active:scale-95 shadow-md ${
                isPlaying
                  ? 'bg-tactical-amber text-slate-950 hover:bg-tactical-amber/90 shadow-glow-amber'
                  : 'bg-tactical-cyan text-slate-950 hover:bg-tactical-cyan/90 shadow-glow-cyan'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY SIMULATION</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={engine.reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141e34] hover:bg-[#1e2c49] border border-[#1f2e4d] text-slate-300 hover:text-white font-mono text-xs transition active:scale-95"
              title="Reset Timeline to T+0h"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>

            {/* Target Lock / Focus Cyclone Button */}
            {onFocusCyclone && (
              <button
                onClick={onFocusCyclone}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-tactical-red to-tactical-orange hover:brightness-110 border border-red-500/50 text-white font-mono text-xs font-bold transition active:scale-95 shadow-glow-red ml-1"
                title="Fly camera down directly to the Cyclone Eye at close range"
              >
                <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>🎯 FOCUS EYE</span>
              </button>
            )}
          </div>

          {/* Speed Multiplier 1x / 2x / 4x */}
          <div className="flex items-center gap-1 bg-[#141e34] p-1 rounded-lg border border-[#1f2e4d]">
            <span className="text-[10px] font-mono text-slate-500 px-1.5 uppercase">Speed</span>
            {([1, 2, 4] as const).map((s) => (
              <button
                key={s}
                onClick={() => engine.setSpeed(s)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                  speed === s
                    ? 'bg-tactical-cyan text-slate-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
