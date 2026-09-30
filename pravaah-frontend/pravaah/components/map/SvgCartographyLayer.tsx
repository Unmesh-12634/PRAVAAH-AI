"use client";

import React from "react";
import { MapLayerState } from "./types";

interface SvgCartographyLayerProps {
  layers: MapLayerState;
}

export default function SvgCartographyLayer({ layers }: SvgCartographyLayerProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Coordinate Grid Pattern */}
        <pattern
          id="tacticalLightGrid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="#DCE7F0"
            strokeDasharray="2,2"
            strokeWidth="0.8"
          />
        </pattern>

        {/* Coastal Storm Surge Inundation Area */}
        <radialGradient id="surgeGradientLight" cx="42%" cy="48%" r="45%">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.22" />
          <stop offset="85%" stopColor="#0284C7" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#EEF5FA" stopOpacity="0" />
        </radialGradient>

        {/* Rain Doppler Intensity Bands */}
        <radialGradient id="rainBandsLight" cx="62%" cy="56%" r="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EEF5FA" stopOpacity="0" />
        </radialGradient>

        {/* Forecast Track Cone */}
        <linearGradient id="coneGradLight" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.08" />
        </linearGradient>

        {/* Doppler Sweep Beam Gradient */}
        <linearGradient id="radarBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid overlay */}
      <rect width="100%" height="100%" fill="url(#tacticalLightGrid)" />

      {/* Realistic Rotating Doppler Radar Sweep Beam */}
      {layers.dopplerRadar && (
        <g style={{ transformOrigin: "600px 420px" }} className="animate-radar-sweep pointer-events-none">
          <path
            d="M 600 420 L 910 250 A 330 330 0 0 1 910 590 Z"
            fill="url(#radarBeamGradient)"
          />
          <line x1="600" y1="420" x2="910" y2="420" stroke="#0284C7" strokeWidth="2" opacity="0.7" />
        </g>
      )}

      {/* Bay of Bengal Water Texture Note */}
      <text
        x="780"
        y="240"
        fill="#94A3B8"
        fontFamily="var(--font-manrope), sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="3"
        opacity="0.6"
      >
        BAY OF BENGAL
      </text>
      <text
        x="800"
        y="260"
        fill="#94A3B8"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        opacity="0.6"
      >
        BATHYMETRY: 200m - 1200m
      </text>

      {/* Indian Landmass: Andhra Pradesh Coastal Corridor */}
      <path
        d="M -50 -10 L 430 -10 Q 405 110 385 200 T 350 300 T 295 400 T 240 480 T 205 570 T 170 650 L -50 650 Z"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="2"
      />

      {/* Flood Pathways: Buckingham Canal & River Estuary lines */}
      <g opacity={layers.floodPathways ? 1 : 0.4} className="transition-opacity">
        <path
          d="M 330 280 Q 360 300 395 330 T 440 360"
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="6"
        />
        <path
          d="M 270 380 Q 295 410 320 440"
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="5"
        />
        <path
          d="M 205 470 Q 230 495 245 540"
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="4"
        />
      </g>

      {/* Coastal Inundation Swath (Surge 1.0m to 1.5m) */}
      {layers.stormSurge && (
        <path
          d="M 385 200 Q 360 250 350 300 Q 330 330 320 360 Q 285 420 250 470 Q 235 490 215 560 L 255 540 Q 285 475 320 420 Q 355 360 375 305 Q 395 250 415 190 Z"
          fill="url(#surgeGradientLight)"
          className="animate-in fade-in duration-300"
        />
      )}

      {/* Rain Doppler Isobars Envelope */}
      {layers.dopplerRadar && (
        <ellipse
          cx="600"
          cy="420"
          rx="310"
          ry="230"
          fill="url(#rainBandsLight)"
          className="animate-in fade-in duration-300"
        />
      )}

      {/* Gale Wind Radii Rings centered on Cyclone Eye */}
      {layers.galeWind && (
        <g className="animate-in fade-in duration-300">
          <circle
            cx="600"
            cy="420"
            r="140"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.8"
          />
          <circle
            cx="600"
            cy="420"
            r="210"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="6,4"
            opacity="0.7"
          />
          <circle
            cx="600"
            cy="420"
            r="290"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1"
            strokeDasharray="8,6"
            opacity="0.6"
          />
        </g>
      )}

      {/* Cone of Uncertainty to Bapatla Coast */}
      <polygon
        points="600,420 350,280 405,260"
        fill="url(#coneGradLight)"
      />

      {/* Track Line: Past and Forecast */}
      <path
        d="M 760 590 L 680 500 L 600 420"
        fill="none"
        stroke="#DC2626"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 600 420 L 490 340 L 375 270"
        fill="none"
        stroke="#D97706"
        strokeWidth="3"
        strokeDasharray="7,5"
        strokeLinecap="round"
      />

      {/* Past Track Waypoints */}
      <circle
        cx="760"
        cy="590"
        r="4.5"
        fill="#FFFFFF"
        stroke="#DC2626"
        strokeWidth="2"
      />
      <text
        x="772"
        y="594"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        fontWeight="600"
      >
        T-36h (12.2°N)
      </text>
      <circle
        cx="680"
        cy="500"
        r="4.5"
        fill="#FFFFFF"
        stroke="#DC2626"
        strokeWidth="2"
      />
      <text
        x="692"
        y="504"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="10"
        fontWeight="600"
      >
        T-24h (13.5°N)
      </text>

      {/* CYCLONE EYE - Tactical Center Point */}
      <g transform="translate(600, 420)">
        <circle
          r="32"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1"
          opacity="0.4"
          className="animate-ping"
        />
        <circle r="22" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
        <circle r="10" fill="#DC2626" />
        <circle r="3.5" fill="#FFFFFF" />
        <path
          d="M -16,-16 Q 0,-26 16,-16 Q 26,0 16,16 Q 0,26 -16,16 Q -26,0 -16,-16 Z"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.2"
          opacity="0.75"
        />
      </g>

      {/* Administrative Boundaries & District Labels */}
      <text
        x="140"
        y="140"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1"
      >
        GUNTUR DISTRICT
      </text>
      <text
        x="180"
        y="240"
        fill="#0B5CAD"
        fontFamily="var(--font-mono), monospace"
        fontSize="12"
        fontWeight="800"
        letterSpacing="1"
      >
        BAPATLA [IMPACT ZONE]
      </text>
      <text
        x="120"
        y="350"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1"
      >
        PRAKASAM / ONGOLE
      </text>
      <text
        x="80"
        y="490"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1"
      >
        SPSR NELLORE
      </text>
      <text
        x="310"
        y="90"
        fill="#475569"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1"
      >
        KRISHNA / MACHILIPATNAM
      </text>

      {/* Highway NH-16 Evacuation Corridor */}
      {layers.evacuationRoutes && (
        <g className="animate-in fade-in duration-300">
          <path
            d="M 330 30 L 310 150 L 260 270 L 200 390 L 150 510 L 120 620"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeDasharray="7,4"
          />
          <rect
            x="185"
            y="405"
            width="150"
            height="18"
            rx="3"
            fill="#FFFBEB"
            stroke="#FDE68A"
            strokeWidth="1"
          />
          <text
            x="190"
            y="418"
            fill="#B45309"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fontWeight="700"
          >
            NH-16 EVACUATION CORRIDOR
          </text>
        </g>
      )}
    </svg>
  );
}
