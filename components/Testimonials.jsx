'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
    const { t } = useTranslation();

    const testimonials = [
        {
            name: 'سارة من الرياض',
            message: t('testimonial_1'),
        },
        {
            name: 'عبدالله من جدة',
            message: t('testimonial_2'),
        },
        {
            name: 'ليلى من الدمام',
            message: t('testimonial_3'),
        },
    ];

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">{t('testimonials_title')}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-gray-100 p-6 rounded shadow-sm">
                            <p className="text-gray-700 mb-4 italic">"{item.message}"</p>
                            <p className="text-right font-semibold text-[#3B82F6]">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
