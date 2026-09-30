"use client";

import React from "react";
import {
  LayerState,
  HISTORICAL_TRACK,
  FORECAST_TRACK,
  RISK_MAP_ASSETS,
  RiskMapAsset,
  TimelineSnapshot,
  RISK_SEVERITY_COLORS,
} from "@/data/riskMapData";

interface RiskMapCanvasProps {
  layers: LayerState;
  snapshot: TimelineSnapshot;
  selectedAsset: RiskMapAsset | null;
  onSelectAsset: (asset: RiskMapAsset | null) => void;
  is3D: boolean;
  isSatellite: boolean;
  fitTrigger?: number;
}

// Map asset icon + color
function getAssetMeta(type: RiskMapAsset["type"]) {
  switch (type) {
    case "hospital":
      return { icon: "✚", color: "#10B981", ring: "#059669" };
    case "substation":
      return { icon: "⚡", color: "#F59E0B", ring: "#D97706" };
    case "shelter":
      return { icon: "⛺", color: "#8B5CF6", ring: "#7C3AED" };
    case "road":
      return { icon: "⟺", color: "#6B7280", ring: "#4B5563" };
    case "landfall":
      return { icon: "⊕", color: "#DC2626", ring: "#991B1B" };
    default:
      return { icon: "●", color: "#64748B", ring: "#475569" };
  }
}

function assetVisible(asset: RiskMapAsset, layers: LayerState): boolean {
  switch (asset.type) {
    case "hospital":
      return !!layers.hospitals;
    case "substation":
      return !!layers.power;
    case "shelter":
      return !!layers.shelters;
    case "road":
      return !!layers.roads;
    case "landfall":
      return true; // always show landfall node
    default:
      return true;
  }
}

