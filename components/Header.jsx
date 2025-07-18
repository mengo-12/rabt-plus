'use client'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar'
        i18n.changeLanguage(newLang)
    }

    return (
        <button onClick={toggleLanguage} className="px-3 py-1 border rounded">
            {i18n.language === 'ar' ? 'English' : 'العربية'}
        </button>
    )
}