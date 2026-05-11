# 🤝 Contributing to BiyaHero

Thank you for your interest in contributing to BiyaHero! This guide will help you get started.

---

## 🎯 Engineering Handoff Notes

### Project Context
BiyaHero was built during a hackathon to solve real commuting problems in Batangas Province. The codebase prioritizes:
- **Functionality over perfection**
- **User experience over complexity**
- **Rapid iteration over extensive testing**

### Current State
- ✅ Core features complete and working
- ✅ Production-ready architecture
- ⚠️ No automated tests (manual testing only)
- ⚠️ No backend database (client-side only)
- ⚠️ No user authentication

---

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Getting Started
```bash
# Clone repository
git clone https://github.com/yourusername/biyahero.git
cd biyahero

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

### Development Server
- **Frontend**: `npm run dev` (port 5173)
- **Backend**: `cd server && npm start` (port 3001)

---

## 📁 Folder Conventions

### `/src/components`
Reusable UI components that can be used across multiple pages.

**Naming:** PascalCase (e.g., `SearchBar.jsx`)

**Structure:**
```jsx
import { useState } from 'react'
import { motion } from 'framer-motion'

const ComponentName = ({ prop1, prop2 }) => {
    // Component logic
    return (
        <div>
            {/* JSX */}
        </div>
    )
}

export default ComponentName
```

### `/src/pages`
Full page components that correspond to routes.

**Naming:** PascalCase (e.g., `RouteResults.jsx`)

**Structure:**
```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PageName = () => {
    // Page logic
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page content */}
        </div>
    )
}

export default PageName
```

### `/src/services`
External API integrations and service layer.

**Naming:** camelCase (e.g., `geocodingService.js`)

**Structure:**
```javascript
/**
 * Service description
 */

export const functionName = async (params) => {
    try {
        // API call
        return { success: true, data }
    } catch (error) {
        console.error('Error:', error)
        return { success: false, error: error.message }
    }
}

export default {
    functionName
}
```

### `/src/utils`
Business logic and utility functions.

**Naming:** camelCase (e.g., `distanceBasedFare.js`)

**Structure:**
```javascript
/**
 * Utility description
 * @param {type} param - Description
 * @returns {type} Description
 */
export const utilityFunction = (param) => {
    // Logic
    return result
}
```

### `/src/data`
Static data and configuration.

**Naming:** camelCase (e.g., `batangasLocations.js`)

**Structure:**
```javascript
export const DATA_NAME = [
    // Array of objects
]

export const CONSTANT_NAME = 'value'
```

---

## 💻 Coding Standards

### JavaScript/React
- Use **ES6+** syntax
- Use **functional components** with hooks
- Use **arrow functions** for callbacks
- Use **async/await** for promises
- Use **destructuring** when appropriate

### Styling
- Use **Tailwind CSS** utility classes
- Use **Framer Motion** for animations
- Follow **mobile-first** approach
- Use **dark mode** support

### Comments
```javascript
// Single-line comments for brief explanations

/**
 * Multi-line comments for functions
 * @param {string} param - Parameter description
 * @returns {object} Return value description
 */
```

### Naming Conventions
- **Components**: PascalCase (`SearchBar`)
- **Functions**: camelCase (`calculateFare`)
- **Constants**: UPPER_SNAKE_CASE (`BASE_FARE`)
- **Files**: Match export name

---

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation
- `refactor/component-name` - Code refactoring

### Commit Messages
```
feat: Add place confirmation UI
fix: Resolve map initialization error
docs: Update API reference
refactor: Simplify fare calculator
style: Format code with Prettier
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and commit
3. Push to your fork
4. Open Pull Request with description
5. Wait for review
6. Address feedback
7. Merge when approved

---

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Route search works end-to-end
- [ ] Fare calculation is accurate
- [ ] Map renders correctly
- [ ] Autocomplete shows suggestions
- [ ] Place confirmation works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] No console errors

### Test Scenarios
1. **Search Flow**: Type destination → Select → Confirm → View route
2. **Fare Calculation**: Verify fare matches formula
3. **Map Display**: Check markers and route line
4. **AI Assistant**: Ask questions and verify responses
5. **Edge Cases**: Empty input, no results, API failures

---

## 🐛 Debugging Tips

### Common Issues

**Map not rendering:**
```javascript
// Check if mapRef.current exists
if (!mapRef.current) return

// Add delay for DOM readiness
setTimeout(() => {
    L.map(mapRef.current)
}, 100)
```

**Geocoding fails:**
```javascript
// Add fallback
const places = await getPlaceSuggestions(query)
if (places.length === 0) {
    // Show "no results" message
}
```

**OSRM routing fails:**
```javascript
// Use fallback distance
if (!route.success) {
    return getFallbackRoute(start, end)
}
```

### Browser DevTools
- **Console**: Check for errors
- **Network**: Verify API calls
- **React DevTools**: Inspect component state
- **Lighthouse**: Check performance

---

## 📦 Adding Dependencies

### Before Adding
1. Check if existing library can solve the problem
2. Verify package is actively maintained
3. Check bundle size impact
4. Review license compatibility

### Installation
```bash
npm install package-name
```

### Update Documentation
- Add to `package.json`
- Document usage in relevant files
- Update README if user-facing

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render)
```bash
cd server
npm start
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.biyahero.com
```

---

## 📝 Documentation

### When to Update Docs
- Adding new features
- Changing APIs
- Modifying architecture
- Fixing bugs (if non-obvious)

### Documentation Files
- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - System design
- `docs/API_REFERENCE.md` - API documentation
- `docs/FEATURES.md` - Feature list
- `docs/SETUP.md` - Installation guide

---

## 🎯 Priority Areas for Contribution

### High Priority
1. **Automated Testing** - Unit and integration tests
2. **Backend API** - Database and caching
3. **User Authentication** - Login and profiles
4. **Real-time Traffic** - Live traffic data

### Medium Priority
1. **Offline Mode** - Service worker
2. **Push Notifications** - Alert system
3. **Multi-language** - i18n support
4. **Accessibility** - WCAG compliance

### Low Priority
1. **Analytics** - Usage tracking
2. **A/B Testing** - Feature experiments
3. **Performance** - Optimization
4. **SEO** - Meta tags

---

## 🤔 Questions?

- **Technical**: Open an issue on GitHub
- **Architecture**: Check `docs/ARCHITECTURE.md`
- **APIs**: Check `docs/API_REFERENCE.md`
- **Setup**: Check `docs/SETUP.md`

---

## 🙏 Thank You!

Every contribution helps make BiyaHero better for Batangas commuters. We appreciate your time and effort!

---

**Happy Coding! 🚀**
