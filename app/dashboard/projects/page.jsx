'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

export default function MyProjectsPage() {
    const [projects, setProjects] = useState([])

    const fetchProjects = async () => {
        const res = await fetch('/api/my-projects')
        if (!res.ok) return
        const data = await res.json()
        setProjects(data)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleDelete = async (id) => {
        const confirm = window.confirm("هل أنت متأكد أنك تريد حذف هذا المشروع؟")
        if (!confirm) return

        const res = await fetch(`/api/my-projects/${id}`, {
            method: 'DELETE',
        })

        if (res.ok) {
            setProjects(projects.filter(p => p.id !== id))
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">مشاريعي</h1>

            {projects.length === 0 ? (
                <p className="text-gray-600">لم تقم بإضافة أي مشروع بعد.</p>
            ) : (
                <ul className="space-y-4">
                    {projects.map((project) => (
                        <li key={project.id} className="p-4 border rounded shadow-sm relative">
                            <h2 className="text-xl font-semibold">{project.title}</h2>
                            <p className="text-gray-700">{project.description}</p>
                            <p className="text-sm text-gray-500">الميزانية: {project.budget} ريال</p>
                            <div className="flex items-center justify-between mt-2">
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    عرض التفاصيل →
                                </Link>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    حذف المشروع
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}