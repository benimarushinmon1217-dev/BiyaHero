# 🏗️ BiyaHero Full-Stack Architecture

## Production-Grade Smart Transportation Platform

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  React + Vite + Tailwind CSS + React Router + Axios         │
│  - Pages, Components, Context, Hooks                         │
│  - Protected Routes, Auth Context                            │
│  - Leaflet Maps, Framer Motion                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                                │
│  Express.js REST API (MVC Architecture)                      │
│  - Routes → Controllers → Services → Models                  │
│  - JWT Authentication Middleware                             │
│  - Input Validation, Error Handling                          │
│  - Rate Limiting, Security Headers                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                              │
│  Business Logic & External APIs                              │
│  - Routing Service (OpenRouteService/OSRM)                  │
│  - Geocoding Service (Nominatim)                            │
│  - AI Assistant Service (Pattern Matching)                   │
│  - Fare Calculator (Distance-based)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  MySQL Database + Sequelize ORM                              │
│  - Users, SavedRoutes, TripHistory                          │
│  - AIConversations, Alerts                                   │
│  - Associations, Indexes, Constraints                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL APIS                              │
│  - OpenStreetMap (Maps & Tiles)                             │
│  - OpenRouteService / OSRM (Routing)                        │
│  - Nominatim (Geocoding)                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Complete Project Structure

```
biyahero/
│
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   ├── database.js               # Sequelize MySQL connection
│   │   └── jwt.js                    # JWT configuration
│   │
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
│   │   ├── routeController.js        # Route management
│   │   ├── tripController.js         # Trip history
│   │   ├── aiController.js           # AI assistant
│   │   └── alertController.js        # Alerts management
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification
│   │   ├── errorHandler.js           # Error handling
│   │   └── validator.js              # Input validation
│   │
│   ├── models/
│   │   ├── User.js                   # User model
│   │   ├── SavedRoute.js             # Saved routes
│   │   ├── TripHistory.js            # Trip records
│   │   ├── AIConversation.js         # AI chat history
│   │   ├── Alert.js                  # Alerts
│   │   └── index.js                  # Model associations
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── routeRoutes.js            # Route endpoints
│   │   ├── tripRoutes.js             # Trip endpoints
│   │   ├── aiRoutes.js               # AI endpoints
│   │   └── alertRoutes.js            # Alert endpoints
│   │
│   ├── services/
│   │   ├── routingService.js         # OpenRouteService/OSRM
│   │   ├── geocodingService.js       # Nominatim geocoding
│   │   └── aiAssistantService.js     # AI responses
│   │
│   ├── utils/
│   │   ├── ApiError.js               # Custom error class
│   │   ├── ApiResponse.js            # Response formatter
│   │   ├── jwtHelper.js              # JWT utilities
│   │   └── fareCalculator.js         # Fare calculation
│   │
│   ├── validations/
│   │   ├── authValidation.js         # Auth validation
│   │   ├── routeValidation.js        # Route validation
│   │   └── tripValidation.js         # Trip validation
│   │
│   ├── app.js                        # Express app setup
│   ├── server.js                     # Server entry point
│   ├── package.json
│   └── .env
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js              # Axios instance
│   │   │   ├── authApi.js            # Auth API calls
│   │   │   ├── routeApi.js           # Route API calls
│   │   │   └── aiApi.js              # AI API calls
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── route/
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── RouteMap.jsx
│   │   │   │   ├── RouteCard.jsx
│   │   │   │   └── FareDisplay.jsx
│   │   │   └── ai/
│   │   │       ├── ChatInterface.jsx
│   │   │       └── MessageBubble.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── RouteContext.jsx      # Route state
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth hook
│   │   │   ├── useRoute.js           # Route hook
│   │   │   └── useGeolocation.js     # Location hook
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RouteSearch.jsx
│   │   │   ├── RouteResults.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── SavedRoutes.jsx
│   │   │   ├── TripHistory.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Alerts.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx         # Route configuration
│   │   │   └── ProtectedRoute.jsx    # Auth guard
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js        # Auth business logic
│   │   │   ├── routeService.js       # Route business logic
│   │   │   └── storageService.js     # LocalStorage utils
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js          # App constants
│   │   │   ├── helpers.js            # Helper functions
│   │   │   └── validators.js         # Form validators
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── public/
│   │   └── logo.svg
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docs/                             # Documentation
│   ├── API_REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── FEATURES.md
│
├── BACKEND_SETUP.md                  # Backend setup guide
├── FRONTEND_SETUP.md                 # Frontend setup guide
├── FULLSTACK_ARCHITECTURE.md         # This file
├── README.md                         # Project overview
└── .gitignore
```

---

## 🔄 Data Flow

### 1. User Authentication Flow

```
User → Login Form → authApi.login()
  ↓
Backend: authRoutes → authController.login()
  ↓
Verify credentials → Generate JWT
  ↓
Return: { user, accessToken, refreshToken }
  ↓
Frontend: Store token → Update AuthContext
  ↓
Redirect to Dashboard
```

### 2. Route Search Flow

```
User → Search Form → Enter origin & destination
  ↓
Frontend: geocodingService.searchPlaces()
  ↓
Backend: /api/v1/geocoding/search
  ↓
Nominatim API → Return place suggestions
  ↓
User selects places → routeApi.getRoute()
  ↓
Backend: /api/v1/routes/calculate
  ↓
OpenRouteService/OSRM → Calculate route
  ↓
fareCalculator.calculateFare() → Add fare
  ↓
Return: { route, distance, duration, fare, geometry }
  ↓
Frontend: Display on map + Show fare
```

