# 🧪 End-to-End Testing Guide - BiyaHero Multi-Modal System

## 🎯 Purpose

This guide provides comprehensive testing procedures to verify the complete multi-modal routing system works correctly from frontend to backend.

---

## 📋 Pre-Testing Checklist

### Backend Requirements

- [ ] MySQL server running
- [ ] Database `biyahero_db` created
- [ ] Backend `.env` file configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server running on port 5000

### Frontend Requirements

- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend `.env` file configured (if needed)
- [ ] Frontend dev server running on port 5173
- [ ] Browser with developer tools open

### Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## 🧪 Test Suite 1: Backend API Tests

### Test 1.1: Health Check

**Endpoint:** `GET http://localhost:5000/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "BiyaHero API is running",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "environment": "development"
}
```

**How to Test:**
```bash
curl http://localhost:5000/health
```

**✅ Pass Criteria:** Status 200, success: true

---

### Test 1.2: Multi-Modal Route Generation

**Endpoint:** `POST http://localhost:5000/api/v1/routes/multi-modal`

**Request Body:**
```json
{
  "origin": {
    "name": "Antipolo Del Sur",
    "lat": 13.9500,
    "lng": 121.1700
  },
  "destination": {
    "name": "SM Lipa",
    "lat": 13.9380,
    "lng": 121.1625
  },
  "passengerType": "regular",
  "preference": "recommended"
}
```

**Expected Response Structure:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "origin": { "name": "...", "lat": ..., "lng": ... },
    "destination": { "name": "...", "lat": ..., "lng": ... },
    "passengerType": "regular",
    "totalRoutes": 2-3,
    "routes": [
      {
        "routeId": "direct-route",
        "routeType": "direct",
        "routeName": "Direct Route",
        "totalSegments": 1,
        "totalDistance": 5.2,
        "totalDuration": 25,
        "totalFare": 12,
        "totalTransfers": 0,
        "segments": [...],
        "advantages": [...],
        "disadvantages": [...]
      }
    ]
  }
}
```

**How to Test:**
```bash
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"name": "Antipolo Del Sur", "lat": 13.9500, "lng": 121.1700},
    "destination": {"name": "SM Lipa", "lat": 13.9380, "lng": 121.1625},
    "passengerType": "regular",
    "preference": "recommended"
  }'
```

**✅ Pass Criteria:**
- Status 200
- Returns 2-3 route options
- Each route has segments array
- Fares calculated correctly
- Geometry data present

---

### Test 1.3: Transport Hubs

**Endpoint:** `GET http://localhost:5000/api/v1/routes/transport-hubs`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalHubs": 7,
    "hubs": [
      {
        "id": "hub-lipa-bayan",
        "name": "Lipa Bayan",
        "displayName": "Lipa City Center (Bayan)",
        "lat": 13.9411,
        "lng": 121.1650,
        "importance": 10,
        "availableTransport": ["jeepney", "tricycle", "bus", "uv_express"]
      }
    ]
  }
}
```

**How to Test:**
```bash
curl http://localhost:5000/api/v1/routes/transport-hubs
```

**✅ Pass Criteria:**
- Status 200
- Returns 7 hubs
- Each hub has required fields

---

### Test 1.4: Transport Types

**Endpoint:** `GET http://localhost:5000/api/v1/routes/transport-types`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalTypes": 6,
    "transportTypes": [
      {
        "type": "jeepney",
        "baseFare": 12,
        "farePerKm": 1,
        "baseDistance": 5,
        "avgSpeed": 25,
        "avgWaitTime": 10,
        "comfortLevel": "basic",
        "capacity": 20
      }
    ]
  }
}
```

**How to Test:**
```bash
curl http://localhost:5000/api/v1/routes/transport-types
```

**✅ Pass Criteria:**
- Status 200
- Returns 6 transport types
- Each type has configuration

---

### Test 1.5: Segment Fare Calculation

**Endpoint:** `POST http://localhost:5000/api/v1/routes/calculate-segment-fare`

**Request Body:**
```json
{
  "transportType": "jeepney",
  "distance": 8.5,
  "passengerType": "regular"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "transportType": "jeepney",
    "distance": 8.5,
    "passengerType": "regular",
    "fare": 16
  }
}
```

