'use client';
import { useEffect, useState } from 'react';

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            const res = await fetch('/api/teams/members');
            const data = await res.json();
            if (res.ok) setInvitations(data.members);
            setLoading(false);
        };
        fetchInvitations();
    }, []);

    const handleRespond = async (memberId, action) => {
        const res = await fetch(`/api/teams/members/${memberId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
        });

        if (res.ok) {
            setInvitations(invitations.filter(m => m.id !== memberId));
            alert('تم تحديث الحالة بنجاح');
        } else {
            alert('حدث خطأ');
        }
    };

    if (loading) return <p className="text-center py-10">جاري التحميل...</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">دعوات الفرق</h1>

            {invitations.length === 0 && <p>لا توجد دعوات جديدة.</p>}

            <div className="space-y-4">
                {invitations.map(invite => (
                    <div key={invite.id} className="border p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{invite.team.name}</p>
                            <p className="text-sm text-gray-600">الدور: {invite.role}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRespond(invite.id, 'accept')}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                قبول
                            </button>
                            <button
                                onClick={() => handleRespond(invite.id, 'reject')}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                رفض
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
