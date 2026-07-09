import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { languages } from '../i18n'

/* Inline SVG flags — Windows doesn't support emoji flags */
const flags = {
    en: (
        <svg className="w-5 h-3.5 rounded-sm overflow-hidden" viewBox="0 0 190 100">
            <rect width="190" height="100" fill="#B22234" />
            <rect y="7.69" width="190" height="7.69" fill="#fff" />
            <rect y="23.08" width="190" height="7.69" fill="#fff" />
            <rect y="38.46" width="190" height="7.69" fill="#fff" />
            <rect y="53.85" width="190" height="7.69" fill="#fff" />
            <rect y="69.23" width="190" height="7.69" fill="#fff" />
            <rect y="84.62" width="190" height="7.69" fill="#fff" />
            <rect width="76" height="53.85" fill="#3C3B6E" />
        </svg>
    ),
    cs: (
        <svg className="w-5 h-3.5 rounded-sm overflow-hidden" viewBox="0 0 60 30">
            <rect width="60" height="15" fill="#fff" />
            <rect y="15" width="60" height="15" fill="#D7141A" />
            <polygon points="0,0 30,15 0,30" fill="#11457E" />
        </svg>
    ),
}

function LanguageSwitcher({ theme = 'login' }) {
    const { lang, setLang } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const currentLang = languages.find((l) => l.code === lang) || languages[0]

    // Determine the styling based on the active theme
    // Login -> Right side is BLUE on desktop (lg+), WHITE on mobile. So text needs to be white on lg, dark on mobile.
    // Register -> Right side is WHITE on desktop (lg+), WHITE on mobile. So text needs to be dark always.
    const isLogin = theme === 'login'

    // Button classes
    const btnClasses = isLogin
        ? "text-slate-700 dark:text-slate-300 bg-slate-900/5 dark:bg-white/5 border-slate-200 dark:border-slate-700 hover:bg-slate-900/10 dark:hover:bg-white/10 lg:text-white/80 lg:bg-white/10 lg:border-white/20 lg:hover:text-white lg:hover:bg-white/15"
        : "text-slate-700 dark:text-slate-300 bg-slate-900/5 dark:bg-white/5 border-slate-200 dark:border-slate-700 hover:bg-slate-900/10 dark:hover:bg-white/10";

    // Dropdown window classes
    const dropdownClasses = isLogin
        ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 lg:bg-blue-950/90 lg:border-white/20"
        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700";

    // Default item class
    const itemClasses = isLogin
        ? "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white lg:text-white/60 lg:hover:bg-white/10 lg:hover:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white";

    // Active item class
    const activeItemClasses = isLogin
        ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 lg:bg-blue-500/20 lg:text-white"
        : "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400";

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={theme === 'dashboard' ? 'relative' : 'absolute top-6 right-6 z-50'} ref={dropdownRef}>
            <button
                id="language-switcher"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer text-sm font-medium border ${btnClasses}`}
            >
                {flags[currentLang.code]}
                <span>{currentLang.code.toUpperCase()}</span>
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-xl backdrop-blur-xl shadow-xl overflow-hidden border ${dropdownClasses}`}>
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => {
                                setLang(l.code)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors duration-150 cursor-pointer ${l.code === lang ? activeItemClasses : itemClasses
                                }`}
                        >
                            {flags[l.code]}
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguageSwitcher
