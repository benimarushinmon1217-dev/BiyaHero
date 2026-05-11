// Intelligent Search Service for BiyaHero
// Provides fuzzy matching, typo tolerance, and smart location search

import { BATANGAS_LOCATIONS, getCategoryIcon, getCategoryLabel } from '../data/batangasLocations'

/**
 * Calculate Levenshtein distance for fuzzy matching
 * Measures similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
const levenshteinDistance = (str1, str2) => {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    const len1 = s1.length
    const len2 = s2.length

    const matrix = []

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i]
    }

    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                )
            }
        }
    }

    return matrix[len2][len1]
}

/**
 * Calculate similarity score between query and location
 * Higher score = better match
 * @param {string} query - Search query
 * @param {object} location - Location object
 * @returns {number} Similarity score (0-100)
 */
const calculateSimilarity = (query, location) => {
    const q = query.toLowerCase().trim()
    const name = location.name.toLowerCase()
    const aliases = location.aliases.map(a => a.toLowerCase())

    // Exact match - highest priority
    if (name === q || aliases.includes(q)) {
        return 100 + location.priority
    }

    // Starts with query - very high priority
    if (name.startsWith(q) || aliases.some(a => a.startsWith(q))) {
        return 90 + location.priority
    }

    // Contains query - high priority
    if (name.includes(q) || aliases.some(a => a.includes(q))) {
        return 80 + location.priority
    }

    // Fuzzy matching - check edit distance
    const nameDistance = levenshteinDistance(q, name)
    const aliasDistances = aliases.map(a => levenshteinDistance(q, a))
    const minDistance = Math.min(nameDistance, ...aliasDistances)

    // Allow up to 2 character differences for typo tolerance
    if (minDistance <= 2) {
        return 70 - (minDistance * 10) + location.priority
    }

    // Word-level matching (for multi-word queries)
    const queryWords = q.split(/\s+/)
    const nameWords = name.split(/\s+/)
    const aliasWords = aliases.flatMap(a => a.split(/\s+/))

    const wordMatches = queryWords.filter(qw =>
        nameWords.some(nw => nw.includes(qw) || qw.includes(nw)) ||
        aliasWords.some(aw => aw.includes(qw) || qw.includes(aw))
    ).length

    if (wordMatches > 0) {
        return 50 + (wordMatches * 10) + location.priority
    }

    return 0
}

/**
 * Search locations with intelligent matching
 * @param {string} query - Search query
 * @param {number} limit - Maximum results (default: 10)
 * @param {string} categoryFilter - Optional category filter
 * @returns {Array} Sorted array of matching locations
 */
export const searchLocations = (query, limit = 10, categoryFilter = null) => {
    if (!query || query.trim().length === 0) {
        return []
    }

    // Calculate similarity scores for all locations
    const results = BATANGAS_LOCATIONS
        .map(location => ({
            ...location,
            score: calculateSimilarity(query, location),
            icon: getCategoryIcon(location.category),
            categoryLabel: getCategoryLabel(location.category)
        }))
        .filter(location => location.score > 0) // Only include matches
        .filter(location => !categoryFilter || location.category === categoryFilter) // Apply category filter
        .sort((a, b) => b.score - a.score) // Sort by score (highest first)
        .slice(0, limit) // Limit results

    return results
}

/**
 * Get autocomplete suggestions
 * Optimized for fast, real-time suggestions
 * @param {string} query - Search query
 * @param {number} limit - Maximum suggestions (default: 5)
 * @returns {Array} Autocomplete suggestions
 */
export const getAutocompleteSuggestions = (query, limit = 5) => {
    if (!query || query.trim().length < 2) {
        return []
    }

    return searchLocations(query, limit)
}

/**
 * Get popular destinations by category
 * @param {string} category - Category filter
 * @param {number} limit - Maximum results
 * @returns {Array} Popular locations
 */
export const getPopularByCategory = (category, limit = 5) => {
    return BATANGAS_LOCATIONS
        .filter(loc => loc.category === category)
        .sort((a, b) => b.priority - a.priority)
        .slice(0, limit)
        .map(location => ({
            ...location,
            icon: getCategoryIcon(location.category),
            categoryLabel: getCategoryLabel(location.category)
        }))
}

/**
 * Get all locations by category
 * @param {string} category - Category name
 * @returns {Array} Locations in category
 */
export const getLocationsByCategory = (category) => {
    return BATANGAS_LOCATIONS
        .filter(loc => loc.category === category)
        .sort((a, b) => b.priority - a.priority)
        .map(location => ({
            ...location,
            icon: getCategoryIcon(location.category),
            categoryLabel: getCategoryLabel(location.category)
        }))
}

/**
 * Get location by exact name
 * @param {string} name - Location name
 * @returns {object|null} Location object or null
 */
export const getLocationByName = (name) => {
    const nameLower = name.toLowerCase()
    return BATANGAS_LOCATIONS.find(loc =>
        loc.name.toLowerCase() === nameLower ||
        loc.aliases.some(a => a.toLowerCase() === nameLower)
    )
}

/**
 * Get trending/popular destinations
 * Based on priority scores
 * @param {number} limit - Maximum results
 * @returns {Array} Popular destinations
 */
export const getTrendingDestinations = (limit = 10) => {
    return BATANGAS_LOCATIONS
        .sort((a, b) => b.priority - a.priority)
        .slice(0, limit)
        .map(location => ({
            ...location,
            icon: getCategoryIcon(location.category),
            categoryLabel: getCategoryLabel(location.category)
        }))
}

/**
 * Get nearby locations (placeholder for future geolocation feature)
 * @param {object} coords - {lat, lng}
 * @param {number} limit - Maximum results
 * @returns {Array} Nearby locations
 */
export const getNearbyLocations = (coords, limit = 5) => {
    // For now, return popular destinations
    // In future, can calculate actual distance
    return getTrendingDestinations(limit)
}

/**
 * Validate if search query is likely a valid location
 * @param {string} query - Search query
 * @returns {boolean} True if likely valid
 */
export const isValidLocationQuery = (query) => {
    if (!query || query.trim().length < 2) {
        return false
    }

    const results = searchLocations(query, 1)
    return results.length > 0 && results[0].score > 50
}

/**
 * Get search suggestions with categories
 * Groups results by category
 * @param {string} query - Search query
 * @returns {object} Grouped suggestions
 */
export const getGroupedSuggestions = (query) => {
    const results = searchLocations(query, 15)

    const grouped = {}
    results.forEach(location => {
        if (!grouped[location.category]) {
            grouped[location.category] = []
        }
        grouped[location.category].push(location)
    })

    return grouped
}

// Export all functions
export default {
    searchLocations,
    getAutocompleteSuggestions,
    getPopularByCategory,
    getLocationsByCategory,
    getLocationByName,
    getTrendingDestinations,
    getNearbyLocations,
    isValidLocationQuery,
    getGroupedSuggestions
}
