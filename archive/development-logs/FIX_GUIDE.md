# 🔧 Bug Fix Guide - BiyaHero Application

## 🐛 Issues Identified

### 1. **Backend Server Not Running** (CRITICAL)
- **Error**: `ERR_CONNECTION_REFUSED` on `localhost:5000`
- **Cause**: Backend API server is not started
- **Impact**: All API calls fail, multi-modal routing doesn't work

### 2. **Missing Environment Files**
- **Missing**: `.env` (frontend) and `backend/.env` (backend)
- **Impact**: Configuration not loaded properly

### 3. **Backend Dependencies Not Installed**
- **Missing**: `backend/node_modules` folder
- **Impact**: Cannot start backend server

### 4. **React Router Warnings** (Non-Critical)
- **Warning**: Future API changes in React Router v7
- **Impact**: None currently, just deprecation warnings

---

## ✅ Fixes Applied

### ✓ Created `.env` file (Frontend)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_DEV_MODE=true
VITE_DEFAULT_CENTER_LAT=13.9411
VITE_DEFAULT_CENTER_LNG=121.1650
VITE_DEFAULT_ZOOM=13
```

### ✓ Created `backend/.env` file (Backend)
```env
NODE_ENV=development
PORT=5000
API_VERSION=v1
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biyahero_db
DB_USER=root
DB_PASSWORD=
# ... (other configs)
```

### ✓ Fixed port mismatch in `.env.example`
- Updated from port 3001 to 5000

### ✓ Installed axios package
- Added to frontend dependencies

---

## 🚀 Steps to Fix Your Application

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup MySQL Database (Required)
You need a MySQL database running. Choose one option:

**Option A: Using XAMPP (Recommended for Windows)**
1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Start Apache and MySQL from XAMPP Control Panel
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create database: `biyahero_db`

**Option B: Using MySQL Workbench**
1. Install MySQL Server and Workbench
2. Create database: `biyahero_db`
3. Update `backend/.env` with your MySQL credentials

**Option C: Skip Database (Temporary)**
If you want to test without database, you'll need to modify the backend to work without DB connection (not recommended).

### Step 3: Update Database Credentials
Edit `backend/.env` and set your MySQL password:
```env
DB_PASSWORD=your_mysql_password_here
```

### Step 4: Start Backend Server
```bash
# From backend directory
npm run dev
```

You should see:
```
🚀 BiyaHero API Server Started
📡 Server running on port 5000
```

### Step 5: Start Frontend (In New Terminal)
```bash
# From root directory
npm run dev
```

### Step 6: Verify Everything Works
1. Frontend should be at: http://localhost:5173
2. Backend should be at: http://localhost:5000
3. Test health check: http://localhost:5000/health
4. No more connection errors in console

---

## 🔍 Verification Checklist

- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] MySQL database running
- [ ] Database `biyahero_db` created
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] No `ERR_CONNECTION_REFUSED` errors
- [ ] Can search for routes without errors

---

## 🐛 Remaining Issues (Non-Critical)

### React Router Warnings
These are just deprecation warnings for future React Router v7:
- `React.startTransition` → `v7_startTransition`
- Relative route resolution → `v7_relativeSplatPath`

**Fix (Optional)**: Update `src/App.jsx` router configuration:
```jsx
<BrowserRouter future={{
  v7_startTransition: true,
  v7_relativeSplatPath: true
}}>
```

---

## 📝 Quick Command Reference

### Start Both Servers (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Check if Servers are Running
```bash
# Check backend
curl http://localhost:5000/health

# Check frontend
curl http://localhost:5173
```

---

## 🆘 Troubleshooting

### Backend won't start
- **Check**: MySQL is running
- **Check**: Database credentials in `backend/.env`
- **Check**: Port 5000 is not in use
- **Try**: `netstat -ano | findstr :5000` (Windows)

### Frontend can't connect to backend
- **Check**: Backend is running (http://localhost:5000/health)
- **Check**: `.env` has correct `VITE_API_BASE_URL`
- **Try**: Restart frontend dev server

### Database connection errors
- **Check**: MySQL service is running
- **Check**: Database `biyahero_db` exists
- **Check**: Credentials in `backend/.env` are correct
- **Try**: Test connection with MySQL Workbench

---

## 📚 Additional Resources

- Backend Setup: `BACKEND_SETUP.md`
- Quick Start: `QUICK_START.md`
- API Reference: `docs/API_REFERENCE.md`
- Architecture: `docs/ARCHITECTURE.md`

---

## ✨ Summary

**Main Issue**: Backend server wasn't running, causing all API calls to fail.

**Solution**: 
1. Install backend dependencies
2. Setup MySQL database
3. Configure environment files (✓ Done)
4. Start both servers

After completing Steps 1-5 above, your application should work without errors! 🎉
