// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"

// const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

// export default async function DashboardPage() {
//     const cookieStore = cookies()
//     const token = cookieStore.get("token")?.value

//     if (!token) {
//         return (
//             <div className="text-center mt-10 text-red-600 font-semibold">
//                 يجب تسجيل الدخول أولاً.
//             </div>
//         )
//     }

//     try {
//         const user = jwt.verify(token, JWT_SECRET)

//         return (
//             <main className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="text-center">
//                     <h1 className="text-3xl font-bold">مرحبًا، {user.email} 👋</h1>
//                     <p className="text-lg mt-2">أنت مسجّل كـ {user.role}</p>
//                 </div>
//             </main>
//         )
//     } catch (error) {
//         return (
//             <div className="text-center mt-10 text-red-600 font-semibold">
//                 الجلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى.
//             </div>
//         )
//     }
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                يجب تسجيل الدخول أولاً.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    مرحبًا، {session.user.email} 👋
                </h1>
                <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
                    أنت مسجّل كـ <span className="font-semibold">{session.user.role}</span>
                </p>
            </div>
        </main>
    );
}
