import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const RouteMap = ({ route, origin, destination, userCoords, originPlace, destinationPlace }) => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const [routeCoordinates, setRouteCoordinates] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mapReady, setMapReady] = useState(false)

    // Geocode location name to coordinates
    const geocodeLocation = async (locationName) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}, Batangas, Philippines&limit=1`
            )
            const data = await response.json()
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error)
        }
        return null
    }

    // Get route from OSRM (Open Source Routing Machine) - follows actual roads
    const getRoute = async (start, end) => {
        try {
            // Using OSRM public API - follows real roads and highways
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`

            const response = await fetch(url)
            const data = await response.json()

            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                // Convert GeoJSON coordinates to Leaflet format [lat, lng]
                const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]])
                return coordinates
            } else {
                console.warn('OSRM routing failed, using fallback')
                return [[start.lat, start.lng], [end.lat, end.lng]]
            }
        } catch (error) {
            console.error('Routing error:', error)
            // Fallback to straight line if routing fails
            return [[start.lat, start.lng], [end.lat, end.lng]]
        }
    }

    useEffect(() => {
        // Ensure the map container exists before initializing
        if (!mapRef.current) {
            console.warn('Map container ref not ready')
            return
        }

        if (mapInstanceRef.current) {
            console.log('Map already initialized')
            return
        }

        console.log('Initializing map...')

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (!mapRef.current) {
                console.error('Map container disappeared')
                return
            }

            try {
                // Check if Leaflet is loaded
                if (typeof L === 'undefined') {
                    console.error('Leaflet library not loaded')
                    setError('Map library not loaded. Please refresh the page.')
                    setLoading(false)
                    return
                }

                // Initialize map centered on Batangas
                console.log('Creating Leaflet map instance...')
                const map = L.map(mapRef.current, {
                    center: [13.7565, 121.0583],
                    zoom: 11,
                    zoomControl: true,
                    scrollWheelZoom: true
                })

                mapInstanceRef.current = map
                console.log('Map instance created successfully')

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19,
                }).addTo(map)

                // Wait for tiles to load
                map.whenReady(() => {
                    console.log('Map tiles loaded and ready')
                    setMapReady(true)
                    setLoading(false)
                })

                // Handle tile load errors
                map.on('tileerror', (error) => {
                    console.error('Tile load error:', error)
                })

            } catch (error) {
                console.error('Map initialization error:', error)
                setError(`Failed to initialize map: ${error.message}`)
                setLoading(false)
            }
        }, 100)

        return () => {
            clearTimeout(timer)
            if (mapInstanceRef.current) {
                try {
                    console.log('Cleaning up map instance')
                    mapInstanceRef.current.remove()
                } catch (error) {
                    console.error('Map cleanup error:', error)
                }
                mapInstanceRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (!mapInstanceRef.current || !mapReady) {
            console.log('Map not ready yet, skipping route setup')
            return
        }

        if (!origin || !destination) {
            console.warn('Missing origin or destination')
            return
        }

        console.log('Setting up route...', { origin, destination, originPlace, destinationPlace })

        const map = mapInstanceRef.current
        setLoading(true)
        setError(null)

        // Clear existing markers and polylines safely
        try {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    map.removeLayer(layer)
                }
            })
        } catch (error) {
            console.error('Error clearing layers:', error)
        }

        const setupRoute = async () => {
            try {
                // Use validated place objects if available (CRITICAL for accuracy)
                let startCoords = userCoords
                if (!startCoords && originPlace) {
                    startCoords = { lat: originPlace.lat, lng: originPlace.lng }
                    console.log('Using originPlace coords:', startCoords)
                } else if (!startCoords) {
                    console.log('Geocoding origin:', origin)
                    startCoords = await geocodeLocation(origin)
                }

                let endCoords = null
                if (destinationPlace) {
                    endCoords = { lat: destinationPlace.lat, lng: destinationPlace.lng }
                    console.log('Using destinationPlace coords:', endCoords)
                } else {
                    console.log('Geocoding destination:', destination)
                    endCoords = await geocodeLocation(destination)
                }

                if (!startCoords || !endCoords) {
                    console.error('Failed to get coordinates', { startCoords, endCoords })
                    // Fallback to Batangas area coordinates
                    startCoords = startCoords || { lat: 13.7565, lng: 121.0583 }
                    const endOffset = { lat: 0.05, lng: 0.05 }
                    const finalEndCoords = endCoords || {
                        lat: startCoords.lat + endOffset.lat,
                        lng: startCoords.lng + endOffset.lng
                    }

                    setError('Could not find exact locations. Showing approximate area.')
                    return { start: startCoords, end: finalEndCoords }
                }

                console.log('Coordinates resolved:', { start: startCoords, end: endCoords })
                return { start: startCoords, end: endCoords }
            } catch (error) {
                console.error('Error in setupRoute:', error)
                setError(`Route setup failed: ${error.message}`)
                throw error
            }
        }

        setupRoute().then(async ({ start, end }) => {
            try {
                // Create custom icons
                const startIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
          background: linear-gradient(135deg, #1890ff 0%, #13c2c2 100%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 16px;">📍</div>
        </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                })

                const endIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
          background: linear-gradient(135deg, #13c2c2 0%, #1890ff 100%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 16px;">🎯</div>
        </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                })

                // User location marker (if available)
                if (userCoords) {
                    const userIcon = L.divIcon({
                        className: 'user-location-marker',
                        html: `<div style="
            background: #1890ff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.3), 0 2px 8px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          "></div>
          <style>
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.3), 0 2px 8px rgba(0,0,0,0.3); }
              50% { box-shadow: 0 0 0 8px rgba(24, 144, 255, 0.1), 0 2px 8px rgba(0,0,0,0.3); }
            }
          </style>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    })

                    L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
                        .addTo(map)
                        .bindPopup('<b>Your Location</b>')
                }

                // Add markers
                L.marker([start.lat, start.lng], { icon: startIcon })
                    .addTo(map)
                    .bindPopup(`<b>Start:</b> ${origin}`)

                L.marker([end.lat, end.lng], { icon: endIcon })
                    .addTo(map)
                    .bindPopup(`<b>Destination:</b> ${destination}`)

                // Get and draw route
                console.log('Fetching route from OSRM...')
                const routePoints = await getRoute(start, end)
                console.log('Route points received:', routePoints.length, 'points')
                setRouteCoordinates(routePoints)

                // Add route polyline outline (darker, wider)
                L.polyline(routePoints, {
                    color: '#0c5aa6',
                    weight: 8,
                    opacity: 0.4,
                    smoothFactor: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map)

                // Add main route polyline (follows actual roads)
                const polyline = L.polyline(routePoints, {
                    color: '#1890ff',
                    weight: 5,
                    opacity: 0.9,
                    smoothFactor: 1,
                    lineCap: 'round',
                    lineJoin: 'round',
                    className: 'route-line'
                }).addTo(map)

                // Fit map to show entire route
                const bounds = L.latLngBounds([
                    [start.lat, start.lng],
                    [end.lat, end.lng]
                ])
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })

                console.log('Route rendered successfully')
                setLoading(false)
            } catch (error) {
                console.error('Error setting up route on map:', error)
                setError(`Failed to render route: ${error.message}`)
                setLoading(false)
            }
        }).catch(error => {
            console.error('Error in setupRoute:', error)
            setError(`Route generation failed: ${error.message}`)
            setLoading(false)
        })

    }, [route, origin, destination, userCoords, originPlace, destinationPlace, mapReady])

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-[400px] md:h-[500px] rounded-2xl shadow-lg"
                style={{ zIndex: 1 }}
            />
            {loading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {!mapReady ? 'Initializing map...' : 'Loading route...'}
                        </p>
                    </div>
                </div>
            )}
            {error && (
                <div className="absolute top-4 left-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 z-10">
                    <p className="text-sm text-red-800 dark:text-red-300">
                        ⚠️ {error}
                    </p>
                </div>
            )}
            {import.meta.env.DEV && (
                <div className="absolute bottom-4 left-4 bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg z-10">
                    <div>Map: {mapReady ? '✅' : '⏳'}</div>
                    <div>Route: {routeCoordinates ? `✅ ${routeCoordinates.length} points` : '⏳'}</div>
                </div>
            )}
        </div>
    )
}

export default RouteMap
