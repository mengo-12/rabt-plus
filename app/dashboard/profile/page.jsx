// 'use client';
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useTranslation } from 'react-i18next';


// export default function ProfilePage() {
//     const { t } = useTranslation();

//     const router = useRouter();
//     const { data: session } = useSession();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [role, setRole] = useState("");
//     const [id, setId] = useState("");
//     const [avatar, setAvatar] = useState(null);
//     const [currentAvatar, setCurrentAvatar] = useState("");
//     const [cv, setCV] = useState(null);
//     const [currentCV, setCurrentCV] = useState("");
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [description, setDescription] = useState("");
//     const [bio, setBio] = useState("");
//     const [phone, setPhone] = useState("");  // إضافة حالة رقم الهاتف

//     const [avatarFileName, setAvatarFileName] = useState('');
//     const [avatarPreview, setAvatarPreview] = useState(null);
//     const [cvFileName, setCvFileName] = useState('');

//     // توليد معاينة للصورة
//     useEffect(() => {
//         if (avatar) {
//             const reader = new FileReader();
//             reader.onloadend = () => setAvatarPreview(reader.result);
//             reader.readAsDataURL(avatar);
//         } else {
//             setAvatarPreview(null);
//         }
//     }, [avatar]);

//     // تحميل بيانات المستخدم
//     useEffect(() => {
//         const fetchUser = async () => {
//             const res = await fetch("/api/profile", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setId(data.id);
//                 setName(data.name);
//                 setEmail(data.email);
//                 setRole(data.role);
//                 setCurrentAvatar(data.avatar || "");
//                 setCurrentCV(data.cv || "");
//                 setDescription(data.description || "");
//                 setBio(data.bio || "");
//                 setPhone(data.phone || "");  // جلب رقم الهاتف من البيانات
//             } else {
//                 router.push("/login");
//             }

//             setLoading(false);
//         };

//         fetchUser();
//     }, [router]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage("");

//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("description", description);
//         formData.append("bio", bio);
//         formData.append("phone", phone);  // إرسال رقم الهاتف مع البيانات
//         if (avatar) formData.append("avatar", avatar);
//         if (cv) formData.append("cv", cv);

//         const res = await fetch("/api/profile", {
//             method: "PUT",
//             body: formData,
//             credentials: "include",
//         });

//         const data = await res.json();

//         if (res.ok) {
//             setMessage("✅ تم تحديث البيانات بنجاح");
//             setAvatar(null);
//             setCV(null);
//         } else {
//             setMessage(data.message || "حدث خطأ في التحديث");
//         }
//     };

//     if (loading) {
//         return <p className="text-center mt-10 text-gray-700 dark:text-white">{t('profile_loading')}</p>;
//     }

//     // حذف الصورة الحالية من الخادم
//     const handleDeleteAvatar = async () => {
//         const res = await fetch("/api/profile/avatar", {
//             method: "DELETE",
//             credentials: "include",
//         });

//         if (res.ok) {
//             setCurrentAvatar("");
//             setAvatar(null);
//             setAvatarFileName("");
//             setMessage("✅ تم حذف الصورة بنجاح");
//         } else {
//             setMessage("❌ حدث خطأ أثناء حذف الصورة");
//         }
//     };

//     // حذف السيرة الذاتية الحالية من الخادم
//     const handleDeleteCV = async () => {
//         const res = await fetch("/api/profile/cv", {
//             method: "DELETE",
//             credentials: "include",
//         });

//         if (res.ok) {
//             setCurrentCV("");
//             setCV(null);
//             setCvFileName("");
//             setMessage("✅ تم حذف السيرة الذاتية بنجاح");
//         } else {
//             setMessage("❌ حدث خطأ أثناء حذف السيرة الذاتية");
//         }
//     };

//     return (
//         <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
//             <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">

//                 {/* الجانب الأيمن: الصورة والسيرة الذاتية */}
//                 <div className="space-y-6">
//                     <div className="text-center">
//                         <img
//                             src={avatarPreview || currentAvatar || "/default-avatar.png"}
//                             alt="الصورة الشخصية"
//                             className="mx-auto w-32 h-32 rounded-full object-cover border"
//                         />
//                         <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//                             {t('profile_current_avatar')}
//                         </p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('profile_avatar_label')}</label>
//                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                             <label
//                                 htmlFor="avatar-upload"
//                                 className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                             >
//                                 {t('choose_image')}
//                             </label>
//                             <span className="text-sm text-gray-600 dark:text-gray-300">
//                                 {avatarFileName || t('no_file_selected')}
//                             </span>
//                             <input
//                                 id="avatar-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => {
//                                     const file = e.target.files[0];
//                                     setAvatar(file);
//                                     setAvatarFileName(file?.name || '');
//                                 }}
//                                 className="hidden"
//                             />
//                         </div>
//                     </div>

