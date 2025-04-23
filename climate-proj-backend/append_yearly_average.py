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
    location_id = f"{lat}_{long}"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if the current row has the JSON column populated
    cursor.execute(
        "SELECT yearly_averages_json FROM models WHERE location_id = ?",
        (location_id,)
    )
    result = cursor.fetchone()
    if result and result[0] is not None:
        print(f"Skipping API call for {location_id} — data already exists.")
        conn.close()
        return

    # Call the API since data is missing
    yearly_df = get_yearly(lat, long)
    if yearly_df is None or yearly_df.empty:
        print(f"No data returned for ({lat}, {long})")
        conn.close()
        return

    # Build the JSON structure
    json_data = {}
    for col in yearly_df.columns:
        if col != "year":
            json_data[col] = {
                str(int(row["year"])): float(row[col]) for _, row in yearly_df.iterrows()
            }

    # Update the database
    cursor.execute(
        "UPDATE models SET yearly_averages_json = ? WHERE location_id = ?",
        (json.dumps(json_data), location_id)
    )

    conn.commit()
    conn.close()
    print(f"Stored yearly averages for {location_id}")

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
