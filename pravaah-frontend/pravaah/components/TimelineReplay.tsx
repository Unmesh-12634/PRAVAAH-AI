"use client";

import React, { useState, useEffect } from "react";

const STEPS = [
  { id: "t36", label: "T-36h Warning", percent: 0, time: "-36:00:00" },
  { id: "t24", label: "T-24h Evacuation", percent: 30, time: "-24:00:00" },
  { id: "t12", label: "T-12h Rainbands (Current)", percent: 60, time: "-12:00:00", current: true },
  { id: "t6", label: "T-6h Surge", percent: 85, time: "-06:00:00" },
  { id: "landfall", label: "Landfall (Bapatla)", percent: 100, time: "00:00:00" },
];

export default function TimelineReplay() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [progress, setProgress] = useState(60);
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + 0.5 * speed);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setProgress(STEPS[index].percent);
  };

  const handlePrevious = () => {
    const nextIdx = Math.max(0, currentStepIndex - 1);
    handleStepClick(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(STEPS.length - 1, currentStepIndex + 1);
    handleStepClick(nextIdx);
  };

  const calculateDisplayTime = () => {
    const totalMinutes = 36 * 60;
    const elapsedMinutes = (progress / 100) * totalMinutes;
    const remainingMinutes = Math.round(totalMinutes - elapsedMinutes);
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (remainingMinutes === 0) return "00:00:00 (LANDFALL)";
    return `-${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
  };

  return (
    <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-code">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            title="Previous step"
            className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">skip_previous</span>
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause simulation" : "Play simulation"}
            className="w-7 h-7 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <button
            onClick={handleNext}
            title="Next step"
            className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">skip_next</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded text-[11px] font-bold text-slate-600 ml-1">
            <button
              onClick={() => setSpeed(1)}
              className={`px-1.5 py-0.5 rounded transition ${
                speed === 1 ? "bg-white shadow-xs text-blue-700" : "text-slate-500"
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(2)}
              className={`px-1.5 py-0.5 rounded transition ${
                speed === 2 ? "bg-white shadow-xs text-blue-700" : "text-slate-500"
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              className={`px-1.5 py-0.5 rounded transition ${
                speed === 4 ? "bg-white shadow-xs text-blue-700" : "text-slate-500"
              }`}
            >
              4x
            </button>
          </div>
        </div>

        {/* Replay Step Markers & Scrubber Bar */}
        <div className="flex-1 min-w-[280px] mx-2 sm:mx-6 flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] text-slate-500">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`transition hover:text-slate-900 ${
                  step.current ? "font-bold text-red-600 flex items-center gap-1" : ""
                }`}
              >
                {step.current && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                {step.label}
              </button>
            ))}
          </div>

          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
              setProgress(newPercent);
            }}
            className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative cursor-pointer"
          >
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-[#0A2540] shadow-sm transform -translate-x-1/2"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scrubber Readout */}
        <div className="text-slate-600 font-semibold shrink-0">
          Scrubber: <span className="text-[#0A2540] font-bold">{calculateDisplayTime()}</span>
        </div>
      </div>
    </div>
  );
}
