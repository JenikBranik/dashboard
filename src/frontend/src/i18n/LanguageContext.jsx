import { createContext, useContext, useState, useCallback } from 'react'
import { translate } from './index'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('dashboard_lang') || 'en'
    })

    const changeLang = useCallback((newLang) => {
        setLang(newLang)
        localStorage.setItem('dashboard_lang', newLang)
    }, [])

    const t = useCallback((key) => translate(key, lang), [lang])

    return (
        <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

/**
 * Hook to access translations.
 * Usage: const { t, lang, setLang } = useLanguage()
 *        t('login.title') → "Customer Login"
 */
export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
