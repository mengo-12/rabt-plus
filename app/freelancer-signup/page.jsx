'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function FreelancerRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '', // ✅ أضف الهاتف هنا
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, role: 'freelancer' }),
        });

        if (res.ok) {
            router.push('/dashboard/profile');
        } else {
            let errorMessage = 'حدث خطأ أثناء التسجيل';
            try {
                const data = await res.json();
                errorMessage = data.message || errorMessage;
            } catch (err) {
                console.error("Failed to parse error response", err);
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <div className="flex items-center mb-6">
                    <UserPlusIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 ml-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">تسجيل حساب مستقل</h2>
                </div>

                {error && (
                    <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="الاسم"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <input
                        name="phone"
                        type="tel"
                        placeholder="رقم الهاتف"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="كلمة المرور"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                    >
                        إنشاء حساب
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
}

