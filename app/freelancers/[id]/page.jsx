// app/freelancers/[id]/page.jsx

import { PrismaClient } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function FreelancerProfile({ params }) {
    const id = params?.id

    if (!id) {
        return <div className="text-center text-red-600">معرّف غير صالح</div>
    }

    const user = await prisma.user.findUnique({
        where: { id },
    })

    if (!user || user.role !== "freelancer") {
        return <div className="text-center mt-10 text-red-600">المستخدم غير موجود أو ليس مستقلًا</div>
    }

    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded">
                <div className="flex items-center space-x-4 mb-4">
                    {user.avatar ? (
                        <Image
                            src={user.avatar}
                            alt="الصورة الشخصية"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                            لا صورة
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {user.cv && (
                    <div className="mt-4">
                        <Link
                            href={user.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            عرض السيرة الذاتية
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
