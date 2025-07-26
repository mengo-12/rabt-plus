'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [id, setId] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState("");
    const [cv, setCV] = useState(null);
    const [currentCV, setCurrentCV] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");  // إضافة حالة رقم الهاتف

    const [avatarFileName, setAvatarFileName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [cvFileName, setCvFileName] = useState('');

    // توليد معاينة للصورة
    useEffect(() => {
        if (avatar) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(avatar);
        } else {
            setAvatarPreview(null);
        }
    }, [avatar]);

    // تحميل بيانات المستخدم
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/profile", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setId(data.id);
                setName(data.name);
                setEmail(data.email);
                setRole(data.role);
                setCurrentAvatar(data.avatar || "");
                setCurrentCV(data.cv || "");
                setDescription(data.description || "");
                setBio(data.bio || "");
                setPhone(data.phone || "");  // جلب رقم الهاتف من البيانات
            } else {
                router.push("/login");
            }

            setLoading(false);
        };

        fetchUser();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("bio", bio);
        formData.append("phone", phone);  // إرسال رقم الهاتف مع البيانات
        if (avatar) formData.append("avatar", avatar);
        if (cv) formData.append("cv", cv);

        const res = await fetch("/api/profile", {
            method: "PUT",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("✅ تم تحديث البيانات بنجاح");
            setAvatar(null);
            setCV(null);
        } else {
            setMessage(data.message || "حدث خطأ في التحديث");
        }
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-700 dark:text-white">جارٍ تحميل البيانات...</p>;
    }

    // حذف الصورة الحالية من الخادم
    const handleDeleteAvatar = async () => {
        const res = await fetch("/api/profile/avatar", {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            setCurrentAvatar("");
            setAvatar(null);
            setAvatarFileName("");
            setMessage("✅ تم حذف الصورة بنجاح");
        } else {
            setMessage("❌ حدث خطأ أثناء حذف الصورة");
        }
    };

    // حذف السيرة الذاتية الحالية من الخادم
    const handleDeleteCV = async () => {
        const res = await fetch("/api/profile/cv", {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            setCurrentCV("");
            setCV(null);
            setCvFileName("");
            setMessage("✅ تم حذف السيرة الذاتية بنجاح");
        } else {
            setMessage("❌ حدث خطأ أثناء حذف السيرة الذاتية");
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">

                {/* الجانب الأيمن: الصورة والسيرة الذاتية */}
                <div className="space-y-6">
                    <div className="text-center">
                        <img
                            src={avatarPreview || currentAvatar || "/default-avatar.png"}
                            alt="الصورة الشخصية"
                            className="mx-auto w-32 h-32 rounded-full object-cover border"
                        />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            الصورة الحالية
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">الصورة الشخصية</label>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                اختر صورة
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {avatarFileName || "لم يتم اختيار ملف"}
                            </span>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setAvatar(file);
                                    setAvatarFileName(file?.name || '');
                                }}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {currentAvatar && (
                        <button
                            type="button"
                            onClick={handleDeleteAvatar}
                            className="mt-2 text-red-600 hover:underline text-sm"
                        >
                            حذف الصورة الحالية
                        </button>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            السيرة الذاتية (PDF)
                        </label>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <label
                                htmlFor="cv-upload"
                                className="cursor-pointer inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                اختر ملف
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {cvFileName || "لم يتم اختيار ملف"}
                            </span>
                            <input
                                id="cv-upload"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setCV(file);
                                    setCvFileName(file?.name || '');
                                }}
                                className="hidden"
                            />
                        </div>
                        {currentCV && (
                            <a
                                href={currentCV}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-600 dark:text-blue-400 underline"
                            >
                                عرض السيرة الذاتية الحالية
                            </a>
                        )}

                        {currentCV && (
                            <button
                                type="button"
                                onClick={handleDeleteCV}
                                className="mt-2 text-red-600 hover:underline text-sm"
                            >
                                حذف السيرة الذاتية
                            </button>
                        )}
                    </div>
                </div>

                {/* الجانب الأيسر: البيانات النصية */}
                <div className="md:col-span-2">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        تعديل الملف الشخصي
                    </h1>

                    {message && (
                        <p className={`mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-white">الاسم</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-white">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                            />
                        </div>

                        {/* إضافة حقل رقم الهاتف */}
                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-white">رقم الهاتف</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                placeholder="مثلاً: 0501234567"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-white">نبذة قصيرة</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                maxLength={300}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700 dark:text-white">الوصف التفصيلي</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                maxLength={1000}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
                        >
                            حفظ التعديلات
                        </button>

                        {role === "freelancer" && id && (
                            <Link
                                href={`/freelancers/${id}`}
                                className="text-center text-blue-600 dark:text-blue-400 underline block mt-4"
                            >
                                عرض صفحتي العامة
                            </Link>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
