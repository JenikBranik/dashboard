import en from './en.json'
import cs from './cs.json'

const translations = { en, cs }

/**
 * Available languages with display labels.
 * To add a new language: create a JSON file, import it above,
 * add it to `translations`, and add an entry to `languages`.
 */
export const languages = [
    { code: 'en', label: 'English' },
    { code: 'cs', label: 'Čeština' },
]

/**
 * Get a nested translation value by dot-separated key.
 * Example: translate('login.title', 'cs') → "Přihlášení"
 * Falls back to English if key is missing in the selected language.
 */
export function translate(key, lang = 'en') {
    const keys = key.split('.')

    // Try selected language first
    let value = translations[lang]
    for (const k of keys) {
        value = value?.[k]
    }
    if (value !== undefined) return value

    // Fallback to English
    let fallback = translations.en
    for (const k of keys) {
        fallback = fallback?.[k]
    }
    return fallback ?? key
}

export default translations
