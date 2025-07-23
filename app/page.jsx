// app/page.jsx

// import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import FreelancerCards from '../components/FreelancerCards'

export default function HomePage() {
    return (
        <main className="font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">منصة المستقلين المبرمجين</h1>
                <p className="text-lg md:text-xl mb-6">انطلق بمشروعك مع أفضل المطورين</p>
                <div className="flex justify-center gap-4">
                    <a href="/allFreelancers" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">استعرض المبرمجين</a>
                    <a href="/freelancer-signup" className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">انضم كمبرمج</a>
                    <a href="/client-signup" className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">انضم عميل</a>
                </div>
            </section>

            {/* <Hero /> */}
            <Features />
            <FreelancerCards />
            <HowItWorks />
            <Testimonials />
            <Footer />
        </main>
    )
}
