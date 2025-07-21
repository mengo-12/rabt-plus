// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"
// import Link from "next/link"
// import { redirect } from "next/navigation"
// import ButtonLogout from "../../components/ButtonLogout"

// const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

// export default async function DashboardLayout({ children }) {
//     const cookieStore = await cookies()
//     const token = cookieStore.get("token")?.value

//     if (!token) {
//         redirect("/login") // ✅ إعادة توجيه بدلاً من رسالة
//     }

//     try {
//         const user = jwt.verify(token, JWT_SECRET)

//         return (
//             <div className="min-h-screen flex bg-gray-100">
//                 {/* Sidebar */}
//                 <aside className="w-64 bg-white shadow-md p-6">
//                     <h2 className="text-xl font-bold mb-4">لوحة التحكم</h2>
//                     <ul className="space-y-2">
//                         <li>
//                             <Link href="/dashboard" className="text-blue-600">
//                                 الرئيسية
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/dashboard/profile" className="text-blue-600">
//                                 الملف الشخصي
//                             </Link>
//                         </li>
//                         <ButtonLogout />
//                     </ul>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="flex-1 p-6">
//                     <header className="mb-6">
//                         <p className="text-gray-700">مرحبًا، {user.name}</p>
//                     </header>

//                     {children}
//                 </main>
//             </div>
//         )
//     } catch (error) {
//         console.error("خطأ في التحقق من التوكن:", error)
//         redirect("/login") // ✅ إعادة التوجيه عند توكن غير صالح
//     }
// }

// dashboard/layout.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions"; // تأكد من المسار
import Link from "next/link";
import { redirect } from "next/navigation";
import ButtonLogout from "../../components/ButtonLogout";

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">لوحة التحكم</h2>
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className="text-blue-600">
                            الرئيسية
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/profile" className="text-blue-600">
                            الملف الشخصي
                        </Link>
                    </li>
                    <ButtonLogout />
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <header className="mb-6">
                    <p className="text-gray-700">مرحبًا، {session.user.name}</p>
                </header>

                {children}
            </main>
        </div>
    );
}