//                     {currentAvatar && (
//                         <button
//                             type="button"
//                             onClick={handleDeleteAvatar}
//                             className="mt-2 text-red-600 hover:underline text-sm"
//                         >
//                             {t('delete_avatar')}
//                         </button>
//                     )}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
//                             {t('cv_label')}(PDF)
//                         </label>
//                         <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                             <label
//                                 htmlFor="cv-upload"
//                                 className="cursor-pointer inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                             >
//                                 {t('choose_file')}
//                             </label>
//                             <span className="text-sm text-gray-600 dark:text-gray-300">
//                                 {cvFileName || t('no_file_selected')}
//                             </span>
//                             <input
//                                 id="cv-upload"
//                                 type="file"
//                                 accept=".pdf"
//                                 onChange={(e) => {
//                                     const file = e.target.files[0];
//                                     setCV(file);
//                                     setCvFileName(file?.name || '');
//                                 }}
//                                 className="hidden"
//                             />
//                         </div>
//                         {currentCV && (
//                             <a
//                                 href={currentCV}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="block mt-2 text-blue-600 dark:text-blue-400 underline"
//                             >
//                                 {t('view_current_cv')}
//                             </a>
//                         )}

//                         {currentCV && (
//                             <button
//                                 type="button"
//                                 onClick={handleDeleteCV}
//                                 className="mt-2 text-red-600 hover:underline text-sm"
//                             >
//                                 {t('delete_cv')}
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* الجانب الأيسر: البيانات النصية */}
//                 <div className="md:col-span-2">
//                     <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
//                         {t('edit_profile')}
//                     </h1>

//                     {message && (
//                         <p className={`mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
//                             {message}
//                         </p>
//                     )}

//                     <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//                         <div>
//                             <label className="block mb-1 text-gray-700 dark:text-white">{t('label_name')}</label>
//                             <input
//                                 type="text"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 text-gray-700 dark:text-white">{t('label_email')}</label>
//                             <input
//                                 type="email"
//                                 value={email}
//                                 readOnly
//                                 className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
//                             />
//                         </div>

//                         {/* إضافة حقل رقم الهاتف */}
//                         <div>
//                             <label className="block mb-1 text-gray-700 dark:text-white">{t('label_phone')}</label>
//                             <input
//                                 type="tel"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
//                                 placeholder="مثلاً: 0501234567"
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 text-gray-700 dark:text-white">{t('label_bio')}</label>
//                             <textarea
//                                 value={bio}
//                                 onChange={(e) => setBio(e.target.value)}
//                                 rows={3}
//                                 className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
//                                 maxLength={300}
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 text-gray-700 dark:text-white">{t('label_description')}</label>
//                             <textarea
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 rows={5}
//                                 className="w-full p-2 rounded border text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
//                                 maxLength={1000}
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
//                         >
//                             {t('save_changes')}
//                         </button>

//                         {role === "freelancer" && id && (
//                             <Link
//                                 href={`/freelancers/${id}`}
//                                 className="text-center text-blue-600 dark:text-blue-400 underline block mt-4"
//                             >
//                                 {t('view_public_page')}
//                             </Link>
//                         )}
//                     </form>
//                 </div>
//             </div>
//         </main>
//     );
// }
'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { t } = useTranslation();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        description: '',
        phone: '',
        avatar: null,
        cv: null
    });

    const [preview, setPreview] = useState('');
    const [cvName, setCvName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();

                if (res.ok) {
                    setFormData({
                        name: data.name || '',
                        bio: data.bio || '',
                        description: data.description || '',
                        phone: data.phone || '',
                        avatar: null,
                        cv: null
                    });
                    setPreview(data.avatar || '');
                    setCvName(data.cv ? data.cv.split('/').pop() : '');
                } else {
                    setMessage(`❌ ${data.error || 'فشل في جلب البيانات'}`);
                }
            } catch (err) {
                setMessage('❌ حدث خطأ أثناء تحميل البيانات');
            }
        };

        fetchProfile();
    }, [status]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'avatar' && files.length) {
            setFormData({ ...formData, avatar: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else if (name === 'cv' && files.length) {
            setFormData({ ...formData, cv: files[0] });
            setCvName(files[0].name);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!session?.user?.email) {
            setMessage('❌ لم يتم العثور على البريد الإلكتروني للمستخدم');
            setLoading(false);
            return;
        }

        const body = new FormData();
        body.append('email', session.user.email);

        Object.entries(formData).forEach(([key, value]) => {
            if (value) body.append(key, value);
        });

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                body
            });

            const result = await res.json();
            if (res.ok) {
                setMessage('✅ تم تحديث البيانات بنجاح');
            } else {
                setMessage(`❌ ${result.error || 'حدث خطأ أثناء التحديث'}`);
            }
        } catch (err) {
            setMessage('❌ فشل الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t('ملفي الشخصي')}</h1>

            {message && (
                <p className={`mb-4 text-center text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">{t('الاسم')}</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t('رقم الجوال')}</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t('نبذة قصيرة')}</label>
                    <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t('الوصف (بحد أقصى 150 كلمة)')}</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t('الصورة الشخصية')}</label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full"
                    />
                    {preview && (
                        <img src={preview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-full" />
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t('السيرة الذاتية (PDF)')}</label>
                    <input
                        type="file"
                        name="cv"
                        accept=".pdf"
                        onChange={handleChange}
                        className="w-full"
                    />
                    {cvName && (
                        <p className="mt-1 text-sm text-gray-600">📄 {cvName}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? t('جاري التحديث...') : t('تحديث')}
                </button>
            </form>
        </div>
    );
}


