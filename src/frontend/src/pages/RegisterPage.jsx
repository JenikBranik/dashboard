import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function RegisterPage() {
    const { t } = useLanguage()
    const { user, register } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // For the custom slide transition
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        // If the user lands here and is already logged in, politely kick them
        if (user && !isSuccess) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, isSuccess, navigate])

    // Track mouse position for parallax effect
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!name || !email || !password) {
            setError(t('register.errorEmpty'))
            return
        }

        setIsLoading(true)
        try {
            await register(name, email, password)
            setIsSuccess(true)
            // Wait for the slide UP animation to finish before updating route
            setTimeout(() => {
                navigate('/dashboard', { replace: true })
            }, 800)
        } catch (err) {
            setError(err.message || 'Registration failed')
            setIsLoading(false)
        }
    }

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x, y });
    }

    const parallax = (factor) => ({
        transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    })

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-50">

            {/* The Main Form Container */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isSuccess ? { y: "-100vh", x: 0, opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
                // If sliding up, don't trigger normal exit animation
                exit={isSuccess ? { opacity: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 h-screen w-full flex bg-white z-10 flex-row-reverse shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                onMouseMove={handleMouseMove}
            >
                <LanguageSwitcher theme="register" />

                {/* LEFT HALF (Flex-reverse makes this the actual Right half on screen): Form Zone (White) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
                    <div className="w-full max-w-sm md:max-w-md mx-6 lg:mx-12 xl:mx-20 transition-transform duration-300">

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {t('register.title')}
                        </h1>
                        <p className="text-slate-500 mb-10">
                            {t('register.subtitle')}
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name field */}
                            <div className="group">
                                <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2 transition-colors duration-300 group-focus-within:border-blue-600">
                                    <svg className="w-5 h-5 text-slate-400 shrink-0 transition-colors duration-300 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder={t('register.name')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-base tracking-wide"
                                        disabled={isSuccess}
                                    />
                                </div>
                            </div>

                            {/* Email field */}
                            <div className="group">
                                <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2 transition-colors duration-300 group-focus-within:border-blue-600">
                                    <svg className="w-5 h-5 text-slate-400 shrink-0 transition-colors duration-300 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <input
                                        type="email"
                                        placeholder={t('register.email')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-base tracking-wide"
                                        disabled={isSuccess}
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="group">
                                <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-2 transition-colors duration-300 group-focus-within:border-blue-600">
                                    <svg className="w-5 h-5 text-slate-400 shrink-0 transition-colors duration-300 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <input
                                        type="password"
                                        placeholder={t('register.password')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-base tracking-wide"
                                        disabled={isSuccess}
                                    />
                                </div>
                            </div>

                            {/* Register button */}
                            <button
                                type="submit"
                                disabled={isLoading || isSuccess}
                                className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold tracking-wide rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {t('register.signingUp')}
                                    </div>
                                ) : isSuccess ? (
                                    "Success!"
                                ) : (
                                    t('register.submitButton')
                                )}
                            </button>
                        </form>

                        {/* Back to Login link */}
                        <p className="text-center text-slate-600 text-sm mt-10">
                            {t('register.hasAccount')}{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold">
                                {t('register.signIn')}
                            </Link>
                        </p>
                        <p className="text-center text-slate-400 text-xs mt-8">
                            {t('login.copyright')}
                        </p>
                    </div>
                </div>

                {/* RIGHT HALF (Flex-reverse makes this the LEFT half on screen): Visual Zone (Blue Pattern) - Hidden on Mobile */}
                <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 overflow-hidden">

                    {/* Decorative grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                    {/* Parallax Orbs (adjusted for left side) */}
                    <div
                        className="absolute top-1/4 -left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl transition-transform duration-[800ms] ease-out will-change-transform"
                        style={parallax(-50)}
                    />

                    <div
                        className="absolute bottom-1/4 left-32 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl transition-transform duration-[1200ms] ease-out will-change-transform"
                        style={parallax(70)}
                    />

                    <div
                        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl transition-transform duration-[1000ms] ease-out will-change-transform"
                        style={parallax(-20)}
                    />

                    {/* Branding text in visual half */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12 text-center">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl" style={parallax(-10)}>
                            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                                {t('register.brandingTitle')}
                            </h2>
                            <p className="text-blue-200 text-lg max-w-sm mx-auto">
                                {t('register.brandingSubtitle')}
                            </p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    )
}

export default RegisterPage
