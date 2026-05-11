// AI response generator for Batangas commute-related questions
import { getRouteByNames } from '../services/routeService'
import { getFareForAI, formatFare } from './distanceBasedFare'
import { getRouteContextForAI, getCommuterTips } from '../data/routeIntelligence'

export const getAIResponse = async (question) => {
    const lowerQuestion = question.toLowerCase()

    // Fare-related questions with distance-based calculation
    if (lowerQuestion.includes('magkano') || lowerQuestion.includes('pamasahe') || lowerQuestion.includes('fare')) {
        // Try to extract locations from question
        const fareInfo = await extractFareFromQuestion(lowerQuestion)

        if (fareInfo && fareInfo.success) {
            const { distance, regularFare, studentFare, seniorFare, pwdFare, travelTime, fareRule, origin, destination } = fareInfo

            // Get route intelligence context
            const routeContext = getRouteContextForAI(origin, destination)
            let contextInfo = ''

            if (routeContext) {
                contextInfo = `\n\n🚌 Transport: ${routeContext.transportType}\n📊 Difficulty: ${routeContext.difficulty}\n🔄 Transfers: ${routeContext.transfers}\n⚠️ Rush Hour: ${routeContext.rushHourRisk} risk\n\n💡 Commuter Tip: ${routeContext.tips}`
            }

            return `Fare papunta dyan:\n\n📏 Distance: ${distance.toFixed(1)} km\n⏱️ Travel Time: ${travelTime}\n\n💰 Regular: ${formatFare(regularFare)}\n🎓 Student: ${formatFare(studentFare)} (20% off)\n👴 Senior: ${formatFare(seniorFare)} (20% off)\n♿ PWD: ${formatFare(pwdFare)} (20% off)\n\n📋 Fare Rule: ${fareRule}${contextInfo}\n\n✨ Fares are based on actual route distance!`
        }

        return `Depende sa distance ng route mo sa Batangas:\n\n💰 Base Fare: ₱12 (first 5 km)\n💰 Additional: ₱1 per km after 5 km\n\n🎓 Student/Senior/PWD: 20% discount\n\nExample:\n- 5 km = ₱12\n- 10 km = ₱17\n- 14 km = ₱21\n\nSaan ka ba specifically galing at pupunta? Para ma-compute ko exact fare. 😊`
    }

    // Route-related questions
    if (lowerQuestion.includes('paano') && (lowerQuestion.includes('pumunta') || lowerQuestion.includes('punta'))) {
        // Try to extract destination
        const destination = extractDestinationFromQuestion(lowerQuestion)

        if (destination) {
            const tips = getCommuterTips('Lipa City', destination)
            if (tips) {
                return `Para pumunta sa ${destination}:\n\n💡 ${tips}\n\nSaan ka ba galing? Para mas detailed yung instructions ko including exact fare based on distance. 😊`
            }
        }

        return `Para pumunta dyan sa Batangas, may ilang options ka:\n\n1. Jeep - most common, affordable\n2. UV Express/Van - faster, more comfortable\n3. Bus - for longer routes, may aircon option\n\nSaan ka ba specifically galing at pupunta? Para mas detailed yung instructions ko including exact fare based on distance. 😊`
    }

    // Safety questions
    if (lowerQuestion.includes('safe') || lowerQuestion.includes('ligtas') || lowerQuestion.includes('gabi')) {
        return `Safety tips for commuting in Batangas:\n\n✅ Stick to well-lit terminals\n✅ Keep valuables hidden\n✅ Share your location with family\n✅ Use official terminals (Grand Terminal, etc.)\n✅ Trust your instincts\n\nPag gabi, mas safe ang UV Express. Avoid empty streets. Stay alert! 🛡️`
    }

    // Schedule questions
    if (lowerQuestion.includes('oras') || lowerQuestion.includes('schedule') || lowerQuestion.includes('byahe')) {
        return `Operating hours ng transpo sa Batangas:\n\n🚌 Buses: 4:00 AM - 9:00 PM\n🚐 Jeeps: 5:00 AM - 8:00 PM\n🚐 UV Express/Vans: 5:00 AM - 8:00 PM\n\nRush hours: 6-8 AM & 5-7 PM\n\nBest time to travel: 9 AM - 4 PM 😊`
    }

    // Traffic questions
    if (lowerQuestion.includes('traffic') || lowerQuestion.includes('trapik')) {
        return `Current traffic situation sa Batangas:\n\n🔴 Lipa City Center - Usually congested\n🟡 Batangas City Port Area - Moderate traffic\n🟢 Provincial roads - Generally light\n\nTips:\n- Leave 20-30 mins earlier than usual\n- Check Waze/Google Maps\n- Consider alternative routes\n- Avoid market days (Wednesday/Saturday)!`
    }

    // Distance/fare rule questions
    if (lowerQuestion.includes('distance') || lowerQuestion.includes('distansya') || lowerQuestion.includes('layo')) {
        return `Fare computation sa BiyaHero:\n\n📏 Base Fare: ₱12 for first 5 km\n📏 Additional: ₱1 per km after 5 km\n\nExamples:\n- 1 km → ₱12\n- 5 km → ₱12\n- 6 km → ₱13\n- 10 km → ₱17\n- 14 km → ₱21\n\n🎓 Student/Senior/PWD: 20% discount\n\nWe use actual road distance from OpenStreetMap for accurate fares! 🗺️`
    }

    // Jeep-related questions
    if (lowerQuestion.includes('jeep') || lowerQuestion.includes('dyip')) {
        return `Jeepney tips sa Batangas:\n\n🚐 How to ride:\n1. Wait at designated stops or terminals\n2. Say "Para po" to stop\n3. Pass your fare forward\n4. Say "Bayad po" when paying\n\n💡 Pro tips:\n- Prepare exact change\n- Check the signboard for route\n- Ask "Dadaan ba kayo sa...?"\n- Don't be shy to ask other passengers!\n\n💰 Fare: Based on distance (₱12 base + ₱1/km after 5km)`
    }

    // Lipa-related
    if (lowerQuestion.includes('lipa')) {
        return `Papuntang Lipa City:\n\n🚌 From Manila:\n- DLTB/JAM buses from Buendia/Cubao\n- ₱180-200 fare, 2-3 hours\n\n🚐 Within Batangas:\n- Jeeps from Batangas City\n- UV Express from nearby towns\n- Fare based on distance\n\n💡 Inside Lipa:\n- Jeeps to SM Lipa, City Hall, etc.\n- Tricycles for short distances\n\nLipa is very accessible! 😊`
    }

    // Batangas City-related
    if (lowerQuestion.includes('batangas city') || lowerQuestion.includes('grand terminal')) {
        return `Papuntang Batangas City:\n\n🚌 From Manila:\n- DLTB/JAM buses from Buendia/Cubao\n- ₱200-220 fare, 2.5-3 hours\n\n🚐 Within Batangas:\n- Jeeps from Lipa, Tanauan, etc.\n- UV Express from major towns\n- Fare based on actual distance\n\n💡 Grand Terminal:\n- Main hub for all routes\n- Jeeps to all Batangas towns\n- Very organized! 🚌`
    }

    // Port-related
    if (lowerQuestion.includes('port') || lowerQuestion.includes('pier')) {
        return `Papuntang Batangas Port:\n\n🚌 From Manila:\n- DLTB/JAM buses (Batangas Port route)\n- ₱200-250 fare, 2.5-3 hours\n\n🚐 From Batangas City:\n- Jeeps from Grand Terminal\n- Tricycles available\n- Fare based on distance\n\n💡 Tip:\n- Arrive 1 hour before ferry departure\n- Bring valid ID\n- Check ferry schedules! ⛴️`
    }

    // Default response for general questions
    return `Hmm, I can help you with:\n\n🗺️ Route directions in Batangas\n💰 Distance-based fare estimates\n🚌 Transportation options\n⏰ Schedule information\n🛡️ Safety tips\n📍 Specific location guides\n\nTry asking something like:\n- "Paano pumunta sa Lipa?"\n- "Magkano pamasahe from SM Lipa to Batangas City?"\n- "Safe ba mag-commute ng gabi?"\n- "Gaano kalayo from Lipa to Tanauan?"\n\nAno ba specifically ang gusto mong malaman? 😊`
}

