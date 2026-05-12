# 🛠️ Development Environment Guide

**Complete guide to setting up and running the BiyaHero development environment**

---

## 🎯 Quick Start

### One-Command Startup (Recommended)

```bash
npm run dev
```

This single command will:
- ✅ Start the frontend (Vite) on port 5173
- ✅ Start the backend (Express) on port 5000
- ✅ Show color-coded logs for both services
- ✅ Auto-restart on file changes

---

## 📋 Prerequisites

### Required Software

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MySQL 8.0+**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

3. **npm or yarn**
   - Comes with Node.js
   - Verify: `npm --version`

### Optional Tools

- **Git** - For version control
- **VS Code** - Recommended IDE
- **Postman** - For API testing

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/biyahero.git
cd biyahero
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Setup Database

```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE biyahero_db;
EXIT;
```

### 4. Configure Environment

```bash
# Copy environment template
cp .env.example .env
cp backend/.env.example backend/.env

# Edit backend/.env with your MySQL credentials
# DB_PASSWORD=your_mysql_password
```

### 5. Start Development

```bash
# Start all services
npm run dev
```

---

## 🎮 Available Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend-only` | Start frontend only |
| `npm run dev:backend-only` | Start backend only |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run health-check` | Check backend health |

### Windows Batch Scripts

| Script | Description |
|--------|-------------|
| `start-all.bat` | Start all services (Windows) |
| `start-frontend.bat` | Start frontend only (Windows) |
| `start-backend.bat` | Start backend only (Windows) |

---

## 🔍 Service Status

### Development Status Panel

When running in development mode, you'll see a status panel in the bottom-right corner showing:

- ✅ **Frontend** - Vite dev server status
- ✅ **Backend** - Express API status
- ✅ **Database** - MySQL connection status
- ✅ **Geolocation** - Browser geolocation API
- ✅ **Routing** - External routing engine

**Features:**
- Real-time status updates
- Auto-reconnect on backend restart
- Minimize/expand panel
- Close/reopen panel

### Health Check Endpoint

Check backend health manually:

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "BiyaHero API is running",
  "timestamp": "2026-05-12T10:30:00.000Z",
  "environment": "development",
  "uptime": 123.45,
  "database": {
    "status": "connected",
    "message": "Database connection successful"
  },
  "server": {
    "port": 5000,
    "nodeVersion": "v18.0.0",
    "platform": "win32"
  },
  "responseTime": "5ms"
}
```

---

## 🌐 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| MySQL | 3306 | localhost:3306 |

**Note:** Ports can be changed in configuration files if needed.

---

## 🔧 Troubleshooting

### Backend Won't Start

**Problem:** `Error: Cannot find module`

**Solution:**
```bash
cd backend
npm install
cd ..
npm run dev
```

---

### Database Connection Failed

**Problem:** `SequelizeConnectionError: Access denied`

**Solution:**
1. Check MySQL is running
2. Verify credentials in `backend/.env`
3. Ensure database exists: `CREATE DATABASE biyahero_db;`

---

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**

**Windows:**
```bash
# Find process using port
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9
```

---

### Frontend Can't Connect to Backend

**Problem:** `ERR_CONNECTION_REFUSED` or `Network Error`

**Solution:**
1. Ensure backend is running: `npm run dev:backend-only`
2. Check backend health: `curl http://localhost:5000/health`
3. Verify CORS settings in `backend/app.js`
4. Check Dev Status Panel for backend status

---

### MySQL Not Running

**Problem:** `ECONNREFUSED 127.0.0.1:3306`

**Solution:**

**Windows:**
```bash
# Start MySQL service
net start MySQL80
```

**Mac:**
```bash
# Start MySQL
brew services start mysql
```

**Linux:**
```bash
# Start MySQL
sudo systemctl start mysql
```

---

### Dependencies Out of Date

**Problem:** Various errors after pulling new code

**Solution:**
```bash
# Update all dependencies
npm install
cd backend && npm install && cd ..

# Clear cache if needed
npm cache clean --force
```

---

## 🎨 Development Workflow

### Typical Development Session

1. **Start Services**
   ```bash
   npm run dev
   ```

2. **Check Status Panel**
   - Verify all services are green ✅
   - Check backend connection
   - Confirm database is connected

3. **Make Changes**
   - Edit code in `src/` (frontend) or `backend/`
   - Changes auto-reload (hot module replacement)

4. **Test Changes**
   - Frontend: Check browser
   - Backend: Use Postman or curl
   - Database: Check MySQL Workbench

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push
   ```

---

## 📊 Monitoring & Debugging

### Frontend Debugging

**Browser DevTools:**
- Console: `F12` → Console tab
- Network: `F12` → Network tab
- React DevTools: Install browser extension

**Vite Logs:**
- Check terminal for Vite output
- Look for compilation errors
- Check HMR (Hot Module Replacement) status

### Backend Debugging

**Server Logs:**
- Check terminal for Express output
- Morgan logs all HTTP requests
- Error stack traces show in console

**Database Queries:**
- Sequelize logs SQL queries in development
- Check `backend/logs/` for detailed logs

**API Testing:**
- Use Postman for manual testing
- Check `/health` endpoint first
- Verify request/response in Network tab

---

## 🔐 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_OPENROUTE_API_KEY=your_key_here
```

### Backend (backend/.env)

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biyahero_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚦 Startup Order

### Automatic (Recommended)

```bash
npm run dev
```

Concurrently handles startup order automatically.

### Manual (If Needed)

1. **Start MySQL** (must be first)
   ```bash
   # Ensure MySQL is running
   ```

2. **Start Backend** (second)
   ```bash
   npm run dev:backend-only
   ```

3. **Start Frontend** (last)
   ```bash
   npm run dev:frontend-only
   ```

---

## 📱 Mobile Testing

### Test on Mobile Device

1. **Find Your Local IP**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Start with Host Flag**
   ```bash
   # Frontend
   npm run dev -- --host
   
   # Backend already listens on 0.0.0.0
   ```

3. **Access from Mobile**
   ```
   http://YOUR_LOCAL_IP:5173
   ```

---

## 🎯 Best Practices

### Do's ✅

- Always use `npm run dev` for development
- Check Dev Status Panel before debugging
- Keep dependencies up to date
- Use environment variables for configuration
- Test on multiple browsers
- Commit frequently with clear messages

### Don'ts ❌

- Don't commit `.env` files
- Don't run production builds in development
- Don't ignore console warnings
- Don't skip database migrations
- Don't hardcode API URLs
- Don't forget to pull before starting work

---

## 🆘 Getting Help

### Resources

- **Documentation**: `/docs` folder
- **API Reference**: `docs/API_REFERENCE.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Contributing**: `docs/CONTRIBUTING.md`

### Common Issues

- Check Dev Status Panel first
- Review console logs
- Verify environment variables
- Ensure all services are running
- Check network connectivity

### Support

- **GitHub Issues**: Report bugs and request features
- **Team Chat**: Ask questions in team channel
- **Documentation**: Check guides in `/docs`

---

## 🎉 Success Checklist

Before starting development, verify:

- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database created (`biyahero_db`)
- [ ] `npm run dev` starts successfully
- [ ] Dev Status Panel shows all green ✅
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend health check passes
- [ ] Database connection successful

---

**Your development environment is ready! Happy coding! 🚀**

