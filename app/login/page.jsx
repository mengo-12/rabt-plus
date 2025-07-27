'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/', // ✅ توجيه للصفحة الرئيسية
        });

        if (res?.error) {
            setError('بيانات الدخول غير صحيحة');
        } else if (res.ok) {
            router.push('/'); // ✅ توجيه للصفحة الرئيسية
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <div className="flex items-center mb-6">
                    <ArrowRightOnRectangleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 ml-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">تسجيل الدخول</h2>
                </div>

                {error && (
                    <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-200 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                    >
                        دخول
                    </button>
                </form>

                <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                    <p>
                        ليس لديك حساب؟{' '}
                        <Link href="/register" className="text-blue-600 hover:underline font-medium">
                            إنشاء حساب
                        </Link>
                    </p>
                    <p className="mt-2">
                        <Link href="/" className="text-sm text-gray-500 hover:underline">
                            العودة إلى الصفحة الرئيسية
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


