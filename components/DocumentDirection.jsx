'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function DocumentDirection() {
    const { i18n } = useTranslation()

    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.dir = dir
        document.documentElement.lang = i18n.language
    }, [i18n.language])

    return null // لا تحتاج لعرض شيء
}
