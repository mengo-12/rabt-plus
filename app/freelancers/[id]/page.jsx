// 'use client'
// import { useParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'

// export default function FreelancerPage() {
//     const { id } = useParams()
//     const [freelancer, setFreelancer] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const { data: session } = useSession()

//     useEffect(() => {
//         const fetchFreelancer = async () => {
//             const res = await fetch(`/api/freelancers/${id}`)
//             const data = await res.json()
//             setFreelancer(data)
//             setLoading(false)
//         }

//         if (id) fetchFreelancer()
//     }, [id])

//     if (loading) {
//         return <div className="text-center py-10 text-gray-500 dark:text-gray-400">جاري تحميل بيانات المستقل...</div>
//     }

//     if (!freelancer) {
//         return <div className="text-center py-10 text-red-500">لا يمكن العثور على هذا المستقل</div>
//     }

//     const isClient = session?.user?.role === 'client'

//     return (
//         <div className="container mx-auto px-4 py-12 max-w-3xl">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//                 <div className="flex flex-col items-center">
//                     <img
//                         src={freelancer.avatar || '/default-avatar.png'}
//                         className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4"
//                     />
//                     <h1 className="text-2xl font-bold text-center">{freelancer.name}</h1>
//                     <p className="text-gray-500 mt-2">{freelancer.bio}</p>
//                 </div>

//                 <div className="mt-6 space-y-4">
//                     <section>
//                         <h2 className="text-lg font-semibold">الوصف الكامل</h2>
//                         <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{freelancer.description}</p>
//                     </section>

//                     <section>
//                         <h2 className="text-lg font-semibold">المهارات</h2>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                             {['تصميم', 'React', 'Node.js'].map(skill => (
//                                 <span key={skill} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
//                                     {skill}
//                                 </span>
//                             ))}
//                         </div>
//                     </section>

//                     {freelancer.cv && (
//                         <section>
//                             <a href={freelancer.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 underline">
//                                 تحميل السيرة الذاتية
//                             </a>
//                         </section>
//                     )}

//                     {isClient && (
//                         <div className="text-center mt-6">
//                             <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">تواصل مع المستقل</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import RatingForm from '@/components/RatingForm'
import { useSession } from 'next-auth/react'

export default function FreelancerPage() {
    const { id } = useParams()
    const { data: session, status } = useSession()
    const [freelancer, setFreelancer] = useState(null)
    const [ratings, setRatings] = useState([])
    const [hasRated, setHasRated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/freelancers/${id}`)
                const data = await res.json()

                if (res.ok) {
                    setFreelancer(data.freelancer)
                    setRatings(data.freelancer.freelancerRatings || [])
                    setHasRated(data.alreadyRated || false)
                } else {
                    setFreelancer(null)
                    setRatings([])
                    setHasRated(false)
                }
            } catch (error) {
                console.error('فشل في تحميل بيانات المستقل:', error)
                setFreelancer(null)
                setRatings([])
                setHasRated(false)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchData()
    }, [id])

    const averageRating =
        ratings.length > 0
            ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            : null

    // دالة لتحديث التقييمات بعد إضافة تقييم جديد
    const handleNewRating = (newRating) => {
        // ضيف بيانات العميل بناءً على الجلسة (session.user)
        const newRatingWithClient = {
            ...newRating,
            client: {
                id: session?.user?.id,
                name: session?.user?.name || "مستخدم مجهول",
            }
        }
        setRatings(prev => [newRatingWithClient, ...prev])
        setHasRated(true)
    }

    if (loading) return <p className="text-center py-10">جاري التحميل...</p>
    if (!freelancer) return <p className="text-center py-10 text-red-500">لم يتم العثور على المستقل.</p>

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4">
                {freelancer.avatar && (
                    <Image
                        src={freelancer.avatar}
                        alt={freelancer.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                    />
                )}
                <div>
                    <h1 className="text-2xl font-bold">{freelancer.name}</h1>
                    {averageRating ? (
                        <p>⭐ متوسط التقييم: {averageRating} / 5</p>
                    ) : (
                        <p>لم يتم التقييم بعد</p>
                    )}
                </div>
            </div>

            {freelancer.bio && (
                <div className="mt-4">
                    <h2 className="font-semibold">نبذة:</h2>
                    <p>{freelancer.bio}</p>
                </div>
            )}

            {freelancer.description && (
                <div className="mt-4">
                    <h2 className="font-semibold">الوصف التفصيلي:</h2>
                    <p>{freelancer.description}</p>
                </div>
            )}

            {freelancer.cv && (
                <div className="mt-4">
                    <a
                        href={freelancer.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        عرض السيرة الذاتية
                    </a>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">التقييمات:</h2>
                {ratings.length > 0 ? (
                    <ul className="space-y-3">
                        {ratings.map((r) => (
                            <li key={r.id} className="border p-3 rounded">
                                <p>⭐ {r.rating} / 5</p>
                                {r.comment && <p className="mt-1">{r.comment}</p>}
                                <p className="text-sm text-gray-500 mt-1">
                                    بواسطة: {r.client?.name || "مستخدم مجهول"}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>لا توجد تقييمات بعد</p>
                )}
            </div>

            {session?.user?.role === 'client' && !hasRated && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">أضف تقييمك:</h2>
                    <RatingForm freelancerId={freelancer.id} onSubmitSuccess={handleNewRating} />
                </div>
            )}

            {session?.user?.role === 'client' && hasRated && (
                <p className="mt-4 text-green-600">لقد قمت بتقييم هذا المستقل بالفعل.</p>
            )}
        </div>
    )
}


