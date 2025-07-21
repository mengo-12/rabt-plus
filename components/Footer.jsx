'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-[#111827] text-white py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} {t('footer_rights')}</p>
            </div>
        </footer>
    );
}
