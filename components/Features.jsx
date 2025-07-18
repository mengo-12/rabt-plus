'use client'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export default function Features() {
    const { t } = useTranslation()
    const features = t('features_list', { returnObjects: true })

    useEffect(() => {
        console.log('features:', features)
    }, [features])

    if (!Array.isArray(features)) {
        return <p className="text-red-500">خطأ: features_list ليست مصفوفة</p>
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold mb-6 text-black">
                    {t('features_title')}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <li key={i} className="bg-gray-100 p-4 rounded shadow text-black">
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
