/** @type {import('tailwindcss').Config} */

const rtl = require('tailwindcss-rtl');

module.exports = {
    darkMode: 'class',
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
    theme: {
        extend: {
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
                tajawal: ['Tajawal', 'sans-serif'],
            },
            colors: {
                primary: '#00bfa6', // تركواز
                secondary: '#1f2937', // رمادي غامق
            },
        },
    },
    plugins: [
        require('flowbite/plugin'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        rtl()
    ],
    corePlugins: {
        preflight: true,
    },
}