'use client';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function HowItWorks() {
    const { t } = useTranslation();
    const steps = t('how_it_works_steps', { returnObjects: true });

    useEffect(() => {
        console.log('how_it_works_steps:', steps);
    }, [steps]);

    if (!Array.isArray(steps)) {
        return <p className="text-red-500">خطأ: how_it_works_steps ليست مصفوفة</p>;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold mb-6 text-black">
                    {t('how_it_works_title')}
                </h3>
                <div className="space-y-4 text-black">
                    {steps.map((step, i) => (
                        <div key={i} className="text-lg font-medium">
                            {i + 1}. {step}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
