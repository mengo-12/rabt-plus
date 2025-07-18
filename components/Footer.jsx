'use client'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation()

    return (
        <footer className="bg-gray-800 text-white text-center py-4">
            {t('footer_text')}
        </footer>
    )
}