export default function RiskMapCanvas({
  layers,
  snapshot,
  selectedAsset,
  onSelectAsset,
  is3D,
  isSatellite,
}: RiskMapCanvasProps) {
  const cx = snapshot.cyclone.x;
  const cy = snapshot.cyclone.y;

  // Visible historical track up to current step
  const visibleSteps = ["T-36h", "T-24h", "T-12h", "T-6h", "LANDFALL"];
  const currentIdx = visibleSteps.indexOf(snapshot.step);
  const visibleTrack = HISTORICAL_TRACK.slice(0, Math.max(1, currentIdx + 1));

  const riskStyle = RISK_SEVERITY_COLORS[snapshot.compositeRisk] || RISK_SEVERITY_COLORS["SEVERE"];

  // Surge/risk zone radius scales with severity
  const riskRadii: Record<string, number> = {
    LOW: 100,
    MODERATE: 130,
    HIGH: 160,
    SEVERE: 190,
    CRITICAL: 220,
  };
  const riskR = riskRadii[snapshot.compositeRisk] || 160;

  // Forecast cone points
  const conePoints = FORECAST_TRACK.slice(0, 2);
  const coneWidth = 40;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-slate-950"
      style={{ transition: "background 0.4s ease" }}
    >
      {/* 3D mode overlay indicator */}
      {is3D && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[11px] font-code px-3 py-1.5 rounded-full border border-slate-700 shadow-lg">
            ◈ 3D Oblique Terrain Mode — Deck.gl / MapLibre Engine
          </div>
          {/* Simulated 3D perspective grid lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
              backgroundSize: "80px 60px",
              transform: "perspective(600px) rotateX(20deg) scale(1.15)",
              transformOrigin: "center bottom",
            }}
          />
        </div>
      )}

      {/* HISTORICAL REPLAY WATERMARK */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-[10px] font-code font-bold px-3 py-1 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-300 backdrop-blur-xs">
          ⚠ HISTORICAL REPLAY — Cyclone Michaung Dec 2023 — NOT REAL-TIME
        </span>
      </div>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 620"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={
          is3D
            ? {
                transform: "perspective(900px) rotateX(15deg) translateY(-2%) scale(1.04)",
                transformOrigin: "center 75%",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }
            : {
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }
        }
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="rmGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={isSatellite ? "#1E3A5F" : "#DCE7F0"}
              strokeWidth="0.8"
              strokeDasharray="2,3"
            />
          </pattern>

          {/* Risk radial gradient */}
          <radialGradient id="riskGrad" cx={`${cx}%`} cy={`${cy}%`} r="35%">
            <stop offset="0%" stopColor={riskStyle.svgFill} stopOpacity={riskStyle.svgOpacity} />
            <stop offset="50%" stopColor={riskStyle.svgFill} stopOpacity={riskStyle.svgOpacity * 0.5} />
            <stop offset="100%" stopColor={riskStyle.svgFill} stopOpacity="0" />
          </radialGradient>

          {/* Surge coastal gradient */}
          <linearGradient id="surgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>

          {/* Rainfall radial */}
          <radialGradient id="rainGrad" cx={`${cx + 5}%`} cy={`${cy + 8}%`} r="40%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>

          {/* Wind radial */}
          <radialGradient id="windGrad" cx={`${cx}%`} cy={`${cy}%`} r="38%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.30" />
            <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          {/* Population exposure */}
          <radialGradient id="popGrad" cx="40%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Cyclone pulse animation */}
          <circle id="cycPulse" cx={cx * 10} cy={cy * 6.2} r="30" fill="#DC2626" opacity="0.6" />
        </defs>

        {/* BASEMAP: coordinate grid */}
        <rect width="1000" height="620" fill={isSatellite ? "#1a2533" : "#EEF5FA"} />
        <rect width="1000" height="620" fill="url(#rmGrid)" />

        {/* LAND MASS — Andhra Pradesh stylized coastline */}
        <path
          d="M 0,0 L 320,0 L 320,120 L 295,155 L 285,185 L 270,220 L 255,260 L 240,300
             L 225,340 L 215,380 L 205,420 L 195,460 L 185,500 L 175,540 L 165,580
             L 155,620 L 0,620 Z"
          fill={isSatellite ? "#1E3B2F" : "#D4E8C2"}
          stroke={isSatellite ? "#2D5A40" : "#A8C97A"}
          strokeWidth="1.5"
        />
        {/* Coastal strip highlight */}
        <path
          d="M 295,155 L 285,185 L 270,220 L 255,260 L 240,300 L 225,340 L 215,380
             L 205,420 L 195,460 L 185,500 L 175,540"
          fill="none"
          stroke={isSatellite ? "#4ADE80" : "#86EFAC"}
          strokeWidth="3"
          strokeDasharray="8,4"
          opacity="0.6"
        />

        {/* BAY OF BENGAL label */}
        <text
          x="700"
          y="500"
          textAnchor="middle"
          fontSize="14"
          fontFamily="monospace"
          fill={isSatellite ? "#334155" : "#94A3B8"}
          fontWeight="600"
          letterSpacing="3"
          opacity="0.8"
        >
          BAY OF BENGAL
        </text>

        {/* District labels */}
        {[
          { x: 80, y: 80, label: "BAPATLA" },
          { x: 80, y: 200, label: "PRAKASAM" },
          { x: 80, y: 340, label: "NELLORE" },
        ].map(({ x, y, label }) => (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            fill={isSatellite ? "#475569" : "#64748B"}
            fontWeight="700"
            letterSpacing="2"
            opacity="0.7"
          >
            {label}
          </text>
        ))}

        {/* ═══ LAYER: COMPOSITE RISK SURFACE ═══ */}
        {layers.compositeRisk && (
          <ellipse
            cx={`${cx}%`}
            cy={`${cy}%`}
            rx={`${riskR * 0.38}%`}
            ry={`${riskR * 0.28}%`}
            fill="url(#riskGrad)"
            style={{ transition: "all 0.6s ease" }}
          />
        )}

        {/* ═══ LAYER: WIND FIELD ═══ */}
        {layers.wind && (
          <g style={{ transition: "all 0.6s ease" }}>
            <ellipse cx={`${cx}%`} cy={`${cy}%`} rx="35%" ry="28%" fill="url(#windGrad)" />
            {/* Wind flow lines */}
            {[0, 30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map((angle) => {
              const r1 = 60,
                r2 = 130;
              const rad = (angle * Math.PI) / 180;
              const x1 = cx * 10 + r1 * Math.cos(rad);
              const y1 = cy * 6.2 + r1 * Math.sin(rad);
              const x2 = cx * 10 + r2 * Math.cos(rad);
              const y2 = cy * 6.2 + r2 * Math.sin(rad);
              return (
                <line
                  key={angle}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#3B82F6"
                  strokeWidth="1"
                  opacity="0.25"
                  strokeDasharray="4,6"
                />
              );
            })}
          </g>
        )}

        {/* ═══ LAYER: RAINFALL ═══ */}
        {layers.rainfall && (
          <ellipse
            cx={`${cx + 3}%`}
            cy={`${cy + 8}%`}
            rx="38%"
            ry="32%"
            fill="url(#rainGrad)"
            style={{ transition: "all 0.6s ease" }}
          />
        )}

        {/* ═══ LAYER: SURGE INUNDATION — coastal band ═══ */}
        {layers.surge && (
          <path
            d="M 295,155 L 285,185 L 270,220 L 255,260 L 240,300 L 225,340 L 215,380 L 205,420 L 195,460 L 185,500 L 175,540 L 195,540 L 205,500 L 215,460 L 225,420 L 235,380 L 245,340 L 260,300 L 280,260 L 300,220 L 315,185 L 325,155 Z"
            fill="url(#surgeGrad)"
            stroke="#06B6D4"
            strokeWidth="1.5"
            style={{ transition: "all 0.6s ease" }}
            opacity="0.7"
          />
        )}

        {/* ═══ LAYER: FLOOD PATHWAY ═══ */}
        {layers.floodPathway && (
          <g>
            <path
              d="M 260,300 Q 220,340 200,400 Q 185,450 170,520"
              fill="none"
              stroke="#2563EB"
              strokeWidth="8"
              opacity="0.18"
              strokeLinecap="round"
            />
            <path
              d="M 250,280 Q 235,320 220,380 Q 210,430 195,490"
              fill="none"
              stroke="#2563EB"
              strokeWidth="5"
              opacity="0.12"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ═══ LAYER: POPULATION EXPOSURE ═══ */}
        {layers.population && (
          <ellipse
            cx="40%"
            cy="55%"
            rx="28%"
            ry="22%"
            fill="url(#popGrad)"
            style={{ transition: "all 0.6s ease" }}
          />
        )}

        {/* ═══ LAYER: BUILT-UP AREAS ═══ */}
        {layers.builtUp && (
          <g>
            {[
              { x: 80, y: 160, w: 30, h: 20 },
              { x: 120, y: 300, w: 25, h: 16 },
              { x: 90, y: 440, w: 28, h: 18 },
            ].map((r, i) => (
              <rect
                key={i}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill="#78716C"
                opacity="0.22"
                rx="2"
              />
            ))}
          </g>
        )}

        {/* ═══ LAYER: ROADS ═══ */}
        {layers.roads && (
          <g>
            {/* NH-16 */}
            <path
              d="M 175,540 L 195,460 L 215,380 L 240,300 L 265,220"
              fill="none"
              stroke="#6B7280"
              strokeWidth="3.5"
              opacity="0.5"
              strokeDasharray="8,3"
            />
            <text x="175" y="555" fontSize="8" fill="#6B7280" fontFamily="monospace" opacity="0.8">
              NH-16
            </text>
          </g>
        )}

        {/* ═══ LAYER: FORECAST CONE ═══ */}
        {layers.forecastCone && conePoints.length >= 2 && (
          <polygon
            points={`${cx * 10},${cy * 6.2} ${conePoints[0].x * 10 - coneWidth},${conePoints[0].y * 6.2} ${conePoints[1].x * 10 - coneWidth * 1.6},${conePoints[1].y * 6.2} ${conePoints[1].x * 10 + coneWidth * 1.6},${conePoints[1].y * 6.2} ${conePoints[0].x * 10 + coneWidth},${conePoints[0].y * 6.2}`}
            fill="#DC2626"
            opacity="0.08"
            stroke="#DC2626"
            strokeWidth="1"
            strokeDasharray="5,4"
          />
        )}

        {/* ═══ LAYER: HISTORICAL TRACK ═══ */}
        {layers.historicalTrack && visibleTrack.length > 1 && (
          <g>
            <polyline
              points={visibleTrack.map((p) => `${p.x * 10},${p.y * 6.2}`).join(" ")}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeDasharray="10,5"
              opacity="0.7"
              style={{ transition: "all 0.6s ease" }}
            />
            {visibleTrack.map((p, i) => (
              <circle
                key={i}
                cx={p.x * 10}
                cy={p.y * 6.2}
                r="5"
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.5"
                opacity="0.5"
              />
            ))}
          </g>
        )}

        {/* ═══ LAYER: FORECAST TRACK ═══ */}
        {layers.forecastTrack && (
          <polyline
            points={FORECAST_TRACK.map((p) => `${p.x * 10},${p.y * 6.2}`).join(" ")}
            fill="none"
            stroke="#F97316"
            strokeWidth="2.5"
            strokeDasharray="6,5"
            opacity="0.8"
          />
        )}

        {/* ═══ CYCLONE CENTER (always shown) ═══ */}
        <circle
          cx={cx * 10}
          cy={cy * 6.2}
          r="38"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.5"
          opacity="0.20"
        />
        <circle
          cx={cx * 10}
          cy={cy * 6.2}
          r="26"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.5"
          opacity="0.35"
        />
        {/* Core eye */}
        <circle
          cx={cx * 10}
          cy={cy * 6.2}
          r="14"
          fill="none"
          stroke="#DC2626"
          strokeWidth="2"
          opacity="0.9"
        />
        <circle cx={cx * 10} cy={cy * 6.2} r="6" fill="#DC2626" opacity="0.85" />

        {/* Spiral arms */}
        {[0, 120, 240].map((offset) => {
          const rad = (offset * Math.PI) / 180;
          const radEnd = ((offset + 60) * Math.PI) / 180;
          const x0 = cx * 10 + 10 * Math.cos(rad);
          const y0 = cy * 6.2 + 10 * Math.sin(rad);
          const xMid = cx * 10 + 24 * Math.cos(rad + 0.5);
          const yMid = cy * 6.2 + 24 * Math.sin(rad + 0.5);
          const x1 = cx * 10 + 36 * Math.cos(radEnd);
          const y1 = cy * 6.2 + 36 * Math.sin(radEnd);
          return (
            <path
              key={offset}
              d={`M ${x0},${y0} Q ${xMid},${yMid} ${x1},${y1}`}
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.5"
              opacity="0.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Cyclone label */}
        <rect
          x={cx * 10 - 64}
          y={cy * 6.2 - 58}
          width="128"
          height="20"
          rx="4"
          fill="#1E293B"
          opacity="0.9"
        />
        <text
          x={cx * 10}
          y={cy * 6.2 - 44}
          textAnchor="middle"
          fontSize="9.5"
          fontFamily="monospace"
          fill="white"
          fontWeight="700"
          letterSpacing="0.5"
        >
          MICHAUNG · {snapshot.cyclone.wind_kmh} km/h · {snapshot.cyclone.pressure_hpa} hPa
        </text>

        {/* ═══ INFRASTRUCTURE ASSET MARKERS ═══ */}
        {RISK_MAP_ASSETS.filter((a) => assetVisible(a, layers)).map((asset) => {
          const meta = getAssetMeta(asset.type);
          const isSelected = selectedAsset?.id === asset.id;
          const ax = asset.x * 10;
          const ay = asset.y * 6.2;

          return (
            <g
              key={asset.id}
              onClick={() => onSelectAsset(isSelected ? null : asset)}
              style={{ cursor: "pointer" }}
            >
              {isSelected && (
                <circle cx={ax} cy={ay} r="22" fill={meta.color} opacity="0.25" />
              )}
              <circle
                cx={ax}
                cy={ay}
                r={isSelected ? 12 : 9}
                fill={meta.color}
                stroke={isSelected ? "#FFFFFF" : meta.ring}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity="0.95"
                style={{ transition: "all 0.2s ease" }}
              />
              {asset.type === "landfall" && (
                <g>
                  <circle
                    cx={ax}
                    cy={ay}
                    r="18"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                    opacity="0.7"
                  />
                  <circle
                    cx={ax}
                    cy={ay}
                    r="28"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="1"
                    strokeDasharray="4,3"
                    opacity="0.35"
                  />
                </g>
              )}
              {/* Asset label */}
              {(isSelected || asset.type === "landfall") && (
                <g>
                  <rect
                    x={ax - 60}
                    y={ay + 16}
                    width="120"
                    height="18"
                    rx="3"
                    fill="#0F172A"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={ax}
                    y={ay + 29}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill="white"
                    fontWeight="600"
                  >
                    {asset.name.length > 20 ? asset.name.slice(0, 18) + "…" : asset.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Coordinate axis labels */}
        {[14, 15, 16, 17].map((lat, i) => (
          <text
            key={lat}
            x="985"
            y={620 - i * 155}
            textAnchor="end"
            fontSize="8"
            fontFamily="monospace"
            fill={isSatellite ? "#334155" : "#94A3B8"}
            opacity="0.7"
          >
            {lat}°N
          </text>
        ))}
        {[79, 80, 81, 82, 83].map((lng, i) => (
          <text
            key={lng}
            x={150 + i * 175}
            y={615}
            textAnchor="middle"
            fontSize="8"
            fontFamily="monospace"
            fill={isSatellite ? "#334155" : "#94A3B8"}
            opacity="0.7"
          >
            {lng}°E
          </text>
        ))}
      </svg>
    </div>
  );
}
