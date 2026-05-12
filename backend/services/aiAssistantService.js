/**
 * AI Assistant Service
 * Intelligent commuter assistance with pattern matching
 */

import { calculateFare } from '../utils/fareCalculator.js';

/**
 * Knowledge base for Batangas transportation
 */
const KNOWLEDGE_BASE = {
    greetings: [
        'Hello! Ako si BiyaHero, your smart commute assistant. Paano kita matutulungan today?',
        'Hi there! Ready to help you navigate Batangas. Ano ang destination mo?',
        'Kumusta! I\'m here to make your commute easier. What can I help you with?'
    ],

    routes: {
        'lipa to batangas': {
            response: 'From Lipa City to Batangas City, you can take a bus from Lipa Grand Terminal. Travel time is around 45-60 minutes. Fare is approximately ₱50-70 depending on the bus type.',
            distance: 32
        },
        'sm lipa to batangas': {
            response: 'From SM Lipa to Batangas City, take a jeepney to Lipa Grand Terminal first, then board a Batangas-bound bus. Total travel time: 1-1.5 hours.',
            distance: 35
        },
        'tanauan to lipa': {
            response: 'From Tanauan to Lipa, you can take a jeepney or UV Express. Travel time is 20-30 minutes. Fare is around ₱25-35.',
            distance: 15
        }
    },

    terminals: {
        'lipa grand terminal': 'Lipa Grand Terminal is the main bus terminal in Lipa City. Located along P. Zamora Street. Buses to Manila, Batangas City, and other destinations depart here.',
        'batangas grand terminal': 'Batangas Grand Terminal is the main transportation hub in Batangas City. Located in Barangay Alangilan. Buses to Manila and provincial routes available.',
        'batangas port': 'Batangas Port (Batangas International Port) is accessible via jeepney or tricycle from Batangas Grand Terminal. Travel time: 15-20 minutes.'
    },

    transportTypes: {
        'jeepney': 'Jeepneys are the most common mode of transport in Batangas. Base fare starts at ₱12 for the first 5km, then ₱1 per additional kilometer.',
        'bus': 'Buses connect major cities in Batangas and to Manila. Air-conditioned buses are more expensive but more comfortable.',
        'tricycle': 'Tricycles are good for short distances within municipalities. Fare is usually negotiable, typically ₱10-50 depending on distance.',
        'uv express': 'UV Express vans offer faster, more comfortable travel between cities. Fares are higher than jeepneys but lower than taxis.'
    },

    tips: [
        'Always have exact change ready for jeepney fares.',
        'During rush hours (7-9 AM, 5-7 PM), expect longer travel times.',
        'Students, seniors, and PWDs get 20% discount on fares.',
        'Keep your belongings secure, especially in crowded vehicles.',
        'Ask the driver or conductor if unsure about the route.'
    ]
};

/**
 * Generate AI response based on user message
 * @param {string} userMessage - User's question or message
 * @param {Object} context - Additional context (location, user info, etc.)
 * @returns {Promise<Object>} AI response
 */
export const generateResponse = async (userMessage, context = {}) => {
    const startTime = Date.now();
    const messageLower = userMessage.toLowerCase();

    let response = '';
    let responseType = 'general';

    // Check for greetings
    if (isGreeting(messageLower)) {
        response = getRandomItem(KNOWLEDGE_BASE.greetings);
        responseType = 'greeting';
    }
    // Check for route queries
    else if (isRouteQuery(messageLower)) {
        response = handleRouteQuery(messageLower, context);
        responseType = 'route';
    }
    // Check for terminal queries
    else if (isTerminalQuery(messageLower)) {
        response = handleTerminalQuery(messageLower);
        responseType = 'terminal';
    }
    // Check for transport type queries
    else if (isTransportQuery(messageLower)) {
        response = handleTransportQuery(messageLower);
        responseType = 'transport';
    }
    // Check for fare queries
    else if (isFareQuery(messageLower)) {
        response = handleFareQuery(messageLower, context);
        responseType = 'fare';
    }
    // Check for tips request
    else if (isTipsQuery(messageLower)) {
        response = getRandomItem(KNOWLEDGE_BASE.tips);
        responseType = 'tip';
    }
    // Default response
    else {
        response = handleDefaultQuery(messageLower);
        responseType = 'default';
    }

    const responseTime = Date.now() - startTime;

    return {
        response,
        responseType,
        responseTime,
        suggestions: generateSuggestions(responseType)
    };
};