**How to Test:**
```bash
curl -X POST http://localhost:5000/api/v1/routes/calculate-segment-fare \
  -H "Content-Type: application/json" \
  -d '{
    "transportType": "jeepney",
    "distance": 8.5,
    "passengerType": "regular"
  }'
```

**✅ Pass Criteria:**
- Status 200
- Fare calculated correctly
- Formula: ₱12 base + ₱1 per km after 5km

---

## 🧪 Test Suite 2: Frontend UI Tests

### Test 2.1: Landing Page Load

**URL:** `http://localhost:5173/`

**Steps:**
1. Open browser to `http://localhost:5173/`
2. Verify page loads without errors
3. Check console for errors

**✅ Pass Criteria:**
- Page loads successfully
- No console errors
- Search bar visible
- Navbar present

---

### Test 2.2: Route Search

**URL:** `http://localhost:5173/`

**Steps:**
1. Click origin search bar
2. Type "Antipolo Del Sur"
3. Select from dropdown
4. Click destination search bar
5. Type "SM Lipa"
6. Select from dropdown
7. Click "Find Route" button

**✅ Pass Criteria:**
- Autocomplete works
- Selections saved
- Navigates to `/route` page
- Loading indicator appears

---

### Test 2.3: Multiple Route Display

**URL:** `http://localhost:5173/route` (after search)

**Steps:**
1. Wait for routes to load
2. Count route cards displayed
3. Verify each card shows:
   - Route type badge
   - Fare amount
   - Duration
   - Transfer count
   - Transport icons
   - Advantages/disadvantages

**✅ Pass Criteria:**
- 2-3 route cards displayed
- All information visible
- Cards are clickable
- First route selected by default

---

### Test 2.4: Route Selection

**URL:** `http://localhost:5173/route`

**Steps:**
1. Click on second route card
2. Verify card highlights
3. Check map updates
4. Verify segment details update

**✅ Pass Criteria:**
- Selected card has ring highlight
- Map shows new route geometry
- Segment details match selected route
- Smooth transition

---

### Test 2.5: Passenger Type Change

**URL:** `http://localhost:5173/route`

**Steps:**
1. Note current fare amounts
2. Click "Student" passenger type
3. Wait for routes to reload
4. Compare new fares

**✅ Pass Criteria:**
- Routes reload
- Fares reduced by 20%
- "20% off" badge visible
- All routes updated

---

### Test 2.6: Sort Options

**URL:** `http://localhost:5173/route`

**Steps:**
1. Click "Cheapest" sort option
2. Verify lowest fare route is first
3. Click "Fastest" sort option
4. Verify shortest duration route is first
5. Click "Least Transfers" sort option
6. Verify route with fewest transfers is first

**✅ Pass Criteria:**
- Routes reorder correctly
- Selected sort button highlighted
- Routes reload with new order

---

### Test 2.7: Segment Details Display

**URL:** `http://localhost:5173/route`

**Steps:**
1. Scroll to "Step-by-Step Guide" section
2. Verify each segment shows:
   - Step number
   - Transport icon
   - Origin → Destination
   - Distance, duration, fare
   - Instructions
   - Transfer notes (if applicable)

**✅ Pass Criteria:**
- All segments displayed
- Information complete
- Visual design clear
- Transfer instructions present

---

### Test 2.8: Map Interaction

**URL:** `http://localhost:5173/route`

**Steps:**
1. Verify map loads
2. Check origin marker present
3. Check destination marker present
4. Verify route line drawn
5. Try zooming in/out
6. Try panning map

**✅ Pass Criteria:**
- Map loads successfully
- Markers visible
- Route geometry displayed
- Map interactive

---

### Test 2.9: Mobile Responsiveness

**URL:** `http://localhost:5173/route`

**Steps:**
1. Open browser DevTools
2. Toggle device toolbar (mobile view)
3. Test on iPhone SE (375px)
4. Test on iPad (768px)
5. Verify layout adapts

**✅ Pass Criteria:**
- Layout stacks vertically on mobile
- All content accessible
- Buttons touchable
- No horizontal scroll

---

### Test 2.10: Error Handling

**URL:** `http://localhost:5173/route`

**Steps:**
1. Stop backend server
2. Try searching for a route
3. Verify error message displays
4. Restart backend
5. Try again

**✅ Pass Criteria:**
- Error message displayed
- User can return to search
- No app crash
- Graceful recovery

---

## 🧪 Test Suite 3: Integration Tests

### Test 3.1: Short Distance Route

