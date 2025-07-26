'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

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

                // تحقق إذا المستخدم الحالي هو صاحب المشروع
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

    if (!project) return <p className="p-4">جاري التحميل...</p>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <p className="mb-1">الميزانية: <strong>{project.budget} ريال</strong></p>
            <p className="mb-4">الحالة: {project.status}</p>

            {isOwner ? (
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push(`/dashboard/client/projects/edit/${project.id}`)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                        تعديل
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        حذف
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-500">هذا المشروع نُشر من قبل عميل آخر</p>
            )}
        </div>
    )
}
