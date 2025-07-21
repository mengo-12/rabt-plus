'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
    const router = useRouter()
    const { data: session, status } = useSession();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [currentAvatar, setCurrentAvatar] = useState("")
    const [cv, setCV] = useState(null)
    const [currentCV, setCurrentCV] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [description, setDescription] = useState("")
    const [bio, setBio] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/profile", {
                method: "GET",
                credentials: "include", // ✅ ضروري لتمرير الكوكيز
            })
            if (res.ok) {
                const data = await res.json()
                setId(data.id)
                setName(data.name)
                setEmail(data.email)
                setRole(data.role)
                setCurrentAvatar(data.avatar || "")
                setCurrentCV(data.cv || "")
                setDescription(data.description || "")
                setBio(data.bio || "")
            } else {
                router.push("/login")
            }
            setLoading(false)
        }

        fetchUser()
    }, [router])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        const formData = new FormData()
        formData.append("name", name)
        formData.append("password", password)
        formData.append("oldPassword", oldPassword)
        formData.append("description", description)
        formData.append("bio", bio)
        if (avatar) formData.append("avatar", avatar)
        if (cv) formData.append("cv", cv)

        const res = await fetch("/api/profile", {
            method: "PUT",
            body: formData,
            credentials: "include", // اختياري لكن يُفضل
        })

        const data = await res.json()

        if (res.ok) {
            setMessage("✅ تم تحديث البيانات بنجاح")
            setPassword("")
            setOldPassword("")
            setAvatar(null)
            setCV(null)
        } else {
            setMessage(data.message || "حدث خطأ في التحديث")
        }
    }

    if (loading) {
        return <p className="text-center mt-10">جارٍ التحميل...</p>
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-4"
                encType="multipart/form-data"
            >
                <h1 className="text-xl font-bold text-center mb-4 text-black">تعديل الملف الشخصي</h1>

                {message && (
                    <p className={`text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                {currentAvatar && (
                    <div className="text-center">
                        <img
                            src={currentAvatar || "/default-avatar.png"}
                            alt="الصورة الشخصية"
                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                    </div>
                )}

                <div>
                    <label className="block font-medium mb-1 text-black">الصورة الشخصية</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        className="w-full border rounded p-2 text-black"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">السيرة الذاتية (PDF)</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCV(e.target.files[0])}
                        className="w-full border rounded p-2 text-black"
                    />
                </div>

                {currentCV && (
                    <a
                        href={currentCV}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-blue-600 underline"
                    >
                        عرض السيرة الذاتية الحالية
                    </a>
                )}

                <div>
                    <label className="block font-medium mb-1 text-black">الاسم</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 text-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">البريد الإلكتروني</label>
                    <input
                        type="email"
                        className="w-full border rounded p-2 bg-gray-100 text-black"
                        value={email}
                        readOnly
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">نبذة عني</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border rounded p-2 text-black"
                        placeholder="اكتب نبذة قصيرة عنك تظهر في صفحتك العامة"
                        rows={3}
                        maxLength={300}
                    />
                    <p className="text-sm text-gray-500 mt-1">الحد الأقصى 300 حرف</p>
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">الوصف التفصيلي عنك</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded p-2 text-black"
                        placeholder="أخبرنا عن خبراتك، المهارات التي تتقنها، المشاريع السابقة، إلخ"
                        rows={5}
                        maxLength={1000}
                    />
                    <p className="text-sm text-gray-500 mt-1">الحد الأقصى 150 كلمة تقريبًا</p>
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">كلمة المرور القديمة</label>
                    <input
                        type="password"
                        className="w-full border rounded p-2 text-black"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور الحالية"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-black">كلمة مرور جديدة (اختياري)</label>
                    <input
                        type="password"
                        className="w-full border rounded p-2 text-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="اتركها فارغة إن لم ترغب بالتغيير"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    حفظ التعديلات
                </button>

                {role === "freelancer" && id && (
                    <Link href={`/freelancers/${id}`} className="text-center text-blue-600 underline block mt-4">
                        عرض صفحتي العامة
                    </Link>
                )}
            </form>
        </main>
    )
}