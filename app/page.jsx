// app/page.jsx

import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import FreelancerCards from '../components/FreelancerCards'

export default function HomePage() {
    return (
        <main className="font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <Hero />
            <Features />
            <FreelancerCards />
            <HowItWorks />
            <Testimonials />
            <Footer />
        </main>
    )
}
