# 📡 BiyaHero API Reference

## External APIs

BiyaHero integrates with free, open-source mapping and routing services.

---

## OSRM (Open Source Routing Machine)

### Overview
OSRM provides road-following route geometry and accurate distance calculations.

### Base URL
```
https://router.project-osrm.org/route/v1/driving/
```

### Endpoint: Get Route

**Request:**
```
GET /route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson
```

**Parameters:**
- `lon1,lat1` - Origin coordinates (longitude, latitude)
- `lon2,lat2` - Destination coordinates (longitude, latitude)
- `overview=full` - Return complete route geometry
- `geometries=geojson` - Return GeoJSON format

**Example:**
```javascript
const url = `https://router.project-osrm.org/route/v1/driving/121.1650,13.9411;121.0583,13.7565?overview=full&geometries=geojson`

const response = await fetch(url)
const data = await response.json()
```

**Response:**
```json
{
  "code": "Ok",
  "routes": [{
    "distance": 32500,
    "duration": 2700,
    "geometry": {
      "coordinates": [[121.1650, 13.9411], ...],
      "type": "LineString"
    }
  }]
}
```

**Response Fields:**
- `distance` - Route distance in meters
- `duration` - Travel time in seconds
- `geometry.coordinates` - Array of [lon, lat] points

**Rate Limits:**
- No official limit
- Be respectful of public API
- Consider caching results

**Error Handling:**
```javascript
if (data.code !== 'Ok') {
    // Fallback to straight-line distance
}
```

---

## Nominatim (OpenStreetMap Geocoding)

### Overview
Nominatim provides geocoding (address → coordinates) and reverse geocoding (coordinates → address).

### Base URL
```
https://nominatim.openstreetmap.org/
```

### Endpoint: Search (Geocoding)

**Request:**
```
GET /search?format=json&q={query}&limit={limit}&addressdetails=1
```

**Parameters:**
- `format=json` - Response format
- `q` - Search query
- `limit` - Maximum results (default: 10)
- `addressdetails=1` - Include address breakdown
- `accept-language=en` - Response language

**Example:**
```javascript
const query = encodeURIComponent('Lipa Cathedral, Batangas, Philippines')
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`

const response = await fetch(url)
const data = await response.json()
```

**Response:**
```json
[{
  "place_id": 123456,
  "lat": "13.9411",
  "lon": "121.1650",
  "display_name": "San Sebastian Cathedral, Lipa City, Batangas, Philippines",
  "type": "place_of_worship",
  "class": "amenity",
  "address": {
    "amenity": "San Sebastian Cathedral",
    "city": "Lipa City",
    "state": "Batangas",
    "country": "Philippines"
  }
}]
```

**Response Fields:**
- `lat`, `lon` - Coordinates
- `display_name` - Full address
- `type` - Place type
- `class` - OSM class
- `address` - Address components

### Endpoint: Reverse Geocoding

**Request:**
```
GET /reverse?format=json&lat={lat}&lon={lon}&addressdetails=1
```

**Parameters:**
- `lat` - Latitude
- `lon` - Longitude
- `addressdetails=1` - Include address breakdown

**Example:**
```javascript
const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=13.9411&lon=121.1650&addressdetails=1`

const response = await fetch(url)
const data = await response.json()
```

**Rate Limits:**
- **1 request per second**
- Include User-Agent header
- Cache results when possible

**Usage Policy:**
```javascript
// Add delay between requests
await new Promise(resolve => setTimeout(resolve, 1000))
```

---

## Internal API Functions

### Geocoding Service

#### `getPlaceSuggestions(query, limit)`
Get structured place suggestions with confidence scoring.

**Parameters:**
- `query` (string) - Search query
- `limit` (number) - Max results (default: 5)

**Returns:**
```javascript
[{
  name: "Lipa Cathedral",
  lat: 13.9411,
  lng: 121.1650,
  displayName: "San Sebastian Cathedral, Lipa City, Batangas",
  category: "church",
  municipality: "Lipa City",
  province: "Batangas",
  confidence: 0.95,
  isKnownLocation: true
}]
```

**Example:**
```javascript
import { getPlaceSuggestions } from '../services/geocodingService'

const places = await getPlaceSuggestions('Lipa Cathedral', 5)
```

#### `geocodeWithConfirmation(locationName)`
Geocode with multiple options for user confirmation.

**Returns:**
```javascript
{
  success: true,
  place: {...},
  suggestions: [...],
  needsConfirmation: true
}
```

---

### Route Service

#### `getRouteFromOSRM(start, end)`
Get route from OSRM with distance and geometry.

**Parameters:**
- `start` (object) - `{lat, lng}`
- `end` (object) - `{lat, lng}`

**Returns:**
```javascript
{
  success: true,
  distance: 32.5,
  duration: 45,
  geometry: [[13.9411, 121.1650], ...],
  summary: "32.5 km, 45 min"
}
```

**Example:**
```javascript
import { getRouteFromOSRM } from '../services/routeService'

