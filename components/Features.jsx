'use client'
import React from 'react'
import { FaShieldAlt, FaUsers, FaClock } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function Features() {
    const { t } = useTranslation()

    const features = [
        {
            icon: <FaShieldAlt className="text-3xl text-[#3B82F6]" />,
            title: t('feature_secure'),
            description: t('feature_secure_desc'),
        },
        {
            icon: <FaUsers className="text-3xl text-[#3B82F6]" />,
            title: t('feature_talents'),
            description: t('feature_talents_desc'),
        },
        {
            icon: <FaClock className="text-3xl text-[#3B82F6]" />,
            title: t('feature_fast'),
            description: t('feature_fast_desc'),
        },
    ]

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">{t('features_title')}</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-[#F9FAFB] p-6 rounded shadow-sm">
                            <div className="mb-4 dark:text-black">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-black">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-black">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
