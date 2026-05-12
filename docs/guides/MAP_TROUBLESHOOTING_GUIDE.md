# 🗺️ Map Troubleshooting Guide

**Quick guide to fix map loading and route generation issues**

---

## 🔍 Common Issues & Solutions

### Issue 1: Map Not Loading (Blank/Gray Box)

**Symptoms:**
- Map container shows but no tiles load
- Gray box instead of map
- No error messages

**Causes:**
1. Leaflet CSS not loaded
2. Map container has no height
3. Leaflet library not loaded
4. Network issues blocking tile requests

**Solutions:**

**Check 1: Verify Leaflet CSS**
```javascript
// In RouteMap.jsx, ensure this import is present:
import 'leaflet/dist/leaflet.css'
```

**Check 2: Verify Container Height**
```jsx
// Map container must have explicit height
<div className="w-full h-[400px] md:h-[500px]" />
```

**Check 3: Check Browser Console**
```
F12 → Console tab
Look for errors like:
- "L is not defined"
- "Cannot read property 'map' of undefined"
- Failed to load resource (tile errors)
```

**Check 4: Test Tile Server**
Open in browser:
```
https://a.tile.openstreetmap.org/11/1024/768.png
```
Should show a map tile image.

---

### Issue 2: Routes Not Generating

**Symptoms:**
- Map loads but no route line appears
- Markers show but no path between them
- "Loading route..." never completes

**Causes:**
1. Missing origin/destination coordinates
2. OSRM API unavailable
3. Invalid coordinates
4. Network timeout

**Solutions:**

**Check 1: Verify Coordinates**
Open browser console and check:
```javascript
// Should see logs like:
"Using originPlace coords: {lat: 13.9411, lng: 121.1650}"
"Using destinationPlace coords: {lat: 13.9380, lng: 121.1625}"
```

**Check 2: Test OSRM API**
```bash
# Test in browser or curl
curl "https://router.project-osrm.org/route/v1/driving/121.0583,13.7565;121.1650,13.9411?overview=false"
```

Should return JSON with `"code": "Ok"`

**Check 3: Check Dev Status Panel**
Look at bottom-right corner:
- Backend: Should be ✅ green
- Database: Should be ✅ green
- Routing: Should be ✅ green

**Check 4: Verify Place Objects**
In SearchBar, ensure you're selecting locations from the dropdown (not just typing).
Look for green ✅ checkmark next to origin/destination.

---

### Issue 3: Map Loads But Crashes/Freezes

**Symptoms:**
- Map loads initially
- Freezes when trying to generate route
- Browser becomes unresponsive

**Causes:**
1. Too many route points
2. Memory leak from not cleaning up map
3. Multiple map instances created
4. Infinite re-render loop

**Solutions:**

**Check 1: Verify Map Cleanup**
```javascript
// In RouteMap.jsx useEffect cleanup:
return () => {
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
    }
}
```

**Check 2: Check for Multiple Instances**
Open console and look for:
```
"Map already initialized"
```
Should only see once per page load.

**Check 3: Limit Route Points**
```javascript
// In getRoute function, limit points if needed:
const coordinates = data.routes[0].geometry.coordinates
    .filter((_, index) => index % 2 === 0) // Take every 2nd point
    .map(coord => [coord[1], coord[0]])
```

---

### Issue 4: Markers Not Showing

**Symptoms:**
- Map and route load
- No start/end markers visible
- Only route line shows

**Causes:**
1. Marker icons not loading
2. CDN blocked
3. Icon path incorrect

**Solutions:**

**Check 1: Verify Icon URLs**
```javascript
// In RouteMap.jsx, check these URLs load:
iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png'
iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png'
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
```

Test in browser - should show marker images.

**Check 2: Use Custom Markers**
The code uses custom divIcon markers (📍 and 🎯 emojis).
Check if they're rendering in the DOM.

---

### Issue 5: "Cannot Read Property 'lat' of undefined"

**Symptoms:**
- Error in console
- Map fails to load
- Route generation stops

**Causes:**
1. originPlace or destinationPlace is null/undefined
2. User didn't select from dropdown
3. Geocoding failed

**Solutions:**

**Check 1: Verify Place Selection**
```javascript
// In SearchBar.jsx, ensure place objects are set:
console.log('Origin Place:', selectedOriginPlace)
console.log('Destination Place:', selectedDestinationPlace)
```

