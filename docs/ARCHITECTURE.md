# 🏗️ BiyaHero Architecture

## System Overview

BiyaHero is a modern web application built with React + Vite that provides intelligent commute planning for Batangas Province, Philippines.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Maps**: Leaflet.js

### Backend Services
- **Routing**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Server**: Express.js (Node.js)

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│   Presentation Layer (React)            │
│   - Pages, Components, UI               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Service Layer                         │
│   - Geocoding, Routing, Search          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Business Logic Layer                  │
│   - Fare Calculation, Route Generation  │
│   - AI Responses, Route Intelligence    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Data Layer                            │
│   - Location Database, Route Metadata   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   External APIs                         │
│   - OSRM, Nominatim                     │
└─────────────────────────────────────────┘
```

---

## Frontend Structure

### `/src/pages`
Main application pages:
- `LandingPage.jsx` - Home page with search
- `RouteResults.jsx` - Route display and fare breakdown
- `AIAssistant.jsx` - AI-powered commute assistant
- `Alerts.jsx` - Traffic and route alerts
- `Profile.jsx` - User profile and trip history
- `Features.jsx` - Feature inventory (dev mode)

### `/src/components`
Reusable UI components:
- `Navbar.jsx` - Navigation bar
- `SearchBar.jsx` - Destination search with autocomplete
- `RouteMap.jsx` - Interactive Leaflet map
- `FeatureCard.jsx` - Feature display cards

### `/src/services`
External service integrations:
- `geocodingService.js` - Place search and validation
- `routeService.js` - OSRM routing integration
- `searchService.js` - Local location search

### `/src/utils`
Business logic utilities:
- `distanceBasedFare.js` - Fare calculation engine
- `routeGenerator.js` - Route generation logic
- `aiResponses.js` - AI assistant responses

### `/src/data`
Static data and metadata:
- `batangasLocations.js` - 100+ location database
- `routeIntelligence.js` - Route metadata and tips
- `features.js` - Feature inventory

---

## Core Systems

### 1. Destination Resolution System

**Flow:**
```
User Input → Local Suggestions → Geocoding → Place Confirmation → Validated Coordinates
```

**Components:**
- `SearchBar.jsx` - Two-stage autocomplete UI
- `geocodingService.js` - Structured place objects
- `searchService.js` - Fuzzy matching

**Key Features:**
- Confidence scoring (0-1)
- Batangas prioritization
- Category-based filtering
- User confirmation required

### 2. Routing System

**Flow:**
```
Validated Coordinates → OSRM API → Road Geometry → Distance Calculation
```

**Components:**
- `routeService.js` - OSRM integration
- `RouteMap.jsx` - Visual route display
- `routeGenerator.js` - Route options generation

**Key Features:**
- Follows actual roads (not straight lines)
- Real-time distance calculation
- Multiple route options
- Fallback handling

### 3. Fare Calculation System

**Formula:**
```
Base Fare: ₱12 (first 5 km)
Additional: ₱1 per km after 5 km
Discount: 20% for Student/Senior/PWD
```

**Components:**
- `distanceBasedFare.js` - Fare engine
- `routeGenerator.js` - Fare integration

**Key Features:**
- Distance-based (not hardcoded)
- Dynamic discount calculation
- Multiple fare types
- Accurate to nearest peso

### 4. Route Intelligence System

**Purpose:** Provide commuter context and tips

**Components:**
- `routeIntelligence.js` - Route metadata
- `aiResponses.js` - Contextual AI responses

**Metadata:**
- Transport types
- Difficulty levels
- Rush hour risk
- Transfer expectations
- Commuter tips

### 5. AI Assistant System

**Flow:**
```
User Question → Pattern Matching → Route Context → Fare Calculation → Response
```

**Components:**
- `AIAssistant.jsx` - Chat interface
- `aiResponses.js` - Response generation
- `routeIntelligence.js` - Context provider

**Key Features:**
- Natural language understanding
- Taglish support
- Contextual responses
- Distance-aware fare quotes

---

## Data Flow

### Route Search Flow
```
1. User types destination
2. Local database suggestions appear
3. User selects location
4. Geocoding returns 5 validated options
5. User confirms exact destination
6. Coordinates locked
7. OSRM calculates route distance
8. Fare calculated from distance
9. Route intelligence added
10. Results displayed with map
```

### Fare Calculation Flow
```
1. OSRM provides actual route distance
2. Distance passed to fare calculator
3. Base fare + additional km calculated
4. Discount applied if applicable
5. Final fare rounded to nearest peso
6. All fare types generated
7. Displayed in route results
```

---

## API Integration

### OSRM (Open Source Routing Machine)
- **Endpoint**: `https://router.project-osrm.org/route/v1/driving/`
- **Purpose**: Road-following route geometry
- **Returns**: Distance, duration, coordinates
- **No API key required**

