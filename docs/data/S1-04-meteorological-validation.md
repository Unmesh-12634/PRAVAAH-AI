# S1-04 — Meteorological Data Validation

## Purpose
Validate rainfall and meteorological forcing layers for the Michaung 2023 historical replay.

## Datasets
- CHIRPS v3 Daily Reanalysis: `UCSB-CHC/CHIRPS/V3/DAILY_RNL`
- ERA5-Land Hourly: `ECMWF/ERA5_LAND/HOURLY`

## Required variables
### Rainfall
CHIRPS precipitation in mm/day.

### Meteorological forcing
ERA5-Land variables required by the initial hazard pipeline:
- 2 m air temperature
- 2 m dew-point temperature
- hourly precipitation
- 10 m east-west wind component
- 10 m north-south wind component

## Validation gates
1. The collection returns at least one image for the configured AOI and event window.
2. Required bands are present.
3. Dataset identifiers are recorded centrally.
4. The event window remains sourced from the event configuration rather than hard-coded in scripts.

## Important provenance note
ERA5-Land is a Copernicus Climate Change Service dataset. Any public distribution of derived products must include the required C3S/ECMWF acknowledgement. See the Google Earth Engine dataset catalog for the current attribution language.

## Why these layers matter
Rainfall supplies a direct forcing signal for rainfall-driven flooding and saturation. ERA5-Land supplies a consistent meteorological context that can be joined to cyclone timing and satellite observations.

This stage validates availability only. It does not claim that these datasets alone are sufficient for operational forecasting.