/**
 * Check if message is a greeting
 */
const isGreeting = (message) => {
    const greetings = ['hi', 'hello', 'hey', 'kumusta', 'good morning', 'good afternoon'];
    return greetings.some(greeting => message.includes(greeting));
};

/**
 * Check if message is a route query
 */
const isRouteQuery = (message) => {
    return (message.includes('from') && message.includes('to')) ||
        message.includes('paano pumunta') ||
        message.includes('how to get') ||
        message.includes('route');
};

/**
 * Check if message is about terminals
 */
const isTerminalQuery = (message) => {
    return message.includes('terminal') || message.includes('station');
};

/**
 * Check if message is about transport types
 */
const isTransportQuery = (message) => {
    return message.includes('jeepney') || message.includes('bus') ||
        message.includes('tricycle') || message.includes('uv express');
};

/**
 * Check if message is about fares
 */
const isFareQuery = (message) => {
    return message.includes('fare') || message.includes('magkano') ||
        message.includes('how much') || message.includes('price');
};

/**
 * Check if message is asking for tips
 */
const isTipsQuery = (message) => {
    return message.includes('tip') || message.includes('advice') ||
        message.includes('suggestion');
};

/**
 * Handle route queries
 */
const handleRouteQuery = (message, context) => {
    // Try to match known routes
    for (const [route, data] of Object.entries(KNOWLEDGE_BASE.routes)) {
        if (message.includes(route)) {
            return data.response;
        }
    }

    return 'I can help you find the best route! Please provide your origin and destination, or use the route search feature for detailed directions.';
};

/**
 * Handle terminal queries
 */
const handleTerminalQuery = (message) => {
    for (const [terminal, info] of Object.entries(KNOWLEDGE_BASE.terminals)) {
        if (message.includes(terminal)) {
            return info;
        }
    }

    return 'The main terminals in Batangas are Lipa Grand Terminal and Batangas Grand Terminal. Which one would you like to know about?';
};

/**
 * Handle transport type queries
 */
const handleTransportQuery = (message) => {
    for (const [transport, info] of Object.entries(KNOWLEDGE_BASE.transportTypes)) {
        if (message.includes(transport)) {
            return info;
        }
    }

    return 'In Batangas, you can use jeepneys, buses, tricycles, or UV Express vans. Each has different fare rates and comfort levels.';
};

/**
 * Handle fare queries
 */
const handleFareQuery = (message, context) => {
    if (context.distance) {
        const fare = calculateFare(context.distance, context.passengerType || 'regular');
        return `For a distance of ${context.distance}km, the estimated fare is ₱${fare}. Students, seniors, and PWDs get 20% discount.`;
    }

    return 'Jeepney base fare is ₱12 for the first 5km, then ₱1 per additional kilometer. Students, seniors, and PWDs get 20% discount.';
};

/**
 * Handle default queries
 */
const handleDefaultQuery = (message) => {
    return 'I\'m here to help with your commute in Batangas! You can ask me about routes, fares, terminals, or transportation tips. What would you like to know?';
};

/**
 * Generate follow-up suggestions
 */
const generateSuggestions = (responseType) => {
    const suggestions = {
        greeting: [
            'How do I get to Batangas City?',
            'What\'s the fare from Lipa to Batangas?',
            'Tell me about Lipa Grand Terminal'
        ],
        route: [
            'How much is the fare?',
            'What\'s the travel time?',
            'Are there alternative routes?'
        ],
        fare: [
            'Do students get discounts?',
            'What about senior citizens?',
            'How is the fare calculated?'
        ],
        default: [
            'Show me routes from Lipa',
            'What are the main terminals?',
            'Give me commuting tips'
        ]
    };

    return suggestions[responseType] || suggestions.default;
};

/**
 * Get random item from array
 */
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export default {
    generateResponse
};
