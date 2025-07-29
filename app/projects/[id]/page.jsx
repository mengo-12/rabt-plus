'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PhoneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'

export default function ProjectDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [project, setProject] = useState(null)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${id}`)
                if (!res.ok) throw new Error("فشل في جلب البيانات")
                const data = await res.json()
                setProject(data)

                if (session?.user?.id === data.userId) {
                    setIsOwner(true)
                }
            } catch (error) {
                console.error("خطأ:", error)
            }
        }

        if (id) fetchProject()
    }, [id, session])

    const handleDelete = async () => {
        const confirmed = confirm("هل أنت متأكد من حذف المشروع؟")
        if (!confirmed) return

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                alert("تم حذف المشروع بنجاح")
                router.push('/dashboard/client/projects')
            } else {
                alert("حدث خطأ أثناء الحذف")
            }
        } catch (error) {
            console.error("فشل في الحذف:", error)
        }
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <p className="text-lg font-medium">جاري تحميل المشروع...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
                    {/* عنوان المشروع + اسم العميل + الحالة */}
                    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {project.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            {/* اسم العميل */}
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">العميل:</span> {project.client?.name || "غير معروف"}
                            </p>

                            {/* حالة المشروع */}
                            <span className="inline-block px-3 py-1 text-sm rounded-full font-semibold 
                bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                                الحالة: {project.status}
                            </span>
                        </div>
                    </div>

                    {/* وصف المشروع */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            وصف المشروع
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {project.description || "لم يتم تقديم وصف للمشروع."}
                        </p>
                    </div>

                    {/* تفاصيل إضافية */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">تاريخ النشر</h3>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {new Date(project.createdAt).toLocaleDateString("ar-EG")}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">التاريخ المتوقع للتسليم</h3>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {project.deadline ? new Date(project.deadline).toLocaleDateString("ar-EG") : "غير محدد"}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">ميزانية المشروع</h3>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {project.budget ? `${project.budget.toLocaleString()} ريال` : "غير محددة"}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm text-gray-500 dark:text-gray-400">عدد العروض المقدمة</h3>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {project.proposals?.length || 0} عرض
                            </p>
                        </div>
                    </div>
                </div>


                {!isOwner && project.client?.phone && (
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                <PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                                    رقم العميل للتواصل:
                                </p>
                                <div className="flex items-center gap-2">
                                    <span dir="ltr" className="text-green-600 dark:text-green-400 font-medium">
                                        {project.client.phone}
                                    </span>
                                    <a
                                        href={`https://wa.me/${project.client.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                        title="تواصل عبر واتساب"
                                    >
                                        {/* شعار واتساب */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M16.67 13.13c-.26-.13-1.52-.75-1.75-.84s-.4-.13-.57.13-.66.84-.81 1c-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.26-.78-.7-1.3-1.57-1.45-1.84-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45s-.57-1.38-.78-1.9c-.2-.48-.41-.42-.57-.43h-.48c-.17 0-.44.06-.66.3-.23.26-.87.85-.87 2.1 0 1.26.89 2.48 1.01 2.65.13.17 1.76 2.72 4.27 3.8.6.26 1.07.41 1.43.52.6.19 1.14.16 1.56.1.48-.07 1.52-.62 1.73-1.23.21-.6.21-1.1.15-1.23-.06-.13-.24-.2-.5-.32m-4.6 7.31h-.01a9.87 9.87 0 0 1-5.03-1.38L2 21l1.95-5.68A9.85 9.85 0 0 1 2 9.87c0-5.44 4.43-9.87 9.87-9.87a9.84 9.84 0 0 1 9.87 9.87c0 5.44-4.43 9.87-9.87 9.87" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isOwner && (
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => router.push(`/dashboard/client/projects/edit/${project.id}`)}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                            تعديل
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            حذف
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

