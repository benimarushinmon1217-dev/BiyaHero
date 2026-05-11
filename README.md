# 🚀 BiyaHero - AI-Powered Commuting Companion

> Smart route planning and fare calculation for Batangas Province, Philippines

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**BiyaHero** (Biyahe + Hero/Bayani) is an intelligent commute planning platform designed specifically for Batangas Province. It combines real-time routing, distance-based fare calculation, and AI-powered assistance to help commuters navigate public transportation with confidence.

### Key Features

✅ **Smart Route Planning** - Real road-following routes using OSRM  
✅ **Distance-Based Fares** - Accurate fare calculation (₱12 base + ₱1/km)  
✅ **Place Confirmation** - Navigation-grade destination accuracy  
✅ **AI Assistant** - Natural language commute guidance in Taglish  
✅ **100+ Locations** - Comprehensive Batangas location database  
✅ **Interactive Maps** - Leaflet.js with custom markers  
✅ **Discount Support** - 20% off for Student/Senior/PWD  
✅ **Mobile Responsive** - Works on all devices  

---

## 🎯 Problem & Solution

### Problem
Commuters in Batangas struggle with:
- Uncertain fare costs
- Complex multi-transfer routes
- Lack of real-time guidance
- Difficulty finding exact destinations

### Solution
BiyaHero provides:
- **Accurate fare estimates** based on actual route distance
- **Step-by-step guidance** with transfer information
- **AI-powered assistance** for commute questions
- **Validated destination selection** to prevent routing errors

---

## 🖼️ Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Route Results
![Route Results](docs/screenshots/route-results.png)

### AI Assistant
![AI Assistant](docs/screenshots/ai-assistant.png)

### Place Confirmation
![Place Confirmation](docs/screenshots/place-confirmation.png)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (Vite)                 │
│   - Pages, Components, UI               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Service Layer                         │
│   - Geocoding, Routing, Search          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   External APIs                         │
│   - OSRM (Routing)                      │
│   - Nominatim (Geocoding)               │
└─────────────────────────────────────────┘
```

**Tech Stack:**
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Maps**: Leaflet.js
- **Routing**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Backend**: Express.js (Node.js)

[📚 Full Architecture Documentation](docs/ARCHITECTURE.md)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/biyahero.git
cd biyahero
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

[📚 Detailed Setup Guide](docs/SETUP.md)

---

## 📁 Project Structure

```
biyahero/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── RouteMap.jsx
│   │   └── FeatureCard.jsx
│   ├── pages/          # Route pages
│   │   ├── LandingPage.jsx
│   │   ├── RouteResults.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── Alerts.jsx
│   │   └── Profile.jsx
│   ├── services/       # External API integrations
│   │   ├── geocodingService.js
│   │   ├── routeService.js
│   │   └── searchService.js
│   ├── utils/          # Business logic
│   │   ├── distanceBasedFare.js
│   │   ├── routeGenerator.js
│   │   └── aiResponses.js
│   ├── data/           # Static data
│   │   ├── batangasLocations.js
│   │   ├── routeIntelligence.js
│   │   └── features.js
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js        # Express server
├── docs/               # Documentation
├── public/             # Static assets
└── package.json
```

---

## 🎯 Core Features

### 1. Destination Resolution System
- **Two-stage autocomplete**: Local database + geocoded results
- **Place confirmation**: User selects exact destination
- **Confidence scoring**: 0-100% match accuracy
- **Batangas prioritization**: Local landmarks ranked higher

### 2. Distance-Based Fare System
**Formula:**
```
Base Fare: ₱12 (first 5 km)
Additional: ₱1 per km after 5 km
Discount: 20% for Student/Senior/PWD
```

**Example:**
- 5 km → ₱12
- 10 km → ₱17
- 14 km → ₱21 (₱17 with discount)

### 3. Route Intelligence
- Transport type recommendations
- Difficulty assessment
- Rush hour awareness
- Transfer expectations
- Commuter tips

### 4. AI Assistant
- Natural language understanding
- Taglish support (Tagalog + English)
- Contextual responses
- Distance-aware fare quotes

[📚 Full Feature Documentation](docs/FEATURES.md)

---

## 🔌 API Integration

### OSRM (Routing)
```javascript
const route = await getRouteFromOSRM(
  { lat: 13.9411, lng: 121.1650 },
  { lat: 13.7565, lng: 121.0583 }
)
// Returns: distance, duration, geometry
```

### Nominatim (Geocoding)
```javascript
const places = await getPlaceSuggestions('Lipa Cathedral', 5)
// Returns: 5 validated place options
```

[📚 API Reference](docs/API_REFERENCE.md)

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render/Railway)
```bash
cd server
npm start
```

[📚 Deployment Guide](docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use ES6+ JavaScript
- Follow React best practices
- Use Tailwind CSS for styling
- Add comments for complex logic
- Test manually before submitting

---

## 📊 Location Coverage

- **100+ Locations** across Batangas Province
- **12 Categories**: Municipalities, Malls, Schools, Hospitals, Terminals, Churches, Roads, Barangays, Tourist Spots, Public Offices, Establishments
- **Fuzzy Search**: Typo-tolerant matching
- **Alias Support**: "dlsl" → "De La Salle Lipa"

---

## 🎨 Design Philosophy

1. **User-Centric**: Built for actual Batangas commuters
2. **Accurate**: Distance-based fares, validated destinations
3. **Intelligent**: AI-powered assistance, route intelligence
4. **Accessible**: Mobile-responsive, keyboard navigation
5. **Open**: Free APIs, no vendor lock-in

---

## 🔮 Future Roadmap

- [ ] Real-time traffic integration
- [ ] User authentication
- [ ] Trip history and favorites
- [ ] Push notifications for alerts
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Driver/operator dashboard
- [ ] Payment integration

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for Batangas commuters

- **Developer**: [Your Name]
- **Project**: Hackathon 2026
- **Location**: Batangas, Philippines

---

## 🙏 Acknowledgments

- **OpenStreetMap** - Map data and geocoding
- **OSRM** - Routing engine
- **Leaflet.js** - Interactive maps
- **React Community** - Amazing ecosystem
- **Batangas Commuters** - Inspiration and feedback

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/biyahero/issues)
- **Email**: support@biyahero.com
- **Documentation**: [docs/](docs/)

---

## ⭐ Star Us!

If you find BiyaHero useful, please consider giving us a star on GitHub!

---

**Made with 🚌 for Batangas commuters**
