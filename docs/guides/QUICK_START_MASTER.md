# 🚀 BiyaHero Quick Start Guide

**Get the full-stack transportation intelligence platform running in 10 minutes!**

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

---

## ⚡ Super Quick Start (5 Minutes)

### Option 1: One-Command Startup (Recommended)

```bash
# 1. Clone and install
git clone https://github.com/yourusername/biyahero.git
cd biyahero
npm install
cd backend && npm install && cd ..

# 2. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL password

# 3. Create database
mysql -u root -p
CREATE DATABASE biyahero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 4. Start everything
npm run dev
```

**Done!** Open http://localhost:5173

### Option 2: Windows Batch Scripts

```bash
# Double-click or run:
start-all.bat          # Start frontend + backend
start-frontend.bat     # Frontend only
start-backend.bat      # Backend only
```

---

## 🎯 What You Get

### Automatic Startup
`npm run dev` automatically starts:
- ✅ **Frontend** (Vite) on port 5173
- ✅ **Backend** (Express) on port 5000
- ✅ Color-coded logs
- ✅ Auto-restart on changes
- ✅ Health monitoring

### Real-Time Development Status Panel

Look for the panel in the bottom-right corner showing:
- ✅ **Frontend** - React app status
- ✅ **Backend** - API server status (port, uptime, response time)
- ✅ **Database** - MySQL connection
- ✅ **Geolocation** - GPS/location services
- ✅ **Routing** - OSRM routing engine

### User-Friendly Error Messages

Instead of cryptic errors, you see:
```
🔌 Unable to connect to BiyaHero backend server.
   Please ensure the backend is running on port 5000.
```

---

## 📝 Detailed Setup (Step-by-Step)

### Step 1: Database Setup (2 minutes)

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE biyahero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 2: Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env file - UPDATE THESE:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=biyahero_db
# JWT_SECRET=your_secret_key_here
# JWT_REFRESH_SECRET=your_refresh_secret_here

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully
✅ Database synchronized successfully
🚀 BiyaHero API Server Started
📡 Server running on port 5000
🌍 Environment: development
```

### Step 3: Frontend Setup (3 minutes)

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to project root
cd ..

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Verify Installation (2 minutes)

1. **Open browser:** http://localhost:5173

2. **Check Development Status Panel:**
   - Look for panel in bottom-right corner
   - All indicators should be green ✅

3. **Test route search:**
   - Enter origin: "Lipa City"
   - Enter destination: "Batangas City"
   - Click "Search Route"
   - Map should display with route

4. **Test quick location presets:**
   - Click any of the 6 quick location buttons
   - Location should auto-fill

5. **Test geolocation:**
   - Click "Use My Location" button
   - Allow browser location access
   - Your location should be detected

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database tables created automatically
- [ ] Dev Status Panel shows all green ✅
- [ ] Can search routes
- [ ] Map displays correctly
- [ ] Quick location buttons work
- [ ] Geolocation works

---

## 🔧 Available Commands

### Development
```bash
npm run dev                 # Start frontend + backend
npm run dev:frontend-only   # Frontend only
npm run dev:backend-only    # Backend only
npm run health-check        # System health check
```

### Backend Commands
```bash
cd backend
npm run dev                 # Start with nodemon
npm start                   # Start without auto-reload
```

### Production
```bash
npm run build              # Build frontend for production
npm run preview            # Preview production build
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `ER_ACCESS_DENIED_ERROR`

**Fix:**
```bash
# Check MySQL is running
mysql -u root -p

# Update backend/.env with correct password
DB_PASSWORD=your_actual_password
```

**Error:** `Port 5000 is already in use`

**Fix:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in backend/.env
PORT=5001
```

### Frontend Won't Start

**Error:** `Port 5173 is already in use`

**Fix:**
```bash
# Windows - Kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

### Database Connection Failed

