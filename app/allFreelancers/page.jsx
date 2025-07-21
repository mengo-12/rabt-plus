// app/freelancers/page.jsx
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-primary dark:bg-gray-800 dark:text-white"
                />
            </div>

            {/* الشبكة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(freelancer => (
                        <Link
                            key={freelancer.id}
                            href={`/freelancers/${freelancer.id}`}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition"
                        >
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={freelancer.avatar || '/default-avatar.png'}
                                    alt={freelancer.name}
                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{freelancer.name}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{freelancer.bio}</p>
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

