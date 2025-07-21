'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FreelancerRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        description: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.description.length > 500) {
            return setError('الوصف طويل جدًا (الحد 500 حرف)');
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, role: 'freelancer' }),
        });

        if (res.ok) {
            router.push('/login');
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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">تسجيل حساب مستقل</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="الاسم" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
                <input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required />
                <input name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} className="w-full border rounded p-2" required />
                <textarea name="description" placeholder="نبذة عنك، مهاراتك، لغاتك" value={form.description} onChange={handleChange} className="w-full border rounded p-2" rows={4} maxLength={500} />
                <p className="text-sm text-gray-500 text-right">الحد الأقصى 500 حرف</p>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">إنشاء حساب</button>
            </form>
        </div>
    );
}
