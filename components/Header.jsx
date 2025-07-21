'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function Header() {
    const { t, i18n: i18nextInstance } = useTranslation();
    const [darkMode, setDarkMode] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18nextInstance.language === 'ar' ? 'en' : 'ar';
        i18nextInstance.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    const toggleDarkMode = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

    return (
        <header className="bg-white dark:bg-gray-900 dark:text-white shadow-sm py-4 transition">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-[#3B82F6] dark:text-white">
                    منصتي
                </Link>
                <nav className="space-x-6 hidden md:flex rtl:space-x-reverse">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] dark:hover:text-white">{t('nav_home')}</Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] dark:hover:text-white">{t('nav_about')}</Link>
                    <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] dark:hover:text-white">{t('nav_how')}</Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] dark:hover:text-white">{t('nav_contact')}</Link>
                </nav>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <button
                        onClick={toggleLanguage}
                        className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                        {i18n.language === 'ar' ? 'English' : 'العربية'}
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="text-sm px-3 py-1 border border-gray-400 rounded dark:bg-white dark:text-black"
                        title="Toggle Dark Mode"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    <Link
                        href="/login"
                        className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {t('nav_login')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