### 3. AI Assistant Flow

```
User → Chat Input → Send message
  ↓
Frontend: aiApi.sendMessage()
  ↓
Backend: /api/v1/ai/chat
  ↓
aiAssistantService.generateResponse()
  ↓
Pattern matching + Context analysis
  ↓
Return: { response, suggestions }
  ↓
Frontend: Display response + Save to DB
```

---

## 🔐 Authentication System

### JWT Token Flow

```
1. User Login
   ↓
2. Server generates:
   - Access Token (7 days)
   - Refresh Token (30 days)
   ↓
3. Frontend stores tokens:
   - localStorage (persistent)
   - AuthContext (runtime)
   ↓
4. API Requests:
   - Add header: Authorization: Bearer <token>
   ↓
5. Backend Middleware:
   - Verify token
   - Attach user to req.user
   ↓
6. Protected Routes:
   - Check req.user
   - Allow/Deny access
```

### Protected Routes

**Backend:**
```javascript
router.get('/profile', authenticate, getProfile);
router.post('/routes/save', authenticate, saveRoute);
```

**Frontend:**
```javascript
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│─────────────│
│ id (PK)     │
│ email       │
│ password    │
│ firstName   │
│ lastName    │
│ passengerType│
└─────────────┘
       │
       │ 1:N
       ├──────────────┐
       │              │
       ↓              ↓
┌─────────────┐  ┌─────────────┐
│SavedRoutes  │  │TripHistory  │
│─────────────│  │─────────────│
│ id (PK)     │  │ id (PK)     │
│ userId (FK) │  │ userId (FK) │
│ routeName   │  │ distance    │
│ origin*     │  │ fare        │
│ destination*│  │ tripDate    │
└─────────────┘  └─────────────┘
       │
       │ 1:N
       ↓
┌──────────────────┐
│ AIConversations  │
│──────────────────│
│ id (PK)          │
│ userId (FK)      │
│ userMessage      │
│ aiResponse       │
└──────────────────┘
```

---

## 🛡️ Security Layers

### 1. Input Validation
```javascript
// Backend validation
body('email').isEmail()
body('password').isLength({ min: 6 })

// Frontend validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

### 2. Authentication
```javascript
// JWT middleware
const token = req.headers.authorization?.split(' ')[1]
const decoded = jwt.verify(token, JWT_SECRET)
req.user = await User.findByPk(decoded.id)
```

### 3. Authorization
```javascript
// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

### 4. Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 5. SQL Injection Prevention
```javascript
// Sequelize parameterized queries
User.findOne({ where: { email: userInput } })
// NOT: `SELECT * FROM users WHERE email = '${userInput}'`
```

---

## 🚀 Deployment Architecture

### Development
```
Frontend: http://localhost:5173 (Vite)
Backend:  http://localhost:5000 (Express)
Database: localhost:3306 (MySQL)
```

### Production
```
Frontend: Vercel / Netlify
Backend:  Render / Railway / AWS
Database: AWS RDS / PlanetScale / Railway
```

---

## 📊 Performance Optimizations

### Backend
- ✅ Database indexing on frequently queried fields
- ✅ Connection pooling (Sequelize)
- ✅ Response caching (future)
- ✅ Compression middleware
- ✅ Rate limiting

### Frontend
- ✅ Code splitting (React.lazy)
- ✅ Image optimization
- ✅ Debounced search
- ✅ Memoization (useMemo, useCallback)
- ✅ Virtual scrolling for long lists

---

## 🧪 Testing Strategy

### Backend Testing
```javascript
// Unit tests
describe('fareCalculator', () => {
  it('should calculate correct fare for 10km', () => {
    expect(calculateFare(10, 'regular')).toBe(17)
  })
})

// Integration tests
describe('POST /api/v1/auth/register', () => {
  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, firstName, lastName })
    expect(res.status).toBe(201)
  })
})
```

### Frontend Testing
```javascript
// Component tests
describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})

// E2E tests (Cypress)
describe('User Login', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('[name="email"]').type('user@example.com')
    cy.get('[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Load balancer (Nginx)
- Multiple backend instances
- Database read replicas
- Redis caching layer

### Vertical Scaling
- Increase server resources
- Optimize database queries
- CDN for static assets
- Database sharding (future)

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Real-time traffic data integration
- [ ] Push notifications (Firebase)
- [ ] Payment integration (GCash, PayMaya)
- [ ] Driver/operator dashboard
- [ ] Advanced analytics

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Offline mode (PWA)
- [ ] Multi-language support
- [ ] Social features (share routes)
- [ ] Gamification (rewards)

---

## 📚 Technology Stack Summary

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Leaflet** - Maps
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Validation

### External APIs
- **OpenStreetMap** - Map tiles
- **OpenRouteService** - Routing
- **Nominatim** - Geocoding

---

## 🎯 Key Features Implemented

✅ User authentication (register, login, JWT)  
✅ Protected routes (frontend + backend)  
✅ Route search with geocoding  
✅ Distance-based fare calculation  
✅ Interactive maps (Leaflet)  
✅ AI commute assistant  
✅ Saved routes  
✅ Trip history  
✅ Traffic alerts  
✅ User profile management  
✅ Passenger type discounts  
✅ MVC architecture  
✅ RESTful APIs  
✅ Input validation  
✅ Error handling  
✅ Security best practices  

---

**Architecture Complete! 🎉**

This is a production-grade, scalable, maintainable full-stack application ready for:
- ✅ Development
- ✅ Testing
- ✅ Deployment
- ✅ Team collaboration
- ✅ Future scaling
