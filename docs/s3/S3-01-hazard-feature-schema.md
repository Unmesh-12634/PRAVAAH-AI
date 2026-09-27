# S3-01 — Canonical Hazard Feature Schema

## Purpose

Define the canonical feature contract for PRAVAAH hazard modeling. This layer converts synchronized historical observations into auditable, model-ready predictors.

## Design rule

Observed flood evidence, environmental context, and predictive features remain separate. A feature must not be interpreted as observed flooding merely because it is correlated with flooding.

## Event identity

Every feature record is associated with:

- event_id
- snapshot_id
- target_time_utc
- relative_time_to_landfall_hours
- AOI identifier
- source dataset and source timestamp
- processing version

## Feature groups

### 1. Cyclone-track dynamics

- storm latitude / longitude
- distance to storm center
- minimum central pressure
- maximum sustained wind
- pressure tendency when available
- wind tendency when available
- distance change over the preceding interval
- time relative to landfall

### 2. Meteorological forcing

- cumulative precipitation over 6h / 12h / 24h / 72h
- maximum precipitation intensity
- rainfall anomaly where a valid baseline exists
- 2 m air temperature
- dew point
- surface pressure
- 10 m wind components and derived speed
- ERA5 runoff
- soil moisture layers

### 3. Terrain and hydrologic context

- elevation
- slope
- low-elevation indicator
- flat-terrain indicator
- distance to persistent water where available
- historical water occurrence

### 4. Land-cover exposure context

Dynamic World class proportions / masks:

- water
- built
- crops
- flooded vegetation
- trees
- grass
- shrub/scrub
- bare

### 5. Earth-observation evidence

- Sentinel-1 pre-event backscatter
- Sentinel-1 approach backscatter
- Sentinel-1 post-event backscatter
- SAR change metrics
- candidate inundation mask and area

Sentinel-2 optical variables are retained when cloud-free observations permit them.

## Label separation

The training pipeline must distinguish:

1. **Observed flood evidence** — SAR/validated observation.
2. **Environmental predictor** — rainfall, terrain, soil moisture, land cover, cyclone dynamics.
3. **Exposure** — people/assets/infrastructure intersecting the hazard.
4. **Vulnerability** — susceptibility indicators.
5. **Model output** — predicted hazard/risk.

No model output is allowed to overwrite or masquerade as observed evidence.

## Missing data

Missing observations must remain explicit. Do not silently substitute zeros for unavailable satellite acquisitions or meteorological values.

Each feature should carry a validity/availability indicator where missingness can affect model interpretation.

## Temporal leakage rule

For a prediction at time T, only information available at or before T may be used as an input feature. Post-landfall observations are validation evidence and must never enter a pre-landfall prediction feature vector.

## Spatial leakage rule

Train/test splitting must prevent nearby pixels from producing artificially optimistic validation. Event-based and spatially grouped splits should be preferred over random pixel splitting.

## Canonical record

A future implementation should serialize records approximately as:

```text
event_id
snapshot_id
target_time_utc
relative_time_to_landfall_h
track.*
meteo.*
terrain.*
landcover.*
eo.*
availability.*
label.*
provenance.*
```

## S3 acceptance criteria

- Same schema works for Michaung replay and future cyclone events.
- Every feature has source/provenance.
- Pre-landfall prediction cannot consume post-event evidence.
- Missing observations are explicit.
- Observed flood labels remain separate from predictors.
- Schema supports spatial raster features and aggregated tabular features.

## Next

S3-02 implements extraction of this schema for the Michaung event and produces the first model-ready feature table.