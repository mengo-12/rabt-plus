'use client'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

export default function Hero() {
    const { t } = useTranslation()
    const router = useRouter()

    return (
        <section className="text-center py-20 bg-gray-50">
            <h2 className="text-4xl font-bold mb-4 text-black">{t('hero_title')}</h2>
            <p className="text-lg mb-8 text-black">{t('hero_subtitle')}</p>
            <div className="space-x-4">
                <button
                    onClick={() => router.push('/register?role=client')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {t('hero_client_button')}
                </button>
                <button
                    onClick={() => router.push('/register?role=freelancer')}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    {t('hero_freelancer_button')}
                </button>
            </div>
        </section>
    )
}
