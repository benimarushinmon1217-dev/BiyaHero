# Routing accuracy audit

## Findings

The active search flow is `SearchBar` → selected place object → `multiModalRouteService`
→ `POST /routes/multi-modal` → `realisticRoutingService` → `RouteMap`.

The main transit-geometry defect was in the routing service: the network service asked
OpenRouteService's `driving-car` profile (or OSRM `driving`) to draw a line between
two manually listed stops, then presented that road route as a jeepney/bus segment.
That road path is not evidence of the corridor followed by the vehicle. The stop and
hub records also had no source or verification metadata, despite comments and API
messages calling them actual or verified routes.

The location search additionally had preset shortcuts that could set hardcoded
coordinates directly, bypassing place search. Route geometry conversion was repeated
inline and relied on arrays whose coordinate order was implicit. The selected place
markers were at the selected coordinates, while transit lines began/ended at candidate
network stops; the dashed connectors are approximate access indicators, not walking
directions.

## Changes

- Nominatim is the place-search provider. Quick-location buttons search for their place
  and require result selection instead of assigning embedded coordinates.
- Place suggestions preserve the OpenStreetMap object type and ID, its mapped feature
  category, reported bounding box, and returned coordinates. Ways and relations use
  Nominatim's representative point; nodes use their mapped point. Search shows that
  identity and coordinate so a commuter can distinguish the matched mapped object from
  a similarly named street or landmark.
- The route request sends canonical `{ latitude, longitude }` coordinates and address
  text. The API still accepts legacy `{ lat, lng }` clients and normalizes them at the
  boundary.
- Added coordinate utilities for range validation, Batangas bounds, GeoJSON conversion,
  Leaflet conversion, distance, and endpoint validation. GeoJSON remains
  `[longitude, latitude]`; Leaflet tuples remain `[latitude, longitude]`; the active
  transit API geometry uses canonical `{ latitude, longitude }` point objects.
- OpenRouteService/OSRM road results are now checked against requested endpoints and
  rejected if either snapped endpoint is more than 250 metres away. They remain road
  geometry, never a substitute for transit geometry.
- Transit routes now require source references and separate verification for the
  route/service, stop coordinates, direction, and ordered transit geometry. Route
  geometry is sliced from the verified transit shape in the verified direction; a
  car-routing API is no longer called to invent a jeepney path.
- Unverified hardcoded route/hub candidates are excluded from route generation,
  verified-place APIs, popular routes, and grounded assistant answers. The legacy
  `/route-old` screen is redirected so its generic estimates cannot be mistaken for a
  verified commute.
- Development map diagnostics display requested coordinates, actual transit-shape
  endpoints, place and geometry providers, network ID, and distance. Map bounds include
  the selected places, route shape, and access connectors.
- When no verified transit itinerary exists, the in-app map can show an OSRM driving
  route reference between the selected coordinates. It is labelled as road geometry,
  never as a jeepney/bus route; regular and student fares based on its road distance
  are explicitly estimates.
- The map screenshot revealed stale SM City Lipa coordinates (`13.9380, 121.1625`),
  which land roughly 1.8 km south of the mall near F. Manalo Street. The shared place
  coordinate now uses the OpenStreetMap SM City Lipa feature
  (`13.9547813, 121.1630958`). Old saved/verified place entries more than 500 m from
  that mapped mall point are reconciled when selected. This corrects the place pin only;
  it does not verify any jeepney terminal or route.

## Current data and external requirements

The existing hardcoded transport records contain no citations, field-survey references,
verified route shapes, or direction-specific evidence. They are therefore explicitly
marked `unverified` and do not produce transit itineraries. This intentionally means
the requested Antipolo Del Sur, SM City Lipa, Batangas State University, Lipa Bayan,
Tanauan, Rosario, and other example trips cannot currently be asserted as working
verified transit trips. Route queries return an explicit no-verified-service result
instead of fabricating alternatives.

To enable a corridor, add documented source references and verified stop coordinates,
direction, and actual transit geometry to that route record. A hub used for transfers
also needs its own source reference. Road-routing geometry from OSRM/OpenRouteService
cannot satisfy the transit-shape requirement. Walking access remains explicitly
approximate until a walking-profile provider and actual walking-leg routing are
configured.

Place search and displayed map tiles use OpenStreetMap services. The selected
Nominatim result supplies the coordinates used by BiyaHero; no external map handoff is
provided. A selected place coordinate identifies the mapped feature, not necessarily
its entrance or a precise pickup point, so users should review the pins.
This is a live, query-based use of mapped OpenStreetMap features, not a complete offline
extract of every building, road, address, or business in Batangas. OpenStreetMap is
community-maintained and may omit, misname, or have outdated features; BiyaHero must
not imply province-wide completeness. A full local data import would need a regional
OSM extract, update/attribution handling, and storage/indexing rather than repeated
geocoding guesses.

## Validation performed

Backend unit tests cover coordinate normalization/order, swapped-axis rejection,
Batangas bounds, endpoint snapping, coordinate-based stop matching, directionally
ordered transit-shape extraction, and rejection of unverified transit data. The
frontend build and backend tests are the executable checks for this phase. Actual
real-world route geometry and transit availability still require cited Batangas
transport data and configured providers; a successful software test does not prove
those external facts.
