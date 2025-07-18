
// import '../i18n'

import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

export default function HomePage() {
    return (
        <main className="font-sans">
            <Header />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Footer />
        </main>
    )
}
