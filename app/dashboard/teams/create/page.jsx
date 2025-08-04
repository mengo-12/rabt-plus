'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateTeamPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [rolesNeeded, setRolesNeeded] = useState({
        uiux: false,
        frontend: false,
        backend: false,
        api: false
    });
    const [message, setMessage] = useState('');

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setRolesNeeded(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamName) {
            setMessage('❌ اسم الفريق مطلوب');
            return;
        }

        const res = await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: teamName,
                description,
                rolesNeeded,
                ownerId: session.user.id
            })
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/dashboard/teams/${data.team.id}`);
        } else {
            setMessage('❌ حدث خطأ أثناء إنشاء الفريق');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">إنشاء فريق جديد</h1>

            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">اسم الفريق</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">وصف الفريق (اختياري)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2">التخصصات المطلوبة</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="uiux"
                                checked={rolesNeeded.uiux}
                                onChange={handleCheckboxChange}
                            />
                            مصمم UI/UX
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="frontend"
                                checked={rolesNeeded.frontend}
                                onChange={handleCheckboxChange}
                            />
                            Frontend Developer
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="backend"
                                checked={rolesNeeded.backend}
                                onChange={handleCheckboxChange}
                            />
                            Backend Developer
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="api"
                                checked={rolesNeeded.api}
                                onChange={handleCheckboxChange}
                            />
                            API Specialist
                        </label>
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    إنشاء الفريق
                </button>
            </form>
        </div>
    );
}
