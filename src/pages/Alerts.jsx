import { motion } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle, XCircle, Cloud, Construction, Clock } from 'lucide-react'

const Alerts = () => {
    const alerts = [
        {
            id: 1,
            type: 'warning',
            title: 'Heavy Traffic on Lipa-Batangas Road',
            message: 'Expect 20-30 minute delays along Lipa-Batangas Road due to ongoing road repairs near Malvar',
            location: 'Lipa-Batangas Road',
            time: '15 minutes ago',
            icon: AlertTriangle,
            color: 'orange'
        },
        {
            id: 2,
            type: 'info',
            title: 'New Jeepney Route to SM Lipa',
            message: 'Direct jeepney route from Grand Terminal to SM Lipa now available. Fare: ₱20',
            location: 'Lipa City',
            time: '1 hour ago',
            icon: Info,
            color: 'blue'
        },
        {
            id: 3,
            type: 'danger',
            title: 'Road Closure at Tanauan',
            message: 'JP Laurel Highway closed from 10PM-5AM for road widening project',
            location: 'Tanauan City',
            time: '2 hours ago',
            icon: Construction,
            color: 'red'
        },
        {
            id: 4,
            type: 'weather',
            title: 'Heavy Rain Advisory',
            message: 'Expect flooding in low-lying areas of Batangas. Plan alternative routes and allow extra travel time.',
            location: 'Batangas Province',
            time: '3 hours ago',
            icon: Cloud,
            color: 'gray'
        },
        {
            id: 5,
            type: 'success',
            title: 'Traffic Cleared on STAR Tollway',
            message: 'STAR Tollway now passable. Normal travel time resumed from Lipa to Batangas City.',
            location: 'STAR Tollway',
            time: '4 hours ago',
            icon: CheckCircle,
            color: 'green'
        },
        {
            id: 6,
            type: 'info',
            title: 'Extended Bus Operating Hours',
            message: 'DLTB and JAM buses now operate until 10:00 PM on weekends for Manila-Batangas routes',
            location: 'Batangas Grand Terminal',
            time: '5 hours ago',
            icon: Clock,
            color: 'blue'
        }
    ]

    const getAlertStyle = (type) => {
        const styles = {
            warning: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
            danger: 'border-red-500 bg-red-50 dark:bg-red-900/20',
            info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
            success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
            weather: 'border-gray-500 bg-gray-50 dark:bg-gray-800/50'
        }
        return styles[type] || styles.info
    }

    const getIconColor = (color) => {
        const colors = {
            orange: 'text-orange-600 dark:text-orange-400',
            red: 'text-red-600 dark:text-red-400',
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            gray: 'text-gray-600 dark:text-gray-400'
        }
        return colors[color] || colors.blue
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">Commute Alerts</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Stay updated with real-time traffic and route advisories
                </p>
            </motion.div>

            {/* Alert Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="card text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Warnings</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Updates</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">1</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">1</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Weather</div>
                </div>
            </motion.div>

            {/* Alerts List */}
            <div className="space-y-4">
                {alerts.map((alert, index) => {
                    const Icon = alert.icon
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`card border-l-4 ${getAlertStyle(alert.type)}`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getAlertStyle(alert.type)}`}>
                                    <Icon size={24} className={getIconColor(alert.color)} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold">{alert.title}</h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{alert.time}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                            📍 {alert.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Subscribe Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 card bg-gradient-to-br from-primary-600 to-cyan-500 text-white border-0"
            >
                <h2 className="text-2xl font-bold mb-2">Get Instant Notifications</h2>
                <p className="mb-4 text-white/90">
                    Subscribe to alerts for your favorite routes and never miss important updates
                </p>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                    Enable Notifications
                </button>
            </motion.div>
        </div>
    )
}

export default Alerts
