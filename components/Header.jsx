// 'use client';
// import React, { useEffect, useState, useRef } from 'react';
// import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
// import i18n from '../i18n';
// import Button from '@/components/ui/Button';
// import { useSession, signOut } from 'next-auth/react';

// export default function Header() {
//     const { t, i18n: i18nextInstance } = useTranslation();
//     const [darkMode, setDarkMode] = useState(false);
//     const { data: session } = useSession();
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     const toggleLanguage = () => {
//         const newLang = i18nextInstance.language === 'ar' ? 'en' : 'ar';
//         i18nextInstance.changeLanguage(newLang);
//         document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
//     };

//     const toggleDarkMode = () => {
//         const html = document.documentElement;
//         const isDark = html.classList.toggle('dark');
//         localStorage.setItem('theme', isDark ? 'dark' : 'light');
//         setDarkMode(isDark);
//     };

//     useEffect(() => {
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme === 'dark') {
//             document.documentElement.classList.add('dark');
//             setDarkMode(true);
//         } else {
//             document.documentElement.classList.remove('dark');
//             setDarkMode(false);
//         }
//         document.documentElement.dir = i18nextInstance.language === 'ar' ? 'rtl' : 'ltr';
//     }, []);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setDropdownOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     useEffect(() => {
//         console.log("بيانات المستخدم:", session?.user);
//     }, [session]);

//     return (
//         <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:text-white shadow-md fixed top-0 left-0 w-full z-50 transition-colors">
//             <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//                 <Link
//                     href="/"
//                     className="text-2xl font-bold text-blue-600 dark:text-white"
//                 >
//                     منصتي
//                 </Link>

//                 {/* روابط التنقل */}
//                 <nav className="hidden md:flex items-center gap-6 font-medium">
//                     <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
//                         {t('nav_home')}
//                     </Link>
//                     {session && (
//                         <Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
//                             عرض المشاريع
//                         </Link>
//                     )}
//                     <Link href="/allFreelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
//                         {t('nav_how')}
//                     </Link>
//                     <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
//                         {t('nav_contact')}
//                     </Link>
//                 </nav>

//                 {/* أدوات التحكم */}
//                 <div className="flex items-center gap-3 relative">
//                     {/* زر تغيير اللغة */}
//                     <button
//                         onClick={toggleLanguage}
//                         className="px-3 py-1 rounded border border-blue-600 dark:border-white text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800 transition text-sm"
//                     >
//                         {i18n.language === 'ar' ? 'EN' : 'AR'}
//                     </button>

//                     {/* زر الوضع الليلي */}
//                     <button
//                         onClick={toggleDarkMode}
//                         className="text-xl px-2 py-1 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
//                         title="الوضع الليلي"
//                     >
//                         {darkMode ? '☀️' : '🌙'}
//                     </button>

//                     {/* المستخدم */}
//                     {session?.user ? (
//                         <div className="relative" ref={dropdownRef}>
//                             <button
//                                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                                 className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-md transition"
//                             >
//                                 <img
//                                     src={session.user.avatar || '/default-avatar.png'}
//                                     alt="User avatar"
//                                     className="w-8 h-8 rounded-full border dark:border-gray-600"
//                                 />
//                                 <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px] text-black dark:text-white">
//                                     {session.user.name}
//                                 </span>
//                             </button>

//                             {dropdownOpen && (
//                                 <div className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 text-sm">
//                                     <Link
//                                         href="/dashboard/profile"
//                                         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
//                                     >
//                                         الملف الشخصي
//                                     </Link>
//                                     {session.user.role === 'client' && (
//                                         <>
//                                             <Link
//                                                 href="/dashboard/client/new-project"
//                                                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
//                                             >
//                                                 إضافة مشروع
//                                             </Link>
//                                             <Link
//                                                 href="/dashboard/projects"
//                                                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
//                                             >
//                                                 مشاريعي
//                                             </Link>
//                                         </>
//                                     )}
//                                     <button
//                                         onClick={() => signOut()}
//                                         className="w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
//                                     >
//                                         تسجيل الخروج
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <Link href="/login">
//                             <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm">
//                                 {t('nav_login')}
//                             </button>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }



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

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:text-white shadow-md fixed top-0 left-0 w-full z-50 transition-colors">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-white">
                    {t('header_brand')}
                </Link>

                <nav className="hidden md:flex items-center gap-6 font-medium">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        {t('nav_home')}
                    </Link>
                    {session && (
                        <Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                            {t('nav_projects')}
                        </Link>
                    )}
                    <Link href="/allFreelancers" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        {t('nav_freelancers')}
                    </Link>
                    <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        {t('nav_contact')}
                    </Link>
                </nav>

                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 rounded border border-blue-600 dark:border-white text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800 transition text-sm"
                    >
                        {i18n.language === 'ar' ? 'EN' : 'AR'}
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="text-xl px-2 py-1 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                        title={t('toggle_theme')}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    {session?.user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-md transition"
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
                                    <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                                        {t('profile')}
                                    </Link>
                                    {session.user.role === 'client' && (
                                        <>
                                            <Link href="/dashboard/client/new-project" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                                                {t('add_project')}
                                            </Link>
                                            <Link href="/dashboard/projects" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
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
                        <Link href="/login">
                            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm">
                                {t('nav_login')}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
