// register/page.jsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "freelancer",
    })

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })

        const data = await res.json()
        setLoading(false)

        if (res.ok) {
            if (data.user.role === "freelancer") {
                router.push("/dashboard/profile")
            } else {
                router.push("/dashboard")
            }
        } else {
            setMessage(data.message || "فشل التسجيل")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">إنشاء حساب</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="الاسم الكامل"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                    >
                        <option value="freelancer">مستقل</option>
                        <option value="client">صاحب مشروع</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? "جاري التسجيل..." : "تسجيل"}
                    </button>

                    {message && (
                        <p className="text-center text-sm text-red-600 mt-2">{message}</p>
                    )}
                </form>
            </div>
        </div>
    )
}
