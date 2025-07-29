// 'use client'

// import { useEffect, useState } from "react"
// import Link from "next/link"

// export default function ProjectsListPage() {
//     const [projects, setProjects] = useState([])

//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const res = await fetch('/api/projects')
//                 if (!res.ok) throw new Error('فشل في جلب المشاريع')
//                 const data = await res.json()
//                 setProjects(data)
//             } catch (error) {
//                 console.error('خطأ في جلب المشاريع:', error)
//             }
//         }

//         fetchProjects()
//     }, [])

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">جميع المشاريع</h1>

//             {projects.length === 0 ? (
//                 <p>لا توجد مشاريع حاليًا</p>
//             ) : (
//                 <ul className="space-y-4">
//                     {projects.map((project) => (
//                         <li key={project.id} className="border p-4 rounded">
//                             <h2 className="text-xl font-semibold">{project.title}</h2>
//                             <p className="text-gray-700">{project.description}</p>
//                             <p className="text-sm text-gray-500">الميزانية: {project.budget} ريال</p>
//                             <Link
//                                 href={`/projects/${project.id}`}
//                                 className="text-blue-600 hover:underline block mt-2"
//                             >
//                                 عرض التفاصيل
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     )
// }


// 'use client'

// import { useEffect, useState } from "react"
// import Link from "next/link"

// export default function ProjectsListPage() {
//     const [projects, setProjects] = useState([])

//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const res = await fetch('/api/projects')
//                 if (!res.ok) throw new Error('فشل في جلب المشاريع')
//                 const data = await res.json()
//                 setProjects(data)
//             } catch (error) {
//                 console.error('خطأ في جلب المشاريع:', error)
//             }
//         }

//         fetchProjects()
//     }, [])

//     return (
//         <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
//             <h1 className="text-3xl font-bold mb-8 text-center">جميع المشاريع</h1>

//             {projects.length === 0 ? (
//                 <p className="text-center text-gray-600 dark:text-gray-400 mt-10">لا توجد مشاريع حالياً</p>
//             ) : (
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//                     {projects.map((project) => (
//                         <li
//                             key={project.id}
//                             className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
//                         >
//                             <div>
//                                 <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
//                                 <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
//                                     الميزانية: <span className="text-green-600 dark:text-green-400">{project.budget} ريال</span>
//                                 </p>
//                             </div>
//                             <Link
//                                 href={`/projects/${project.id}`}
//                                 className="mt-6 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
//                             >
//                                 عرض التفاصيل &rarr;
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     )
// }

'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProjectsListPage() {
    const [projects, setProjects] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // دالة جلب المشاريع مع page و search
    const fetchProjects = async (pageNumber = 1, searchTerm = '', append = false) => {
        setLoading(true)
        setError('')
        try {
            const queryParams = new URLSearchParams()
            if (pageNumber > 1) queryParams.append('page', pageNumber)
            if (searchTerm) queryParams.append('search', searchTerm)

            const res = await fetch(`/api/projects?${queryParams.toString()}`)
            if (!res.ok) throw new Error('فشل في جلب المشاريع')

            const data = await res.json()
            if (append) {
                setProjects(prev => [...prev, ...data.projects])
            } else {
                setProjects(data.projects)
            }
            setHasMore(data.hasMore)
        } catch (err) {
            setError(err.message || 'حدث خطأ غير متوقع')
        } finally {
            setLoading(false)
        }
    }

    // جلب المشاريع أول مرة وعند تغير البحث
    useEffect(() => {
        setPage(1)
        fetchProjects(1, search, false)
    }, [search])

    // تحميل المزيد
    const handleLoadMore = () => {
        const nextPage = page + 1
        fetchProjects(nextPage, search, true)
        setPage(nextPage)
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-center">جميع المشاريع</h1>

            {/* حقل البحث */}
            <div className="max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="ابحث عن مشروع..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </div>

            {error && (
                <p className="text-red-600 text-center mb-6">{error}</p>
            )}

            {projects.length === 0 && !loading ? (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-10">لا توجد مشاريع حالياً</p>
            ) : (
                <>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                        الميزانية: <span className="text-green-600 dark:text-green-400">{project.budget} ريال</span>
                                    </p>
                                </div>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="mt-6 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                    عرض التفاصيل &rarr;
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* زر تحميل المزيد */}
                    {hasMore && !loading && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
                            >
                                تحميل المزيد
                            </button>
                        </div>
                    )}

                    {loading && (
                        <p className="text-center mt-6">جارِ تحميل المزيد...</p>
                    )}
                </>
            )}
        </div>
    )
}

