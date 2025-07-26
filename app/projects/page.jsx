'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProjectsListPage() {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects')
                if (!res.ok) throw new Error('فشل في جلب المشاريع')
                const data = await res.json()
                setProjects(data)
            } catch (error) {
                console.error('خطأ في جلب المشاريع:', error)
            }
        }

        fetchProjects()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">جميع المشاريع</h1>

            {projects.length === 0 ? (
                <p>لا توجد مشاريع حاليًا</p>
            ) : (
                <ul className="space-y-4">
                    {projects.map((project) => (
                        <li key={project.id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">{project.title}</h2>
                            <p className="text-gray-700">{project.description}</p>
                            <p className="text-sm text-gray-500">الميزانية: {project.budget} ريال</p>
                            <Link
                                href={`/projects/${project.id}`}
                                className="text-blue-600 hover:underline block mt-2"
                            >
                                عرض التفاصيل
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
