import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { normalizeCoordinates, routeGeometryPointToLeaflet, toLeafletCoordinate } from '../utils/coordinates'

const TRANSPORT_COLORS = {
    jeepney: '#ef233c',
    tricycle: '#f97316',
    bus: '#16a34a',
    uv_express: '#9333ea',
    van: '#4f46e5',
    walking: '#6b7280'
}

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const LeafletRouteMap = ({ route, origin, destination, userCoords, originPlace, destinationPlace }) => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const [routeCoordinates, setRouteCoordinates] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mapReady, setMapReady] = useState(false)

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
                map.createPane('verifiedRoutePane')
                map.getPane('verifiedRoutePane').style.zIndex = '550'
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
                if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
                    map.removeLayer(layer)
                }
            })
        } catch (error) {
            console.error('Error clearing layers:', error)
        }

        const start = userCoords || originPlace
        const end = destinationPlace
        const startCoordinate = normalizeCoordinates(start)
        const endCoordinate = normalizeCoordinates(end)
        const userCoordinate = normalizeCoordinates(userCoords)
        if (!startCoordinate || !endCoordinate) {
            setError('Verified origin or destination coordinates are unavailable. Select the locations again before viewing the map.')
            setLoading(false)
            return
        }

        const startCoords = startCoordinate
        const endCoords = endCoordinate
        const segments = Array.isArray(route?.segments) ? route.segments : []
        const segmentPaths = segments.map(segment => ({
            segment,
            coordinates: Array.isArray(segment.geometry)
                ? segment.geometry
                    .map(routeGeometryPointToLeaflet)
                    .filter(Boolean)
                : []
        })).filter(item => item.coordinates.length > 1)

        if (segmentPaths.length === 0 && route?.routeId !== 'road-reference') {
            setError('Verified route geometry is unavailable. No approximate route line will be drawn.')
        }

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

        if (userCoordinate) {
            L.circle(toLeafletCoordinate(userCoordinate), {
                radius: Number(userCoords.accuracy) || 25,
                color: '#1890ff',
                fillColor: '#1890ff',
                fillOpacity: 0.12,
                weight: 1
            }).addTo(map)
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
            L.marker(toLeafletCoordinate(userCoordinate), { icon: userIcon })
                .addTo(map)
                .bindPopup('<b>Your Location</b>')
        }

        L.marker(toLeafletCoordinate(startCoords), { icon: startIcon })
            .addTo(map)
            .bindPopup(`<b>Start:</b> ${originPlace?.formattedAddress || originPlace?.displayName || originPlace?.name || origin}<br>${startCoords.latitude.toFixed(6)}, ${startCoords.longitude.toFixed(6)}`)
        L.marker(toLeafletCoordinate(endCoords), { icon: endIcon })
            .addTo(map)
            .bindPopup(`<b>Destination:</b> ${destinationPlace?.formattedAddress || destinationPlace?.displayName || destinationPlace?.name || destination}<br>${endCoords.latitude.toFixed(6)}, ${endCoords.longitude.toFixed(6)}`)

        const routePoints = segmentPaths.flatMap(({ coordinates }) => coordinates)
        segmentPaths.forEach(({ segment, coordinates }, index) => {
            const mode = String(segment.transportType || '').toLowerCase().replace(/\s+/g, '_')
            const color = TRANSPORT_COLORS[mode] || '#0c5aa6'
            const modeLabel = mode === 'road_reference' ? 'Road-route reference' : segment.transportType || 'Transit'
            L.polyline(coordinates, {
                pane: 'verifiedRoutePane',
                color: '#ffffff',
                weight: 15,
                opacity: 1,
                smoothFactor: 1,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map)
            L.polyline(coordinates, {
                pane: 'verifiedRoutePane',
                color: '#111827',
                weight: 11,
                opacity: 1,
                smoothFactor: 1,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map)
            L.polyline(coordinates, {
                pane: 'verifiedRoutePane',
                color,
                weight: 7,
                opacity: 1,
                smoothFactor: 1,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'route-line'
            }).addTo(map).bindPopup(
                `<b>Segment ${index + 1}:</b> ${modeLabel} — ${segment.routeName || ''}` +
                `<br>${mode === 'road_reference' ? 'Road route provider' : 'Verified transit geometry source'}: ${segment.geometryProvider || 'unavailable'}`
            )

            if (index > 0) {
                const [lat, lng] = coordinates[0]
                L.circleMarker([lat, lng], {
                    radius: 7,
                    color: '#ffffff',
                    weight: 2,
                    fillColor: '#f59e0b',
                    fillOpacity: 1
                }).addTo(map).bindPopup(`<b>Transfer:</b> ${segment.originName}`)
            }
        })

        const accessConnectors = [route?.originAccess, route?.destinationAccess].filter(access =>
                access && Number.isFinite(Number(access.lat)) && Number.isFinite(Number(access.lng))
                && Number.isFinite(Number(access.stopLat)) && Number.isFinite(Number(access.stopLng))
                && toLeafletCoordinate(access)
                && toLeafletCoordinate({ lat: access.stopLat, lng: access.stopLng })
                && Number(access.distanceKm) > 0.03
        )
        accessConnectors.forEach(access => {
                L.polyline(
                [
                    toLeafletCoordinate(access),
                    toLeafletCoordinate({ lat: access.stopLat, lng: access.stopLng })
                ],
                    {
                        pane: 'verifiedRoutePane',
                        color: '#111827',
                        weight: 3,
                        opacity: 0.9,
                        dashArray: '6 7'
                    }
                ).addTo(map).bindPopup(
                    `<b>Approximate access:</b> ${access.distanceKm} km to ${access.stopName}. The dashed line is not a walking path.`
                )
                L.circleMarker(toLeafletCoordinate({ lat: access.stopLat, lng: access.stopLng }), {
                    radius: 6,
                    color: '#ffffff',
                    weight: 2,
                    fillColor: '#111827',
                    fillOpacity: 1
                }).addTo(map).bindPopup(`<b>Verified boarding/alighting stop:</b> ${access.stopName}`)
        })

        setRouteCoordinates(routePoints)
        const accessPoints = accessConnectors.flatMap(access => [
                toLeafletCoordinate(access),
                toLeafletCoordinate({ lat: access.stopLat, lng: access.stopLng })
        ])
        const bounds = L.latLngBounds([
            ...routePoints,
            ...accessPoints.map(point => routeGeometryPointToLeaflet(point)),
            toLeafletCoordinate(startCoords),
            toLeafletCoordinate(endCoords)
        ].filter(Boolean))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
        setLoading(false)

    }, [route, origin, destination, userCoords, originPlace, destinationPlace, mapReady])

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-[400px] md:h-[500px] rounded-2xl shadow-lg"
                style={{ zIndex: 1 }}
            />
            {route?.segments?.length > 0 && (
                <div aria-label="Route map legend" className="absolute bottom-4 right-4 z-[5] rounded-lg bg-white/95 p-3 text-xs shadow-lg dark:bg-gray-900/95">
                    <div className="space-y-1">
                        {[...new Set(route.segments.map(segment => String(segment.transportType || '').toLowerCase().replace(/\s+/g, '_')))].map(mode => (
                            <div key={mode} className="flex items-center gap-2">
                                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: TRANSPORT_COLORS[mode] || '#0c5aa6' }} />
                                <span className="capitalize">{mode.replace('_', ' ')}</span>
                            </div>
                        ))}
                        {route.segments.length > 1 && <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Transfer</div>}
                    </div>
                </div>
            )}
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
                <details className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg z-10">
                    <summary className="cursor-pointer font-semibold">Routing diagnostics (development)</summary>
                    <div className="mt-2 space-y-1">
                        <div>Map: {mapReady ? 'ready' : 'loading'} · Geometry points: {routeCoordinates?.length || 0}</div>
                        <div>Origin request: {JSON.stringify(normalizeCoordinates(originPlace)) || 'unavailable'}</div>
                        <div>Origin GPS: {JSON.stringify(normalizeCoordinates(userCoords)) || 'not used'}</div>
                        <div>Destination request: {JSON.stringify(normalizeCoordinates(destinationPlace)) || 'unavailable'}</div>
                        <div>Route start/end: {JSON.stringify(routeCoordinates?.[0] || null)} → {JSON.stringify(routeCoordinates?.[routeCoordinates.length - 1] || null)}</div>
                        <div>Transit geometry source: {route?.segments?.[0]?.geometryProvider || 'unavailable'}</div>
                        <div>Place providers: {originPlace?.provider || 'unknown'} → {destinationPlace?.provider || 'unknown'}</div>
                        <div>Transit network: {route?.networkId || 'unverified / unavailable'} · {route?.transportVerificationStatus || 'no verified route'}</div>
                        <div>Distance: {route?.totalDistance ?? 'unavailable'} km</div>
                    </div>
                </details>
            )}
        </div>
    )
}

const RouteMap = props => {
    return <LeafletRouteMap {...props} />
}

export default RouteMap
