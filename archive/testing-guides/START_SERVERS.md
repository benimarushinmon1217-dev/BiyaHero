# 🚀 Quick Start - Running Both Servers

## Prerequisites Checklist
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] MySQL server running
- [ ] Database `biyahero_db` created
- [ ] Environment files configured (`.env` and `backend/.env`)

---

## Option 1: Two Terminal Windows (Recommended)

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

**Expected Output**:
```
🚀 BiyaHero API Server Started
📡 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api/v1
💚 Health check: http://localhost:5000/health
```

### Terminal 2 - Frontend Server
```bash
# From root directory
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Option 2: Using VS Code Split Terminal

1. Open VS Code integrated terminal
2. Click the split terminal icon (or `Ctrl+Shift+5`)
3. In left terminal: `cd backend && npm run dev`
4. In right terminal: `npm run dev`

---

## Option 3: Using Windows Terminal (Tabs)

1. Open Windows Terminal
2. **Tab 1**: Backend
   ```bash
   cd D:\Ramoel\PORTFOLIO\sikaptala2026\backend
   npm run dev
   ```
3. **Tab 2**: Frontend (Ctrl+Shift+T for new tab)
   ```bash
   cd D:\Ramoel\PORTFOLIO\sikaptala2026
   npm run dev
   ```

---

## ✅ Verification Steps

### 1. Check Backend is Running
Open browser: http://localhost:5000/health

**Expected Response**:
```json
{
  "success": true,
  "message": "BiyaHero API is running",
  "timestamp": "2024-xx-xxTxx:xx:xx.xxxZ",
  "environment": "development"
}
```

### 2. Check Frontend is Running
Open browser: http://localhost:5173

**Expected**: BiyaHero landing page loads

### 3. Check Console (F12)
**Expected**: No red errors, no connection refused errors

---

## 🛑 Stopping Servers

### Stop Backend
- Press `Ctrl+C` in backend terminal
- Type `Y` if prompted

### Stop Frontend
- Press `Ctrl+C` in frontend terminal
- Type `Y` if prompted

---

## 🔄 Restarting Servers

If you make changes to:
- **Backend code**: Restart backend (nodemon auto-restarts)
- **Frontend code**: No restart needed (Vite hot-reload)
- **Environment files**: Restart both servers

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If in use, kill the process
taskkill /PID <PID_NUMBER> /F
```

### Frontend won't start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# If in use, kill the process
taskkill /PID <PID_NUMBER> /F
```

### MySQL not running
- **XAMPP**: Open XAMPP Control Panel → Start MySQL
- **Windows Service**: Services → MySQL → Start

### Database connection error
```bash
# Test MySQL connection
mysql -u root -p
# Enter password, then:
SHOW DATABASES;
# Should see 'biyahero_db'
```

---

## 📝 Development Workflow

### Daily Startup
1. Start MySQL (XAMPP or service)
2. Start backend server
3. Start frontend server
4. Open http://localhost:5173

### Making Changes
- **Frontend**: Edit files → Auto-reload
- **Backend**: Edit files → Nodemon auto-restart
- **Database**: Changes persist automatically

### Before Committing
1. Stop both servers
2. Run tests (if available)
3. Check for console errors
4. Commit changes

---

## 🎯 Quick Commands Reference

| Action | Command | Location |
|--------|---------|----------|
| Install backend deps | `npm install` | `/backend` |
| Install frontend deps | `npm install` | `/` (root) |
| Start backend | `npm run dev` | `/backend` |
| Start frontend | `npm run dev` | `/` (root) |
| Build frontend | `npm run build` | `/` (root) |
| Check backend health | Visit URL | http://localhost:5000/health |
| Open app | Visit URL | http://localhost:5173 |

---

## 💡 Pro Tips

1. **Keep terminals open**: Don't close them while developing
2. **Watch the logs**: Backend terminal shows API requests
3. **Use nodemon**: Backend auto-restarts on file changes
4. **Hot reload**: Frontend updates without refresh
5. **Check health endpoint**: Quick way to verify backend is running

---

## 🆘 Need Help?

- **Setup issues**: See `FIX_GUIDE.md`
- **Error diagnosis**: See `DIAGNOSTIC_REPORT.md`
- **API documentation**: See `docs/API_REFERENCE.md`
- **Architecture**: See `docs/ARCHITECTURE.md`

---

## ✨ You're Ready!

Once both servers are running and showing no errors, you can:
- 🔍 Search for routes
- 🗺️ View multi-modal routing options
- 💬 Use AI assistant
- 📱 Test all features

Happy coding! 🎉
