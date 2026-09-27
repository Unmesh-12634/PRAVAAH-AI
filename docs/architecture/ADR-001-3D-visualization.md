# ADR-001: 3D Geospatial Visualization

## Status
Accepted — architecture direction; implementation technology remains an investigation item.

## Decision
3D is a first-class visualization/scenario module. It consumes standardized PRAVAAH outputs: terrain/elevation, hazard rasters, modeled inundation depth, roads and critical assets. It does not own hazard or risk calculations.

## Technology investigation
Evaluate Google-compatible 3D options and browser WebGL/terrain alternatives. The selected solution must support the real AOI, custom hazard overlays, infrastructure layers and scenario playback.

## Non-goals
- No claim of full hydrodynamic simulation from the renderer.
- No independent risk model in the visualization layer.
- No fabricated terrain or exposure data.

## Integration
Risk/Scenario Engine → raster/vector/API layers → 3D renderer.

## Acceptance criteria
1. Coastal Andhra Pradesh terrain renders in 3D.
2. At least one hazard layer overlays the terrain.
3. Critical infrastructure is displayed.
4. Scenario changes alter the visualization.
5. The renderer consumes PRAVAAH outputs without duplicating model logic.
