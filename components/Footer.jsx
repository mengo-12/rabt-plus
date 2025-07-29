'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} {t('footer_rights')}
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-cyan-400">{t('footer_terms')}</a>
                    <a href="#" className="hover:text-cyan-400">{t('footer_privacy')}</a>
                    <a href="#" className="hover:text-cyan-400">{t('footer_contact')}</a>
                </div>
            </div>
        </footer>
    );
}
