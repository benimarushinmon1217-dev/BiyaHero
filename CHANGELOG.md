# Changelog

All notable changes to the BiyaHero project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-05-11

### 🎉 Initial Release

First production-ready release of BiyaHero - AI-powered commuting companion for Batangas Province.

### ✨ Added

#### Core Features
- Smart route planning with multiple route options
- Distance-based fare calculation (₱12 base + ₱1/km)
- AI assistant with Taglish support
- Interactive maps with Leaflet.js
- Place confirmation system for accurate destinations
- 100+ Batangas location database
- Fuzzy search with typo tolerance
- Student/Senior/PWD discount support (20%)
- Traffic and route alerts
- User profile with trip history
- Dark mode support
- Mobile-responsive design

#### Technical Implementation
- React 18 + Vite frontend
- Express.js backend
- OSRM routing integration
- Nominatim geocoding integration
- Distance-based fare engine
- Route intelligence system
- Autocomplete search engine
- Custom map markers and polylines

#### Documentation
- Professional README.md
- Complete architecture documentation
- API reference guide
- Setup and installation guide
- Deployment guide
- Contributing guidelines
- Feature inventory
- Project structure documentation

### 🔧 Changed
- Replaced manual fare matrix with dynamic distance-based calculation
- Upgraded from straight-line routing to OSRM road-following routes
- Refactored destination selection to require user confirmation
- Migrated from fareMatrix.js to routeIntelligence.js system
- Consolidated all documentation into `/docs` folder

### 🗑️ Removed
- 42 redundant markdown files from root directory
- Deprecated `fareCalculator.js` (replaced by `distanceBasedFare.js`)
- Deprecated `fareMatrix.js` (replaced by `routeIntelligence.js`)
- Unused `TestSimple.jsx` component
- All temporary implementation notes and guides

### 🐛 Fixed
- Map initialization timing issues
- Destination geocoding accuracy
- Route geometry following actual roads
- Fare calculation rounding (changed from ceil to round)
- White screen issues (Vite dev server vs Live Server)
- CSS border-border class error

### 📚 Documentation
- Created `/docs` folder structure
- Added ARCHITECTURE.md
- Added API_REFERENCE.md
- Added CONTRIBUTING.md
- Added DEPLOYMENT.md
- Added FEATURES.md
- Added SETUP.md
- Added PROJECT_STRUCTURE.md
- Updated README.md with professional format
- Updated .env.example with current architecture

### 🏗️ Repository Cleanup
- Removed 42 redundant documentation files
- Deleted 3 deprecated code files
- Organized all documentation in `/docs`
- Cleaned root directory to essential files only
- Prepared repository for GitHub push
- Optimized for engineer handoff

---

## Project History

### Development Timeline

**Phase 1: Initial Setup (Tasks 1-2)**
- Created React + Vite application
- Rebranded from HatidSundo to BiyaHero
- Implemented 5 main pages
- Added live location detection
- Created custom map markers

**Phase 2: Feature Development (Tasks 3-5)**
- Built feature inventory system
- Upgraded routing to follow real roads
- Updated content to Batangas-specific
- Implemented OSRM integration

**Phase 3: Core Systems (Tasks 6-8)**
- Implemented distance-based fare system
- Expanded location coverage to 100+ locations
- Created fuzzy search engine
- Refactored to route intelligence system

**Phase 4: Critical Fixes (Tasks 9-10)**
- Fixed destination resolution accuracy
- Implemented place confirmation flow
- Added confidence scoring
- Resolved map initialization errors

**Phase 5: Production Preparation (Task 11)**
- Repository cleanup and refactor
- Documentation consolidation
- Code cleanup
- GitHub preparation

---

## Breaking Changes

### v1.0.0
- Removed `fareCalculator.js` - Use `distanceBasedFare.js` instead
- Removed `fareMatrix.js` - Use `routeIntelligence.js` instead
- Changed fare calculation from `Math.ceil()` to `Math.round()`
- Route generation now requires validated place objects (not raw strings)

---

## Migration Guides

### From fareCalculator.js to distanceBasedFare.js
```javascript
// Old
import { calculateFare } from './utils/fareCalculator'
const fare = calculateFare(origin, destination)

// New
import { calculateFareFromDistance } from './utils/distanceBasedFare'
const fare = calculateFareFromDistance(distanceKm)
```

### From fareMatrix.js to routeIntelligence.js
```javascript
// Old
import { fareMatrix } from './data/fareMatrix'
const fare = fareMatrix[origin][destination]

// New
import { routeIntelligence } from './data/routeIntelligence'
import { calculateFareFromDistance } from './utils/distanceBasedFare'
const route = routeIntelligence.find(r => r.origin === origin)
const fare = calculateFareFromDistance(route.distance)
```

---

## Known Issues

### Current Limitations
- No automated tests (manual testing only)
- No backend database (client-side only)
- No user authentication
- No real-time traffic data
- Mock API responses

### Planned Improvements
- Add automated testing
- Implement database integration
- Add user authentication
- Integrate real-time traffic
- Add offline mode

---

## Contributors

- **Lead Developer**: [Your Name]
- **Project Type**: Hackathon 2026
- **Location**: Batangas, Philippines

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- OpenStreetMap for map data and geocoding
- OSRM for routing engine
- Leaflet.js for interactive maps
- React community for amazing ecosystem
- Batangas commuters for inspiration

---

**For detailed feature documentation, see [docs/FEATURES.md](docs/FEATURES.md)**

**For architecture details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
