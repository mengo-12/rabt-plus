'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
 
i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ar',
        supportedLngs: ['en', 'ar'],
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        detection: {
            order: ['cookie', 'localStorage', 'htmlTag'],
            caches: ['cookie'],
        },
        react: {
            useSuspense: false, // مهم لتفادي مشاكل SSR في Next.js
        },
    })

export default i18n