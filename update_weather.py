"""Download public forecasts for BoatMate; no credentials or dependencies needed."""
import concurrent.futures
import json
import pathlib
import time
import urllib.parse
import urllib.request

PLACES = {
    'melville': (-32.01, 115.82, False),
    'perth': (-31.966, 115.865, False),
    'mosman': (-32.013, 115.772, False),
    'cockburn': (-32.18, 115.70, True),
    'rottnest': (-32.01, 115.62, True),
}

class ForecastUnavailable(RuntimeError):
    """Expected provider outage or invalid forecast response."""


def request(host, lat, lon, marine=False):
    params = {
        'latitude': lat, 'longitude': lon,
        'hourly': ('wave_height,wave_period' if marine else
                   'wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m,precipitation_probability,weather_code,is_day,visibility'),
        'timeformat': 'unixtime', 'timezone': 'Australia/Perth', 'forecast_days': 3,
    }
    params.update({'cell_selection': 'sea'} if marine else {'wind_speed_unit': 'kn'})
    url = host + '?' + urllib.parse.urlencode(params, safe=',/')
    error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=20) as response:
                data = json.load(response)
            if data.get('error') or not data.get('hourly', {}).get('time'):
                raise ValueError('Forecast is empty or invalid')
            return data
        except Exception as exc:
            error = exc
            if attempt < 2:
                time.sleep(2)
    raise ForecastUnavailable('Forecast download failed') from error

def load_place(item):
    key, (lat, lon, coastal) = item
    try:
        weather = request('https://api.open-meteo.com/v1/forecast', lat, lon)
    except ForecastUnavailable:
        print(key + ': forecast unavailable after retries; no stale data published')
        return key, None
    marine = None
    if coastal:
        try:
            marine = request('https://marine-api.open-meteo.com/v1/marine', lat, lon, True)
        except ForecastUnavailable:
            # The UI refuses to label coastal comfort without wave data.
            print(key + ': wave data unavailable')
    return key, {'weather': weather, 'marine': marine}

def main():
    result = {'fetched_at': int(time.time()), 'places': {}}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        for key, data in executor.map(load_place, PLACES.items()):
            if data is not None:
                result['places'][key] = data
                print(key + ': forecast downloaded')
    # Always replace the checked-in snapshot, even during a complete outage.
    # Missing places trigger the app's unavailable state/live fallback.
    # Never give old forecast values a new freshness timestamp.
    target = pathlib.Path('weather.json')
    pending = target.with_suffix('.tmp')
    pending.write_text(json.dumps(result, separators=(',', ':')))
    pending.replace(target)
    print('Saved fresh forecasts for ' + str(len(result['places'])) + ' locations')

if __name__ == '__main__':
    main()
