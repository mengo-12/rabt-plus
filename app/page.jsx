// // app/page.jsx
// 'use client'

// import Hero from '../components/Hero'
// import Features from '../components/Features'
// import HowItWorks from '../components/HowItWorks'
// import Testimonials from '@/components/Testimonials'
// import FreelancerCards from '../components/FreelancerCards'
// import Link from 'next/link'


// import { useEffect } from 'react'
// import { CheckCircleIcon, GlobeAltIcon, StarIcon, } from '@heroicons/react/24/outline';
// import { UserPlusIcon } from '@heroicons/react/24/solid'
// import { Search } from 'lucide-react';


// export default function HomePage() {






//     return (


//         <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

//             {/* Hero Section */}
//             <section className="bg-gradient-to-br from-cyan-600 to-blue-800 py-20 text-white text-center">
//                 <div className="max-w-4xl mx-auto px-6">
//                     <h1 className="text-4xl md:text-5xl font-bold mb-4">منصتك للعمل الحر بكل احترافية</h1>
//                     <p className="text-lg mb-8">انطلق الآن وابدأ في استكشاف أفضل المستقلين أو تقديم خدماتك بكل سهولة!</p>
//                     <div className="flex justify-center gap-4">
//                         {/* <button className="bg-white text-cyan-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition">ابدأ كعميل</button> */}
//                         {/* <button className="bg-transparent border border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-cyan-700 transition">انضم كمستقل</button> */}
//                         <a href="/freelancer-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
//                             انضم كمبرمج
//                         </a>
//                         <a href="/client-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
//                             انضم كعميل
//                         </a>
//                     </div>
//                 </div>
//             </section>

//             {/* Features Section */}
//             <section className="py-20 bg-white dark:bg-gray-800">
//                 <div className="max-w-6xl mx-auto px-6 text-center">
//                     <h2 className="text-3xl font-bold mb-12">مميزات منصتنا</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//                         <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
//                             <GlobeAltIcon className="w-12 h-12 text-cyan-600 mb-4 mx-auto" />
//                             <h3 className="text-xl font-bold mb-2">واجهة سهلة الاستخدام</h3>
//                             <p className="text-gray-700 dark:text-gray-300">تصميم بسيط وسهل لجميع المستخدمين بدون تعقيد.</p>
//                         </div>
//                         <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
//                             <StarIcon className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
//                             <h3 className="text-xl font-bold mb-2">تقييمات حقيقية</h3>
//                             <p className="text-gray-700 dark:text-gray-300">قيّم المستقلين بعد كل مشروع لضمان الجودة.</p>
//                         </div>
//                         <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
//                             <GlobeAltIcon className="w-12 h-12 text-green-500 mb-4 mx-auto" />
//                             <h3 className="text-xl font-bold mb-2">دعم متعدد اللغات</h3>
//                             <p className="text-gray-700 dark:text-gray-300">المنصة تدعم العربية والإنجليزية والمزيد قريباً.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* How it Works */}
//             <section className="py-20 bg-cyan-50 dark:bg-blue-950">
//                 <div className="max-w-6xl mx-auto px-6 text-center">
//                     <h2 className="text-3xl font-bold mb-12">كيف تعمل المنصة؟</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
//                         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//                             <UserPlusIcon className="w-10 h-10 text-cyan-700 mb-3" />
//                             <h4 className="text-xl font-bold mb-2">1. التسجيل</h4>
//                             <p>سجّل كعميل أو مستقل وابدأ رحلتك معنا.</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//                             <Search className="w-10 h-10 text-cyan-700 mb-3" />
//                             <h4 className="text-xl font-bold mb-2">2. البحث أو التقديم</h4>
//                             <p>ابحث عن خدمات، أو قدم خدماتك كمستقل.</p>
//                         </div>
//                         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//                             <CheckCircleIcon className="w-10 h-10 text-cyan-700 mb-3" />
//                             <h4 className="text-xl font-bold mb-2">3. إنجاز المشاريع</h4>
//                             <p>تواصل، نفّذ، واحصل على تقييمات مميزة.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Testimonials */}
//             <section className="py-20 bg-white dark:bg-gray-900">
//                 <div className="max-w-6xl mx-auto px-6 text-center">
//                     <h2 className="text-3xl font-bold mb-10">آراء عملائنا</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {[
//                             { name: "أحمد خالد", text: "خدمة ممتازة وسرعة في التواصل، أنصح بها بشدة!" },
//                             { name: "فاطمة الزهراء", text: "أفضل منصة عمل حر جربتها، سهلة وآمنة." },
//                             { name: "سامي العنزي", text: "تعاملت مع مستقلين رائعين وأكملت مشروعي بسهولة." }
//                         ].map((t, i) => (
//                             <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
//                                 <p className="italic mb-4">"{t.text}"</p>
//                                 <p className="font-bold">{t.name}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Footer */}

//         </div>
//     )
// }


'use client'

import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import FreelancerCards from '../components/FreelancerCards'
import Link from 'next/link'

import { useEffect } from 'react'
import { CheckCircleIcon, GlobeAltIcon, StarIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from '@heroicons/react/24/solid'
import { Search } from 'lucide-react';

export default function HomePage() {
    const { t } = useTranslation('home')

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <section className="bg-gradient-to-br from-cyan-600 to-blue-800 py-20 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h1>
                    <p className="text-lg mb-8">{t('heroSubtitle')}</p>
                    <div className="flex justify-center gap-4">
                        <a href="/freelancer-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
                            {t('joinFreelancer')}
                        </a>
                        <a href="/client-signup" className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
                            {t('joinClient')}
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">{t('featuresTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard icon={<GlobeAltIcon />} title={t('feature1Title')} desc={t('feature1Desc')} />
                        <FeatureCard icon={<StarIcon />} title={t('feature2Title')} desc={t('feature2Desc')} />
                        <FeatureCard icon={<GlobeAltIcon />} title={t('feature3Title')} desc={t('feature3Desc')} />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-cyan-50 dark:bg-blue-950">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">{t('howItWorks')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                        <Step icon={<UserPlusIcon />} title={t('step1Title')} desc={t('step1Desc')} />
                        <Step icon={<Search />} title={t('step2Title')} desc={t('step2Desc')} />
                        <Step icon={<CheckCircleIcon />} title={t('step3Title')} desc={t('step3Desc')} />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-10">{t('testimonialsTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <p className="italic mb-4">"{t(`testimonial${i}`)}"</p>
                                <p className="font-bold">{t(`testimonialName${i}`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="w-12 h-12 text-cyan-600 mb-4 mx-auto">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{desc}</p>
        </div>
    )
}

function Step({ icon, title, desc }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="w-10 h-10 text-cyan-700 mb-3">{icon}</div>
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p>{desc}</p>
        </div>
    )
}

