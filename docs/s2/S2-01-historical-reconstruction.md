# S2-01 — Historical Event Reconstruction

## Objective
Reconstruct the observable evolution of Cyclone Michaung over the configured coastal Andhra Pradesh study area before building predictive models.

## Principle
The reconstruction stage answers "what happened?" independently from the later predictive stage. It must preserve the distinction between:
- historical truth (IBTrACS best track)
- observed satellite evidence (Sentinel-1 / Sentinel-2)
- meteorological reanalysis (CHIRPS / ERA5-Land)
- static environmental context (SRTM / Dynamic World / JRC water)
- derived PRAVAAH features.

## Timeline
The current event configuration defines:
- T-48h
- T-36h
- T-24h
- T-12h
- T-6h
- landfall

For each snapshot, the pipeline should identify the cyclone position, available meteorological observations, satellite observations nearest to the snapshot, and the corresponding static layers.

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
Build the observation manifest and synchronized snapshot metadata first. Then build the first pre/post Sentinel-1 flood-evidence experiment.
