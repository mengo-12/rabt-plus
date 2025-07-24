// // app/freelancers/page.jsx
// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'

// export default function AllFreelancersPage() {
//     const [freelancers, setFreelancers] = useState([])
//     const [search, setSearch] = useState('')
//     const [filtered, setFiltered] = useState([])

//     useEffect(() => {
//         const fetchFreelancers = async () => {
//             const res = await fetch('/api/freelancers')
//             const data = await res.json()
//             setFreelancers(data)
//             setFiltered(data)
//         }

//         fetchFreelancers()
//     }, [])

//     useEffect(() => {
//         const results = freelancers.filter(f =>
//             f.name.toLowerCase().includes(search.toLowerCase())
//         )
//         setFiltered(results)
//     }, [search, freelancers])

//     return (
//         <div className="container mx-auto px-4 py-12">
//             <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">جميع المستقلين</h1>

//             {/* حقل البحث */}
//             <div className="mb-8 max-w-md mx-auto">
//                 <input
//                     type="text"
//                     placeholder="ابحث باسم المستقل..."
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
//                 />
//             </div>

//             {/* الشبكة */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {filtered.length > 0 ? (
//                     filtered.map(freelancer => (
//                         <Link
//                             key={freelancer.id}
//                             href={`/freelancers/${freelancer.id}`}
//                             className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 p-4"
//                         >
//                             <div className="flex flex-col items-center text-center">
//                                 <img
//                                     src={freelancer.avatar || '/default-avatar.png'}
//                                     alt={freelancer.name}
//                                     className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-blue-500"
//                                 />
//                                 <h2 className="text-lg font-bold">{freelancer.name}</h2>
//                                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{freelancer.bio}</p>
//                             </div>
//                         </Link>
//                     ))
//                 ) : (
//                     <p className="text-center text-gray-500 col-span-full">لا يوجد مستقلين مطابقين</p>
//                 )}
//             </div>
//         </div>
//     )
// }

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AllFreelancersPage() {
    const [freelancers, setFreelancers] = useState([])
    const [search, setSearch] = useState('')
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        const fetchFreelancers = async () => {
            const res = await fetch('/api/freelancers')
            const data = await res.json()
            setFreelancers(data)
            setFiltered(data)
        }

        fetchFreelancers()
    }, [])

    useEffect(() => {
        const results = freelancers.filter(f =>
            f.name.toLowerCase().includes(search.toLowerCase())
        )
        setFiltered(results)
    }, [search, freelancers])




    function renderStars(rating) {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating - fullStars >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        )
    }


    useEffect(() => {
        console.log(freelancers) // تحقق مما إذا كان avgRating موجود فعلاً
    }, [freelancers])

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">جميع المستقلين</h1>

            {/* حقل البحث */}
            <div className="mb-8 max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="ابحث باسم المستقل..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
            </div>

            {/* الشبكة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(freelancer => (
                        <Link
                            key={freelancer.id}
                            href={`/freelancers/${freelancer.id}`}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 p-4"
                        >
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={freelancer.avatar || '/default-avatar.png'}
                                    alt={freelancer.name}
                                    className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-blue-500"
                                />
                                <h2 className="text-lg font-bold">{freelancer.name}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{freelancer.bio}</p>

                                {/* عرض متوسط التقييم */}
                                {freelancer.avgRating > 0 ? (
                                    <div className="mt-2 text-sm text-yellow-500 font-medium text-center">
                                        <div className="text-lg">{renderStars(freelancer.avgRating)}</div>
                                        <p className="mt-1">
                                            ({freelancer.avgRating.toFixed(1)} / 5)
                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                – {freelancer.reviewsCount} تقييم
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-400 text-center">لا يوجد تقييمات</p>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">لا يوجد مستقلين مطابقين</p>
                )}
            </div>
        </div>
    )
}
