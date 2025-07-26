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
        // <section className="py-16 bg-white dark:bg-gray-900">
        //     <div className="container mx-auto px-4">
        //         <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">{t('testimonials_title')}</h2>
        //         <div className="grid md:grid-cols-3 gap-8">
        //             {testimonials.map((item, index) => (
        //                 <div key={index} className="bg-gray-100 p-6 rounded shadow-sm">
        //                     <p className="text-gray-700 mb-4 italic">"{item.message}"</p>
        //                     <p className="text-right font-semibold text-[#3B82F6]">{item.name}</p>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </section>


        <section class="py-16 bg-white dark:bg-gray-900">
            <div class="container mx-auto px-6 text-center">
                <h3 class="text-3xl font-bold mb-10">آراء عملائنا</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow">
                        <p class="mb-4">"منصة رائعة، وجدت مستقل خلال دقائق!"</p>
                        <h4 class="font-bold text-blue-600 dark:text-blue-400">سارة - عميلة</h4>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow">
                        <p class="mb-4">"سهلت علي عرض خدماتي والوصول لعملاء جدد."</p>
                        <h4 class="font-bold text-blue-600 dark:text-blue-400">أحمد - مستقل</h4>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow">
                        <p class="mb-4">"الدفع والتواصل يتم بكل سهولة."</p>
                        <h4 class="font-bold text-blue-600 dark:text-blue-400">ريم - عميلة</h4>
                    </div>
                </div>
            </div>
        </section>
    );
}
