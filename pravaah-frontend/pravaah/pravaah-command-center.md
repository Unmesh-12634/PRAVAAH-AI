# PRAVAAH AI Command Center — Main Screen Deployment

## Goal
Scaffold and run the PRAVAAH AI National Disaster Intelligence & Anticipatory Action Platform (Official Gov White Theme C4ISR Desktop Screen) as an interactive Next.js React application with live telemetry simulation and fluid responsiveness.

## Tasks
- [x] Task 1: Initialize Git repository and create dedicated branch `feature/command-center-ui` → Verify: `git branch` displays `feature/command-center-ui`.
- [x] Task 2: Scaffold Next.js React project with Tailwind CSS and required font/icon assets → Verify: `package.json` created and dependencies installed.
- [x] Task 3: Implement C4ISR Header, Top Gov Official Banner, and Executive Navigation bar with live ticking IST time → Verify: Header renders official NDMA bar and live IST clock.
- [x] Task 4: Implement Left Navigation Sidebar (EOC Array) with interactive tab selection and EOC comms status → Verify: Navigation items highlight and update state.
- [x] Task 5: Implement Top Institutional KPI metric cards (5 critical metrics with dynamic hazard indicators) → Verify: Metric cards display accurate stats and trend badges.
- [x] Task 6: Implement Tactical GIS Coastal Map with SVG cartography, cyclone eye, Doppler radar isobars, interactive pins, layer toggles, and live telemetry widget → Verify: Map renders coastline, cyclone trajectory, layer toggling, and tooltip cards on pin hover.
- [x] Task 7: Implement Replay Timeline Scrubber with play/pause, speed controls (1x, 2x, 4x), and step markers → Verify: Scrubber plays and scrub bar moves smoothly across T-36h to Landfall.
- [x] Task 8: Implement Right Situation Intelligence & Anticipatory Action Directives Panel (Priority summary, stacked vulnerability bar, actionable directives) → Verify: Directives render with progress bars and action modal triggers.
- [x] Task 9: Implement Bottom DEOC District Readiness Matrix and Live Ticker Feed → Verify: 4 district readiness tiles and animated ticker render cleanly.
- [x] Task 10: Start Next.js local development server and verify live rendering in browser → Verify: Local dev server runs without errors on `http://localhost:3001`.

## Done When
- [x] Next.js app compiles cleanly with 0 TypeScript/Lint errors.
- [x] The full PRAVAAH AI Command Center screen is running live on the local development server.
- [x] Interactive features (live clock, timeline replay, layer toggles, pin tooltips) function smoothly.
- [x] Design matches the Stitch official government C4ISR white theme and responds fluidly from 1080p to 4K displays.