### Nominatim (OpenStreetMap)
- **Endpoint**: `https://nominatim.openstreetmap.org/`
- **Purpose**: Geocoding and place search
- **Returns**: Coordinates, place details
- **Rate limit**: 1 request/second

---

## State Management

### Local State (useState)
- Component-level UI state
- Form inputs
- Loading states
- Autocomplete suggestions

### Navigation State (React Router)
- Route parameters
- Location state
- Validated place objects

### No Global State
- Simple prop drilling
- Service layer for shared logic
- No Redux/Context needed

---

## Performance Optimizations

1. **Lazy Loading**: Route-based code splitting
2. **Debouncing**: Autocomplete search
3. **Caching**: Location database in memory
4. **Fallback**: Straight-line distance if OSRM fails
5. **Optimistic UI**: Show loading states

---

## Security Considerations

1. **No API Keys**: Public APIs only
2. **Input Validation**: Sanitize user input
3. **HTTPS**: All API calls over HTTPS
4. **No Sensitive Data**: No user data stored
5. **Rate Limiting**: Respect API limits

---

## Scalability

### Current Limitations
- Client-side only (no database)
- Public API rate limits
- No user authentication
- No data persistence

### Future Improvements
- Backend API for caching
- Database for user data
- Authentication system
- Real-time traffic data
- Push notifications

---

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Preview**: `npm run preview`
4. **Lint**: Check code quality
5. **Test**: Manual testing (no automated tests yet)

---

## Deployment Architecture

### Frontend (Vercel)
- Static site deployment
- Automatic builds from Git
- CDN distribution
- Environment variables

### Backend (Render/Railway)
- Express.js server
- CORS enabled
- Health check endpoint
- Auto-deploy from Git

---

## File Organization

```
biyahero/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route pages
│   ├── services/       # External API integrations
│   ├── utils/          # Business logic
│   ├── data/           # Static data
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── server/
│   └── index.js        # Express server
├── public/
│   └── logo.svg        # Static assets
├── docs/               # Documentation
└── package.json        # Dependencies
```

---

## Key Design Decisions

### Why React + Vite?
- Fast development experience
- Modern build tooling
- Excellent DX

### Why Leaflet over Google Maps?
- Free and open source
- No API key required
- Customizable

### Why OSRM over Google Directions?
- Free and open source
- Accurate road following
- No API key required

### Why Distance-Based Fares?
- Accurate and fair
- No manual updates needed
- Scales automatically

### Why Place Confirmation?
- Prevents wrong destinations
- User trust and confidence
- Navigation-grade accuracy

---

## Testing Strategy

### Manual Testing
- Route search flows
- Fare calculations
- Map rendering
- Autocomplete behavior
- Mobile responsiveness

### Future Automated Testing
- Unit tests for fare calculator
- Integration tests for routing
- E2E tests for user flows

---

## Browser Support

- Chrome/Edge (Chromium) ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

---

## Accessibility

- Semantic HTML
- Keyboard navigation
- ARIA labels
- Color contrast
- Screen reader support

---

**Last Updated**: 2026-05-11
