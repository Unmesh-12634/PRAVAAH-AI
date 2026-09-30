# S2-03 — Sentinel-1 SAR Flood/Water-Change Evidence

## Purpose

Produce an observational candidate layer for cyclone-associated surface-water change around Michaung landfall.

This is an **evidence layer**, not a ground-truth flood map.

## Why Sentinel-1

Earth Engine's `COPERNICUS/S1_GRD` collection contains calibrated, terrain-corrected radar backscatter in dB. Sentinel-1 SAR is useful during cyclone conditions because optical imagery can be unavailable under cloud cover. The collection is heterogeneous, so this pipeline constrains the analysis to IW mode, dual VV/VH polarization, and 10 m resolution.

## Method

1. Search for pre-event scenes from 1–5 December 2023 before the IMD landfall window.
2. Search for post-event scenes from after the landfall window through 9 December.
3. Prefer a pre/post pair with the same orbit direction and relative orbit.
4. Apply a 20 m focal mean to reduce isolated speckle.
5. Calculate post-minus-pre VV and VH backscatter change in dB.
6. Mark a conservative candidate where both VV and VH decrease by more than 2 dB.
7. Mask pixels with JRC Global Surface Water occurrence >=50% so persistent water is not automatically counted as new inundation.
8. Preserve Dynamic World as contextual land-cover information for later exposure analysis.
9. Report candidate area in km², while explicitly labeling it as unvalidated evidence.

## Scientific caveats

A decrease in SAR backscatter is not uniquely caused by flooding. It can also arise from soil moisture, vegetation structure, surface roughness, acquisition geometry, or other land-surface changes. Therefore this output must be cross-checked against rainfall, elevation, historical water, land cover, and additional observations before being used for model validation.

The JRC water layer represents historical surface-water frequency through 2021; it is a baseline mask rather than event truth.

## Output

The script writes:

`data/manifests/michaung_sar_flood_evidence.json`

The manifest records:
- selected scenes and acquisition timestamps;
- orbit metadata;
- thresholds;
- candidate area;
- datasets;
- interpretation limitations.

## Run

```powershell
python gee\scripts\s2_sar_flood_evidence.py
```

## References

Google Earth Engine Sentinel-1 Algorithms documentation and JRC Global Surface Water v1.4 documentation should be cited in project reports.
