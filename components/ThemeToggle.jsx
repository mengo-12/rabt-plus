'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if (localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setDarkMode(true)
        } else {
            document.documentElement.classList.remove('dark')
            setDarkMode(false)
        }
    }, [])

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
            setDarkMode(false)
        } else {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
            setDarkMode(true)
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="ml-2 px-3 py-1 rounded border text-sm dark:bg-white dark:text-black bg-black text-white transition"
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    )
}
