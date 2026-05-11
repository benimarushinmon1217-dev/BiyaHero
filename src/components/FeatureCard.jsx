import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react'

const FeatureCard = ({ feature }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle size={20} className="text-green-500" />
            case 'In Progress':
                return <Clock size={20} className="text-yellow-500" />
            case 'Planned':
                return <AlertCircle size={20} className="text-blue-500" />
            case 'Mocked/Simulated':
                return <Zap size={20} className="text-purple-500" />
            default:
                return <AlertCircle size={20} className="text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            case 'Planned':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            case 'Mocked/Simulated':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="card"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{feature.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                    </p>
                </div>
                <div className="ml-3">
                    {getStatusIcon(feature.status)}
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(feature.status)}`}>
                    {feature.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.completion}% Complete
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.completion}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-primary-600 to-cyan-500 h-2 rounded-full"
                />
            </div>

            {/* Features List */}
            {feature.features && feature.features.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Key Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {feature.features.slice(0, 3).map((feat, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded"
                            >
                                {feat}
                            </span>
                        ))}
                        {feature.features.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                +{feature.features.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* APIs Used */}
            {feature.apis && feature.apis.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        APIs:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {feature.apis.map((api, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded"
                            >
                                {api}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Components */}
            {feature.components && feature.components.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Components:
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        {feature.components.slice(0, 2).join(', ')}
                        {feature.components.length > 2 && ` +${feature.components.length - 2} more`}
                    </div>
                </div>
            )}

            {/* Backend */}
            {feature.backend && (
                <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Backend:
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {feature.backend}
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default FeatureCard
