import { useEffect, useState } from 'react'

/**
 * Map Diagnostics Component
 * Helps identify map loading issues
 */
const MapDiagnostics = ({ origin, destination, originPlace, destinationPlace, userCoords }) => {
    const [diagnostics, setDiagnostics] = useState({})

    useEffect(() => {
        const runDiagnostics = async () => {
            const results = {
                timestamp: new Date().toISOString(),
                leafletLoaded: typeof window.L !== 'undefined',
                originData: {
                    name: origin,
                    place: originPlace,
                    hasCoords: !!(originPlace?.lat && originPlace?.lng)
                },
                destinationData: {
                    name: destination,
                    place: destinationPlace,
                    hasCoords: !!(destinationPlace?.lat && destinationPlace?.lng)
                },
                userCoords: userCoords,
                osrmAvailable: false,
                nominatimAvailable: false
            }

            // Test OSRM
            try {
                const osrmTest = await fetch('https://router.project-osrm.org/route/v1/driving/121.0583,13.7565;121.1650,13.9411?overview=false', {
                    timeout: 5000
                })
                results.osrmAvailable = osrmTest.ok
            } catch (error) {
                results.osrmError = error.message
            }

            // Test Nominatim
            try {
                const nominatimTest = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Lipa,Batangas&limit=1', {
                    timeout: 5000
                })
                results.nominatimAvailable = nominatimTest.ok
            } catch (error) {
                results.nominatimError = error.message
            }

            setDiagnostics(results)
        }

        runDiagnostics()
    }, [origin, destination, originPlace, destinationPlace, userCoords])

    if (!import.meta.env.DEV) return null

    return (
        <div className="fixed bottom-20 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-2xl max-w-md text-xs">
            <div className="font-bold mb-2">🗺️ Map Diagnostics</div>
            <div className="space-y-1">
                <div>Leaflet: {diagnostics.leafletLoaded ? '✅' : '❌'}</div>
                <div>OSRM: {diagnostics.osrmAvailable ? '✅' : '❌'} {diagnostics.osrmError && `(${diagnostics.osrmError})`}</div>
                <div>Nominatim: {diagnostics.nominatimAvailable ? '✅' : '❌'} {diagnostics.nominatimError && `(${diagnostics.nominatimError})`}</div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                    <div>Origin: {diagnostics.originData?.name}</div>
                    <div className="ml-2">Coords: {diagnostics.originData?.hasCoords ? '✅' : '❌'}</div>
                    {diagnostics.originData?.place && (
                        <div className="ml-2 text-gray-400">
                            {diagnostics.originData.place.lat?.toFixed(4)}, {diagnostics.originData.place.lng?.toFixed(4)}
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                    <div>Destination: {diagnostics.destinationData?.name}</div>
                    <div className="ml-2">Coords: {diagnostics.destinationData?.hasCoords ? '✅' : '❌'}</div>
                    {diagnostics.destinationData?.place && (
                        <div className="ml-2 text-gray-400">
                            {diagnostics.destinationData.place.lat?.toFixed(4)}, {diagnostics.destinationData.place.lng?.toFixed(4)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MapDiagnostics
