# S2-01 — Historical Event Reconstruction

## Objective
Reconstruct the observable evolution of Cyclone Michaung over the configured coastal Andhra Pradesh study area before building predictive models.

## Event reference
The India Meteorological Department reports that Michaung crossed the south Andhra Pradesh coast close to south of Bapatla during 1230–1430 IST (0700–0900 UTC) on 5 December 2023 as a Severe Cyclonic Storm. PRAVAAH uses 0800 UTC, the midpoint of that reported window, as the deterministic replay reference while preserving the full two-hour uncertainty interval. citeturn0search15turn0search18

## Principle
The reconstruction stage answers "what happened?" independently from the later predictive stage. It must preserve the distinction between:
- historical truth (IBTrACS best track)
- observed satellite evidence (Sentinel-1 / Sentinel-2)
- meteorological reanalysis (CHIRPS / ERA5-Land)
- static environmental context (SRTM / Dynamic World / JRC water)
- derived PRAVAAH features.

## Timeline
The replay timeline is anchored to the IMD landfall reference:
- T-48h
- T-36h
- T-24h
- T-12h
- T-6h
- landfall
- T+6h
- T+12h
- T+24h

Each snapshot identifies the cyclone position nearest to the target time and the available satellite observations in a ±12-hour search window.

## First reconstruction outputs
1. Event timeline table.
2. Cyclone track GeoJSON/CSV.
3. Rainfall accumulation surfaces.
4. Terrain-derived elevation/slope surfaces.
5. Pre/post Sentinel-1 observation candidates.
6. Optical observation candidates with cloud metadata.
7. Historical-water baseline.
8. Observation manifest tying every derived layer to its source.

## Validation principle
Do not label an area "flooded" merely because a model says so. Observed flood evidence must be separately represented from modeled flood hazard.

## Next implementation
Build the synchronized observation manifest first. Then select temporally suitable Sentinel-1 scenes for the first pre/post flood/water-change experiment.
