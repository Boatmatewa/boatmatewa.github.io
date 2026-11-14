# BoatMate WA

Live personal boating map: https://boatmatewa.github.io/

## Version 3

- Map: GPS position, speed and course over ground, trip trail and saved spots.
- Route: manual waypoints, numbered dashed legs, bearing in degrees true, remaining distance, speed-based ETA and saved routes. Users advance waypoints manually.
- Weather: separate area selector, three forecast days, hourly comfort estimates, change windows and the calmest upcoming two-hour daylight window. All times use Australia/Perth.

### Important limitations

This is not a marine chartplotter or a safe-route engine. Routes are drawn manually and may cross land, shallow water or restricted areas. No integrated verified depth, chart, tide, hazard or bridge clearance data is used. The displayed 1.0 m planned depth is informational; no depth alarm exists. GPS guidance pauses if the fix is older than 30 seconds or accuracy exceeds 50 m. iPhone background location may pause.

Weather labels are BoatMate heuristics, not official sea-state categories or a safety assessment. River estimates use wind and gusts only. Coastal estimates also use modelled significant wave height and period, which do not resolve sheltered bays, reefs, wakes or local tidal effects. Missing data is shown as unavailable; storms, fog and heavy rain override comfort labels. No marine warning feed is integrated. Users must check current BOM warnings and official charts/notices.

The weather screen explains all classification thresholds. Forecasts refresh on demand, when reopened after 30 minutes, and while visible. Updated time is the forecast download time, not model issue time. No API key or paid backend is used. Internet is required for maps and forecasts. Saved spots and routes are local to the browser and are lost if its storage is cleared.

## Hosting and data

GitHub Pages is deployed by `.github/workflows/deploy.yml` on pushes and hourly (minute 17). The workflow downloads forecasts with `update_weather.py`, then deploys only index.html, weather.json and .nojekyll. Scheduled runs may be delayed or disabled by GitHub after repository inactivity; forecasts older than three hours are refused. Live API requests are a fallback. `index.html` includes the app logic and styling; Leaflet is loaded from unpkg.

Data providers:
- OpenStreetMap contributors / Leaflet for the base map.
- Open-Meteo forecast and marine APIs, national weather and marine model providers (CC BY 4.0): https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/marine-weather-api
- Official chart link: Transport WA WA898 (not integrated into the routing engine).
- Weather safety context: https://www.bom.gov.au/weather-and-climate/specialised-forecasts-and-observations/coasts-and-oceans/marine-weather-safety/boating-safety

On iPhone, open the live URL in Safari and choose Share > Add to Home Screen. Allow location when using GPS.