// Helper function to extract fare information from question (async)
const extractFareFromQuestion = async (question) => {
    // Common location patterns
    const locations = [
        'sm lipa', 'rosario', 'san juan', 'antipolo', 'robinsons',
        'lipa bayan', 'lipa city', 'batangas city', 'tanauan', 'batangas port',
        'grand terminal', 'cathedral', 'batstate', 'lemery', 'nasugbu',
        'balayan', 'malvar', 'santo tomas', 'taal', 'de la salle', 'dlsl',
        'faith colleges', 'lipa city hall', 'padre garcia'
    ]

    let origin = null
    let destination = null

    // Try to find "from X to Y" pattern
    const fromToMatch = question.match(/from\s+([a-z\s]+)\s+to\s+([a-z\s]+)/)
    if (fromToMatch) {
        origin = fromToMatch[1].trim()
        destination = fromToMatch[2].trim()
    }

    // Try to find "papunta/papuntang X" pattern
    const papuntaMatch = question.match(/papunta(?:ng)?\s+(?:sa\s+)?([a-z\s]+)/)
    if (papuntaMatch && !destination) {
        destination = papuntaMatch[1].trim()
    }

    // Try to find locations in the question
    if (!origin || !destination) {
        const foundLocations = locations.filter(loc => question.includes(loc))
        if (foundLocations.length >= 2) {
            origin = foundLocations[0]
            destination = foundLocations[1]
        } else if (foundLocations.length === 1) {
            destination = foundLocations[0]
            origin = 'lipa city' // Default origin
        }
    }

    if (origin && destination) {
        try {
            const routeData = await getRouteByNames(origin, destination)
            if (routeData.success) {
                const fareInfo = getFareForAI(routeData.distance)
                return {
                    success: true,
                    origin,
                    destination,
                    ...fareInfo
                }
            }
        } catch (error) {
            console.error('Fare extraction error:', error)
        }
    }

    return { success: false }
}

// Helper function to extract destination from question
const extractDestinationFromQuestion = (question) => {
    const locations = [
        'sm lipa', 'rosario', 'san juan', 'antipolo', 'robinsons',
        'lipa bayan', 'lipa city', 'batangas city', 'tanauan', 'batangas port',
        'grand terminal', 'cathedral', 'batstate', 'lemery', 'nasugbu',
        'balayan', 'malvar', 'santo tomas', 'taal', 'de la salle', 'dlsl',
        'faith colleges', 'lipa city hall', 'padre garcia'
    ]

    // Try to find "papunta/papuntang X" pattern
    const papuntaMatch = question.match(/papunta(?:ng)?\s+(?:sa\s+)?([a-z\s]+)/)
    if (papuntaMatch) {
        return papuntaMatch[1].trim()
    }

    // Try to find location in question
    const foundLocation = locations.find(loc => question.includes(loc))
    return foundLocation || null
}

// Export as default
export default getAIResponse
