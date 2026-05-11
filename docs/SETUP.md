# 🛠️ BiyaHero Setup Guide

Complete installation and configuration guide for local development.

---

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** (for cloning repository)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Check Versions
```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
git --version     # Any recent version
```

### Installing Node.js
If you don't have Node.js installed:

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run installer
- Restart terminal

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Installation

### 1. Clone Repository

```bash
# HTTPS
git clone https://github.com/yourusername/biyahero.git

# SSH
git clone git@github.com:yourusername/biyahero.git

# Navigate to project
cd biyahero
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Leaflet.js
- React Router
- Express.js
- And all other dependencies

**Installation time:** ~2-3 minutes (depending on internet speed)

### 3. Verify Installation

```bash
# Check if node_modules exists
ls node_modules

# Check package.json
cat package.json
```

---

## Configuration

### Environment Variables (Optional)

BiyaHero works out of the box with no configuration needed. All APIs are public and free.

If you want to customize settings, create a `.env` file:

```bash
# Copy example
cp .env.example .env
```

**`.env` file:**
```env
# API Base URL (optional)
VITE_API_BASE_URL=http://localhost:3001

# Development Mode
VITE_DEV_MODE=true

# Map Settings (optional)
VITE_DEFAULT_CENTER_LAT=13.9411
VITE_DEFAULT_CENTER_LNG=121.1650
VITE_DEFAULT_ZOOM=13
```

**Note:** All variables must be prefixed with `VITE_` to be accessible in the frontend.

---

## Running the Application

### Development Mode

**Start Frontend:**
```bash
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

**Start Backend (Optional):**
```bash
cd server
npm start
```

Backend will run on:
```
http://localhost:3001
```

### Production Build

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

---

## Project Structure

```
biyahero/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── RouteMap.jsx
│   │   └── FeatureCard.jsx
│   ├── pages/             # Route pages
│   │   ├── LandingPage.jsx
│   │   ├── RouteResults.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── Alerts.jsx
│   │   ├── Profile.jsx
│   │   └── Features.jsx
│   ├── services/          # External API integrations
│   │   ├── geocodingService.js
│   │   ├── routeService.js
│   │   └── searchService.js
│   ├── utils/             # Business logic
│   │   ├── distanceBasedFare.js
│   │   ├── routeGenerator.js
│   │   └── aiResponses.js
│   ├── data/              # Static data
│   │   ├── batangasLocations.js
│   │   ├── routeIntelligence.js
│   │   └── features.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── server/                # Backend (optional)
│   └── index.js           # Express server
├── public/                # Static assets
│   └── logo.svg
├── docs/                  # Documentation
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

---

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:5173`

### 3. Make Changes
Edit files in `src/` directory. Changes will hot-reload automatically.

### 4. Test Changes
- Test in browser
- Check console for errors
- Verify mobile responsiveness

### 5. Build for Production
```bash
npm run build
```

---

## Common Issues

### Port Already in Use

**Error:**
```
Port 5173 is already in use
```

**Solution:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found

**Error:**
```
Cannot find module 'package-name'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Map Not Rendering

**Error:**
Map container is blank

**Solution:**
- Check browser console for errors
- Verify Leaflet CSS is imported
- Check if `mapRef.current` exists
- Add delay before map initialization

### CORS Errors

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
- Ensure backend has CORS enabled
- Check API endpoint URLs
- Verify environment variables

---

## Browser DevTools

### React DevTools
Install browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Debugging
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use React DevTools to inspect components

---

## IDE Setup

### VS Code (Recommended)

**Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag

**Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Testing

### Manual Testing
1. **Route Search**: Type destination → Select → View route
2. **Fare Calculation**: Verify fare matches formula
3. **Map Display**: Check markers and route line
4. **Autocomplete**: Type and verify suggestions
5. **Place Confirmation**: Select place and verify coordinates
6. **Mobile**: Test on mobile devices
7. **Dark Mode**: Toggle and verify

### Test Data
Use these Batangas locations for testing:
- **Lipa City** → **Batangas City**
- **SM City Lipa** → **Batangas State University**
- **Tanauan City** → **Lipa Cathedral**

---

## Performance

### Development
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components
- Source maps for debugging

### Production
- Code splitting
- Minification
- Tree shaking
- Asset optimization

---

## Troubleshooting

### Clear Cache
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Logs
```bash
# Frontend logs
npm run dev

# Backend logs
cd server && npm start
```

---

## Next Steps

After setup:
1. Read [Architecture Documentation](ARCHITECTURE.md)
2. Review [API Reference](API_REFERENCE.md)
3. Check [Contributing Guide](CONTRIBUTING.md)
4. Explore [Features Documentation](FEATURES.md)

---

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/biyahero/issues)
- **Documentation**: [docs/](.)
- **Email**: support@biyahero.com

---

**Happy Coding! 🚀**
