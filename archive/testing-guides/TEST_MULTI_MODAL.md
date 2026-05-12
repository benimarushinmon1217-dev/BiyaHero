# 🧪 Multi-Modal Routing System - Test Guide

## Quick Testing Guide

---

## 🚀 Start the Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully
✅ Database synchronized successfully
🚀 BiyaHero API Server Started
📡 Server running on port 5000
```

---

## 📝 Test Scenarios

### Test 1: Generate Multi-Modal Routes

```bash
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "name": "Antipolo Del Sur",
      "lat": 13.9500,
      "lng": 121.1700
    },
    "destination": {
      "name": "SM City Lipa",
      "lat": 13.9380,
      "lng": 121.1625
    },
    "passengerType": "regular",
    "preference": "recommended"
  }'
```

**Expected Response:**
- 2-3 route options
- Direct route (cheapest)
- Split route (faster)
- Hybrid route (convenient)

---

### Test 2: Student Discount

```bash
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "name": "BSU Lipa",
      "lat": 13.9450,
      "lng": 121.1680
    },
    "destination": {
      "name": "SM City Lipa",
      "lat": 13.9380,
      "lng": 121.1625
    },
    "passengerType": "student"
  }'
```

**Expected:**
- 20% discount applied to all fares
- Student fare shown in response

---

### Test 3: Get Transport Hubs

```bash
curl http://localhost:5000/api/v1/routes/transport-hubs
```

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

---

### Test 4: Get Transport Types

```bash
curl http://localhost:5000/api/v1/routes/transport-types
```

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
        "avgSpeed": 25,
        "avgWaitTime": 10,
        "comfortLevel": "basic",
        "capacity": 20
      }
    ]
  }
}
```

---

### Test 5: Calculate Segment Fare

```bash
curl -X POST http://localhost:5000/api/v1/routes/calculate-segment-fare \
  -H "Content-Type: application/json" \
  -d '{
    "transportType": "jeepney",
    "distance": 10,
    "passengerType": "regular"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "transportType": "jeepney",
    "distance": 10,
    "passengerType": "regular",
    "fare": 17
  }
}
```

---

### Test 6: Long Distance Route

```bash
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "name": "Lipa City",
      "lat": 13.9411,
      "lng": 121.1650
    },
    "destination": {
      "name": "Batangas City",
      "lat": 13.7565,
      "lng": 121.0583
    },
    "passengerType": "regular"
  }'
```

**Expected:**
- Multiple route options
- Higher fares (longer distance)
- Possible bus/van options

---

## 📊 Verification Checklist

### Route Generation
- [ ] Returns multiple route options
- [ ] Direct route is cheapest
- [ ] Split routes show transfers
- [ ] Hybrid routes mix transport types
- [ ] All routes have geometry data

### Fare Calculation
- [ ] Base fare ₱12 for first 5km
- [ ] ₱1 per km after 5km
- [ ] Student discount 20%
- [ ] Senior discount 20%
- [ ] PWD discount 20%

### Segments
- [ ] Each segment has transport type
- [ ] Each segment has fare
- [ ] Each segment has duration
- [ ] Transfer times included
- [ ] Instructions provided

### Hubs
- [ ] 7 major hubs returned
- [ ] Each hub has coordinates
- [ ] Each hub has importance score
- [ ] Available transport types listed

### Transport Types
- [ ] 6 transport types available
- [ ] Each has fare configuration
- [ ] Each has speed/wait time
- [ ] Comfort levels defined

---

## 🎯 Expected Behavior

### Scenario: Antipolo → SM Lipa

**Route Option A (Direct):**
```
Type: Direct
Transport: Jeepney
Fare: ₱12
Duration: 25 minutes
Transfers: 0
Recommended: Yes (Cheapest)
```

**Route Option B (Split):**
```
Type: Split
Segment 1: Jeepney (Antipolo → Lipa Bayan)
  Fare: ₱15
  Duration: 15 min
  
Transfer: 5 minutes

Segment 2: Jeepney (Lipa Bayan → SM Lipa)
  Fare: ₱12
  Duration: 10 min

Total Fare: ₱27
Total Duration: 30 minutes
Transfers: 1
Recommended: No (Faster but more expensive)
```

**Route Option C (Hybrid):**
```
Type: Hybrid
Segment 1: Jeepney (Antipolo → Lipa Bayan)
  Fare: ₱15
  Duration: 15 min
  
Transfer: 3 minutes

Segment 2: Tricycle (Lipa Bayan → SM Lipa)
  Fare: ₱20
  Duration: 8 min

Total Fare: ₱35
Total Duration: 26 minutes
Transfers: 1
Recommended: No (Most convenient but expensive)
```

---

## 🐛 Troubleshooting

### No Routes Generated

**Check:**
- Origin and destination have valid coordinates
- OSRM service is accessible
- Distance is reasonable (not too far)

**Solution:**
```bash
# Test OSRM directly
curl "https://router.project-osrm.org/route/v1/driving/121.1700,13.9500;121.1625,13.9380?overview=false"
```

### Incorrect Fares

**Check:**
- Distance calculation is correct
- Passenger type is valid
- Transport type configuration

**Debug:**
```bash
# Calculate fare manually
curl -X POST http://localhost:5000/api/v1/routes/calculate-segment-fare \
  -H "Content-Type: application/json" \
  -d '{"transportType":"jeepney","distance":10,"passengerType":"regular"}'
```

### Missing Hubs

**Check:**
- MAJOR_HUBS array in multiModalRoutingService.js
- Hub coordinates are correct
- Hub importance scores set

---

## 📈 Performance Testing

### Load Test

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test 100 requests
ab -n 100 -c 10 -p route_request.json -T application/json \
  http://localhost:5000/api/v1/routes/multi-modal
```

**Expected:**
- Response time < 2 seconds
- No errors
- Consistent results

---

## ✅ Success Criteria

The system is working correctly if:

1. ✅ Multiple route options generated
2. ✅ Fares calculated correctly
3. ✅ Segments have proper geometry
4. ✅ Transfer instructions clear
5. ✅ Discounts applied correctly
6. ✅ Hubs returned with data
7. ✅ Transport types configured
8. ✅ Response time acceptable

---

## 🎉 Next Steps

After testing:
1. ✅ Backend multi-modal routing works
2. ⏭️ Integrate with frontend
3. ⏭️ Add route visualization
4. ⏭️ Implement route selection UI
5. ⏭️ Add user preferences
6. ⏭️ Deploy to production

---

**Testing Complete! 🚀**

The multi-modal routing system is ready for frontend integration!
