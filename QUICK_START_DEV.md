# 🚀 Quick Start - Development Environment

**Get BiyaHero running in 5 minutes!**

---

## ⚡ Super Quick Start

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL password

# 3. Create database
mysql -u root -p
CREATE DATABASE biyahero_db;
EXIT;

# 4. Start everything
npm run dev
```

**Done!** Open http://localhost:5173

---

## 🎯 What You Get

### One Command Startup
```bash
npm run dev
```

Automatically starts:
- ✅ Frontend (Vite) on port 5173
- ✅ Backend (Express) on port 5000
- ✅ Color-coded logs
- ✅ Auto-restart on changes

### Real-Time Status Panel

Look for the panel in the bottom-right corner showing:
- ✅ Frontend status
- ✅ Backend status
- ✅ Database connection
- ✅ Geolocation API
- ✅ Routing engine

### User-Friendly Errors

Instead of:
```
Error: ERR_CONNECTION_REFUSED
```

You see:
```
🔌 Unable to connect to BiyaHero backend server.
   Please ensure the backend is running.
```

---

## 🔧 Alternative Commands

```bash
# Frontend only
npm run dev:frontend-only

# Backend only
npm run dev:backend-only

# Health check
npm run health-check

# Windows users
start-all.bat
```

---

## 🆘 Troubleshooting

### Backend Won't Start?
```bash
cd backend && npm install
npm run health-check
```

### Database Connection Failed?
```bash
# Windows
net start MySQL80

# Create database
mysql -u root -p
CREATE DATABASE biyahero_db;
```

### Port Already in Use?
```bash
# Windows - Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📊 Check System Health

```bash
npm run health-check
```

This will verify:
- ✅ Node.js version
- ✅ npm installation
- ✅ MySQL installation
- ✅ Dependencies
- ✅ Environment files
- ✅ Running services

---

## 🎨 Development Status Panel

### Features
- Real-time service monitoring
- Color-coded indicators
- Minimize/expand
- Backend info (port, uptime, response time)
- Helpful error messages

### Status Colors
- ✅ Green = Connected/Available
- ❌ Red = Disconnected/Unavailable
- ⏳ Yellow = Checking/Unknown

---

## 📚 Full Documentation

For complete setup guide, see:
- **[Development Environment Guide](docs/guides/DEVELOPMENT_ENVIRONMENT.md)**
- **[Stabilization Report](DEV_ENVIRONMENT_STABILIZATION_COMPLETE.md)**

---

## 🎉 Success Checklist

- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database created
- [ ] `npm run dev` runs successfully
- [ ] Dev Status Panel shows all green ✅
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend health check passes

---

**Happy coding! 🚀**

