import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import RouteResults from './pages/RouteResults'
import AIAssistant from './pages/AIAssistant'
import Alerts from './pages/Alerts'
import Profile from './pages/Profile'
import Features from './pages/Features'

function App() {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/route" element={<RouteResults />} />
                    <Route path="/assistant" element={<AIAssistant />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dev/features" element={<Features />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
