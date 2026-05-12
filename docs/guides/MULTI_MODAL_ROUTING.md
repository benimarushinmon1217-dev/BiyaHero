# 🚌 Multi-Modal Commuter Routing System

## Realistic Philippine Transportation Simulation

---

## 🎯 System Overview

BiyaHero has evolved from a simple route finder into a **realistic Philippine commuter transportation simulation platform** that understands how Filipinos actually commute in Batangas.

### Key Transformation

**Before:** Linear, single-ride routing  
**After:** Multi-modal, transfer-based, realistic commuting simulation

---

## 🧠 Commuter Intelligence

### Real-World Commuting Behavior

The system now simulates actual Filipino commuter decision-making:

✅ **Split Routes** - Breaking journeys into multiple rides  
✅ **Transfer Points** - Using hubs as connection points  
✅ **Transport Mixing** - Combining jeepney, tricycle, bus, etc.  
✅ **Cost Optimization** - Choosing between cheap vs fast  
✅ **Convenience Factors** - Minimizing walking and waiting  

---

## 🚦 Route Types

### 1. Direct Route (One-Ride)
**Example:** Antipolo Del Sur → SM Lipa

```
Transport: Jeepney
Segments: 1
Transfers: 0
Fare: ₱12
Duration: 25 minutes
```

**Advantages:**
- Cheapest option
- No transfers
- Simple route

**Disadvantages:**
- May take longer
- Depends on vehicle availability

---

### 2. Split Route (Multi-Ride)
**Example:** Antipolo Del Sur → Lipa Bayan → SM Lipa

```
Segment 1: Jeepney (Antipolo → Lipa Bayan)
  Fare: ₱12
  Duration: 15 minutes
  
Transfer at Lipa Bayan (5 minutes)

Segment 2: Jeepney (Lipa Bayan → SM Lipa)
  Fare: ₱12
  Duration: 10 minutes

Total Fare: ₱24
Total Duration: 30 minutes
Transfers: 1
```

**Advantages:**
- Faster travel time
- More frequent vehicles
- Better route coverage

**Disadvantages:**
- More expensive
- Requires transfer
- Waiting time at hub

---

### 3. Hybrid Route (Mixed Transport)
**Example:** Antipolo Del Sur → Lipa Bayan → SM Lipa

```
Segment 1: Jeepney (Antipolo → Lipa Bayan)
  Fare: ₱12
  Duration: 15 minutes
  
Transfer at Lipa Bayan (3 minutes)

Segment 2: Tricycle (Lipa Bayan → SM Lipa)
  Fare: ₱20
  Duration: 8 minutes

Total Fare: ₱32
Total Duration: 26 minutes
Transfers: 1
```

**Advantages:**
- Convenient last-mile transport
- Less walking
- Flexible

**Disadvantages:**
- More expensive
- Requires transfer

---

## 🏢 Transport Hubs

### Major Commuter Hubs in Batangas

1. **Lipa Bayan** (Lipa City Center)
   - Importance: 10/10
   - Transport: Jeepney, Tricycle, Bus, UV Express
   - Role: Primary transfer point

2. **SM City Lipa**
   - Importance: 9/10
   - Transport: Jeepney, Tricycle, Bus
   - Role: Commercial hub

3. **BSU Lipa** (Batangas State University)
   - Importance: 8/10
   - Transport: Jeepney, Tricycle
   - Role: Student hub

4. **Lipa Cathedral**
   - Importance: 7/10
   - Transport: Jeepney, Tricycle
   - Role: Landmark hub

5. **Robinsons Place Lipa**
   - Importance: 8/10
   - Transport: Jeepney, Tricycle
   - Role: Commercial hub

6. **Big Ben Terminal**
   - Importance: 9/10
   - Transport: Jeepney, Bus, UV Express
   - Role: Major terminal

7. **Batangas Grand Terminal**
   - Importance: 10/10
   - Transport: Jeepney, Bus, UV Express, Van
   - Role: Provincial hub

---

## 🚗 Transport Types

### Configuration

