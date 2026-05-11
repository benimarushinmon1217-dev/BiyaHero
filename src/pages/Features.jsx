import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, CheckCircle, Clock, AlertCircle, Zap, Filter } from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import { features, featureCategories, getFeatureStats } from '../data/features'

const Features = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const stats = getFeatureStats()

    const filteredFeatures = features.filter(feature => {
        const categoryMatch = selectedCategory === 'all' || feature.category === selectedCategory
        const statusMatch = selectedStatus === 'all' || feature.status === selectedStatus
        return categoryMatch && statusMatch
    })

    const statusTypes = [
        { id: 'all', name: 'All Features', icon: Filter, color: 'gray' },
        { id: 'Completed', name: 'Completed', icon: CheckCircle, color: 'green' },
        { id: 'In Progress', name: 'In Progress', icon: Clock, color: 'yellow' },
        { id: 'Planned', name: 'Planned', icon: AlertCircle, color: 'blue' },
        { id: 'Mocked/Simulated', name: 'Mocked', icon: Zap, color: 'purple' }
    ]

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Code size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Feature Inventory</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete overview of BiyaHero's implemented features
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Statistics Dashboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-cyan-400">
                        {stats.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Features</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.completed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.inProgress}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.planned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Planned</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-cyan-400">
                        {stats.completionPercentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
                </div>
            </motion.div>

            {/* Overall Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mb-8"
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold">Overall Progress</h2>
                    <span className="text-2xl font-bold text-primary-600 dark:text-cyan-400">
                        {stats.completionPercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.completionPercentage}%` }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="bg-gradient-to-r from-primary-600 to-cyan-500 h-4 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Category Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card mb-8"
            >
                <h2 className="text-xl font-bold mb-4">Progress by Category</h2>
                <div className="space-y-3">
                    {stats.categoryStats.map((cat, index) => (
                        <div key={cat.id}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="font-medium">{cat.name}</span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {cat.completed}/{cat.total} ({cat.percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cat.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                                    className={`bg-gradient-to-r ${cat.color} h-2 rounded-full`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
            >
                {/* Status Filter */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Filter by Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {statusTypes.map((status) => {
                            const Icon = status.icon
                            return (
                                <button
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${selectedStatus === status.id
                                            ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                            : 'glass hover:shadow-md'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{status.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Filter by Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === 'all'
                                    ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                    : 'glass hover:shadow-md'
                                }`}
                        >
                            All Categories
                        </button>
                        {featureCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg'
                                        : 'glass hover:shadow-md'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
            >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredFeatures.length} of {features.length} features
                </p>
            </motion.div>

            {/* Feature Cards Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredFeatures.map((feature, index) => (
                    <FeatureCard key={feature.id} feature={feature} />
                ))}
            </motion.div>

            {/* No Results */}
            {filteredFeatures.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card text-center py-12"
                >
                    <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No features found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Try adjusting your filters to see more results
                    </p>
                </motion.div>
            )}

            {/* Footer Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 card bg-gradient-to-br from-primary-600 to-cyan-500 text-white border-0"
            >
                <h3 className="text-xl font-bold mb-2">Developer Notes</h3>
                <p className="text-white/90 mb-4">
                    This feature inventory system helps track all implemented features, their status,
                    and dependencies. Use this page to understand what's built, what's in progress,
                    and what's planned for BiyaHero.
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        📚 See FEATURES.md for detailed documentation
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        🔧 Backend: server/index.js
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        🎨 UI: Tailwind + Framer Motion
                    </span>
                </div>
            </motion.div>
        </div>
    )
}

export default Features
