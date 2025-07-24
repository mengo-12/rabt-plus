'use client'

import { useState } from 'react'

export default function RatingForm({ freelancerId, onSubmitSuccess }) {
    const [ratingValue, setRatingValue] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    freelancerId,
                    rating: ratingValue,
                    comment,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'فشل إرسال التقييم')
            }

            const newRating = await res.json()
            setRatingValue(5)
            setComment('')
            onSubmitSuccess(newRating)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">التقييم (من 1 إلى 5)</label>
                <select
                    value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                >
                    {[1, 2, 3, 4, 5].map(val => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">تعليق (اختياري)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
        </form>
    )
}