| Transport | Base Fare | Per KM | Speed | Wait Time | Comfort | Capacity |
|-----------|-----------|--------|-------|-----------|---------|----------|
| Jeepney | ₱12 | ₱1 | 25 km/h | 10 min | Basic | 20 |
| Tricycle | ₱15 | ₱5 | 20 km/h | 5 min | Basic | 4 |
| Bus | ₱30 | ₱2 | 40 km/h | 15 min | Comfortable | 50 |
| UV Express | ₱40 | ₱3 | 50 km/h | 10 min | Premium | 12 |
| Van | ₱35 | ₱2.5 | 45 km/h | 12 min | Comfortable | 15 |
| Walking | ₱0 | ₱0 | 4 km/h | 0 min | Basic | 1 |

---

## 💰 Fare Calculation

### Segment-Based Fare System

Each segment calculates fare independently:

```javascript
// Segment 1: Antipolo → Lipa Bayan (8 km)
Base Fare: ₱12 (first 5 km)
Additional: (8 - 5) × ₱1 = ₱3
Segment Fare: ₱15

// Segment 2: Lipa Bayan → SM Lipa (3 km)
Base Fare: ₱12 (first 5 km)
Additional: 0 (less than 5 km)
Segment Fare: ₱12

// Total Fare
₱15 + ₱12 = ₱27
```

### Passenger Type Discounts

- **Regular:** Full fare
- **Student:** 20% discount
- **Senior Citizen:** 20% discount
- **PWD:** 20% discount

**Example:**
```
Regular: ₱27
Student: ₱22 (rounded)
```

---

## 🎯 Route Optimization

### User Preferences

Users can choose routing strategy:

1. **Cheapest Route**
   - Minimizes total fare
   - May have longer duration
   - Fewer transfers preferred

2. **Fastest Route**
   - Minimizes total duration
   - May cost more
   - More transfers acceptable

3. **Least Transfers**
   - Minimizes number of transfers
   - Balance of cost and time
   - Convenience prioritized

4. **Most Comfortable**
   - Better transport types
   - Less walking
   - Premium options

5. **Recommended** (Default)
   - Balanced approach
   - Best overall value
   - System-optimized

---

## 📊 Route Comparison

### Example: Antipolo Del Sur → SM Lipa

| Option | Type | Fare | Duration | Transfers | Recommendation |
|--------|------|------|----------|-----------|----------------|
| A | Direct | ₱12 | 25 min | 0 | Cheapest ⭐ |
| B | Split | ₱24 | 20 min | 1 | Fastest |
| C | Hybrid | ₱32 | 18 min | 1 | Most Convenient |

**User Choice:** Based on priorities (cost, time, convenience)

---

## 🔄 Transfer System

### Transfer Points

Transfers happen at major hubs with:
- **Transfer Time:** 3-5 minutes
- **Wait Time:** 5-15 minutes (depends on transport)
- **Instructions:** Clear guidance on next vehicle
- **Facilities:** Waiting areas, restrooms (at major hubs)

### Transfer Instructions

```
Segment 1 Complete: Arrived at Lipa Bayan

Transfer Instructions:
- Get off at Lipa Bayan jeepney stop
- Walk to tricycle terminal (2 minutes)
- Look for tricycle going to SM Lipa
- Estimated wait time: 5 minutes
```

---

## 🗺️ Route Geometry

Each segment includes:
- **Start Point:** Coordinates
- **End Point:** Coordinates
- **Route Path:** GeoJSON geometry
- **Distance:** Actual road distance
- **Duration:** Estimated travel time

---

## 📱 API Endpoints

### Generate Multi-Modal Routes

```bash
POST /api/v1/routes/multi-modal
```

**Request:**
```json
{
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
  "passengerType": "student",
  "preference": "cheapest"
}
```