**Fix:**
```bash
# Windows - Start MySQL service
net start MySQL80

# Verify MySQL is running
mysql -u root -p

# Recreate database if needed
DROP DATABASE IF EXISTS biyahero_db;
CREATE DATABASE biyahero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Database Tables Not Created

**Fix:**
```bash
# Restart backend server
# Sequelize will auto-create tables on startup
cd backend
npm run dev
```

### Map Not Rendering

**Fix:**
1. Check browser console for errors
2. Verify internet connection (needs OpenStreetMap tiles)
3. Clear browser cache
4. Check Dev Status Panel for routing engine status

### Geolocation Not Working

**Fix:**
1. Use HTTPS or localhost (required for geolocation API)
2. Allow location access in browser
3. Try quick location presets as fallback
4. Check Dev Status Panel for geolocation status

---

## 📊 System Health Check

```bash
npm run health-check
```

This verifies:
- ✅ Node.js version (18+)
- ✅ npm installation
- ✅ MySQL installation and status
- ✅ Dependencies installed
- ✅ Environment files exist
- ✅ Running services (ports 5000, 5173)
- ✅ Database connection

---

## 📁 Project Structure

```
biyahero/
├── backend/              # Express + MySQL backend
│   ├── config/           # Database, JWT config
│   ├── controllers/      # Request handlers
│   ├── data/             # Transportation network data
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── services/         # Business logic (routing, AI, geocoding)
│   ├── middleware/       # Auth, validation, error handling
│   └── server.js         # Entry point
│
├── src/                  # React + Vite frontend
│   ├── api/              # Axios API client
│   ├── components/       # React components
│   ├── data/             # Location presets, features
│   ├── pages/            # Page components
│   ├── utils/            # Helper functions
│   └── App.jsx           # Main app component
│
├── docs/                 # Documentation
│   ├── guides/           # Setup and development guides
│   ├── testing/          # Testing documentation
│   └── reports/          # Implementation reports
│
├── scripts/              # Utility scripts
│   └── health-check.js   # System health checker
│
└── public/               # Static assets
```

---

## 🎯 Key Features

### Transportation Intelligence
- ✅ **Multi-modal routing** - Jeepney + walking combinations
- ✅ **100+ Batangas locations** - Comprehensive coverage
- ✅ **Realistic routing** - Uses actual jeepney routes
- ✅ **Smart transfers** - Optimized transfer points

### User Experience
- ✅ **Quick location presets** - 6 popular destinations
- ✅ **GPS geolocation** - Auto-detect current location
- ✅ **Confidence indicators** - HIGH/MEDIUM/LOW accuracy
- ✅ **Graceful fallbacks** - Multiple location detection methods
- ✅ **Interactive maps** - Leaflet.js with route visualization
- ✅ **Mobile responsive** - Works on all devices

### Fare Calculation
- ✅ **Distance-based pricing** - Accurate fare estimates
- ✅ **Student/Senior/PWD discounts** - 20% discount support
- ✅ **Transfer costs** - Includes all segments

### Development Features
- ✅ **Real-time status monitoring** - Dev Status Panel
- ✅ **Auto-reconnect** - Handles backend restarts
- ✅ **User-friendly errors** - Clear error messages
- ✅ **Health checks** - System diagnostics

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Health Check:** http://localhost:5000/health
- **API Documentation:** See [API_REFERENCE.md](../API_REFERENCE.md)

---

## 🧪 Test the Application

### Test Route Search
```
Origin: Lipa City
Destination: Batangas City
Expected: Multi-modal route with jeepney + walking
```

### Test Quick Locations
Click any preset button:
- 🏛️ Batangas City Hall
- 🏥 Batangas Medical Center
- 🏫 Batangas State University
- 🏪 SM City Batangas
- ⛪ Taal Basilica
- 🏖️ Laiya Beach

### Test Geolocation
1. Click "Use My Location"
2. Allow browser access
3. Check confidence indicator (HIGH/MEDIUM/LOW)

### Test API with cURL
```bash
# Health check
curl http://localhost:5000/health

# Get route
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 13.9414, "lng": 121.1628, "name": "Lipa City"},
    "destination": {"lat": 13.7565, "lng": 121.0583, "name": "Batangas City"}
  }'
