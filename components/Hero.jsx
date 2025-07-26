'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Hero() {
    const { t } = useTranslation()

    return (
        // <section className="bg-[#F9FAFB] py-20 text-center dark:bg-gray-900">
        //     <div className="container mx-auto px-4">
        //         <h1 className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-white mb-4">
        //             {t('hero_title')}
        //         </h1>
        //         <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
        //             {t('hero_subtitle')}
        //         </p>
        //         <div className="flex justify-center gap-4 flex-wrap">
        //             <a href="/client-signup" className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow transition">
        //                 تسجيل كعميل
        //             </a>
        //             <a href="/freelancer-signup" className="bg-[#10B981] hover:bg-green-600 text-white px-6 py-3 rounded-md shadow transition">
        //                 تسجيل كمستقل
        //             </a>
        //         </div>
        //     </div>
        // </section>

        <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">منصة المستقلين المبرمجين</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">ابدأ مشروعك الآن مع نخبة المطورين العرب</p>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="/allFreelancers" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
                    استعرض المبرمجين
                </a>
                <a href="/freelancer-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
                    انضم كمبرمج
                </a>
                <a href="/client-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
                    انضم كعميل
                </a>
            </div>
        </section>

    )
}
