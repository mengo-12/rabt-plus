'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message)
            return
        }

        // توجيه حسب الدور بعد تسجيل الدخول
        if (data.role === 'freelancer') {
            router.push('/dashboard/profile') // توجيه المستقل لصفحة الملف الشخصي داخل داشبورد
        } else {
            router.push('/dashboard') // توجيه العملاء إلى الصفحة الرئيسية للداشبورد
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-black">تسجيل الدخول</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded text-black"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    دخول
                </button>
            </form>
            <p className="mt-4 text-center">
                لا تملك حساب؟{' '}
                <a href="/register" className="text-blue-600 underline">
                    سجل الآن
                </a>
            </p>
        </div>
    )
}
