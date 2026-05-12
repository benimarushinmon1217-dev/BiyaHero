# 🚀 BiyaHero Backend Setup Guide

## Production-Grade MVC Architecture with MySQL + Sequelize

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+ installed and running
- **Git** for version control

---

## 🗄️ Database Setup

### 1. Install MySQL

**Windows:**
- Download from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run installer and set root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE biyahero_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional)
CREATE USER 'biyahero_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON biyahero_db.* TO 'biyahero_user'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

---

## 🛠️ Backend Installation

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web framework
- **sequelize** - ORM
- **mysql2** - MySQL driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **axios** - HTTP client
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **morgan** - HTTP logging
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Required Configuration:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biyahero_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_refresh_token_secret

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🔄 Testing database connection...
✅ Database connection established successfully
🔄 Synchronizing database models...
✅ Database synchronized successfully

========================================
🚀 BiyaHero API Server Started
========================================
📡 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api/v1
💚 Health check: http://localhost:5000/health
========================================
```

---

## 📊 Database Tables

Sequelize will automatically create these tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `phoneNumber`
- `role` (user, admin, moderator)
- `passengerType` (regular, student, senior, pwd)
- `isVerified`
- `isActive`
- `lastLogin`
- `profilePicture`
- `createdAt`
- `updatedAt`

### SavedRoutes Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → users)
- `routeName`
- `originName`, `originLat`, `originLng`
- `destinationName`, `destinationLat`, `destinationLng`
- `distance`
- `estimatedFare`
- `transportType`
- `usageCount`
- `isFavorite`
- `createdAt`
- `updatedAt`

### TripHistory Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → users)
- `originName`, `originLat`, `originLng`
- `destinationName`, `destinationLat`, `destinationLng`
- `distance`
- `fare`
- `passengerType`
- `transportType`
- `duration`
- `tripDate`
- `rating`
- `feedback`
- `createdAt`
- `updatedAt`

### AIConversations Table
- `id` (UUID, Primary Key)
- `userId` (Foreign Key → users, nullable)
- `sessionId`
- `userMessage`
- `aiResponse`
- `context` (JSON)
- `responseTime`
- `wasHelpful`
- `createdAt`
- `updatedAt`

### Alerts Table
- `id` (UUID, Primary Key)
- `title`
- `description`
- `type` (traffic, closure, weather, service, emergency)
- `severity` (info, warning, danger, success)
- `location`
- `municipality`
- `lat`, `lng`
- `startDate`
- `endDate`
- `isActive`
- `affectedRoutes` (JSON)
- `source`
- `createdAt`
- `updatedAt`

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/v1/auth/register      - Register new user
POST   /api/v1/auth/login         - Login user
GET    /api/v1/auth/me            - Get current user (Protected)
PUT    /api/v1/auth/profile       - Update profile (Protected)
POST   /api/v1/auth/change-password - Change password (Protected)
```

### Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "passengerType": "regular"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🏗️ Architecture Overview

```
backend/
├── config/              # Configuration files
│   ├── database.js      # Sequelize connection
│   └── jwt.js           # JWT configuration
├── controllers/         # Request handlers
│   └── authController.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── validator.js     # Input validation
├── models/              # Sequelize models
│   ├── User.js
│   ├── SavedRoute.js
│   ├── TripHistory.js
│   ├── AIConversation.js
│   ├── Alert.js
│   └── index.js         # Model associations
├── routes/              # API routes
│   └── authRoutes.js
├── services/            # Business logic
│   ├── routingService.js
│   ├── geocodingService.js
│   └── aiAssistantService.js
├── utils/               # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── jwtHelper.js
│   └── fareCalculator.js
├── validations/         # Input validation schemas
│   └── authValidation.js
├── app.js               # Express app setup
├── server.js            # Server entry point
├── package.json
└── .env
```

---

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with salt rounds  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Input Validation** - express-validator  
✅ **Rate Limiting** - Prevent brute force attacks  
✅ **Helmet** - Security headers  
✅ **CORS** - Cross-origin protection  
✅ **SQL Injection Prevention** - Sequelize parameterized queries  

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Database Connection
```bash
# Check MySQL connection
mysql -u root -p -e "USE biyahero_db; SHOW TABLES;"
```

---

## 🚨 Troubleshooting

### Database Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
```bash
# Reset MySQL password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Sequelize Sync Errors

**Error:** `Table already exists`

**Solution:**
```bash
# Drop all tables and recreate
mysql -u root -p
DROP DATABASE biyahero_db;
CREATE DATABASE biyahero_db;
EXIT;

# Restart server
npm run dev
```

---

## 📚 Next Steps

1. ✅ Backend is running
2. ⏭️ Set up frontend (see FRONTEND_SETUP.md)
3. ⏭️ Configure OpenRouteService API key
4. ⏭️ Test API endpoints
5. ⏭️ Deploy to production

---

## 🔗 Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Backend Setup Complete! 🎉**

The BiyaHero backend is now running with:
- ✅ MySQL database
- ✅ Sequelize ORM
- ✅ JWT authentication
- ✅ MVC architecture
- ✅ RESTful APIs
- ✅ Production-ready structure
