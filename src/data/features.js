// Complete feature inventory for BiyaHero
export const featureCategories = [
    {
        id: 'navigation',
        name: 'Navigation & Routing',
        icon: '🗺️',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'fare',
        name: 'Fare Estimation',
        icon: '💰',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'ai',
        name: 'AI Assistant',
        icon: '🤖',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'maps',
        name: 'Maps & Geolocation',
        icon: '📍',
        color: 'from-red-500 to-orange-500'
    },
    {
        id: 'alerts',
        name: 'Alerts & Notifications',
        icon: '🚨',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'preferences',
        name: 'User Preferences',
        icon: '⚙️',
        color: 'from-gray-500 to-slate-500'
    },
    {
        id: 'accessibility',
        name: 'Accessibility',
        icon: '♿',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        id: 'uiux',
        name: 'UI/UX Enhancements',
        icon: '🎨',
        color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'backend',
        name: 'Backend Services',
        icon: '🔧',
        color: 'from-teal-500 to-cyan-500'
    },
    {
        id: 'api',
        name: 'API Integrations',
        icon: '🔌',
        color: 'from-violet-500 to-purple-500'
    }
]

export const features = [
    // Navigation & Routing
    {
        id: 'smart-route-finder',
        category: 'navigation',
        name: 'Smart Route Finder',
        description: 'Intelligent route finding with multiple optimization options',
        status: 'Completed',
        completion: 100,
        apis: ['Nominatim', 'Custom Algorithm'],
        components: ['RouteResults.jsx', 'SearchBar.jsx', 'RouteMap.jsx'],
        backend: '/api/routes',
        dependencies: ['React Router', 'Framer Motion'],
        features: [
            'Multiple route options',
            'Step-by-step instructions',
            'Transfer guidance',
            'Time estimates'
        ]
    },
    {
        id: 'route-visualization',
        category: 'navigation',
        name: 'Route Visualization',
        description: 'Interactive map with custom markers and smooth polylines',
        status: 'Completed',
        completion: 100,
        apis: ['OpenStreetMap', 'Nominatim'],
        components: ['RouteMap.jsx'],
        backend: 'Leaflet.js',
        dependencies: ['Leaflet', 'OpenStreetMap'],
        features: [
            'Custom markers',
            'Smooth polylines',
            'Auto-zoom',
            'Interactive controls'
        ]
    },
    {
        id: 'popular-routes',
        category: 'navigation',
        name: 'Popular Routes Quick Access',
        description: 'Pre-configured Batangas routes for quick selection',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['LandingPage.jsx'],
        backend: 'Static data',
        dependencies: [],
        features: [
            'One-click selection',
            'Batangas-specific',
            'Visual cards',
            'Instant navigation'
        ]
    },
    {
        id: 'multi-transfer',
        category: 'navigation',
        name: 'Multi-Transfer Planning',
        description: 'Handle routes with multiple transportation transfers',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx'],
        backend: 'routeGenerator.js',
        dependencies: [],
        features: [
            'Transfer points',
            'Transfer instructions',
            'Waiting times',
            'Transfer tips'
        ]
    },
    {
        id: 'realtime-updates',
        category: 'navigation',
        name: 'Real-time Route Updates',
        description: 'Dynamic route updates based on traffic',
        status: 'In Progress',
        completion: 40,
        apis: ['OpenRouteService (planned)', 'Traffic API (planned)'],
        components: ['RouteResults.jsx'],
        backend: 'Pending',
        dependencies: ['OpenRouteService'],
        features: [
            'Live traffic',
            'Dynamic rerouting',
            'ETA updates',
            'Delay notifications'
        ]
    },

    // Fare Estimation
    {
        id: 'fare-calculator',
        category: 'fare',
        name: 'Fare Calculator',
        description: 'Accurate fare calculation for Batangas transportation',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx'],
        backend: 'routeGenerator.js',
        dependencies: [],
        features: [
            'Per-vehicle breakdown',
            'Total trip cost',
            'Multiple fare types',
            'Real-time calculation'
        ]
    },
    {
        id: 'student-discount',
        category: 'fare',
        name: 'Student Fare Discount',
        description: '20% discount calculation for students',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx', 'Profile.jsx'],
        backend: 'Client-side calculation',
        dependencies: [],
        features: [
            'Automatic discount',
            'ID verification UI',
            'Discounted display'
        ]
    },
    {
        id: 'senior-pwd-discount',
        category: 'fare',
        name: 'Senior/PWD Discount',
        description: '20% discount for seniors and PWD',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx'],
        backend: 'Client-side calculation',
        dependencies: [],
        features: [
            'Multiple discount types',
            'Toggle selection',
            'Real-time updates'
        ]
    },
    {
        id: 'fare-selector',
        category: 'fare',
        name: 'Fare Type Selector',
        description: 'Interactive fare type selection',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx'],
        backend: 'Client-side',
        dependencies: [],
        features: [
            'Visual cards',
            'Instant recalculation',
            'Clear indicators'
        ]
    },

    // AI Assistant
    {
        id: 'taglish-ai',
        category: 'ai',
        name: 'Taglish AI Assistant',
        description: 'Natural language AI for commuting questions',
        status: 'Completed',
        completion: 100,
        apis: ['Pattern Matching'],
        components: ['AIAssistant.jsx'],
        backend: 'aiResponses.js',
        dependencies: ['Framer Motion'],
        features: [
            'Taglish conversation',
            'Batangas knowledge',
            'Route guidance',
            'Safety tips'
        ]
    },
    {
        id: 'suggested-prompts',
        category: 'ai',
        name: 'Suggested Prompts',
        description: 'Pre-configured question suggestions',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['AIAssistant.jsx'],
        backend: 'Static data',
        dependencies: [],
        features: [
            'Common questions',
            'One-click prompts',
            'Contextual suggestions'
        ]
    },
    {
        id: 'chat-history',
        category: 'ai',
        name: 'Chat History',
        description: 'Persistent chat conversation display',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['AIAssistant.jsx'],
        backend: 'Client-side state',
        dependencies: [],
        features: [
            'Message history',
            'Timestamps',
            'Auto-scroll',
            'Typing indicator'
        ]
    },

    // Maps & Geolocation
    {
        id: 'current-location',
        category: 'maps',
        name: 'Current Location Detection',
        description: 'One-click GPS location detection',
        status: 'Completed',
        completion: 100,
        apis: ['Geolocation API', 'Nominatim'],
        components: ['SearchBar.jsx'],
        backend: 'Browser API',
        dependencies: ['Browser Geolocation'],
        features: [
            'GPS detection',
            'Permission handling',
            'High accuracy',
            'Error messages'
        ]
    },
    {
        id: 'reverse-geocoding',
        category: 'maps',
        name: 'Reverse Geocoding',
        description: 'Convert coordinates to addresses',
        status: 'Completed',
        completion: 100,
        apis: ['Nominatim'],
        components: ['SearchBar.jsx', 'RouteMap.jsx'],
        backend: 'OpenStreetMap',
        dependencies: [],
        features: [
            'Coordinate conversion',
            'Batangas-focused',
            'Fallback handling'
        ]
    },
    {
        id: 'interactive-map',
        category: 'maps',
        name: 'Interactive Map Display',
        description: 'Full-featured map with Leaflet.js',
        status: 'Completed',
        completion: 100,
        apis: ['OpenStreetMap'],
        components: ['RouteMap.jsx'],
        backend: 'Leaflet.js',
        dependencies: ['Leaflet'],
        features: [
            'Zoom controls',
            'Pan navigation',
            'Marker popups',
            'Touch support'
        ]
    },
    {
        id: 'custom-markers',
        category: 'maps',
        name: 'Custom Map Markers',
        description: 'Professional animated markers',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteMap.jsx'],
        backend: 'CSS/Leaflet',
        dependencies: [],
        features: [
            'Pulsing user location',
            'Gradient pins',
            'Shadow effects',
            'Emoji indicators'
        ]
    },
    {
        id: 'route-polyline',
        category: 'maps',
        name: 'Route Polyline Rendering',
        description: 'Smooth route path visualization',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteMap.jsx'],
        backend: 'Leaflet.js',
        dependencies: [],
        features: [
            'Curved paths',
            'Dual-layer rendering',
            'Gradient colors',
            'Smooth interpolation'
        ]
    },
    {
        id: 'auto-zoom',
        category: 'maps',
        name: 'Auto-Zoom to Route',
        description: 'Automatic bounds adjustment',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteMap.jsx'],
        backend: 'Leaflet.js',
        dependencies: [],
        features: [
            'Bounds calculation',
            'Padding adjustment',
            'Max zoom limits',
            'Smooth transitions'
        ]
    },

    // Alerts & Notifications
    {
        id: 'traffic-advisory',
        category: 'alerts',
        name: 'Traffic Advisory System',
        description: 'Real-time traffic and route advisories',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Alerts.jsx'],
        backend: '/api/alerts',
        dependencies: [],
        features: [
            'Traffic updates',
            'Road closures',
            'Weather alerts',
            'Service announcements'
        ]
    },
    {
        id: 'alert-dashboard',
        category: 'alerts',
        name: 'Alert Statistics Dashboard',
        description: 'Visual summary of active alerts',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Alerts.jsx'],
        backend: 'Client-side',
        dependencies: [],
        features: [
            'Alert count by type',
            'Color-coded categories',
            'Quick overview'
        ]
    },
    {
        id: 'alert-categorization',
        category: 'alerts',
        name: 'Alert Categorization',
        description: 'Organized alert display',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Alerts.jsx'],
        backend: 'Client-side',
        dependencies: [],
        features: [
            'Color-coded badges',
            'Icon indicators',
            'Timestamp display',
            'Location tags'
        ]
    },

    // User Preferences
    {
        id: 'saved-routes',
        category: 'preferences',
        name: 'Saved Routes',
        description: 'Save frequently used routes',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Profile.jsx'],
        backend: 'Local storage',
        dependencies: [],
        features: [
            'Route naming',
            'Frequency tracking',
            'Quick access',
            'Route management'
        ]
    },
    {
        id: 'student-toggle',
        category: 'preferences',
        name: 'Student Discount Toggle',
        description: 'Enable/disable student status',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Profile.jsx'],
        backend: 'Local storage',
        dependencies: [],
        features: [
            'Toggle switch',
            'Persistent preference',
            'Visual indicator'
        ]
    },
    {
        id: 'notification-prefs',
        category: 'preferences',
        name: 'Notification Preferences',
        description: 'Control push notifications',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Profile.jsx'],
        backend: 'Local storage',
        dependencies: [],
        features: [
            'Enable/disable',
            'Toggle switch',
            'Preference storage'
        ]
    },
    {
        id: 'trip-history',
        category: 'preferences',
        name: 'Trip History',
        description: 'View past commute history',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['Profile.jsx'],
        backend: 'Mock data',
        dependencies: [],
        features: [
            'Recent trips list',
            'Fare tracking',
            'Date/time stamps',
            'Route details'
        ]
    },

    // Accessibility
    {
        id: 'dark-mode',
        category: 'accessibility',
        name: 'Dark Mode',
        description: 'Full dark mode support',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All components', 'App.jsx', 'Navbar.jsx'],
        backend: 'Tailwind CSS',
        dependencies: ['Tailwind'],
        features: [
            'System-wide theme',
            'Toggle switch',
            'Persistent preference',
            'Smooth transitions'
        ]
    },
    {
        id: 'mobile-responsive',
        category: 'accessibility',
        name: 'Mobile Responsiveness',
        description: 'Fully responsive design',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All components'],
        backend: 'Tailwind CSS',
        dependencies: [],
        features: [
            'Mobile-first design',
            'Breakpoint optimization',
            'Touch-friendly',
            'Bottom navigation'
        ]
    },
    {
        id: 'keyboard-nav',
        category: 'accessibility',
        name: 'Keyboard Navigation',
        description: 'Full keyboard accessibility',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All interactive elements'],
        backend: 'HTML/React',
        dependencies: [],
        features: [
            'Tab navigation',
            'Enter key submission',
            'Escape handling',
            'Focus indicators'
        ]
    },

    // UI/UX Enhancements
    {
        id: 'glassmorphism',
        category: 'uiux',
        name: 'Glassmorphism Design',
        description: 'Modern frosted glass effect',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All components'],
        backend: 'CSS',
        dependencies: ['Tailwind'],
        features: [
            'Backdrop blur',
            'Transparency',
            'Border effects',
            'Layered depth'
        ]
    },
    {
        id: 'smooth-animations',
        category: 'uiux',
        name: 'Smooth Animations',
        description: '60 FPS animations',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All pages'],
        backend: 'Framer Motion',
        dependencies: ['Framer Motion'],
        features: [
            'Page transitions',
            'Hover effects',
            'Loading states',
            'Micro-interactions'
        ]
    },
    {
        id: 'loading-states',
        category: 'uiux',
        name: 'Loading States',
        description: 'Visual feedback during operations',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['RouteResults.jsx', 'SearchBar.jsx', 'RouteMap.jsx'],
        backend: 'React state',
        dependencies: [],
        features: [
            'Spinner animations',
            'Skeleton screens',
            'Progress indicators',
            'Pulsing effects'
        ]
    },
    {
        id: 'error-handling-ui',
        category: 'uiux',
        name: 'Error Handling UI',
        description: 'User-friendly error messages',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['SearchBar.jsx', 'All forms'],
        backend: 'React state',
        dependencies: [],
        features: [
            'Clear messages',
            'Contextual help',
            'Fallback options',
            'Visual indicators'
        ]
    },
    {
        id: 'gradient-branding',
        category: 'uiux',
        name: 'Gradient Branding',
        description: 'Consistent blue-cyan branding',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: ['All components'],
        backend: 'CSS',
        dependencies: ['Tailwind'],
        features: [
            'Brand colors',
            'Gradient buttons',
            'Gradient text',
            'Gradient backgrounds'
        ]
    },

    // Backend Services
    {
        id: 'express-api',
        category: 'backend',
        name: 'Express API Server',
        description: 'Node.js + Express backend',
        status: 'Completed',
        completion: 100,
        apis: [],
        components: [],
        backend: 'server/index.js',
        dependencies: ['Express', 'CORS'],
        features: [
            'Health check endpoint',
            'Routes endpoint',
            'AI chat endpoint',
            'Alerts endpoint'
        ]
    },
    {
        id: 'database',
        category: 'backend',
        name: 'Database Integration',
        description: 'Firebase/Supabase integration',
        status: 'In Progress',
        completion: 30,
        apis: ['Firebase (planned)', 'Supabase (planned)'],
        components: [],
        backend: 'Pending',
        dependencies: ['Firebase/Supabase'],
        features: [
            'User authentication',
            'Saved routes storage',
            'Trip history',
            'Preferences sync'
        ]
    },

    // API Integrations
    {
        id: 'nominatim',
        category: 'api',
        name: 'OpenStreetMap (Nominatim)',
        description: 'Geocoding service',
        status: 'Completed',
        completion: 100,
        apis: ['Nominatim'],
        components: ['SearchBar.jsx', 'RouteMap.jsx'],
        backend: 'External API',
        dependencies: [],
        features: [
            'Address to coordinates',
            'Coordinates to address',
            'Location search'
        ]
    },
    {
        id: 'geolocation',
        category: 'api',
        name: 'Browser Geolocation API',
        description: 'Native GPS detection',
        status: 'Completed',
        completion: 100,
        apis: ['Geolocation API'],
        components: ['SearchBar.jsx'],
        backend: 'Browser API',
        dependencies: [],
        features: [
            'High accuracy mode',
            'Permission handling',
            'Error handling',
            'Timeout config'
        ]
    },
    {
        id: 'openrouteservice',
        category: 'api',
        name: 'OpenRouteService',
        description: 'Advanced routing service',
        status: 'Planned',
        completion: 0,
        apis: ['OpenRouteService (planned)'],
        components: ['RouteMap.jsx'],
        backend: 'External API',
        dependencies: ['API Key needed'],
        features: [
            'Turn-by-turn directions',
            'Traffic consideration',
            'Multiple transport modes',
            'Route optimization'
        ]
    }
]

// Calculate statistics
export const getFeatureStats = () => {
    const total = features.length
    const completed = features.filter(f => f.status === 'Completed').length
    const inProgress = features.filter(f => f.status === 'In Progress').length
    const planned = features.filter(f => f.status === 'Planned').length
    const mocked = features.filter(f => f.status === 'Mocked/Simulated').length

    const categoryStats = featureCategories.map(cat => {
        const categoryFeatures = features.filter(f => f.category === cat.id)
        const completedInCategory = categoryFeatures.filter(f => f.status === 'Completed').length

        return {
            ...cat,
            total: categoryFeatures.length,
            completed: completedInCategory,
            percentage: categoryFeatures.length > 0
                ? Math.round((completedInCategory / categoryFeatures.length) * 100)
                : 0
        }
    })

    return {
        total,
        completed,
        inProgress,
        planned,
        mocked,
        completionPercentage: Math.round((completed / total) * 100),
        categoryStats
    }
}
