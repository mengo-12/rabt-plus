'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Button from '@/components/ui/Button';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
    const { t, i18n: i18nextInstance } = useTranslation();
    const [darkMode, setDarkMode] = useState(false);
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleLanguage = () => {
        const newLang = i18nextInstance.language === 'ar' ? 'en' : 'ar';
        i18nextInstance.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        setDarkMode(isDark);
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
        document.documentElement.dir = i18nextInstance.language === 'ar' ? 'rtl' : 'ltr';
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        console.log("بيانات المستخدم:", session?.user);
    }, [session]);

    return (
        <header className="bg-white dark:bg-gray-900 dark:text-white shadow-sm py-4 transition">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl font-bold text-[#3B82F6] dark:text-white whitespace-nowrap"
                >
                    منصتي
                </Link>

                {/* روابط التنقل */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6]">
                        {t('nav_home')}
                    </Link>
                    {/* <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6]">
                        {t('nav_about')}
                    </Link> */}
                    {/* ✅ عرض رابط المشاريع فقط إذا كان المستخدم مسجلاً */}
                    {session && (
                        <Link href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6]">
                            عرض المشاريع
                        </Link>
                    )}
                    <Link href="/allFreelancers" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6]">
                        {t('nav_how')}
                    </Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#3B82F6]">
                        {t('nav_contact')}
                    </Link>
                </nav>

                {/* أدوات التحكم */}
                <div className="flex items-center gap-2 rtl:flex-row-reverse relative">
                    {/* زر تغيير اللغة */}
                    <Button
                        onClick={toggleLanguage}
                        className="!bg-transparent !text-blue-600 border border-blue-600 hover:bg-blue-50 dark:border-white dark:text-white dark:hover:bg-gray-800"
                    >
                        {i18n.language === 'ar' ? 'EN' : 'AR'}
                    </Button>

                    {/* زر الوضع الليلي */}
                    <Button
                        onClick={toggleDarkMode}
                        className="!bg-gray-200 dark:!bg-white dark:!text-black text-gray-700 px-2"
                        title="الوضع الليلي"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </Button>

                    {/* المستخدم مسجل دخول */}
                    {session?.user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition"
                            >
                                <img
                                    src={session.user.avatar || '/default-avatar.png'}
                                    alt="User avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                                    {session.user.name}
                                </span>
                            </button>

                            {/* قائمة منسدلة */}
                            {dropdownOpen && (
                                <div className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-md py-2 text-sm">
                                    <Link
                                        href="/dashboard/profile"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                    >
                                        الملف الشخصي
                                    </Link>

                                    {/* روابط خاصة بالعميل */}
                                    {session.user.role === 'client' && (
                                        <>
                                            <Link
                                                href="/dashboard/client/new-project"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                            >
                                                إضافة مشروع
                                            </Link>
                                            <Link
                                                href="/dashboard/projects"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                            >
                                                مشاريعي
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                    >
                                        تسجيل الخروج
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button>{t('nav_login')}</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}



