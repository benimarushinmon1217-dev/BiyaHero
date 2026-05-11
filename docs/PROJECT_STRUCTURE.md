# 📁 BiyaHero Project Structure

Complete guide to the repository organization and file structure.

---

## Root Directory

```
biyahero/
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variable template
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
├── README.md               # Project overview
├── docs/                   # Documentation
├── public/                 # Static assets
├── server/                 # Backend server
└── src/                    # Frontend source code
```

---

## Documentation (`/docs`)

All project documentation is centralized in the `docs/` folder:

```
docs/
├── ARCHITECTURE.md         # System architecture and design
├── API_REFERENCE.md        # API documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── DEPLOYMENT.md           # Deployment instructions
├── FEATURES.md             # Feature inventory
├── PROJECT_STRUCTURE.md    # This file
└── SETUP.md                # Installation guide
```

### Documentation Purpose

- **ARCHITECTURE.md** - Understand system design, data flow, and technical decisions
- **API_REFERENCE.md** - Learn about external APIs and internal functions
- **CONTRIBUTING.md** - Guidelines for contributing code
- **DEPLOYMENT.md** - Deploy to Vercel, Render, or other platforms
- **FEATURES.md** - Complete feature list with implementation details
- **PROJECT_STRUCTURE.md** - Navigate the codebase
- **SETUP.md** - Get started with local development

---

## Frontend Source (`/src`)

### Directory Structure

```
src/
├── components/             # Reusable UI components
│   ├── FeatureCard.jsx
│   ├── Navbar.jsx
│   ├── RouteMap.jsx
│   └── SearchBar.jsx
├── data/                   # Static data and configuration
│   ├── batangasLocations.js
│   ├── features.js
│   └── routeIntelligence.js
├── pages/                  # Route pages
│   ├── AIAssistant.jsx
│   ├── Alerts.jsx
│   ├── Features.jsx
│   ├── LandingPage.jsx
│   ├── Profile.jsx
│   └── RouteResults.jsx
├── services/               # External API integrations
│   ├── geocodingService.js
│   ├── routeService.js
│   └── searchService.js
├── utils/                  # Business logic utilities
│   ├── aiResponses.js
│   ├── distanceBasedFare.js
│   └── routeGenerator.js
├── App.jsx                 # Main app component
├── index.css               # Global styles
└── main.jsx                # Application entry point
```

### Component Organization

#### `/src/components` - Reusable UI Components
Components that can be used across multiple pages.

**Files:**
- `FeatureCard.jsx` - Feature display cards (dev mode)
- `Navbar.jsx` - Navigation bar with dark mode toggle
- `RouteMap.jsx` - Interactive Leaflet map
- `SearchBar.jsx` - Destination search with autocomplete

**Naming Convention:** PascalCase (e.g., `SearchBar.jsx`)

#### `/src/pages` - Route Pages
Full page components corresponding to routes.

**Files:**
- `LandingPage.jsx` - Home page with search (`/`)
- `RouteResults.jsx` - Route display and fare breakdown (`/route`)
- `AIAssistant.jsx` - AI chat interface (`/ai`)
- `Alerts.jsx` - Traffic and route alerts (`/alerts`)
- `Profile.jsx` - User profile and trip history (`/profile`)
- `Features.jsx` - Feature inventory (`/dev/features`)

**Naming Convention:** PascalCase (e.g., `RouteResults.jsx`)

#### `/src/services` - External API Integrations
Service layer for external API calls.

**Files:**
- `geocodingService.js` - Nominatim geocoding integration
- `routeService.js` - OSRM routing integration
- `searchService.js` - Local location search engine

**Naming Convention:** camelCase (e.g., `geocodingService.js`)

**Purpose:** Isolate API logic from UI components

#### `/src/utils` - Business Logic
Core business logic and utility functions.

**Files:**
- `distanceBasedFare.js` - Fare calculation engine
- `routeGenerator.js` - Route generation logic
- `aiResponses.js` - AI assistant response generation

**Naming Convention:** camelCase (e.g., `distanceBasedFare.js`)

**Purpose:** Reusable business logic independent of UI

#### `/src/data` - Static Data
Configuration and static data files.

**Files:**
- `batangasLocations.js` - 100+ location database
- `routeIntelligence.js` - Route metadata and tips
- `features.js` - Feature inventory data

**Naming Convention:** camelCase (e.g., `batangasLocations.js`)

**Purpose:** Centralized data management

---

## Backend Server (`/server`)

```
server/
├── index.js                # Express server
└── package.json            # Server dependencies (optional)
```

