"""Verify local Earth Engine authentication and project access.
Run after configuring Earth Engine credentials and GEE_PROJECT_ID.
"""
import os
import ee

project = os.getenv("GEE_PROJECT_ID")
if not project:
    raise SystemExit("Set GEE_PROJECT_ID before running this script.")

ee.Initialize(project=project)
print("PRAVAAH GEE CONNECTED")
print("Project:", project)
print("EE test:", ee.Number(2 + 3).getInfo())