**Response:**
```json
{
  "success": true,
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
  "passengerType": "student",
  "totalRoutes": 3,
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
      "comfortLevel": "basic",
      "reliability": 8,
      "recommended": true,
      "recommendationReason": "Cheapest option with no transfers",
      "segments": [
        {
          "segmentOrder": 1,
          "transportType": "jeepney",
          "originName": "Antipolo Del Sur",
          "destinationName": "SM City Lipa",
          "distance": 5.2,
          "duration": 25,
          "fare": 12,
          "waitTime": 10,
          "transferTime": 0,
          "instructions": "Take a jeepney from Antipolo Del Sur to SM City Lipa",
          "transferNotes": null
        }
      ],
      "advantages": [
        "No transfers",
        "Simple route",
        "Cheapest option"
      ],
      "disadvantages": [
        "May take longer",
        "Depends on jeepney availability"
      ]
    }
  ]
}
```

### Get Transport Hubs

```bash
GET /api/v1/routes/transport-hubs
```

### Get Transport Types

```bash
GET /api/v1/routes/transport-types
```

### Calculate Segment Fare

```bash
POST /api/v1/routes/calculate-segment-fare
```

---

## 🎨 Frontend Integration

### Display Route Options

```jsx
{routes.map((route, index) => (
  <RouteCard key={route.routeId}>
    <RouteHeader>
      <RouteType>{route.routeType}</RouteType>
      <RouteName>{route.routeName}</RouteName>
      {route.recommended && <Badge>Recommended</Badge>}
    </RouteHeader>
    
    <RouteStats>
      <Stat>
        <Icon>💰</Icon>
        <Value>₱{route.totalFare}</Value>
      </Stat>
      <Stat>
        <Icon>⏱️</Icon>
        <Value>{route.totalDuration} min</Value>
      </Stat>
      <Stat>
        <Icon>🔄</Icon>
        <Value>{route.totalTransfers} transfers</Value>
      </Stat>
    </RouteStats>
    
    <SegmentList>
      {route.segments.map((segment, idx) => (
        <Segment key={idx}>
          <TransportIcon type={segment.transportType} />
          <SegmentInfo>
            <Origin>{segment.originName}</Origin>
            <Arrow>→</Arrow>
            <Destination>{segment.destinationName}</Destination>
          </SegmentInfo>
          <SegmentFare>₱{segment.fare}</SegmentFare>
        </Segment>
      ))}
    </SegmentList>
    
    <Advantages>
      {route.advantages.map((adv, idx) => (
        <Advantage key={idx}>✓ {adv}</Advantage>
      ))}
    </Advantages>
  </RouteCard>
))}
```

---

## 🧪 Testing

### Test Scenarios

**Scenario 1: Short Distance (Direct)**
```
Origin: Lipa Cathedral
Destination: SM Lipa
Expected: 1 direct route
```

**Scenario 2: Medium Distance (Split Options)**
```
Origin: Antipolo Del Sur
Destination: SM Lipa
Expected: 2-3 route options (direct, split, hybrid)
```

**Scenario 3: Long Distance (Multiple Transfers)**
```
Origin: Lipa City
Destination: Batangas City
Expected: Multiple options with different transport types
```

---

## 🎯 Success Metrics

Users should feel:
- ✅ "This app understands how I actually commute"
- ✅ "These routes make sense for Batangas"
- ✅ "I can choose based on my priorities"
- ✅ "The transfer instructions are clear"
- ✅ "The fares are realistic"

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Real-time vehicle tracking
- [ ] Dynamic fare adjustments
- [ ] Rush hour routing
- [ ] Weather-based recommendations
- [ ] User route ratings

### Phase 3
- [ ] Machine learning route optimization
- [ ] Predictive wait times
- [ ] Crowdsourced traffic data
- [ ] Social commuting features
- [ ] Driver/operator integration

---

## 📚 Related Documentation

- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend setup
- [FULLSTACK_ARCHITECTURE.md](FULLSTACK_ARCHITECTURE.md) - System architecture
- [API_REFERENCE.md](docs/API_REFERENCE.md) - API documentation

---

**Multi-Modal Routing System Complete! 🎉**

BiyaHero now simulates realistic Philippine commuter behavior with:
- ✅ Multiple route options
- ✅ Transfer-based routing
- ✅ Segment-based fares
- ✅ Transport hubs
- ✅ Mixed transport types
- ✅ Commuter intelligence
