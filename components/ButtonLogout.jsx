// 'use client'

// import { useRouter } from 'next/navigation'

// export default function ButtonLogout() {
//     const router = useRouter()

//     const handleLogout = async () => {
//         await fetch('/api/logout', { method: 'POST' }) // لا تستخدم GET
//         router.push('/login')
//     }

//     return (
//         <button
//             onClick={handleLogout}
//             className="text-red-600 hover:underline mt-4 block"
//         >
//             تسجيل الخروج
//         </button>
//     )
// }

"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-4 py-2 rounded"
        >
            تسجيل الخروج
        </button>
    );
}