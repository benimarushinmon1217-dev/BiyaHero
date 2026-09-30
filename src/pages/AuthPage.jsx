import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BiyaHeroSelect from '../components/BiyaHeroSelect'

const AuthPage = ({ mode }) => {
    const isSignup = mode === 'signup'
    const { isAuthenticated, login, register } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passengerType: 'regular'
    })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    if (isAuthenticated) return <Navigate to="/" replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            if (isSignup) {
                await register(values)
            } else {
                await login({ email: values.email, password: values.password })
            }
            navigate(location.state?.from?.pathname || '/', { replace: true })
        } catch (requestError) {
            setError(requestError.friendlyMessage || requestError.response?.data?.error?.message || 'Unable to authenticate. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const update = (field) => event => setValues(previous => ({ ...previous, [field]: event.target.value }))

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
            <section className="card w-full max-w-md">
                <div className="text-center mb-7">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center">
                        <MapPin className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold">{isSignup ? 'Create your BiyaHero account' : 'Welcome back'}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {isSignup ? 'Save places and keep your trip history.' : 'Sign in to plan your Batangas commute.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <>
                            <label className="block text-sm font-medium">
                                First name
                                <input required minLength={2} value={values.firstName} onChange={update('firstName')} className="input-field mt-1" autoComplete="given-name" />
                            </label>
                            <label className="block text-sm font-medium">
                                Last name
                                <input required minLength={2} value={values.lastName} onChange={update('lastName')} className="input-field mt-1" autoComplete="family-name" />
                            </label>
                            <label className="block text-sm font-medium">
                                Passenger type
                                <BiyaHeroSelect
                                    id="signup-passenger-type"
                                    ariaLabel="Passenger type"
                                    value={values.passengerType}
                                    onChange={value => setValues(previous => ({ ...previous, passengerType: value }))}
                                    options={[
                                        { value: 'regular', label: 'Regular' },
                                        { value: 'student', label: 'Student' },
                                        { value: 'senior', label: 'Senior' },
                                        { value: 'pwd', label: 'PWD' }
                                    ]}
                                />
                            </label>
                        </>
                    )}
                    <label className="block text-sm font-medium">
                        Email
                        <input required type="email" value={values.email} onChange={update('email')} className="input-field mt-1" autoComplete="email" />
                    </label>
                    <label className="block text-sm font-medium">
                        Password
                        <input required minLength={6} type="password" value={values.password} onChange={update('password')} className="input-field mt-1" autoComplete={isSignup ? 'new-password' : 'current-password'} />
                    </label>
                    <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                        {submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
                    {isSignup ? 'Already have an account?' : 'New to BiyaHero?'}{' '}
                    <Link className="font-semibold text-primary-600 dark:text-cyan-400" to={isSignup ? '/login' : '/signup'}>
                        {isSignup ? 'Log in' : 'Sign up'}
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default AuthPage
