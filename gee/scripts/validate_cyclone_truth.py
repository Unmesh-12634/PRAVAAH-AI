from pathlib import Path
from common import load_yaml

def main():
    path = Path("data/tracks/CYCLONE_MICHAUNG_2023.csv")
    if not path.exists():
        raise FileNotFoundError(f"Expected IBTrACS subset at {path}")

    import csv
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    if not rows:
        raise RuntimeError("Cyclone track file is empty.")

    required = {"ISO_TIME", "LAT", "LON", "USA_WIND", "USA_PRES"}
    missing = required - set(rows[0])
    if missing:
        raise RuntimeError(f"Track file missing required columns: {sorted(missing)}")

    storm_rows = [r for r in rows if r.get("NAME", "").strip().upper() == "MICHAUNG"]
    print(f"MICHAUNG track records: {len(storm_rows)}")
    print(f"Columns validated: {sorted(required)}")
    if storm_rows:
        print(f"First timestamp: {storm_rows[0]['ISO_TIME']}")
        print(f"Last timestamp: {storm_rows[-1]['ISO_TIME']}")
    print("Cyclone truth validation: PASS")

if __name__ == "__main__":
    main()
