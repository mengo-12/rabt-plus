'use client';

import './globals.css';
import { Providers } from './providers'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n'; // تأكد من أن التهيئة تعمل هنا أو في _app
import Header from '../components/Header'
export default function RootLayout({ children }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <html>
            <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">

                <Providers>
                    <Header />
                    {children}
                </Providers>

            </body>
        </html>
    );
}