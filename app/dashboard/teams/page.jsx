'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTeams = async () => {
            const res = await fetch('/api/teams');
            const data = await res.json();
            if (res.ok) setTeams(data.teams);
            setLoading(false);
        };
        fetchTeams();
    }, []);

    const handleDeleteTeam = async (teamId) => {
        if (!confirm('هل أنت متأكد من حذف الفريق؟')) return;

        const res = await fetch(`/api/teams/${teamId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setTeams(teams.filter(t => t.id !== teamId));
        } else {
            let errorMessage = 'فشل في حذف الفريق';
            try {
                const data = await res.json();
                if (data?.error) errorMessage = data.error;
            } catch (e) {
                // body فاضي = تجاهل الخطأ وخليها الرسالة الافتراضية
            }
            alert(errorMessage);
        }
    };

    if (loading) return <p className="text-center py-10">جاري التحميل...</p>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">الفرق</h1>

            {teams.length === 0 && <p>لا توجد فرق بعد.</p>}

            <div className="space-y-6">
                {teams.map(team => (
                    <div key={team.id} className="border p-4 rounded shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">{team.name}</h2>
                                <p className="text-gray-600">{team.description}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteTeam(team.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                حذف الفريق
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">الأعضاء:</h3>
                            {team.members.length === 0 ? (
                                <p className="text-gray-500">لا يوجد أعضاء بعد</p>
                            ) : (
                                <ul className="space-y-2">
                                    {team.members.map(member => (
                                        <li key={member.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span>{member.user.name} — {member.role}</span>
                                            <span className={`text-sm ${member.status === 'accepted' ? 'text-green-600' : member.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {member.status === 'accepted' ? 'مقبول' : member.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* إضافة رابط المحادثة */}
                        <div className="mt-4 text-right">
                            <Link
                                href={`/dashboard/teams/${team.id}/chat`}
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                فتح المحادثة
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
