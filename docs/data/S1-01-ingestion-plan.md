# S1-01 — Geospatial Ingestion Plan

## Objective
Create reproducible, provenance-aware access to satellite, terrain, land-cover, water and meteorological datasets for the Michaung historical replay.

## Rules
1. Spatial filters originate from the AOI configuration.
2. Event dates originate from the event configuration.
3. Dataset identifiers are centralized in the dataset registry.
4. Raw source data is never silently overwritten by derived products.
5. Exported artifacts must record source, acquisition window, AOI, scale, processing version and creation timestamp.
6. A failed source query is an ingestion failure, not an empty dataset.

## First validation gates
- Earth Engine authentication succeeds.
- AOI geometry can be constructed.
- Core collections can be queried.
- Michaung replay window returns observations.
- Terrain and land-cover assets return valid bands.

## First output
A source inventory sufficient to select pre-event and post-event Sentinel-1/Sentinel-2 observations for the first flood-evidence experiment.
