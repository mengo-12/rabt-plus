import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export default async function DashboardPage() {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                يجب تسجيل الدخول أولاً.
            </div>
        )
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)

        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">مرحبًا، {user.email} 👋</h1>
                    <p className="text-lg mt-2">أنت مسجّل كـ {user.role}</p>
                </div>
            </main>
        )
    } catch (error) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                الجلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى.
            </div>
        )
    }
}
