// 'use client'
// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react' // أو أي نظام تحقق تستخدمه
// import { useParams } from 'next/navigation'

// export default function FreelancerPage() {
//     const { id } = useParams()
//     const { data: session } = useSession()
//     const [freelancer, setFreelancer] = useState(null)

//     useEffect(() => {
//         const fetchFreelancer = async () => {
//             const res = await fetch(`/api/freelancers/${id}`)
//             const data = await res.json()
//             setFreelancer(data)
//         }
//         fetchFreelancer()
//     }, [id])

//     if (!freelancer) return <p>جاري التحميل...</p>

//     const isSubscribed = session?.user?.isSubscribed // افترضنا هذا الحقل

//     return (
//         <div className="container mx-auto py-10">
//             <img src={freelancer.avatar} alt="الصورة الشخصية" className="w-32 h-32 rounded-full mb-4" />
//             <h1 className="text-2xl font-bold">{freelancer.name}</h1>

//             {isSubscribed ? (
//                 <>
//                     <p>السيرة الذاتية: <a href={freelancer.cv} target="_blank" className="text-blue-500 underline">عرض</a></p>
//                     {/* مزيد من التفاصيل */}
//                 </>
//             ) : (
//                 <p className="text-gray-600 mt-4">اشترك في المنصة لعرض باقي بيانات المستقل.</p>
//             )}

//             {isSubscribed && freelancer.description && (
//                 <div className="mt-4">
//                     <h2 className="font-semibold text-lg mb-2">عن المستقل:</h2>
//                     <p className="text-gray-700">{freelancer.description}</p>
//                 </div>
//             )}
//         </div>
//     )
// }


// 'use client'
// export const dynamic = 'force-dynamic'

// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { useParams } from 'next/navigation'

// export default function FreelancerPage() {
//     const params = useParams()
//     const id = params.id?.toString().split(" ")[0] // احتياط ضد تكرار

//     const { data: session } = useSession()
//     const [freelancer, setFreelancer] = useState(null)

//     useEffect(() => {
//         const fetchFreelancer = async () => {
//             const res = await fetch(`/api/freelancers/${id}`)
//             const data = await res.json()
//             setFreelancer(data)
//         }
//         fetchFreelancer()
//     }, [id])

//     if (!freelancer) return <p>جاري التحميل...</p>

//     const isSubscribed = session?.user?.isSubscribed

//     return (
//         <div className="container mx-auto py-10">
//             <img src={freelancer.avatar} alt="الصورة الشخصية" className="w-32 h-32 rounded-full mb-4" />
//             <h1 className="text-2xl font-bold">{freelancer.name}</h1>

//             {isSubscribed ? (
//                 <>
//                     <p>السيرة الذاتية: <a href={freelancer.cv} target="_blank" className="text-blue-500 underline">عرض</a></p>
//                 </>
//             ) : (
//                 <p className="text-gray-600 mt-4">اشترك في المنصة لعرض باقي بيانات المستقل.</p>
//             )}

//             {isSubscribed && freelancer.description && (
//                 <div className="mt-4">
//                     <h2 className="font-semibold text-lg mb-2">عن المستقل:</h2>
//                     <p className="text-gray-700">{freelancer.description}</p>
//                 </div>
//             )}
//         </div>
//     )
// }


'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function FreelancerPage() {
    const { id } = useParams()
    const [freelancer, setFreelancer] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchFreelancer = async () => {
            const res = await fetch(`/api/freelancers/${id}`)
            const data = await res.json()
            setFreelancer(data)
            setLoading(false)
        }

        if (id) fetchFreelancer()
    }, [id])

    if (loading) {
        return <div className="text-center py-10 text-gray-500 dark:text-gray-400">جاري تحميل بيانات المستقل...</div>
    }

    if (!freelancer) {
        return <div className="text-center py-10 text-red-500">لا يمكن العثور على هذا المستقل</div>
    }

    const isClient = session?.user?.role === 'client'

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {/* معلومات المستقل */}
                <div className="flex flex-col items-center text-center">
                    <img
                        src={freelancer.avatar || '/default-avatar.png'}
                        alt={freelancer.name}
                        className="w-28 h-28 rounded-full object-cover mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{freelancer.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{freelancer.bio || 'لا توجد نبذة حالياً'}</p>
                </div>

                {/* الوصف الكامل */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">الوصف الكامل</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {freelancer.description || 'لا يوجد وصف حالياً'}
                    </p>
                </div>

                {/* المهارات */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">المهارات</h2>
                    <div className="flex flex-wrap gap-2">
                        {/* يمكنك لاحقًا جلب المهارات من قاعدة البيانات */}
                        {['تصميم', 'React', 'Node.js'].map(skill => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* رابط السيرة الذاتية */}
                {freelancer.cv && (
                    <div className="mt-6">
                        <a
                            href={freelancer.cv}
                            target="_blank"
                            className="text-primary underline dark:text-blue-300"
                            rel="noopener noreferrer"
                        >
                            تحميل السيرة الذاتية
                        </a>
                    </div>
                )}

                {/* زر التواصل */}
                {isClient && (
                    <div className="mt-8 text-center">
                        <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">
                            تواصل مع المستقل
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

