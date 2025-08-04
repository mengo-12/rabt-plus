'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function TeamDetailsPage() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTeamData = async () => {
        try {
            const res = await fetch(`/api/teams/${id}`);
            const data = await res.json();
            if (res.ok) {
                setTeam(data.team);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error('Failed to fetch team:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeamData();
        const interval = setInterval(fetchTeamData, 10000); // إعادة تحميل البيانات كل 10 ثواني
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <p>جاري التحميل...</p>;
    if (!team) return <p>لم يتم العثور على الفريق</p>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">{team.name}</h1>
            <p className="mb-6">{team.description}</p>

            <h2 className="text-2xl font-semibold mb-2">الأعضاء:</h2>
            <ul className="space-y-3">
                {team.members.map(member => (
                    <li key={member.id} className="flex items-center justify-between border p-3 rounded">
                        <div className="flex items-center gap-3">
                            {member.user.avatar && (
                                <Image
                                    src={member.user.avatar}
                                    alt={member.user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            )}
                            <span>{member.user.name} - {member.role}</span>
                        </div>
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                member.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                member.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            {member.status === 'accepted' ? 'منضم' : member.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
