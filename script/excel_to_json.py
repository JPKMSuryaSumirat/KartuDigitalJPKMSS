import pandas as pd
import json

EXCEL_FILE = "data.xlsx"
JSON_FILE = "data.json"

# Membaca sheet pertama
df = pd.read_excel(EXCEL_FILE)

# Menghilangkan kolom kosong
df = df.dropna(axis=1, how="all")

# Mengubah NaN menjadi string kosong
df = df.fillna("")

# Convert menjadi list dictionary
records = df.to_dict(orient="records")

# Format JSON mengikuti struktur lama website
output = {
    "Peserta_11-07-2025": records
}

with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Berhasil membuat data.json")
