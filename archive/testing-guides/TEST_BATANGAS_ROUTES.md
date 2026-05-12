# 🧪 TESTING GUIDE - Batangas Transportation Intelligence

**Quick Reference for Testing the New Batangas-Wide Routing System**

---

## 🚀 QUICK START

### 1. Start the Servers

**Backend:**
```bash
cd backend
npm run dev
```
Server will run on: `http://localhost:5000`

**Frontend:**
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 🧪 TEST SCENARIOS

### Scenario 1: Direct Route (No Transfer)
**Test Case:** Lipa Cathedral to SM Lipa

**Steps:**
1. Go to BiyaHero homepage
2. Enter Origin: "Lipa Cathedral"
3. Enter Destination: "SM Lipa"
4. Click "Find Routes"

**Expected Results:**
- ✅ Direct jeepney route displayed
- ✅ Route tagged as "One Ride Only", "Locals' Favorite"
- ✅ Filipino instructions: "Sakay ka po ng 'Lipa Bayan - SM Lipa' jeep..."
- ✅ Commuter note: "Pinakamadalas na route. Laging may jeep..."
- ✅ No transfers required
- ✅ Fare: ~₱12

---

### Scenario 2: One Transfer Route
**Test Case:** Antipolo Del Sur to SM Lipa

**Steps:**
1. Enter Origin: "Antipolo Del Sur"
2. Enter Destination: "SM Lipa"
3. Click "Find Routes"

**Expected Results:**
- ✅ Route with 1 transfer displayed
- ✅ Transfer at Lipa Cathedral or Lipa Sabang
- ✅ Segment 1: Antipolo → Lipa Cathedral (Jeepney)
- ✅ Segment 2: Lipa Cathedral → SM Lipa (Jeepney)
- ✅ Filipino transfer instructions
- ✅ Transfer time: ~5 minutes
- ✅ Total fare: ~₱24

---

### Scenario 3: Student Route
**Test Case:** Antipolo Del Sur to BSU Lipa

**Steps:**
1. Enter Origin: "Antipolo Del Sur"
2. Enter Destination: "Batangas State University"
3. Select Passenger Type: "Student"
4. Click "Find Routes"

**Expected Results:**
- ✅ Route tagged as "Student Friendly"
- ✅ 20% discount applied to fare
- ✅ Commuter note about student traffic
- ✅ Warning about rush hour crowding (7-8 AM, 4-6 PM)

---

### Scenario 4: Inter-City Route
**Test Case:** Tanauan to Lipa

**Steps:**
1. Enter Origin: "Tanauan City Hall"
2. Enter Destination: "Lipa Cathedral"
3. Click "Find Routes"

**Expected Results:**
- ✅ Direct jeepney route
- ✅ Tagged as "One Ride Only", "Locals' Favorite"
- ✅ Duration: ~30-40 minutes
- ✅ Fare: ~₱25
- ✅ Commuter note about JP Laurel Highway

---

### Scenario 5: Long Distance (Bus)
**Test Case:** Lipa to Batangas City

**Steps:**
1. Enter Origin: "Big Ben Terminal"
2. Enter Destination: "Batangas Grand Terminal"
3. Click "Find Routes"

**Expected Results:**
- ✅ Bus route displayed
- ✅ Tagged as "Most Comfortable", "Fastest"
- ✅ Transport type: Bus (🚍)
- ✅ Duration: ~45 minutes
- ✅ Fare: ~₱45
- ✅ Commuter note about STAR Tollway

---

### Scenario 6: Multiple Municipality Route
**Test Case:** Rosario to SM Lipa

**Steps:**
1. Enter Origin: "Rosario Town Center"
2. Enter Destination: "SM Lipa"
3. Click "Find Routes"

**Expected Results:**
- ✅ Direct jeepney route
- ✅ Tagged as "One Ride Only", "Fastest"
- ✅ Duration: ~25-30 minutes
- ✅ Fare: ~₱25

---

## 🏷️ ROUTE TAG VERIFICATION

### Check These Tags Appear:
- [ ] 🎓 Student Friendly
- [ ] 🚌 One Ride Only
- [ ] 💰 Cheapest Option
- [ ] ⚡ Fastest Option
- [ ] ⏰ Rush Hour Prone
- [ ] ⏳ Heavy Waiting Time
- [ ] ✨ Most Comfortable
- [ ] 👋 Recommended for First-Timers
- [ ] ⭐ Locals' Favorite

---

## 💬 FILIPINO INSTRUCTIONS VERIFICATION

### Check These Elements:
- [ ] Filipino instructions in segment details
- [ ] "Paano pumunta:" section visible
- [ ] Commuter notes in Filipino (with 💬 icon)
- [ ] Transfer instructions in Filipino
- [ ] Natural conversational tone

