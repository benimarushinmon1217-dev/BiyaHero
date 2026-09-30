import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center" role="status">
                <span className="text-gray-600 dark:text-gray-300">Checking your session…</span>
            </div>
        )
    }
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
    return children
}

export default ProtectedRoute
