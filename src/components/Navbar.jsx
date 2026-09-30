import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Map, MessageCircle, Bell, User, Moon, Sun, Wallet, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ darkMode, setDarkMode }) => {
    const location = useLocation()
    const { logout, generatedRoute } = useAuth()

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/route', icon: Map, label: 'Routes' },
        { path: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
        { path: '/alerts', icon: Bell, label: 'Alerts' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/fare-calculator', icon: Wallet, label: 'Fares' },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-strong sticky top-0 z-50 shadow-lg"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-cyan-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                            BiyaHero
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.filter(item => item.path !== '/route' || Boolean(generatedRoute)).map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative px-4 py-2 rounded-lg transition-all"
                                >
                                    <div className={`flex items-center space-x-2 ${isActive ? 'text-primary-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-cyan-400'}`}>
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-cyan-500"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg glass hover:shadow-lg transition-all"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button type="button" onClick={logout} className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                            <LogOut size={17} /><span>Log out</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-gray-200 dark:border-gray-700 pb-safe">
                    <div className="flex items-center justify-around py-1">
                        {navItems.filter(item => item.path !== '/route' || Boolean(generatedRoute)).map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex flex-col items-center space-y-1 px-3 py-2"
                                >
                                    <Icon
                                        size={24}
                                        className={isActive ? 'text-primary-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-400'}
                                    />
                                    <span className={`text-[10px] ${isActive ? 'text-primary-600 dark:text-cyan-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                    <button type="button" onClick={logout} className="w-full border-t border-gray-200 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">Log out</button>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
