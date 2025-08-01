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
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 py-8 px-4">
            <div className="max-w-3xl mx-auto rounded-lg shadow-md bg-white dark:bg-gray-800 p-6">
                <div className="flex items-center gap-4">
                    {freelancer.avatar && (
                        <div className="w-20 h-20 relative flex-shrink-0 rounded-full overflow-hidden border-2 border-blue-500">
                            <Image
                                src={freelancer.avatar}
                                alt={freelancer.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1">
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
                        <button
                            onClick={() => window.open(freelancer.cv, '_blank')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            عرض السيرة الذاتية
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">التقييمات:</h2>
                    {ratings.length > 0 ? (
                        <ul className="space-y-3">
                            {ratings.map((r) => (
                                <li
                                    key={r.id}
                                    className="border border-gray-300 dark:border-gray-700 p-3 rounded bg-gray-50 dark:bg-gray-800"
                                >
                                    <p>⭐ {r.rating} / 5</p>
                                    {r.comment && <p className="mt-1">{r.comment}</p>}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        بواسطة: {r.client?.name || "مستخدم مجهول"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">لا توجد تقييمات بعد</p>
                    )}
                </div>

                {session?.user?.role === 'client' && !hasRated && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">أضف تقييمك:</h2>
                        <RatingForm freelancerId={freelancer.id} onSubmitSuccess={handleNewRating} />
                    </div>
                )}

                {session?.user?.role === 'client' && hasRated && (
                    <p className="mt-4 text-green-600 dark:text-green-400">لقد قمت بتقييم هذا المستقل بالفعل.</p>
                )}
            </div>
        </div>

    )
}