### Server Endpoints

- `GET /api/health` - Health check
- `POST /api/routes` - Route generation (mocked)
- `POST /api/ai/chat` - AI responses (mocked)
- `GET /api/alerts` - Alert data (mocked)

**Note:** Currently uses mock data. Ready for database integration.

---

## Public Assets (`/public`)

```
public/
└── logo.svg                # BiyaHero logo
```

Static assets served directly by Vite.

---

## Configuration Files

### `package.json`
Project dependencies and npm scripts.

**Key Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### `vite.config.js`
Vite build configuration.

**Key Settings:**
- React plugin
- Build output directory
- Development server port

### `tailwind.config.js`
Tailwind CSS configuration.

**Key Settings:**
- Content paths
- Theme customization
- Dark mode support

### `postcss.config.js`
PostCSS configuration for Tailwind.

### `.gitignore`
Git ignore rules.

**Ignored:**
- `node_modules/`
- `dist/`
- `.env`
- Build artifacts

### `.env.example`
Environment variable template.

**Variables:**
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_DEV_MODE` - Development mode flag
- Map default settings

---

## File Naming Conventions

### Components & Pages
- **Format:** PascalCase
- **Examples:** `SearchBar.jsx`, `RouteResults.jsx`
- **Rule:** Match the exported component name

### Services & Utils
- **Format:** camelCase
- **Examples:** `geocodingService.js`, `distanceBasedFare.js`
- **Rule:** Descriptive function names

### Data Files
- **Format:** camelCase
- **Examples:** `batangasLocations.js`, `routeIntelligence.js`
- **Rule:** Plural for arrays, singular for objects

### Documentation
- **Format:** UPPER_SNAKE_CASE
- **Examples:** `ARCHITECTURE.md`, `API_REFERENCE.md`
- **Rule:** All caps with underscores

---

## Import Patterns

### Absolute Imports (Not Configured)
Currently using relative imports:
```javascript
import SearchBar from '../components/SearchBar'
import { calculateFare } from '../utils/distanceBasedFare'
```

### Future: Path Aliases
Can be configured in `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@utils': '/src/utils'
  }
}
```

---

## Code Organization Principles

### 1. Separation of Concerns
- **UI Components** - Presentation only
- **Services** - External API calls
- **Utils** - Business logic
- **Data** - Static configuration

### 2. Single Responsibility
Each file has one clear purpose.

### 3. Reusability
Components and utilities are designed for reuse.

### 4. Maintainability
Clear naming and organization for easy navigation.

---

## Dependency Management

### Frontend Dependencies
- **React** - UI framework
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Leaflet** - Maps
- **Lucide React** - Icons

### Backend Dependencies
- **Express** - Web server
- **CORS** - Cross-origin requests

### Development Dependencies
- **Vite** - Build tool
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## Build Output

### Development
```
npm run dev
```
- Hot Module Replacement (HMR)
- Source maps
- Fast refresh
- Port: 5173

### Production
```
npm run build
```
Output directory: `dist/`
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── logo.svg
```

---

## Testing Structure (Future)

Recommended structure for tests:
```
src/
├── components/
│   ├── SearchBar.jsx
│   └── __tests__/
│       └── SearchBar.test.jsx
├── utils/
│   ├── distanceBasedFare.js
│   └── __tests__/
│       └── distanceBasedFare.test.js
```

---

## Environment-Specific Files

### Development
- `.env` (local, gitignored)
- `vite.config.js` (dev server settings)

### Production
- `.env.production` (deployment platform)
- `dist/` (build output)

---

## Version Control

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Message Format
```
feat: Add place confirmation UI
fix: Resolve map initialization error
docs: Update API reference
refactor: Simplify fare calculator
style: Format code with Prettier
```

---

## Quick Navigation

### Adding a New Feature
1. Create component in `/src/components` or `/src/pages`
2. Add business logic to `/src/utils`
3. Add API integration to `/src/services`
4. Add static data to `/src/data`
5. Update routes in `/src/App.jsx`
6. Document in `/docs/FEATURES.md`

### Fixing a Bug
1. Identify affected file(s)
2. Check related services/utils
3. Test locally
4. Update documentation if needed

### Adding Documentation
1. Choose appropriate doc file in `/docs`
2. Follow existing format
3. Update README.md if needed

---

## Resources

- **React Docs**: [react.dev](https://react.dev)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **Tailwind Docs**: [tailwindcss.com](https://tailwindcss.com)
- **Leaflet Docs**: [leafletjs.com](https://leafletjs.com)

---

**Last Updated**: 2026-05-11
