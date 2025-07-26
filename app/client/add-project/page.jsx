// app/client/add-project/page.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProjectPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [budget, setBudget] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    budget: parseFloat(budget),
                }),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || 'حدث خطأ أثناء إضافة المشروع')
            }

            const data = await res.json()
            router.push(`/projects/${data.id}`) // توجيه لصفحة المشروع بعد الإضافة
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-8">
            <h1 className="text-2xl font-bold mb-4">إضافة مشروع جديد</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}

                <div>
                    <label className="block font-medium">عنوان المشروع</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">وصف المشروع</label>
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">الميزانية (اختياري)</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                    {loading ? 'جارٍ النشر...' : 'نشر المشروع'}
                </button>
            </form>
        </div>
    )
}
