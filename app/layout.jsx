import './globals.css'
import { Providers } from './providers'
import DocumentDirection from '@/components/DocumentDirection'
import Header from '../components/Header'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'اسم موقعك',
    description: 'وصف الموقع',
}

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-cairo bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 pt-20">
                <Providers>
                    <DocumentDirection />
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
