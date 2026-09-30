import csv
from pathlib import Path

RAW = Path("data/tracks/ibtracs.NI.list.v04r01.csv")
OUT = Path("data/tracks/CYCLONE_MICHAUNG_2023.csv")
STORM_NAME = "MICHAUNG"
STORM_SID = "2023334N08088"

def read_ibtracs(path):
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        header = next(reader)
        # IBTrACS CSV has a second metadata/units row. Skip it.
        next(reader, None)
        for row in reader:
            if not row:
                continue
            yield header, row

def main():
    if not RAW.exists():
        raise FileNotFoundError(f"Missing raw IBTrACS file: {RAW}")

    header = None
    records = []
    for h, row in read_ibtracs(RAW):
        if header is None:
            header = h
        if len(row) < len(header):
            row = row + [""] * (len(header) - len(row))
        rec = dict(zip(header, row[:len(header)]))
        name = rec.get("NAME", "").strip().upper()
        sid = rec.get("SID", "").strip()
        if name == STORM_NAME and sid == STORM_SID:
            records.append(rec)

    if not records:
        raise RuntimeError(
            f"No records found for {STORM_NAME} with SID {STORM_SID}. "
            "Check the downloaded IBTrACS v04r01 North Indian Ocean file."
        )

    required = ["SID", "SEASON", "NAME", "ISO_TIME", "LAT", "LON", "USA_WIND", "USA_PRES"]
    missing = [c for c in required if c not in header]
    if missing:
        raise RuntimeError(f"Raw IBTrACS file is missing required columns: {missing}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=required)
        writer.writeheader()
        for rec in records:
            writer.writerow({c: rec.get(c, "") for c in required})

    print(f"Extracted {len(records)} Michaung records")
    print(f"SID: {STORM_SID}")
    print(f"Output: {OUT}")
    print(f"First timestamp: {records[0].get('ISO_TIME')}")
    print(f"Last timestamp: {records[-1].get('ISO_TIME')}")

if __name__ == "__main__":
    main()