**Test Data:**
```
Origin: Lipa Cathedral (13.9405, 121.1655)
Destination: SM Lipa (13.9380, 121.1625)
Distance: ~0.5 km
```

**Expected Results:**
- 1-2 route options
- Mostly direct routes
- Low fares (₱12-15)
- Short duration (5-10 min)

**✅ Pass Criteria:**
- Routes generated
- Fares reasonable
- Duration realistic

---

### Test 3.2: Medium Distance Route

**Test Data:**
```
Origin: Antipolo Del Sur (13.9500, 121.1700)
Destination: SM Lipa (13.9380, 121.1625)
Distance: ~5 km
```

**Expected Results:**
- 2-3 route options
- Mix of direct and split routes
- Fares ₱12-30
- Duration 15-30 min

**✅ Pass Criteria:**
- Multiple route types
- Transfer options available
- Realistic fares and times

---

### Test 3.3: Long Distance Route

**Test Data:**
```
Origin: Batangas Grand Terminal (13.7565, 121.0583)
Destination: SM Lipa (13.9380, 121.1625)
Distance: ~20 km
```

**Expected Results:**
- 2-3 route options
- Split and hybrid routes
- Higher fares (₱30-60)
- Longer duration (45-90 min)

**✅ Pass Criteria:**
- Routes generated
- Multiple segments
- Transfer hubs used

---

### Test 3.4: Discount Calculation

**Test Data:**
```
Route: Antipolo Del Sur → SM Lipa
Regular Fare: ₱12
Student Fare: ₱10 (rounded from ₱9.6)
```

**Steps:**
1. Search route as Regular
2. Note fare
3. Switch to Student
4. Verify 20% discount

**✅ Pass Criteria:**
- Discount applied correctly
- Fare = Math.round(originalFare * 0.8)
- All segments discounted

---

### Test 3.5: Route Preference Sorting

**Test Data:**
```
Origin: Antipolo Del Sur
Destination: SM Lipa
```

**Steps:**
1. Load routes with "cheapest" preference
2. Verify lowest fare first
3. Load routes with "fastest" preference
4. Verify shortest duration first

**✅ Pass Criteria:**
- Routes sorted correctly
- Preference respected
- Order changes appropriately

---

## 🧪 Test Suite 4: Performance Tests

### Test 4.1: Route Generation Speed

**Metric:** Time to generate routes

**Steps:**
1. Open browser DevTools Network tab
2. Search for route
3. Measure time from request to response

**✅ Pass Criteria:**
- Response time < 3 seconds
- No timeout errors
- Smooth loading

---

### Test 4.2: UI Responsiveness

**Metric:** Time to render routes

**Steps:**
1. Open browser DevTools Performance tab
2. Start recording
3. Search for route
4. Stop recording when routes display
5. Analyze timeline

**✅ Pass Criteria:**
- Initial render < 1 second
- No layout shifts
- Smooth animations

---

### Test 4.3: Map Loading

**Metric:** Time to load map

**Steps:**
1. Open route results page
2. Measure time until map fully loaded
3. Check for tile loading issues

**✅ Pass Criteria:**
- Map loads < 2 seconds
- All tiles load
- No broken images

---

## 🧪 Test Suite 5: Edge Cases

### Test 5.1: Same Origin and Destination

**Test Data:**
```
Origin: SM Lipa
Destination: SM Lipa
```

**Expected Result:**
- Error message or
- Zero distance route

**✅ Pass Criteria:**
- Handled gracefully
- No crash

---

### Test 5.2: Very Long Distance

**Test Data:**
```
Origin: Batangas City
Destination: Manila (outside service area)
```

**Expected Result:**
- Error message or
- Limited route options

**✅ Pass Criteria:**
- Handled gracefully
- Clear message to user

---

### Test 5.3: Invalid Coordinates

**Test Data:**
```
Origin: { lat: 999, lng: 999 }
Destination: { lat: 0, lng: 0 }
```

**Expected Result:**
- Error message
- No routes generated

**✅ Pass Criteria:**
- Error caught
- User informed
- No crash

---

### Test 5.4: Network Failure

**Steps:**
1. Start route search
2. Disconnect internet mid-request
3. Verify error handling

**✅ Pass Criteria:**
- Error message displayed
- Retry option available
- No crash

---

### Test 5.5: Rapid Passenger Type Changes

