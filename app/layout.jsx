'use client';

import './globals.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n'; // تأكد من أن التهيئة تعمل هنا أو في _app

export default function RootLayout({ children }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <html>
            <body>{children}</body>
        </html>
    );
}