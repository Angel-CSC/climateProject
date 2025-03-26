import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

cache_session = requests_cache.CachedSession('.cache', expire_after = -1)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)


def get_data(lat, long):
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": long,
        "start_date": "1940-01-01",
        "end_date": "2025-02-24",
        "hourly": ["temperature_2m", "precipitation", "rain", "snowfall", "pressure_msl"]
    }
    responses = openmeteo.weather_api(url, params=params)

    response = responses[0]
    print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    print(f"Elevation {response.Elevation()} m asl")
    print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    hourly = response.Hourly()
    hourly_data = {
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        ),
        "temperature_2m": hourly.Variables(0).ValuesAsNumpy(),
        "precipitation": hourly.Variables(1).ValuesAsNumpy(),
        "rain": hourly.Variables(2).ValuesAsNumpy(),
        "snowfall": hourly.Variables(3).ValuesAsNumpy(),
        "pressure_msl": hourly.Variables(4).ValuesAsNumpy(),
    }

    hourly_dataframe = pd.DataFrame(hourly_data)

    hourly_dataframe["date"] = hourly_dataframe["date"].dt.date
    
    return hourly_dataframe



def get_daily(lat, long):
    """Convert hourly data into daily averages."""
    hourly_dataframe = get_data(lat, long)
    
    hourly_dataframe["date"] = pd.to_datetime(hourly_dataframe["date"]).dt.date
    
    daily_dataframe = hourly_dataframe.groupby("date").mean().reset_index()
    
    return daily_dataframe


def get_yearly(lat, long):
    """Convert daily data into yearly averages."""
    try:
        daily_dataframe = get_daily(lat, long)
    
        daily_dataframe["year"] = pd.to_datetime(daily_dataframe["date"]).dt.year
        
        yearly_dataframe = daily_dataframe.drop(columns=["date"]).groupby("year").mean().reset_index()
        
        return yearly_dataframe
    except:
        print("there was an error in trying to get something from the api")
        return None
