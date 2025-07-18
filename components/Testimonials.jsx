'use client'
import { useTranslation } from 'react-i18next'

export default function Testimonials() {
    const { t } = useTranslation()

    return (
        <section className="py-16 bg-white text-center">
            <h3 className="text-2xl font-bold mb-6 text-black">{t('testimonials_title')}</h3>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded text-black">
                    "منصة ممتازة! سهلت عليّ العثور على مستقلين مميزين."
                </div>
                <div className="bg-gray-100 p-6 rounded text-black">
                    "تجربة رائعة كعميل، أنصح بها للجميع."
                </div>
            </div>
        </section>
    )
}
