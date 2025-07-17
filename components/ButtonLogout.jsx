'use client'

import { useRouter } from 'next/navigation'

export default function ButtonLogout() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' }) // لا تستخدم GET
        router.push('/login')
    }

    return (
        <button
            onClick={handleLogout}
            className="text-red-600 hover:underline mt-4 block"
        >
            تسجيل الخروج
        </button>
    )
}