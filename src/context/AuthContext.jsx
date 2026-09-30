import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentAccount, loginAccount, registerAccount, updateAccountPreferences } from '../services/accountService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeLocation, setActiveLocation] = useState(null)
    const [generatedRoute, setGeneratedRoute] = useState(null)

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setGeneratedRoute(null)
    }, [])

    useEffect(() => {
        let active = true
        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            return undefined
        }

        getCurrentAccount()
            .then(currentUser => {
                if (active) {
                    setUser(currentUser)
                    localStorage.setItem('user', JSON.stringify(currentUser))
                }
            })
            .catch(() => {
                if (active) logout()
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [logout])

    useEffect(() => {
        window.addEventListener('biyahero:unauthorized', logout)
        return () => window.removeEventListener('biyahero:unauthorized', logout)
    }, [logout])

    const savePreferences = useCallback(async preferences => {
        const savedPreferences = await updateAccountPreferences(preferences)
        const updatedUser = { ...user, ...savedPreferences }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return savedPreferences
    }, [user])

    const authenticate = useCallback(async (action, details) => {
        const result = action === 'register'
            ? await registerAccount(details)
            : await loginAccount(details)
        localStorage.setItem('token', result.accessToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        setUser(result.user)
        return result.user
    }, [])

    const value = useMemo(() => ({
        user,
        loading,
        isAuthenticated: Boolean(user),
        activeLocation,
        setActiveLocation,
        generatedRoute,
        setGeneratedRoute,
        savePreferences,
        login: details => authenticate('login', details),
        register: details => authenticate('register', details),
        logout,
        setUser
    }), [user, loading, authenticate, logout, activeLocation, generatedRoute, savePreferences])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