**Steps:**
1. Load routes
2. Rapidly click different passenger types
3. Verify no race conditions

**✅ Pass Criteria:**
- Latest selection wins
- No duplicate requests
- UI stays responsive

---

## 📊 Test Results Template

### Test Execution Log

```
Date: _______________
Tester: _______________
Environment: Development / Staging / Production

Backend Tests:
[ ] Test 1.1: Health Check
[ ] Test 1.2: Multi-Modal Route Generation
[ ] Test 1.3: Transport Hubs
[ ] Test 1.4: Transport Types
[ ] Test 1.5: Segment Fare Calculation

Frontend Tests:
[ ] Test 2.1: Landing Page Load
[ ] Test 2.2: Route Search
[ ] Test 2.3: Multiple Route Display
[ ] Test 2.4: Route Selection
[ ] Test 2.5: Passenger Type Change
[ ] Test 2.6: Sort Options
[ ] Test 2.7: Segment Details Display
[ ] Test 2.8: Map Interaction
[ ] Test 2.9: Mobile Responsiveness
[ ] Test 2.10: Error Handling

Integration Tests:
[ ] Test 3.1: Short Distance Route
[ ] Test 3.2: Medium Distance Route
[ ] Test 3.3: Long Distance Route
[ ] Test 3.4: Discount Calculation
[ ] Test 3.5: Route Preference Sorting

Performance Tests:
[ ] Test 4.1: Route Generation Speed
[ ] Test 4.2: UI Responsiveness
[ ] Test 4.3: Map Loading

Edge Cases:
[ ] Test 5.1: Same Origin and Destination
[ ] Test 5.2: Very Long Distance
[ ] Test 5.3: Invalid Coordinates
[ ] Test 5.4: Network Failure
[ ] Test 5.5: Rapid Passenger Type Changes

Overall Result: PASS / FAIL
Notes: _______________________________________________
```

---

## 🐛 Common Issues and Solutions

### Issue 1: Backend Not Starting

**Symptoms:**
- `npm run dev` fails
- Port 5000 already in use

**Solutions:**
```bash
# Check if port is in use
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

---

### Issue 2: Database Connection Failed

**Symptoms:**
- "Unable to connect to database"
- ECONNREFUSED error

**Solutions:**
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check .env configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biyahero_db
DB_USER=root
DB_PASSWORD=your_password
```

---

### Issue 3: No Routes Generated

**Symptoms:**
- Empty routes array
- "No routes available" message

**Solutions:**
1. Check backend logs for errors
2. Verify OSRM/OpenRouteService accessible
3. Check coordinates are valid
4. Verify distance not too large

---

### Issue 4: Map Not Loading

**Symptoms:**
- Gray box instead of map
- Tiles not loading

**Solutions:**
1. Check internet connection
2. Verify Leaflet CDN accessible
3. Check browser console for errors
4. Clear browser cache

---

### Issue 5: Fares Incorrect

**Symptoms:**
- Fares don't match expected values
- Discount not applied

**Solutions:**
1. Verify fare calculation formula
2. Check passenger type passed correctly
3. Verify Math.round() used (not Math.ceil())
4. Check backend logs

---

## 🎯 Success Criteria Summary

The system is considered **FULLY FUNCTIONAL** if:

✅ **Backend:**
- All API endpoints respond correctly
- Routes generated successfully
- Fares calculated accurately
- Database operations work

✅ **Frontend:**
- Multiple routes display
- Route selection works
- Passenger type changes work
- Sort options functional
- Map displays correctly
- Mobile responsive

✅ **Integration:**
- End-to-end flow works
- Data flows correctly
- Error handling graceful
- Performance acceptable

✅ **User Experience:**
- Interface intuitive
- Information clear
- Actions responsive
- No crashes or errors

---

## 📞 Support

If tests fail:
1. Check backend logs: `backend/logs/`
2. Check browser console
3. Review documentation:
   - [BACKEND_SETUP.md](BACKEND_SETUP.md)
   - [MULTI_MODAL_ROUTING.md](MULTI_MODAL_ROUTING.md)
   - [FRONTEND_MULTI_MODAL_COMPLETE.md](FRONTEND_MULTI_MODAL_COMPLETE.md)

---

## 🎉 Testing Complete!

Once all tests pass, the BiyaHero multi-modal routing system is **PRODUCTION READY**! 🚀

**Happy Testing!** 🧪✨
