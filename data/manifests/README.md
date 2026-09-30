# Observation Manifests

Observation manifests are generated metadata artifacts that record the exact Earth Engine images selected for a model/replay step.

Required fields:
- event_id
- snapshot
- sensor
- asset_id
- acquisition_timestamp
- selection_role
- geometry/AOI reference
- cloud percentage where applicable
- orbit/mode/polarization for Sentinel-1 where applicable
- source collection
- processing_version

The manifest is metadata only. Large remote-sensing rasters should remain in Earth Engine or explicit artifact storage rather than being committed to Git.
