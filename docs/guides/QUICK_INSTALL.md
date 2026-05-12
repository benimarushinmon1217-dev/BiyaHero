# ⚡ BiyaHero Quick Install Guide

## Get the full-stack app running in 10 minutes!

---

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🚀 Installation Steps

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
# DB_PASSWORD=your_mysql_password
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
```

### Step 3: Frontend Setup (3 minutes)

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
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

### Step 4: Test the Application (2 minutes)

1. **Open browser:** `http://localhost:5173`

2. **Register a new account:**
   - Click "Register"
   - Fill in details
   - Submit

3. **Test route search:**
   - Enter origin: "Lipa City"
   - Enter destination: "Batangas City"
   - Click "Search Route"

4. **Test AI Assistant:**
   - Go to AI Assistant page
   - Ask: "How do I get to Batangas City?"

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database tables created automatically
- [ ] Can register new user
- [ ] Can login
- [ ] Can search routes
- [ ] Can see map
- [ ] AI assistant responds

---

## 🐛 Quick Troubleshooting

### Backend won't start

**Error:** `ER_ACCESS_DENIED_ERROR`

**Fix:**
```bash
# Check MySQL is running
mysql -u root -p

# Update .env with correct password
DB_PASSWORD=your_actual_password
```

### Frontend won't start

**Error:** `Port 5173 is already in use`

**Fix:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Database tables not created

**Fix:**
```bash
# Restart backend server
# Sequelize will auto-create tables on startup
npm run dev
```

---

## 📁 Project Structure

```
biyahero/
├── backend/          # Express + MySQL backend
│   ├── config/       # Database, JWT config
│   ├── controllers/  # Request handlers
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.js     # Entry point
│
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── api/      # API calls
│   │   ├── components/
│   │   ├── context/  # State management
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── docs/             # Documentation
```

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Health Check:** http://localhost:5000/health
- **API Docs:** See BACKEND_SETUP.md

---

## 📚 Next Steps

1. ✅ App is running
2. ⏭️ Read [FULLSTACK_ARCHITECTURE.md](FULLSTACK_ARCHITECTURE.md)
3. ⏭️ Explore API endpoints
4. ⏭️ Customize features
5. ⏭️ Deploy to production

---

## 🎯 Test API with cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Dela Cruz"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 💡 Development Tips

### Backend Development
```bash
cd backend
npm run dev  # Auto-reload on changes
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot module replacement
```

### Database Management
```bash
# View tables
mysql -u root -p biyahero_db -e "SHOW TABLES;"

# View users
mysql -u root -p biyahero_db -e "SELECT * FROM users;"
```

---

## 🎉 Success!

You now have a full-stack production-grade application running with:

✅ React frontend with routing  
✅ Express backend with MVC architecture  
✅ MySQL database with Sequelize ORM  
✅ JWT authentication  
✅ RESTful APIs  
✅ Interactive maps  
✅ AI assistant  
✅ Fare calculation  

---

## 📞 Need Help?

- **Backend Issues:** See [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **Architecture:** See [FULLSTACK_ARCHITECTURE.md](FULLSTACK_ARCHITECTURE.md)
- **API Reference:** See [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

**Happy Coding! 🚀**
