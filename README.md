# BoatMate WA

Live personal boating map: https://boatmatewa.github.io/

## Version 6

- Address and place search across the Perth river area via Photon / OpenStreetMap. Queries are submitted only on Search, rate limited in the app, and cached for the session. Public search service availability is not guaranteed.
- Connected, manually digitised planning network: East Fremantle to Middle Swan, Freshwater Bay, and the Canning to Salter Point. Coverage is explicitly limited; no harbour-bridge transit, upper Canning shallows, marinas or shore access.
- Search From/To, use a current GPS fix, or select an approach on the coverage map. Addresses remain separate pins. The nearest plotted approach can be up to 1 km away; the gap is disclosed and never drawn as a navigable connector.
- Routes traverse network edges and explicit branch junctions. They cannot invent shortcuts between branches. Trip distance excludes access to shore. Direction changes at branch junctions are reflected in the marker-side indicator near the guide.
- Official Transport WA navigation aids (DOT-004), GPS position, accuracy circle, speed, course, trail and saved spots. Live marker fetch has an explicitly dated embedded fallback.
- Separate weather forecasts and manual waypoint tools remain available.

### Important limitations

This is a planning aid, not a validated marine autorouter or chartplotter. Lines are approximate manual interpretations of WA898, not official recommended tracks or surveyed safe corridors. No integrated depth, tide, current obstruction, clearance, or legal traffic-lane validation is performed. The 1.0 m preference is informational and is not enforced. Bridge lines do not select a lawful passage: obey navigational spans, direction signs and current traffic control. Current notices are linked; dated notes in the app are not live clearance information.

No automatic off-route rerouting or direct GPS-to-guide connection is generated. Manual waypoints can cross land, shallow water or restricted areas. GPS guidance pauses when stale or inaccurate. iPhone background location may pause. The network has not been validated on the water or independently reviewed for navigation.

Network provenance is stored in `swan-routes-source.json` and embedded in `index.html`; graph implementation is also in `river-network-core.js`. Main chart corrections: 12 October 2026; upper sheet: 10 October 2025. Prepared from the chart downloaded 15 November 2026. Tests: `node test-network.js` checks joins, reversing, direction changes, projected endpoints and unavailable locations. Geometry was visually checked against the source chart; this does not establish current navigability.

Weather labels are BoatMate heuristics, not official sea-state categories or a safety assessment. River estimates use wind and gusts only. Coastal estimates also use modelled significant wave height and period, which do not resolve sheltered bays, reefs, wakes or local tidal effects. Missing data is shown as unavailable; storms, fog and heavy rain override comfort labels. No marine warning feed is integrated. Users must check current BOM warnings and official charts/notices.

The weather screen explains all classification thresholds. Forecasts refresh on demand, when reopened after 30 minutes, and while visible. Updated time is the forecast download time, not model issue time. No API key or paid backend is used. Internet is required for maps and forecasts. Saved spots and routes are local to the browser and are lost if its storage is cleared.

## Hosting and data

GitHub Pages is deployed by `.github/workflows/deploy.yml` on pushes and hourly (minute 17). The workflow downloads forecasts with `update_weather.py`, then deploys only index.html, weather.json and .nojekyll. Scheduled runs may be delayed or disabled by GitHub after repository inactivity; forecasts older than three hours are refused. Live API requests are a fallback. `index.html` includes the app logic and styling; Leaflet is loaded from unpkg.

Data providers:
- OpenStreetMap contributors / Leaflet for the base map.
- Open-Meteo forecast and marine APIs, national weather and marine model providers (CC BY 4.0): https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/marine-weather-api
- Planning geometry source: Transport WA WA898. Navigation aids: DOT-004, CC BY 4.0. Search: Photon / Komoot with OpenStreetMap attribution.
- Weather safety context: https://www.bom.gov.au/weather-and-climate/specialised-forecasts-and-observations/coasts-and-oceans/marine-weather-safety/boating-safety

On iPhone, open the live URL in Safari and choose Share > Add to Home Screen. Allow location when using GPS.
