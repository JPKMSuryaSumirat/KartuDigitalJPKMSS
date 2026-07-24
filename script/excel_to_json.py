import pandas as pd
import json
import math

EXCEL_FILE = "data.xlsx"
JSON_FILE = "data.json"

# Membaca Excel sebagai object agar format nomor tidak berubah
df = pd.read_excel(EXCEL_FILE, dtype=object)

# Hapus kolom yang seluruhnya kosong
df = df.dropna(axis=1, how="all")


def clean_value(value):
    # Nilai kosong
    if pd.isna(value):
        return ""

    # Tanggal Excel
    if isinstance(value, pd.Timestamp):
        return value.strftime("%d-%m-%Y")

    # Angka desimal yang sebenarnya bilangan bulat
    if isinstance(value, float):
        if math.isnan(value):
            return ""
        if value.is_integer():
            return str(int(value))
        return str(value)

    # Integer
    if isinstance(value, int):
        return str(value)

    # String
    if isinstance(value, str):
        return value.strip()

    # Selain itu
    return str(value)


# Membersihkan seluruh data
records = []

for _, row in df.iterrows():
    item = {}

    for col in df.columns:
        item[str(col).strip()] = clean_value(row[col])

    records.append(item)

# Struktur JSON baru
output = {
    "peserta": records
}

with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Berhasil membuat {len(records)} data peserta.")