### Example Filipino Phrases to Look For:
- "Sakay ka po ng jeep papuntang..."
- "Baba ka sa..."
- "Mag-transfer ka sa..."
- "Mabilis ang byahe..."
- "Madalas may sakay..."
- "Punuan pag rush hour..."

---

## 🎨 UI/UX VERIFICATION

### Visual Elements to Check:
- [ ] Route tags display with colored badges
- [ ] Tag icons visible (🎓, 💰, ⚡, etc.)
- [ ] Commuter notes in styled quote boxes
- [ ] Filipino instructions in blue-themed boxes
- [ ] Transfer notes in yellow-themed boxes
- [ ] Gradient styling on route summary cards
- [ ] Proper spacing and typography

---

## 🔍 API ENDPOINT TESTING

### Test These Endpoints Directly:

**1. Get Transport Hubs:**
```bash
curl http://localhost:5000/api/v1/routes/transport-hubs
```
Expected: 13 hubs across Batangas

**2. Get Jeepney Routes:**
```bash
curl http://localhost:5000/api/v1/routes/jeepney-routes
```
Expected: 15+ routes with Filipino notes

**3. Get Route Tags:**
```bash
curl http://localhost:5000/api/v1/routes/route-tags
```
Expected: 10 route tags with icons and descriptions

**4. Get Multi-Modal Route:**
```bash
curl -X POST http://localhost:5000/api/v1/routes/multi-modal \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"name": "Lipa Cathedral", "lat": 13.9411, "lng": 121.1650},
    "destination": {"name": "SM Lipa", "lat": 13.9380, "lng": 121.1625},
    "passengerType": "regular"
  }'
```
Expected: Route with Filipino instructions and tags

---

## ✅ ACCEPTANCE CRITERIA

### Route Quality:
- [ ] All routes are realistic (locals would actually take them)
- [ ] Transfers only at legitimate hubs
- [ ] No arbitrary coordinate-based routes
- [ ] Fares are accurate
- [ ] Durations are realistic

### Cultural Accuracy:
- [ ] Filipino instructions are natural
- [ ] Commuter notes reflect real behavior
- [ ] Language is conversational, not formal
- [ ] Local terminology used correctly

### User Experience:
- [ ] Route tags help decision-making
- [ ] Instructions are clear and actionable
- [ ] Visual hierarchy is clear
- [ ] Information is easy to scan
- [ ] Mobile-responsive design works

---

## 🐛 KNOWN ISSUES TO WATCH FOR

### Potential Issues:
1. **Route Not Found**: If origin/destination not in database
   - Expected: Friendly error message in Filipino
   - Should suggest major hubs

2. **Missing Tags**: Some routes may not have tags yet
   - Expected: Route still displays, just without tags

3. **Long Wait Times**: Some routes have infrequent service
   - Expected: "Heavy Waiting Time" tag displayed

---

## 📊 TEST COVERAGE CHECKLIST

### Route Types:
- [ ] Direct routes (no transfer)
- [ ] One-transfer routes
- [ ] Inter-city routes
- [ ] Long-distance routes (bus)
- [ ] Student-friendly routes
- [ ] Rush hour routes

### Passenger Types:
- [ ] Regular passenger
- [ ] Student (20% discount)
- [ ] Senior (20% discount)
- [ ] PWD (20% discount)

### Municipalities:
- [ ] Lipa City
- [ ] Batangas City
- [ ] Tanauan City
- [ ] Rosario
- [ ] San Jose
- [ ] Padre Garcia
- [ ] Ibaan

---

## 🎯 SUCCESS INDICATORS

### The system is working correctly if:
✅ Routes match actual commuter behavior  
✅ Filipino instructions are natural and clear  
✅ Route tags accurately describe routes  
✅ Transfers only happen at major hubs  
✅ Fares and durations are realistic  
✅ UI is clean and easy to understand  
✅ Commuter notes add value and context  

---

## 📝 FEEDBACK COLLECTION

### Questions to Ask Test Users:
1. Are the routes realistic? Would you actually take them?
2. Are the Filipino instructions clear and natural?
3. Do the route tags help you choose a route?
4. Are the commuter notes helpful?
5. Is the fare accurate?
6. Is the duration realistic?
7. Are the transfer instructions clear?
8. Would you use this app for your daily commute?

---

## 🚀 NEXT STEPS AFTER TESTING

### If Tests Pass:
1. ✅ Mark system as ready for user testing
2. ✅ Prepare demo for stakeholders
3. ✅ Plan expansion to more municipalities
4. ✅ Gather user feedback for improvements

### If Issues Found:
1. 🐛 Document issues in detail
2. 🔧 Prioritize fixes
3. 🧪 Re-test after fixes
4. 📊 Update documentation

---

**Happy Testing! 🎉**

For questions or issues, check:
- `BATANGAS_TRANSPORTATION_INTELLIGENCE_COMPLETE.md` - Full implementation details
- `PROJECT_STATUS_REPORT.md` - Overall project status
- Backend logs at `http://localhost:5000`
