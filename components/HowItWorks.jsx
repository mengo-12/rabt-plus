'use client';
import React from 'react';
import { FaUserPlus, FaSearch, FaHandshake } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
    const { t } = useTranslation();

    const steps = [
        {
            icon: <FaUserPlus className="text-3xl text-[#3B82F6]" />,
            title: t('howitworks_step1_title'),
            description: t('howitworks_step1_desc'),
        },
        {
            icon: <FaSearch className="text-3xl text-[#3B82F6]" />,
            title: t('howitworks_step2_title'),
            description: t('howitworks_step2_desc'),
        },
        {
            icon: <FaHandshake className="text-3xl text-[#3B82F6]" />,
            title: t('howitworks_step3_title'),
            description: t('howitworks_step3_desc'),
        },
    ];

    return (
        // <section className="py-16 bg-gray-50 dark:bg-gray-900">
        //     <div className="container mx-auto px-4">
        //         <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">{t('howitworks_title')}</h2>
        //         <div className="grid md:grid-cols-3 gap-8 text-center">
        //             {steps.map((step, index) => (
        //                 <div key={index} className="p-6 bg-white shadow-sm rounded">
        //                     <div className="mb-4">{step.icon}</div>
        //                     <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        //                     <p className="text-gray-600">{step.description}</p>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </section>


        <section class="py-16 bg-gray-50 dark:bg-gray-800">
            <div class="container mx-auto px-6 text-center">
                <h3 class="text-3xl font-bold mb-8">كيف تعمل المنصة؟</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-4xl text-blue-500 mb-4">1️⃣</div>
                        <h4 class="text-xl font-bold mb-2">سجل حسابك</h4>
                        <p>اختر دورك وابدأ ببناء ملفك الشخصي.</p>
                    </div>
                    <div>
                        <div class="text-4xl text-blue-500 mb-4">2️⃣</div>
                        <h4 class="text-xl font-bold mb-2">ابدأ البحث</h4>
                        <p>ابحث عن خدمات أو مستقلين بكل سهولة.</p>
                    </div>
                    <div>
                        <div class="text-4xl text-blue-500 mb-4">3️⃣</div>
                        <h4 class="text-xl font-bold mb-2">تم الاتفاق!</h4>
                        <p>ابدأ مشروعك بثقة وأمان على المنصة.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