```

---

## 🔧 Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js + OpenStreetMap
- **HTTP Client:** Axios
- **Routing:** React Router

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MySQL 8.0 + Sequelize ORM
- **Authentication:** JWT (access + refresh tokens)
- **Routing Engine:** OSRM (Open Source Routing Machine)
- **Geocoding:** Nominatim

### Services
- **Routing:** Multi-modal routing with realistic jeepney routes
- **Geocoding:** Location search and coordinate resolution
- **AI Assistant:** Taglish conversational interface
- **Fare Calculator:** Distance-based with discounts

---

## 📚 Next Steps

### For Users
1. ✅ App is running
2. ⏭️ Explore features
3. ⏭️ Test different routes
4. ⏭️ Try quick locations
5. ⏭️ Test on mobile

### For Developers
1. ✅ Development environment ready
2. ⏭️ Read [FULLSTACK_ARCHITECTURE.md](../FULLSTACK_ARCHITECTURE.md)
3. ⏭️ Explore [API_REFERENCE.md](../API_REFERENCE.md)
4. ⏭️ Check [DEVELOPMENT_ENVIRONMENT.md](DEVELOPMENT_ENVIRONMENT.md)
5. ⏭️ Review [CONTRIBUTING.md](../CONTRIBUTING.md)

### For Deployment
1. ✅ Local testing complete
2. ⏭️ Read [DEPLOYMENT.md](../DEPLOYMENT.md)
3. ⏭️ Configure production environment
4. ⏭️ Deploy frontend (Vercel/Netlify)
5. ⏭️ Deploy backend (Render/Railway)

---

## 💡 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend:** Vite HMR (instant updates)
- **Backend:** Nodemon (auto-restart on file changes)

### Debugging
```bash
# Backend logs
cd backend
npm run dev  # Watch console for API logs

# Frontend logs
# Open browser DevTools console
```

### Database Management
```bash
# View all tables
mysql -u root -p biyahero_db -e "SHOW TABLES;"

# View users
mysql -u root -p biyahero_db -e "SELECT * FROM users;"

# Reset database
mysql -u root -p
DROP DATABASE biyahero_db;
CREATE DATABASE biyahero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
cd backend && npm run dev  # Tables auto-recreate
```

---

## 🎉 Success!

You now have a production-grade transportation intelligence platform running with:

✅ **Full-stack architecture** - React + Express + MySQL  
✅ **Real transportation data** - 100+ Batangas locations  
✅ **Multi-modal routing** - Jeepney + walking combinations  
✅ **Interactive maps** - Route visualization  
✅ **Geolocation** - GPS with confidence indicators  
✅ **Quick locations** - Preset destination buttons  
✅ **Development tools** - Status monitoring, health checks  
✅ **User-friendly errors** - Clear error messages  
✅ **Auto-reconnect** - Resilient connection handling  

---

## 📞 Need Help?

### Documentation
- **Setup Issues:** [DEVELOPMENT_ENVIRONMENT.md](DEVELOPMENT_ENVIRONMENT.md)
- **Backend Setup:** [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **Architecture:** [FULLSTACK_ARCHITECTURE.md](../FULLSTACK_ARCHITECTURE.md)
- **API Reference:** [API_REFERENCE.md](../API_REFERENCE.md)
- **Map Issues:** [MAP_TROUBLESHOOTING_GUIDE.md](MAP_TROUBLESHOOTING_GUIDE.md)

### Reports
- **Geolocation:** [GEOLOCATION_RELIABILITY_COMPLETE.md](GEOLOCATION_RELIABILITY_COMPLETE.md)
- **Dev Environment:** [../reports/DEV_ENVIRONMENT_STABILIZATION_COMPLETE.md](../reports/DEV_ENVIRONMENT_STABILIZATION_COMPLETE.md)
- **Cleanup:** [../reports/CLEANUP_COMPLETE.md](../reports/CLEANUP_COMPLETE.md)

### Support
- **Issues:** [GitHub Issues](https://github.com/yourusername/biyahero/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/biyahero/discussions)

---

## 🎓 Learning Path

### Beginner (Day 1)
1. ✅ Get app running locally
2. ✅ Test all features
3. ✅ Read README.md
4. ✅ Explore the UI

### Intermediate (Week 1)
1. ⏭️ Read FULLSTACK_ARCHITECTURE.md
2. ⏭️ Understand data flow
3. ⏭️ Explore src/ and backend/ folders
4. ⏭️ Read API_REFERENCE.md

### Advanced (Month 1)
1. ⏭️ Read CONTRIBUTING.md
2. ⏭️ Make code changes
3. ⏭️ Add new features
4. ⏭️ Deploy to production

---

**Ready to revolutionize commuting in Batangas? Let's go! 🚀**