Both should have `lat` and `lng` properties.

**Check 2: Add Fallback**
```javascript
// In RouteMap.jsx:
const startCoords = originPlace?.lat && originPlace?.lng 
    ? { lat: originPlace.lat, lng: originPlace.lng }
    : await geocodeLocation(origin)
```

**Check 3: Require Place Selection**
In SearchBar, don't allow route search without place selection:
```javascript
if (!selectedOriginPlace || !selectedDestinationPlace) {
    alert('Please select locations from the dropdown')
    return
}
```

---

## 🛠️ Debugging Tools

### 1. Browser Console Logs

**Enable Detailed Logging:**
The updated RouteMap.jsx now includes console.log statements:
```
"Initializing map..."
"Map instance created successfully"
"Map tiles loaded and ready"
"Setting up route..."
"Using originPlace coords: {...}"
"Coordinates resolved: {...}"
"Fetching route from OSRM..."
"Route points received: 150 points"
"Route rendered successfully"
```

**Check for Errors:**
Look for red error messages in console.

### 2. Dev Status Panel

Bottom-right corner shows:
- ✅ Frontend
- ✅ Backend
- ✅ Database
- ✅ Geolocation
- ✅ Routing

All should be green.

### 3. Map Diagnostics (Dev Mode)

Bottom-left corner of map shows:
```
Map: ✅
Route: ✅ 150 points
```

### 4. Network Tab

**Check API Calls:**
1. Open F12 → Network tab
2. Filter by "Fetch/XHR"
3. Look for:
   - `nominatim.openstreetmap.org` (geocoding)
   - `router.project-osrm.org` (routing)
   - `tile.openstreetmap.org` (map tiles)

All should return 200 OK.

---

## 🔧 Quick Fixes

### Fix 1: Clear Browser Cache
```
Ctrl + Shift + Delete
Clear cached images and files
```

### Fix 2: Hard Refresh
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Fix 3: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Fix 4: Reinstall Dependencies
```bash
npm install
cd backend && npm install
```

### Fix 5: Check Environment
```bash
# Verify Node.js version
node --version  # Should be 18+

# Run health check
npm run health-check
```

---

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Browser console shows no errors
- [ ] Leaflet CSS is loaded
- [ ] Map container has height
- [ ] originPlace and destinationPlace have coordinates
- [ ] OSRM API is accessible
- [ ] Nominatim API is accessible
- [ ] OpenStreetMap tiles are loading
- [ ] Dev Status Panel shows all green
- [ ] Network tab shows successful API calls
- [ ] No JavaScript errors in console

---

## 🆘 Still Not Working?

### Check These Files:

1. **src/components/RouteMap.jsx**
   - Verify all imports
   - Check useEffect dependencies
   - Verify map initialization

2. **src/pages/RouteResultsMultiModal.jsx**
   - Check if originPlace and destinationPlace are passed
   - Verify route data structure

3. **src/components/SearchBar.jsx**
   - Ensure place selection works
   - Check if coordinates are set

### Enable Verbose Logging:

Add to RouteMap.jsx:
```javascript
console.log('Props:', { 
    route, origin, destination, 
    userCoords, originPlace, destinationPlace 
})
```

### Test with Known Coordinates:

Hardcode test coordinates:
```javascript
const testStart = { lat: 13.9411, lng: 121.1650 } // Lipa Cathedral
const testEnd = { lat: 13.9380, lng: 121.1625 } // SM Lipa
```

---

## 📞 Getting Help

If issues persist:

1. **Check Console Logs**
   - Copy all error messages
   - Note which step fails

2. **Check Network Tab**
   - Screenshot failed requests
   - Note status codes

3. **Check Dev Status Panel**
   - Screenshot service status
   - Note which services are red

4. **Provide Details**
   - Browser and version
   - Operating system
   - Steps to reproduce
   - Error messages
   - Console logs

---

## ✅ Success Indicators

Map is working correctly when you see:

- ✅ Map tiles load (OpenStreetMap visible)
- ✅ Start marker (📍) appears
- ✅ End marker (🎯) appears
- ✅ Blue route line connects them
- ✅ Route follows actual roads
- ✅ Map auto-zooms to show full route
- ✅ No errors in console
- ✅ Dev diagnostics show "Map: ✅, Route: ✅"

---

**Updated:** May 12, 2026  
**Version:** 2.1.0 with Enhanced Debugging

