/** @type {import('tailwindcss').Config} */

const rtl = require('tailwindcss-rtl');

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        './node_modules/flowbite-react/**/*.js',
        "./page/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],

    safelist: [
        "keen-slider",
        "keen-slider__slide"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            colors: {
                primary: '#4F46E5',       // اللون الرئيسي (بنفسجي)
                secondary: '#6366F1',     // لون ثانوي
                accent: '#FBBF24',        // لون مميز (أصفر)
                dark: '#1F2937',          // رمادي غامق
                light: '#F9FAFB',         // رمادي فاتح
            },
        },
    },
    plugins: [
        require('flowbite/plugin'),
        rtl()
    ],
}