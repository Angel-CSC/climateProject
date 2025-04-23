import sqlite3
import json
from get_functions import get_yearly
from database import retrieve_data

coordinates = [
    [-90 + row * 20, -180 + col * 36] 
    for row in range(10) 
    for col in range(10)
]

def store_yearly_averages_as_json(lat, long, db_path="./database.sqlite"):
    # Get the yearly data from your custom function
    yearly_df = get_yearly(lat, long)
    if yearly_df is None or yearly_df.empty:
        print(f"No data available for ({lat}, {long})")
        return

    location_id = f"{lat}_{long}"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Build a JSON dictionary where each feature has its own year:value mapping
    json_data = {}
    for col in yearly_df.columns:
        if col != "year":
            json_data[col] = {
                str(int(row["year"])): float(row[col]) for _, row in yearly_df.iterrows()
            }

    # Try adding the JSON column (only once)
    try:
        cursor.execute("ALTER TABLE models ADD COLUMN yearly_averages_json TEXT")
        print("Added 'yearly_averages_json' column to models table.")
    except sqlite3.OperationalError:
        pass  # Column probably already exists

    # Update the model row for the given location
    cursor.execute(
        "UPDATE models SET yearly_averages_json = ? WHERE location_id = ?",
        (json.dumps(json_data), location_id)
    )

    conn.commit()
    conn.close()
    print(f"Stored yearly averages as JSON for location_id {location_id}")

# Example usage (you can remove this if you’re importing the function elsewhere)
if __name__ == "__main__":
    i = 0
    while i < len(coordinates):
        try: 
            lat, long = coordinates[i]
            store_yearly_averages_as_json(lat, long)
            i += 1
        except Exception as e:
            print(e)