const route = await getRouteFromOSRM(
  { lat: 13.9411, lng: 121.1650 },
  { lat: 13.7565, lng: 121.0583 }
)
```

#### `getRouteByNames(originName, destinationName)`
Get route by location names (handles geocoding).

**Returns:**
```javascript
{
  success: true,
  origin: { name, lat, lng, displayName },
  destination: { name, lat, lng, displayName },
  distance: 32.5,
  duration: 45,
  geometry: [...]
}
```

---

### Fare Calculator

#### `calculateFareFromDistance(distanceKm)`
Calculate fare from route distance.

**Formula:**
```
Base Fare: ₱12 (first 5 km)
Additional: ₱1 per km after 5 km
```

**Parameters:**
- `distanceKm` (number) - Distance in kilometers

**Returns:** (number) Fare in pesos

**Example:**
```javascript
import { calculateFareFromDistance } from '../utils/distanceBasedFare'

const fare = calculateFareFromDistance(10) // ₱17
```

#### `applyDiscount(fare, commuterType)`
Apply discount to fare.

**Parameters:**
- `fare` (number) - Base fare
- `commuterType` (string) - 'REGULAR', 'STUDENT', 'SENIOR', 'PWD'

**Returns:** (number) Discounted fare

**Discount:** 20% for Student/Senior/PWD

**Example:**
```javascript
import { applyDiscount } from '../utils/distanceBasedFare'

const discounted = applyDiscount(17, 'STUDENT') // ₱14 (rounded)
```

#### `getAllFareTypes(distanceKm)`
Get all fare types for a distance.

**Returns:**
```javascript
{
  regular: 17,
  student: 14,
  senior: 14,
  pwd: 14
}
```

---

### Search Service

#### `searchLocations(query, limit, categoryFilter)`
Search local location database with fuzzy matching.

**Parameters:**
- `query` (string) - Search query
- `limit` (number) - Max results (default: 10)
- `categoryFilter` (string) - Optional category filter

**Returns:**
```javascript
[{
  name: "SM City Lipa",
  category: "mall",
  aliases: ["sm lipa", "sm city lipa"],
  icon: "🛍️",
  priority: 10,
  score: 95
}]
```

**Example:**
```javascript
import { searchLocations } from '../services/searchService'

const results = searchLocations('sm', 10)
```

#### `getAutocompleteSuggestions(query, limit)`
Get autocomplete suggestions (optimized for speed).

**Returns:** Array of location objects

---

### Route Generator

#### `generateRoutes(origin, destination, commuterType, userCoords, originPlace, destinationPlace)`
Generate complete route options with fares.

**Parameters:**
- `origin` (string) - Origin name
- `destination` (string) - Destination name
- `commuterType` (string) - Fare type
- `userCoords` (object) - Optional user coordinates
- `originPlace` (object) - Validated origin place
- `destinationPlace` (object) - Validated destination place

**Returns:**
```javascript
[{
  id: 1,
  type: 'direct',
  name: 'Direct Route',
  duration: '45 min',
  distance: 32.5,
  distanceFormatted: '32.5 km',
  baseFare: 40,
  currentFare: 32,
  allFares: {...},
  transfers: 0,
  difficulty: 'easy',
  recommended: true,
  steps: [...],
  geometry: [...],
  notes: "..."
}]
```

---

## Error Handling

### OSRM Errors
```javascript
try {
  const route = await getRouteFromOSRM(start, end)
  if (!route.success) {
    // Use fallback distance calculation
  }
} catch (error) {
  console.error('Routing error:', error)
}
```

### Nominatim Errors
```javascript
try {
  const places = await getPlaceSuggestions(query)
  if (places.length === 0) {
    // Show "no results" message
  }
} catch (error) {
  console.error('Geocoding error:', error)
}
```

---

## Rate Limiting

### Best Practices
1. **Cache results** when possible
2. **Debounce** autocomplete searches
3. **Respect** API rate limits
4. **Add delays** between Nominatim requests
5. **Use fallbacks** when APIs fail

---

## Environment Variables

No API keys required! All APIs are public and free.

Optional configuration:
```env
VITE_API_BASE_URL=http://localhost:3001
```

---

**Last Updated**: 2026-05-11
