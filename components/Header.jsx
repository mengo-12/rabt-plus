'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useSession, signOut } from 'next-auth/react';
import NotificationsBell from './NotificationsBell';

export default function Header() {
    const { t, i18n: i18nextInstance } = useTranslation();
    const { data: session, status } = useSession();
    const [darkMode, setDarkMode] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Notifications
    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationsRef = useRef(null);
    const dropdownRef = useRef(null);

    // تحديد اتجاه الصفحة (rtl أو ltr)
    const isRTL = i18nextInstance.language === 'ar';

    // تبديل اللغة
    const toggleLanguage = () => {
        const newLang = i18nextInstance.language === 'ar' ? 'en' : 'ar';
        i18nextInstance.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    // تبديل الوضع الليلي
    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        setDarkMode(isDark);
    };

    // تحميل إعدادات الوضع الليلي والاتجاه عند أول تحميل
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
    }, [i18nextInstance.language]);

    // إغلاق القائمة المنسدلة عند الضغط خارجها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // إغلاق القائمة الجانبية عند الضغط على أي مكان في الصفحة (مع استثناء داخل القائمة نفسها)
    useEffect(() => {
        const handleClickOutsideSidebar = (event) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const hamburgerBtn = document.getElementById('hamburger-button');

            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                hamburgerBtn &&
                !hamburgerBtn.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        };
        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutsideSidebar);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideSidebar);
        }
        return () => document.removeEventListener('mousedown', handleClickOutsideSidebar);
    }, [sidebarOpen]);

    // Fetch Notifications
    useEffect(() => {
        if (session?.user) {
            fetch('/api/notifications')
                .then(res => res.json())
                .then(data => {
                    setNotifications(data.notifications || []);
                    const unread = data.notifications?.filter(n => !n.read).length || 0;
                    setUnreadCount(unread);
                })
                .catch(err => console.error(err));
        }
    }, [session]);

    if (status === 'loading') return null;

    return (
        <>
            {/* الهيدر */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:text-white shadow-md fixed top-0 left-0 w-full z-50 transition-colors">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                        {t('header_brand')}
                    </Link>

                    {/* روابط القائمة العلوية - تظهر فقط في الشاشات الكبيرة */}
                    <nav className="hidden md:flex items-center gap-6 font-medium">
                        <Link
                            href="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            {t('nav_home')}
                        </Link>

                        {session?.user && (
                            <Link
                                href="/projects"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                            >
                                {t('nav_projects')}
                            </Link>
                        )}

                        <Link
                            href="/allFreelancers"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            {t('nav_freelancers')}
                        </Link>

                        {/* <Link
                            href="/dashboard/teams"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"

                        >
                            {t('nav_teams')}
                        </Link> */}

                        {/* *** إضافة رابط إنشاء فريق هنا في القائمة العلوية *** */}
                        {/* {session?.user && (
                            <Link
                                href="/dashboard/teams/new"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition font-semibold"
                            >
                                {t('nav_create_team')}
                            </Link>
                        )} */}

                        <Link
                            href="/contact"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            {t('nav_contact')}
                        </Link>
                    </nav>

                    {/* أدوات الهيدر: زر اللغة، الوضع الليلي، المستخدم */}
                    <div className="flex items-center gap-3 relative">

                        <NotificationsBell />

                        {/* زر تبديل اللغة */}
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 rounded border border-blue-600 dark:border-white text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800 transition text-sm"
                            aria-label="Toggle Language"
                        >
                            {i18n.language === 'ar' ? 'EN' : 'AR'}
                        </button>

                        {/* زر تبديل الوضع الليلي */}
                        <button
                            onClick={toggleDarkMode}
                            className="text-xl px-2 py-1 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title={t('toggle_theme')}
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {/* قائمة المستخدم - الشاشات الكبيرة */}
                        {session?.user ? (
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-md transition"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen}
                                    aria-label="User menu"
                                >
                                    <img
                                        src={session.user.avatar || '/default-avatar.png'}
                                        alt="User avatar"
                                        className="w-8 h-8 rounded-full border dark:border-gray-600"
                                    />
                                    <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px] text-black dark:text-white">
                                        {session.user.name}
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 text-sm">
                                        <Link
                                            href="/dashboard/profile"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                                        >
                                            {t('profile')}
                                        </Link>

                                        <Link
                                            href="/dashboard/team-chat"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                                            الفرق / المحادثات
                                        </Link>

                                        {/* *** إضافة رابط إنشاء فريق في قائمة المستخدم *** */}
                                        <Link
                                            href="/dashboard/teams/new"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                                        >
                                            {t('nav_create_team')}
                                        </Link>

                                        <Link
                                            href="/dashboard/teams"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"

                                        >
                                            {t('nav_teams')}
                                        </Link>

                                        {session.user.role === 'client' && (
                                            <>
                                                <Link
                                                    href="/dashboard/client/new-project"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                                                >
                                                    {t('add_project')}
                                                </Link>
                                                <Link
                                                    href="/dashboard/projects"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                                                >
                                                    {t('my_projects')}
                                                </Link>
                                            </>
                                        )}

                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                                        >
                                            {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:block">
                                <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm">
                                    {t('nav_login')}
                                </button>
                            </Link>
                        )}

                        {/* زر قائمة الهامبرغر للشاشات الصغيرة */}
                        <button
                            id="hamburger-button"
                            aria-label="Toggle menu"
                            aria-expanded={sidebarOpen}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden text-3xl p-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            type="button"
                        >
                            &#9776;
                        </button>
                    </div>
                </div>
            </header>

            {/* قائمة الهامبرغر (الشاشات الصغيرة) */}
            <div
                id="mobile-sidebar"
                className={`fixed top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'
                    } w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        `}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* رأس القائمة: صورة واسم المستخدم أو زر تسجيل الدخول */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-300 dark:border-gray-700">
                    {session?.user ? (
                        <>
                            <img
                                src={session.user.avatar || '/default-avatar.png'}
                                alt="User avatar"
                                className="w-12 h-12 rounded-full border dark:border-gray-600"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg text-gray-900 dark:text-white truncate max-w-[180px]">
                                    {session.user.name}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[180px]">
                                    {session.user.role}
                                </span>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setSidebarOpen(false)}>
                            <button className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700 transition text-base">
                                {t('nav_login')}
                            </button>
                        </Link>
                    )}
                </div>

                {/* روابط القائمة */}
                <nav className="flex flex-col mt-4 space-y-1 px-2 text-gray-900 dark:text-white">
                    <Link
                        href="/"
                        onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {t('nav_home')}
                    </Link>

                    {session?.user && (
                        <Link
                            href="/projects"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            {t('nav_projects')}
                        </Link>

                    )}

                    <Link
                        href="/allFreelancers"
                        onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {t('nav_freelancers')}
                    </Link>

                    <Link
                        href="/dashboard/teams"
                        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"

                    >
                        {t('nav_teams')}
                    </Link>


                    {/* *** إضافة رابط إنشاء فريق هنا في قائمة الهاتف *** */}
                    {session?.user && (
                        <Link
                            href="/dashboard/teams/new"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            {t('nav_create_team')}
                        </Link>
                    )}

                    <Link
                        href="/contact"
                        onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {t('nav_contact')}
                    </Link>

                    <Link
                        href="/dashboard/team-chat"
                        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        الفرق / المحادثات
                    </Link>

                    {/* روابط خاصة بدور العميل */}
                    {session?.user?.role === 'client' && (
                        <>
                            <Link
                                href="/dashboard/client/new-project"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {t('add_project')}
                            </Link>
                            <Link
                                href="/dashboard/projects"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {t('my_projects')}
                            </Link>
                        </>
                    )}

                    {/* روابط خاصة بدور المستقل */}
                    {/* {session?.user?.role === 'freelancer' && (
                        <>
                            <Link
                                href="/dashboard/freelancer/new-service"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {t('add_service')}
                            </Link>
                            <Link
                                href="/dashboard/freelancer/services"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {t('my_services')}
                            </Link>
                        </>
                    )} */}

                    {/* رابط الملف الشخصي */}
                    {session?.user && (
                        <Link
                            href="/dashboard/profile"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                            {t('profile')}
                        </Link>
                    )}

                    {/* زر تسجيل الخروج */}
                    {session?.user && (
                        <button
                            onClick={() => {
                                signOut();
                                setSidebarOpen(false);
                            }}
                            className="w-full text-start px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                        >
                            {t('logout')}
                        </button>
                    )}
                </nav>
            </div>
        </>
    );
}



