# S1-05 — Cyclone Truth and Provenance

## Authoritative source
PRAVAAH uses NOAA/NCEI's International Best Track Archive for Climate Stewardship (IBTrACS), version 4r01, as the historical cyclone-track truth source.

IBTrACS is a global merged best-track archive containing tropical-cyclone position and intensity information from multiple agencies. It provides CSV, NetCDF and shapefile distributions and basin/time subsets.

## Michaung identifier
- Name: MICHAUNG
- Season: 2023
- Basin: North Indian
- ATCF ID: IO082023
- IBTrACS storm identifier: 2023334N08088

## Required fields
- ISO_TIME
- LAT
- LON
- USA_WIND
- USA_PRES

The source also contains agency-specific fields. We preserve the source record rather than replacing it with a manually reconstructed track.

## Role in PRAVAAH
The best-track record provides historical truth for event replay. It is not a forecast. During model evaluation, predictions must be timestamped relative to the historical information that would actually have been available at that time.

## Provenance
Source: NOAA/NCEI IBTrACS v04r01.
Citation: Gahtan, J.; Knapp, K.R.; Schreck, C.J. III; Diamond, H.J.; Kossin, J.P.; Kruk, M.C. (2024), International Best Track Archive for Climate Stewardship (IBTrACS), Version 4r01, NOAA National Centers for Environmental Information, doi:10.25921/82ty-9e16.

## Caveat
IBTrACS contains multiple agency estimates. PRAVAAH must retain the agency field used for each model input and must not silently mix wind/pressure estimates from different agencies.
