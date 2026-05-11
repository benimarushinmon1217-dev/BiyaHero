import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, MessageCircle, Zap, Clock, Shield, TrendingUp } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { getTrendingDestinations, getPopularByCategory } from '../services/searchService'

const LandingPage = () => {
    const navigate = useNavigate()

    // Get popular destinations
    const trendingDestinations = getTrendingDestinations(12)
    const popularMalls = getPopularByCategory('mall', 4)
    const popularSchools = getPopularByCategory('school', 4)

    const features = [
        {
            icon: MapPin,
            title: 'Smart Routes',
            description: 'Find the best commute paths with step-by-step guidance',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: DollarSign,
            title: 'Fare Calculator',
            description: 'Know exact costs including student and senior discounts',
            color: 'from-cyan-500 to-teal-500'
        },
        {
            icon: MessageCircle,
            title: 'AI Assistant',
            description: 'Ask anything about your commute in natural language',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Get traffic alerts and route advisories instantly',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Clock,
            title: 'Time Estimates',
            description: 'Accurate travel duration predictions',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Safety Tips',
            description: 'Commuter safety information and guidance',
            color: 'from-indigo-500 to-purple-500'
        }
    ]

    const quickActions = [
        { label: 'SM Lipa to Batangas City', from: 'SM City Lipa', to: 'Batangas City Grand Terminal' },
        { label: 'Tanauan to Lipa', from: 'Tanauan City Hall', to: 'Lipa City Center' },
        { label: 'Lemery to Batangas Port', from: 'Lemery Public Market', to: 'Batangas Port' },
        { label: 'Balayan to Nasugbu', from: 'Balayan Town Plaza', to: 'Nasugbu Beach' }
    ]

    const handleQuickAction = (from, to) => {
        navigate('/route', { state: { origin: from, destination: to } })
    }

    const handleDestinationClick = (destination) => {
        // Navigate to search with pre-filled destination
        navigate('/', { state: { prefilledDestination: destination } })
        // Scroll to search bar
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-6"
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                        <MapPin size={48} className="text-white" />
                    </div>
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600 bg-clip-text text-transparent">
                    BiyaHero
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
                    Your AI-Powered Commuting Companion
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Navigate Batangas public transportation with confidence. Get smart routes, fare estimates, and real-time assistance.
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto mb-12"
            >
                <SearchBar />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-4xl mx-auto mb-16"
            >
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Popular Routes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickAction(action.from, action.to)}
                            className="card text-left hover:border-primary-500 dark:hover:border-cyan-500 transition-all"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900 dark:to-cyan-900 rounded-lg flex items-center justify-center">
                                    <MapPin size={20} className="text-primary-600 dark:text-cyan-400" />
                                </div>
                                <span className="font-medium">{action.label}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Popular Destinations Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="max-w-6xl mx-auto mb-16"
            >
                <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="text-primary-600 dark:text-cyan-400" size={24} />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Popular Destinations
                    </h3>
                </div>

                {/* Trending Destinations Chips */}
                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Trending Now
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {trendingDestinations.map((dest, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDestinationClick(dest.name)}
                                className="px-4 py-2 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/30 dark:to-cyan-900/30 hover:from-primary-100 hover:to-cyan-100 dark:hover:from-primary-900/50 dark:hover:to-cyan-900/50 rounded-full border border-primary-200 dark:border-primary-700 transition-all flex items-center space-x-2"
                            >
                                <span className="text-lg">{dest.icon}</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-white">
                                    {dest.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Category-based Popular Destinations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Popular Malls */}
                    <div className="card">
                        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <span className="text-2xl">🛍️</span>
                            <span>Shopping Centers</span>
                        </h4>
                        <div className="space-y-2">
                            {popularMalls.map((mall, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    onClick={() => handleDestinationClick(mall.name)}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-between group"
                                >
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-cyan-400">
                                        {mall.name}
                                    </span>
                                    <MapPin size={16} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-cyan-400" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Schools */}
                    <div className="card">
                        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <span className="text-2xl">🎓</span>
                            <span>Schools & Universities</span>
                        </h4>
                        <div className="space-y-2">
                            {popularSchools.map((school, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    onClick={() => handleDestinationClick(school.name)}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors flex items-center justify-between group"
                                >
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                                        {school.name}
                                    </span>
                                    <MapPin size={16} className="text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16"
            >
                <h2 className="text-3xl font-bold text-center mb-8">
                    Everything You Need for Stress-Free Commuting
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                                className="card"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
            >
                <div className="card max-w-2xl mx-auto bg-gradient-to-br from-primary-600 to-cyan-500 text-white border-0">
                    <h2 className="text-3xl font-bold mb-4">Ready to Commute Smarter?</h2>
                    <p className="text-lg mb-6 text-white/90">
                        Join thousands of Batangueños who travel with confidence every day
                    </p>
                    <button
                        onClick={() => navigate('/assistant')}
                        className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                        Try AI Assistant Now
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default LandingPage
