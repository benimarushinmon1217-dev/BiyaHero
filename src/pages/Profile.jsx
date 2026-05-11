import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Settings, Heart, Clock, Award, Moon, Sun, Bell } from 'lucide-react'

const Profile = () => {
    const [isStudent, setIsStudent] = useState(false)
    const [notifications, setNotifications] = useState(true)

    const savedRoutes = [
        { id: 1, name: 'Home to School', from: 'Lipa City', to: 'Batangas State University', frequency: 'Daily' },
        { id: 2, name: 'Weekend Mall Trip', from: 'Tanauan', to: 'SM Lipa', frequency: 'Weekly' },
        { id: 3, name: 'Work Commute', from: 'Lipa', to: 'Batangas City', frequency: 'Daily' },
    ]

    const recentTrips = [
        { id: 1, route: 'Lipa → SM Lipa', date: 'Today, 8:30 AM', fare: '₱20' },
        { id: 2, route: 'Batangas City → Lipa', date: 'Yesterday, 5:00 PM', fare: '₱35' },
        { id: 3, route: 'Tanauan → Batangas Port', date: '2 days ago', fare: '₱50' },
    ]

    const achievements = [
        { id: 1, icon: '🚌', title: 'Commute Master', description: '50+ trips in Batangas' },
        { id: 2, icon: '💰', title: 'Budget Saver', description: 'Saved ₱1,200 this month' },
        { id: 3, icon: '🌟', title: 'Early Bird', description: '15 morning commutes' },
    ]

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-4xl">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card text-center mb-6"
            >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-full flex items-center justify-center">
                    <User size={48} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-1">Juan Dela Cruz</h1>
                <p className="text-gray-600 dark:text-gray-400">juan.delacruz@email.com</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-cyan-400">87</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Trips</div>
                    </div>
                    <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-cyan-400">₱1,240</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Saved</div>
                    </div>
                </div>
            </motion.div>

            {/* Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Settings size={24} className="mr-2" />
                    Preferences
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                🎓
                            </div>
                            <div>
                                <div className="font-semibold">Student Discount</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Get 20% off on fares</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsStudent(!isStudent)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${isStudent ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <motion.div
                                animate={{ x: isStudent ? 24 : 2 }}
                                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Bell size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <div className="font-semibold">Push Notifications</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Get route alerts</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <motion.div
                                animate={{ x: notifications ? 24 : 2 }}
                                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Saved Routes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mb-6"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Heart size={24} className="mr-2" />
                    Saved Routes
                </h2>
                <div className="space-y-3">
                    {savedRoutes.map((route) => (
                        <div key={route.id} className="glass p-4 rounded-xl hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{route.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                        <MapPin size={14} />
                                        <span>{route.from} → {route.to}</span>
                                    </div>
                                </div>
                                <div className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                                    {route.frequency}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Trips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card mb-6"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Clock size={24} className="mr-2" />
                    Recent Trips
                </h2>
                <div className="space-y-3">
                    {recentTrips.map((trip) => (
                        <div key={trip.id} className="flex items-center justify-between glass p-4 rounded-xl">
                            <div>
                                <div className="font-semibold">{trip.route}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{trip.date}</div>
                            </div>
                            <div className="text-lg font-bold text-primary-600 dark:text-cyan-400">
                                {trip.fare}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Award size={24} className="mr-2" />
                    Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="glass p-4 rounded-xl text-center">
                            <div className="text-4xl mb-2">{achievement.icon}</div>
                            <div className="font-semibold mb-1">{achievement.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default Profile
